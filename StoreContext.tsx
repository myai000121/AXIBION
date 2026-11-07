import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { Product, Order, OrderStatus, Banner, WebsiteSettings, ActivityLog, CategoryInfo } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data/categories';
import { useAuth } from './AuthContext';
import { generateOrderId } from '../utils/shopLogic';

interface StoreContextType {
  products: Product[];
  categories: CategoryInfo[];
  orders: Order[];
  banners: Banner[];
  settings: WebsiteSettings;
  activityLogs: ActivityLog[];
  loadingProducts: boolean;
  loadingOrders: boolean;
  createOrder: (orderInput: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearAllProducts: () => Promise<void>;
  addCategory: (category: Omit<CategoryInfo, 'id'>) => Promise<string>;
  updateCategory: (id: string, updates: Partial<CategoryInfo>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBanner: (banner: Omit<Banner, 'id'>) => Promise<string>;
  updateBanner: (banner: Banner) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updateOrder: (orderId: string, updates: Partial<Order>) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<void>;
  deleteActivityLog: (id: string) => Promise<void>;
  clearAllActivityLogs: () => Promise<void>;
}

const DEFAULT_SETTINGS: WebsiteSettings = {
  siteName: 'AXIBION',
  supportEmail: 'support@axibion.tech',
  supportPhone: '+1 (800) 294-2466',
  notice: 'COD available across all regions. Standard delivery within 48-72 hours.',
  freeShippingThreshold: 200,
};

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'banner-hero-1',
    title: 'A World of Technology.',
    subtitle: 'High-performance electronics, next-gen mobile devices, and legitimate ethical cybersecurity hardware.',
    imageUrl: '/src/assets/images/hero_axibion_tech_quantum_1794037986324.jpg',
    link: '#catalog',
    active: true,
    badge: 'FLAGSHIP COLLECTION',
  },
  {
    id: 'banner-cyber-2',
    title: 'Ethical Hacking & RF Lab Devices',
    subtitle: 'Educational wireless spectrum analyzers, packet testers, and hardware development microcontrollers.',
    imageUrl: '/src/assets/images/cat_cybersecurity_tools_1794037987208.jpg',
    link: '#catalog',
    active: true,
    badge: 'NEW ARRIVALS',
  },
];

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<CategoryInfo[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Helper to log admin actions
  const logAdminAction = useCallback(async (action: string, details: string) => {
    if (!user || !user.email) return;
    try {
      const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const logData: ActivityLog = {
        id: logId,
        adminEmail: user.email,
        action,
        details,
        timestamp: new Date().toISOString(),
      };
      await setDoc(doc(db, 'activity_logs', logId), logData);
      setActivityLogs((prev) => [logData, ...prev]);
    } catch (err) {
      console.warn('Could not write admin activity log:', err);
    }
  }, [user]);

  // Real-time listener for Products (Public read)
  useEffect(() => {
    const productsRef = collection(db, 'products');
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedProducts = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Product, 'id'>),
          }));
          setProducts(loadedProducts);
        } else {
          setProducts(INITIAL_PRODUCTS);
        }
        setLoadingProducts(false);
      },
      (error) => {
        console.warn('Products snapshot notice:', error.message);
        setProducts(INITIAL_PRODUCTS);
        setLoadingProducts(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Real-time listener for Categories
  useEffect(() => {
    const catRef = collection(db, 'categories');
    const unsubscribe = onSnapshot(
      catRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<CategoryInfo, 'id'>),
          }));
          setCategories(loaded);
        } else {
          setCategories(INITIAL_CATEGORIES);
        }
      },
      (error) => {
        console.warn('Categories snapshot notice:', error.message);
        setCategories(INITIAL_CATEGORIES);
      }
    );
    return () => unsubscribe();
  }, []);

  // Real-time listener for Banners
  useEffect(() => {
    const bannersRef = collection(db, 'banners');
    const unsubscribe = onSnapshot(
      bannersRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedBanners = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Banner, 'id'>),
          }));
          setBanners(loadedBanners);
        } else {
          setBanners(DEFAULT_BANNERS);
        }
      },
      (error) => {
        console.warn('Banners snapshot notice:', error.message);
        setBanners(DEFAULT_BANNERS);
      }
    );
    return () => unsubscribe();
  }, []);

  // Real-time listener for Orders
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoadingOrders(false);
      return;
    }

    setLoadingOrders(true);
    let ordersQuery;
    if (isAdmin) {
      ordersQuery = query(collection(db, 'orders'));
    } else {
      ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
    }

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const loadedOrders = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Order, 'id'>),
        }));
        loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(loadedOrders);
        setLoadingOrders(false);
      },
      (error) => {
        console.warn('Orders snapshot notice:', error.message);
        setLoadingOrders(false);
      }
    );

    return () => unsubscribe();
  }, [user, isAdmin]);

  // Real-time listener for Settings
  useEffect(() => {
    const settingsDoc = doc(db, 'settings', 'general');
    const unsubscribe = onSnapshot(
      settingsDoc,
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...(docSnap.data() as WebsiteSettings) });
        }
      },
      (error) => {
        console.warn('Settings notice:', error.message);
      }
    );
    return () => unsubscribe();
  }, []);

  // Real-time listener for Activity Logs (Admins only)
  useEffect(() => {
    if (!isAdmin) {
      setActivityLogs([]);
      return;
    }
    const logsQuery = query(collection(db, 'activity_logs'));
    const unsubscribe = onSnapshot(
      logsQuery,
      (snapshot) => {
        const logs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ActivityLog, 'id'>),
        }));
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setActivityLogs(logs);
      },
      (error) => {
        console.warn('Activity logs notice:', error.message);
      }
    );
    return () => unsubscribe();
  }, [isAdmin]);

  // Create Order (Cash on Delivery)
  const createOrder = async (
    orderInput: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    const orderId = generateOrderId();
    const timestamp = new Date().toISOString();
    const newOrder: Order = {
      ...orderInput,
      id: orderId,
      paymentMethod: 'Cash on Delivery',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
      setOrders((prev) => [newOrder, ...prev]);
      return orderId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `orders/${orderId}`);
    }
  };

  // Add Product (Admin Only)
  const addProduct = async (
    productInput: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    const prodId = `prod-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newProduct: Product = {
      ...productInput,
      id: prodId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      await setDoc(doc(db, 'products', prodId), newProduct);
      setProducts((prev) => [newProduct, ...prev]);
      await logAdminAction('Add Product', `Created product "${newProduct.name}" (${prodId})`);
      return prodId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${prodId}`);
    }
  };

  // Update Product (Admin Only)
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const timestamp = new Date().toISOString();
      const updatedData = { ...updates, updatedAt: timestamp };
      await updateDoc(doc(db, 'products', id), updatedData);
      setProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
      );
      await logAdminAction('Update Product', `Updated product ID ${id}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  // Delete Product (Admin Only)
  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((prev) => prev.filter((item) => item.id !== id));
      await logAdminAction('Delete Product', `Deleted product ID ${id}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  // Clear All Products (Admin Only) - keeps catalog empty
  const clearAllProducts = async () => {
    try {
      const snap = await getDocs(collection(db, 'products'));
      for (const d of snap.docs) {
        await deleteDoc(doc(db, 'products', d.id));
      }
      setProducts([]);
      await logAdminAction('Clear Catalog', `Purged all product inventory records`);
    } catch (error) {
      console.warn('Purged local products state:', error);
      setProducts([]);
    }
  };

  // Add Category (Admin Only)
  const addCategory = async (categoryInput: Omit<CategoryInfo, 'id'>): Promise<string> => {
    const catId = `cat-${Date.now()}`;
    const newCat: CategoryInfo = {
      ...categoryInput,
      id: catId,
    };
    try {
      await setDoc(doc(db, 'categories', catId), newCat);
      setCategories((prev) => [...prev, newCat]);
      await logAdminAction('Add Category', `Created category "${newCat.name}"`);
      return catId;
    } catch (error) {
      setCategories((prev) => [...prev, newCat]);
      return catId;
    }
  };

  // Update Category (Admin Only)
  const updateCategory = async (id: string, updates: Partial<CategoryInfo>) => {
    try {
      await updateDoc(doc(db, 'categories', id), updates);
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
      await logAdminAction('Update Category', `Updated category ID ${id}`);
    } catch (error) {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    }
  };

  // Delete Category (Admin Only)
  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories((prev) => prev.filter((c) => c.id !== id));
      await logAdminAction('Delete Category', `Deleted category ID ${id}`);
    } catch (error) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Add Banner (Admin Only)
  const addBanner = async (bannerInput: Omit<Banner, 'id'>): Promise<string> => {
    const bannerId = `banner-${Date.now()}`;
    const newBanner: Banner = {
      ...bannerInput,
      id: bannerId,
    };
    try {
      await setDoc(doc(db, 'banners', bannerId), newBanner);
      setBanners((prev) => [newBanner, ...prev]);
      await logAdminAction('Add Banner', `Created banner "${newBanner.title}"`);
      return bannerId;
    } catch (error) {
      setBanners((prev) => [newBanner, ...prev]);
      return bannerId;
    }
  };

  // Update Banner (Admin Only)
  const updateBanner = async (banner: Banner) => {
    try {
      await setDoc(doc(db, 'banners', banner.id), banner, { merge: true });
      setBanners((prev) => {
        const idx = prev.findIndex((b) => b.id === banner.id);
        if (idx > -1) {
          const copy = [...prev];
          copy[idx] = banner;
          return copy;
        }
        return [...prev, banner];
      });
      await logAdminAction('Update Banner', `Updated banner "${banner.title}"`);
    } catch (error) {
      setBanners((prev) => {
        const idx = prev.findIndex((b) => b.id === banner.id);
        if (idx > -1) {
          const copy = [...prev];
          copy[idx] = banner;
          return copy;
        }
        return [...prev, banner];
      });
    }
  };

  // Delete Banner (Admin Only)
  const deleteBanner = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'banners', id));
      setBanners((prev) => prev.filter((b) => b.id !== id));
      await logAdminAction('Delete Banner', `Deleted banner ID ${id}`);
    } catch (error) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // Update Order Status (Admin Only)
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const timestamp = new Date().toISOString();
      await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: timestamp });
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status, updatedAt: timestamp } : ord))
      );
      await logAdminAction('Update Order Status', `Order ${orderId} changed to ${status}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // Update Full Order (Admin Only)
  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const timestamp = new Date().toISOString();
      const payload = { ...updates, updatedAt: timestamp };
      await updateDoc(doc(db, 'orders', orderId), payload);
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, ...payload } : ord))
      );
      await logAdminAction('Update Order', `Updated order details for ${orderId}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // Delete Order (Admin Only)
  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
      await logAdminAction('Delete Order', `Deleted order record ${orderId}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `orders/${orderId}`);
    }
  };

  // Update Website Settings (Admin Only)
  const updateSettings = async (newSettings: Partial<WebsiteSettings>) => {
    try {
      const merged = { ...settings, ...newSettings };
      await setDoc(doc(db, 'settings', 'general'), merged, { merge: true });
      setSettings(merged);
      await logAdminAction('Update Settings', 'Updated website configuration');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/general');
    }
  };

  // Delete single activity log (Admin Only)
  const deleteActivityLog = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'activity_logs', id));
      setActivityLogs((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      setActivityLogs((prev) => prev.filter((l) => l.id !== id));
    }
  };

  // Clear all activity logs (Admin Only)
  const clearAllActivityLogs = async () => {
    try {
      const snap = await getDocs(collection(db, 'activity_logs'));
      for (const d of snap.docs) {
        await deleteDoc(doc(db, 'activity_logs', d.id));
      }
      setActivityLogs([]);
    } catch (error) {
      setActivityLogs([]);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        banners,
        settings,
        activityLogs,
        loadingProducts,
        loadingOrders,
        createOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        addCategory,
        updateCategory,
        deleteCategory,
        addBanner,
        updateBanner,
        deleteBanner,
        updateOrderStatus,
        updateOrder,
        deleteOrder,
        updateSettings,
        deleteActivityLog,
        clearAllActivityLogs,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
