import React, { useState } from 'react';
import {
  X,
  Shield,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Image as ImageIcon,
  Settings as SettingsIcon,
  FileText,
  Users,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Search,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, Banner, WebsiteSettings, CategoryInfo } from '../types';
import { VALID_ORDER_STATUSES } from '../utils/shopLogic';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'categories'
  | 'customers'
  | 'banners'
  | 'settings'
  | 'logs';

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin, signInWithGoogle } = useAuth();
  const {
    products,
    categories,
    orders,
    banners,
    settings,
    activityLogs,
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
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    updateSettings,
    deleteActivityLog,
    clearAllActivityLogs,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Search & Filters inside Admin
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [categorySearch, setCategorySearch] = useState('');

  // ----------------------------------------------------
  // Product Add / Edit Modal state
  // ----------------------------------------------------
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.name || 'Hacking & Cybersecurity Gadgets');
  const [formPrice, setFormPrice] = useState(0);
  const [formDiscountPrice, setFormDiscountPrice] = useState(0);
  const [formStock, setFormStock] = useState(10);
  const [formDescription, setFormDescription] = useState('');
  const [formImages, setFormImages] = useState<string[]>(['']);
  const [formSpecs, setFormSpecs] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' },
  ]);
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  // ----------------------------------------------------
  // Category Add / Edit Modal state
  // ----------------------------------------------------
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catIconName, setCatIconName] = useState('Layers');
  const [catHighlight, setCatHighlight] = useState(false);

  // ----------------------------------------------------
  // Banner Add / Edit Modal state
  // ----------------------------------------------------
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerBadge, setBannerBadge] = useState('PROMO');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerLink, setBannerLink] = useState('#catalog');
  const [bannerActive, setBannerActive] = useState(true);

  // ----------------------------------------------------
  // Order Add / Edit Modal state
  // ----------------------------------------------------
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderCustName, setOrderCustName] = useState('');
  const [orderEmail, setOrderEmail] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderCity, setOrderCity] = useState('');
  const [orderArea, setOrderArea] = useState('');
  const [orderPostal, setOrderPostal] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderStatusVal, setOrderStatusVal] = useState<OrderStatus>('Order Placed');
  const [orderItemName, setOrderItemName] = useState('');
  const [orderItemPrice, setOrderItemPrice] = useState(99);
  const [orderItemQty, setOrderItemQty] = useState(1);

  // ----------------------------------------------------
  // Settings form
  // ----------------------------------------------------
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>(settings);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  if (!isOpen) return null;

  // STRICT ACCESS DENIED GUARD per user requirement
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[#0c0d12] border border-rose-500/30 rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-white">Administrator Authentication Required</h2>
          <p className="text-xs text-slate-300">
            Please sign in with an authorized administrator Google account to access this management console.
          </p>
          <button
            onClick={() => signInWithGoogle()}
            className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors cursor-pointer"
          >
            Sign In with Google
          </button>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            Cancel & Return to Store
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-[#0c0d12] border border-rose-500/40 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-rose-400">
              Access Denied — You are not authorized to access the Admin Panel.
            </h2>
            <p className="text-xs text-slate-400">
              Your Google account (<strong className="text-white">{user.email}</strong>) does not have administrative privileges for AXIBION.
            </p>
            <p className="text-[11px] text-slate-500">
              Authorized administrators: myai000121@gmail.com and fk9175679@gmail.com only.
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-xs font-bold text-white bg-[#151922] hover:bg-[#1a1e27] border border-[#1a1e27] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Calculate High-Level Metrics
  const totalGrossRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, ord) => sum + ord.totalAmount, 0);
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCatFilter === 'all' || p.category === productCatFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    return orderStatusFilter === 'all' || o.status === orderStatusFilter;
  });

  // Filtered Categories
  const filteredCategories = categories.filter((c) => {
    return c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      c.description.toLowerCase().includes(categorySearch.toLowerCase());
  });

  // Unique Customers from Orders
  const customerMap = new Map<string, { name: string; email: string; phone: string; totalSpent: number; ordersCount: number }>();
  orders.forEach((o) => {
    const existing = customerMap.get(o.email) || {
      name: o.customerName,
      email: o.email,
      phone: o.phone,
      totalSpent: 0,
      ordersCount: 0,
    };
    existing.totalSpent += o.totalAmount;
    existing.ordersCount += 1;
    customerMap.set(o.email, existing);
  });
  const customerList = Array.from(customerMap.values());

  // ----------------------------------------------------
  // Product Modal Openers & Handlers
  // ----------------------------------------------------
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('');
    setFormCategory(categories[0]?.name || 'Hacking & Cybersecurity Gadgets');
    setFormPrice(99);
    setFormDiscountPrice(0);
    setFormStock(15);
    setFormDescription('');
    setFormImages(['']);
    setFormSpecs([
      { key: 'Interface', value: 'USB-C 3.2' },
      { key: 'Warranty', value: '1 Year Manufacturer' },
    ]);
    setFormIsFeatured(false);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormDiscountPrice(p.discountPrice || 0);
    setFormStock(p.stock);
    setFormDescription(p.description);
    setFormImages(p.images.length > 0 ? p.images : ['']);
    const specsArray = Object.entries(p.specifications || {}).map(([key, value]) => ({ key, value }));
    setFormSpecs(specsArray.length > 0 ? specsArray : [{ key: '', value: '' }]);
    setFormIsFeatured(!!p.isFeatured);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const specsRecord: Record<string, string> = {};
    formSpecs.forEach((s) => {
      if (s.key.trim()) specsRecord[s.key.trim()] = s.value.trim();
    });

    const cleanImages = formImages.map((img) => img.trim()).filter((img) => img.length > 0);
    if (cleanImages.length === 0) {
      cleanImages.push('/assets/aistudio/file_000000006df48211a08a0073fab6ae4d_fd38b12d.png');
    }

    const payload = {
      name: formName.trim(),
      brand: formBrand.trim(),
      category: formCategory,
      price: Number(formPrice),
      discountPrice: formDiscountPrice > 0 ? Number(formDiscountPrice) : undefined,
      stock: Number(formStock),
      description: formDescription.trim(),
      images: cleanImages,
      specifications: specsRecord,
      rating: editingProduct?.rating ?? 5.0,
      reviewCount: editingProduct?.reviewCount ?? 1,
      isFeatured: formIsFeatured,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await addProduct(payload);
    }
    setIsProductModalOpen(false);
  };

  // ----------------------------------------------------
  // Category Modal Openers & Handlers
  // ----------------------------------------------------
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatSlug('');
    setCatDescription('');
    setCatIconName('Layers');
    setCatHighlight(false);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (c: CategoryInfo) => {
    setEditingCategory(c);
    setCatName(c.name);
    setCatSlug(c.slug);
    setCatDescription(c.description);
    setCatIconName(c.iconName || 'Layers');
    setCatHighlight(!!c.highlight);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const payload = {
      name: catName.trim(),
      slug,
      description: catDescription.trim(),
      iconName: catIconName.trim() || 'Layers',
      highlight: catHighlight,
    };

    if (editingCategory) {
      await updateCategory(editingCategory.id, payload);
    } else {
      await addCategory(payload);
    }
    setIsCategoryModalOpen(false);
  };

  // ----------------------------------------------------
  // Banner Modal Openers & Handlers
  // ----------------------------------------------------
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerBadge('SPECIAL PROMOTION');
    setBannerImage('/src/assets/images/hero_axibion_tech_quantum_1794037986324.jpg');
    setBannerLink('#catalog');
    setBannerActive(true);
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (b: Banner) => {
    setEditingBanner(b);
    setBannerTitle(b.title);
    setBannerSubtitle(b.subtitle);
    setBannerBadge(b.badge || 'PROMO');
    setBannerImage(b.imageUrl);
    setBannerLink(b.link || '#catalog');
    setBannerActive(b.active);
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      await updateBanner({
        id: editingBanner.id,
        title: bannerTitle.trim(),
        subtitle: bannerSubtitle.trim(),
        badge: bannerBadge.trim(),
        imageUrl: bannerImage.trim(),
        link: bannerLink.trim(),
        active: bannerActive,
      });
    } else {
      await addBanner({
        title: bannerTitle.trim(),
        subtitle: bannerSubtitle.trim(),
        badge: bannerBadge.trim(),
        imageUrl: bannerImage.trim(),
        link: bannerLink.trim(),
        active: bannerActive,
      });
    }
    setIsBannerModalOpen(false);
  };

  // ----------------------------------------------------
  // Order Modal Openers & Handlers
  // ----------------------------------------------------
  const handleOpenAddOrder = () => {
    setEditingOrder(null);
    setOrderCustName('');
    setOrderEmail(user?.email || '');
    setOrderPhone('+1 (555) 000-0000');
    setOrderAddress('123 Technology Blvd');
    setOrderCity('San Francisco');
    setOrderArea('Downtown');
    setOrderPostal('94105');
    setOrderNotes('COD order entered by Admin');
    setOrderStatusVal('Order Placed');
    setOrderItemName('Hardware Diagnostic Device');
    setOrderItemPrice(149);
    setOrderItemQty(1);
    setIsOrderModalOpen(true);
  };

  const handleOpenEditOrder = (o: Order) => {
    setEditingOrder(o);
    setOrderCustName(o.customerName);
    setOrderEmail(o.email);
    setOrderPhone(o.phone);
    setOrderAddress(o.address);
    setOrderCity(o.city);
    setOrderArea(o.area);
    setOrderPostal(o.postalCode);
    setOrderNotes(o.notes || '');
    setOrderStatusVal(o.status);
    setOrderItemName(o.items[0]?.name || 'Tech Product');
    setOrderItemPrice(o.items[0]?.price || 99);
    setOrderItemQty(o.items[0]?.quantity || 1);
    setIsOrderModalOpen(true);
  };

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      await updateOrder(editingOrder.id, {
        customerName: orderCustName.trim(),
        email: orderEmail.trim(),
        phone: orderPhone.trim(),
        address: orderAddress.trim(),
        city: orderCity.trim(),
        area: orderArea.trim(),
        postalCode: orderPostal.trim(),
        notes: orderNotes.trim(),
        status: orderStatusVal,
        totalAmount: orderItemPrice * orderItemQty,
      });
    } else {
      await createOrder({
        userId: user?.uid || 'admin-manual',
        customerName: orderCustName.trim(),
        email: orderEmail.trim(),
        phone: orderPhone.trim(),
        address: orderAddress.trim(),
        city: orderCity.trim(),
        area: orderArea.trim(),
        postalCode: orderPostal.trim(),
        notes: orderNotes.trim(),
        status: orderStatusVal,
        totalAmount: orderItemPrice * orderItemQty,
        paymentMethod: 'Cash on Delivery',
        items: [
          {
            productId: 'manual-item',
            name: orderItemName.trim() || 'Electronic Device',
            price: Number(orderItemPrice),
            quantity: Number(orderItemQty),
            image: '/assets/aistudio/file_000000006df48211a08a0073fab6ae4d_fd38b12d.png',
          },
        ],
      });
    }
    setIsOrderModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-7xl h-[95vh] bg-[#07080b] border border-[#1a1e27] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#1a1e27] bg-[#0c0d12] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#087BFF]/20 border border-[#087BFF]/40 flex items-center justify-center text-[#00D9FF]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-wide">
                  AXIBION Master Administration Portal
                </h1>
                <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Dual-Admin Synchronized
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in as <strong className="text-white">{user.email}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1e27] transition-colors cursor-pointer"
            title="Close Admin Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split: Sidebar Tabs + Active Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar Navigation */}
          <div className="w-56 border-r border-[#1a1e27] bg-[#090a0e] p-3 space-y-1 shrink-0 overflow-y-auto hidden md:block">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#087BFF] text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#12151c]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Overview & KPIs</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#087BFF] text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#12151c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 shrink-0" />
                <span>Products Catalog</span>
              </div>
              <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-black/40">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#087BFF] text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#12151c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Orders & COD</span>
              </div>
              <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-black/40">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#087BFF] text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#12151c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 shrink-0" />
                <span>Categories</span>
              </div>
              <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-black/40">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'banners'
                  ? 'bg-[#087BFF] text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#12151c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4 shrink-0" />
                <span>Banners & Hero</span>
              </div>
              <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-black/40">
                {banners.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-[#087BFF] text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#12151c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 shrink-0" />
                <span>Customers</span>
              </div>
              <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-black/40">
                {customerList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#087BFF] text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#12151c]'
              }`}
            >
              <SettingsIcon className="w-4 h-4 shrink-0" />
              <span>Store Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-[#087BFF] text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#12151c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Activity Logs</span>
              </div>
              <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-black/40">
                {activityLogs.length}
              </span>
            </button>
          </div>

          {/* Active Tab Main View */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#06070a]">
            {/* Mobile Horizontal Navigation Tabs */}
            <div className="flex md:hidden gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-[#1a1e27]">
              {(['overview', 'products', 'orders', 'categories', 'banners', 'customers', 'settings', 'logs'] as AdminTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase whitespace-nowrap ${
                    activeTab === tab ? 'bg-[#087BFF] text-white' : 'bg-[#11141c] text-slate-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">Store Overview & Performance</h2>
                    <p className="text-xs text-slate-400">
                      Real-time synced metrics across both administrator accounts: myai000121@gmail.com & fk9175679@gmail.com.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenAddProduct}
                      className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#087BFF]/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Product</span>
                    </button>
                    <button
                      onClick={handleOpenAddOrder}
                      className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-200 bg-[#151922] hover:bg-[#1a1e27] border border-[#1a1e27] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#00D9FF]" />
                      <span>Create Order</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Strip */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27]">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                      Gross Volume (COD)
                    </span>
                    <p className="text-2xl font-extrabold text-[#00D9FF] font-mono-numbers mt-1">
                      ${totalGrossRevenue.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1 block">Excluding cancellations</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27]">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                      Total Orders
                    </span>
                    <p className="text-2xl font-extrabold text-white font-mono-numbers mt-1">
                      {orders.length}
                    </p>
                    <span className="text-[10px] text-emerald-400 mt-1 block">Live in Firestore</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27]">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                      Active Products
                    </span>
                    <p className="text-2xl font-extrabold text-white font-mono-numbers mt-1">
                      {products.length}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1 block">Catalog currently clean</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27]">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                      Inventory Alerts
                    </span>
                    <p className="text-2xl font-extrabold text-amber-400 font-mono-numbers mt-1">
                      {outOfStockCount + lowStockCount}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {outOfStockCount} out of stock, {lowStockCount} low stock
                    </span>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27] flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">Categories Architecture</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{categories.length} active sectors</p>
                    </div>
                    <button
                      onClick={handleOpenAddCategory}
                      className="px-2.5 py-1.5 rounded-lg bg-[#087BFF]/10 text-[#00D9FF] hover:bg-[#087BFF]/20 text-xs font-bold cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27] flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">Homepage Banners</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{banners.length} promotional slides</p>
                    </div>
                    <button
                      onClick={handleOpenAddBanner}
                      className="px-2.5 py-1.5 rounded-lg bg-[#087BFF]/10 text-[#00D9FF] hover:bg-[#087BFF]/20 text-xs font-bold cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27] flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">Activity Logs</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{activityLogs.length} audit entries</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('logs')}
                      className="px-2.5 py-1.5 rounded-lg bg-[#151922] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer border border-[#1a1e27]"
                    >
                      Inspect
                    </button>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="p-5 rounded-xl bg-[#0c0d12] border border-[#1a1e27] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Recent Customer Orders
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#00D9FF] hover:underline cursor-pointer"
                    >
                      View All Orders ({orders.length})
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">
                      No customer orders have been placed yet.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#1a1e27]">
                      {orders.slice(0, 5).map((ord) => (
                        <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-mono-numbers font-bold text-[#00D9FF]">{ord.id}</span>
                            <span className="text-slate-400 ml-2">by {ord.customerName}</span>
                            <p className="text-[11px] text-slate-500">{new Date(ord.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono-numbers font-bold text-white">${ord.totalAmount}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1a1e27] text-slate-300">
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTS MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">Product Inventory Management</h2>
                    <p className="text-xs text-slate-400">
                      Add real products, edit specifications, delete products, or clear catalog.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenAddProduct}
                      className="px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#087BFF]/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Product</span>
                    </button>

                    {products.length > 0 && (
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete all products and clear the catalog?')) {
                            await clearAllProducts();
                          }
                        }}
                        className="px-3 py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Purge all products"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear All Products</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search by title or brand..."
                      className="w-full bg-[#0c0d12] border border-[#1a1e27] rounded-lg pl-9 pr-3 py-2 text-xs text-white"
                    />
                  </div>

                  <select
                    value={productCatFilter}
                    onChange={(e) => setProductCatFilter(e.target.value)}
                    className="bg-[#0c0d12] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white cursor-pointer"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Products Table */}
                <div className="rounded-xl border border-[#1a1e27] overflow-hidden bg-[#0c0d12]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-[#07080b] text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#1a1e27]">
                        <tr>
                          <th className="px-4 py-3">Product</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Stock</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1a1e27]">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                              <p className="text-sm font-semibold text-slate-400 mb-1">
                                Product Catalog is Empty
                              </p>
                              <p className="text-xs text-slate-500 mb-4">
                                No products found. Click "Add New Product" to populate your live store inventory.
                              </p>
                              <button
                                onClick={handleOpenAddProduct}
                                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] inline-flex items-center gap-1.5 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add First Product
                              </button>
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-[#11141c] transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={p.images[0] || '/assets/aistudio/file_000000006df48211a08a0073fab6ae4d_fd38b12d.png'}
                                    alt={p.name}
                                    className="w-10 h-10 object-cover rounded bg-black/40 border border-[#1a1e27] shrink-0"
                                  />
                                  <div className="truncate max-w-[260px]">
                                    <span className="font-semibold text-white block truncate">{p.name}</span>
                                    <span className="text-[11px] text-slate-400">{p.brand}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-400 truncate max-w-[150px]">{p.category}</td>
                              <td className="px-4 py-3 font-mono-numbers font-medium text-white">
                                ${p.price}
                                {p.discountPrice && (
                                  <span className="text-emerald-400 ml-1.5 text-[11px]">
                                    (${p.discountPrice})
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 font-mono-numbers">
                                <span
                                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                    p.stock <= 0
                                      ? 'bg-rose-500/10 text-rose-400'
                                      : p.stock <= 5
                                      ? 'bg-amber-500/10 text-amber-400'
                                      : 'bg-emerald-500/10 text-emerald-400'
                                  }`}
                                >
                                  {p.stock} units
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenEditProduct(p)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1e27] transition-colors cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (confirm(`Delete product "${p.name}"?`)) {
                                        await deleteProduct(p.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">Customer Orders & COD Fulfillment</h2>
                    <p className="text-xs text-slate-400">
                      Add manual orders, edit customer info, update statuses, or delete orders.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleOpenAddOrder}
                      className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#087BFF]/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Order</span>
                    </button>

                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="bg-[#0c0d12] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white cursor-pointer"
                    >
                      <option value="all">All Statuses ({orders.length})</option>
                      {VALID_ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredOrders.length === 0 ? (
                    <div className="p-8 rounded-xl bg-[#0c0d12] border border-[#1a1e27] text-center text-xs text-slate-400">
                      No orders match the selected status.
                    </div>
                  ) : (
                    filteredOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27] space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <span className="font-mono-numbers font-bold text-[#00D9FF] text-sm">
                              {ord.id}
                            </span>
                            <span className="text-xs text-slate-400 ml-2">
                              by <strong className="text-white">{ord.customerName}</strong> ({ord.email})
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Phone: <strong className="text-slate-300">{ord.phone}</strong> · Placed:{' '}
                              {new Date(ord.createdAt).toLocaleString()}
                            </p>
                          </div>

                          {/* Status Updater & Actions */}
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400">Status:</span>
                            <select
                              value={ord.status}
                              onChange={async (e) => {
                                await updateOrderStatus(ord.id, e.target.value as OrderStatus);
                              }}
                              className="bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#00D9FF] cursor-pointer focus:outline-none focus:border-[#087BFF]"
                            >
                              {VALID_ORDER_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>

                            <div className="text-right ml-2 mr-2">
                              <span className="text-sm font-extrabold text-white font-mono-numbers">
                                ${ord.totalAmount}
                              </span>
                              <span className="text-[10px] text-slate-500 block">COD</span>
                            </div>

                            <button
                              onClick={() => handleOpenEditOrder(ord)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1e27] transition-colors cursor-pointer"
                              title="Edit Order Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={async () => {
                                if (confirm(`Delete order ${ord.id}? This action is irreversible.`)) {
                                  await deleteOrder(ord.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Delivery address & items breakdown */}
                        <div className="p-3 rounded-lg bg-[#07080a] border border-[#1a1e27] text-xs grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Shipping Address
                            </span>
                            <p className="text-slate-300">
                              {ord.address}, {ord.area}, {ord.city} - {ord.postalCode}
                            </p>
                            {ord.notes && (
                              <p className="text-slate-400 italic text-[11px] mt-1">
                                Customer Note: "{ord.notes}"
                              </p>
                            )}
                          </div>

                          <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Items Ordered ({ord.items.length})
                            </span>
                            <div className="space-y-1">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-slate-300">
                                  <span className="truncate max-w-[200px]">
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span className="font-mono-numbers text-white font-medium">
                                    ${item.price * item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: CATEGORIES MANAGEMENT */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">Categories Architecture</h2>
                    <p className="text-xs text-slate-400">
                      Add, edit, and delete specialized electronics and technology sectors.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative min-w-[180px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        placeholder="Search categories..."
                        className="w-full bg-[#0c0d12] border border-[#1a1e27] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <button
                      onClick={handleOpenAddCategory}
                      className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#087BFF]/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Category</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredCategories.map((cat, idx) => {
                    const count = products.filter((p) => p.category === cat.name).length;
                    return (
                      <div
                        key={cat.id}
                        className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27] flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-500 font-mono-numbers">
                                #{idx + 1}
                              </span>
                              <h3 className="text-xs font-bold text-white">{cat.name}</h3>
                            </div>
                            <span className="text-[11px] font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded font-mono-numbers shrink-0">
                              {count} items
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                            {cat.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#161a22] flex items-center justify-between text-xs">
                          <span className="text-[10px] text-slate-500 font-mono-numbers truncate max-w-[140px]">
                            slug: {cat.slug}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditCategory(cat)}
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1a1e27] cursor-pointer"
                              title="Edit Category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Delete category "${cat.name}"?`)) {
                                  await deleteCategory(cat.id);
                                }
                              }}
                              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: BANNERS MANAGEMENT */}
            {activeTab === 'banners' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">Homepage Promotional Banners</h2>
                    <p className="text-xs text-slate-400">
                      Add, edit, toggle, and delete marketing hero banners and promotional cards.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddBanner}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#087BFF]/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Banner</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {banners.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-xl border border-[#1a1e27] overflow-hidden bg-[#0c0d12]"
                    >
                      <div className="relative h-40 bg-black/60">
                        <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-[#087BFF] px-2 py-0.5 rounded">
                          {b.badge || 'PROMO'}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="text-sm font-bold text-white">{b.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{b.subtitle}</p>
                        <div className="pt-2 flex items-center justify-between text-xs">
                          <button
                            onClick={async () => {
                              await updateBanner({ ...b, active: !b.active });
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer border ${
                              b.active
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-[#151922] text-slate-400 border-[#1a1e27]'
                            }`}
                          >
                            {b.active ? 'Active' : 'Inactive'}
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditBanner(b)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1e27] cursor-pointer"
                              title="Edit Banner"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Delete banner "${b.title}"?`)) {
                                  await deleteBanner(b.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                              title="Delete Banner"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: CUSTOMERS */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Customer Database</h2>
                  <p className="text-xs text-slate-400">
                    Registered Google Gmail customer profiles and ordering history.
                  </p>
                </div>

                <div className="rounded-xl border border-[#1a1e27] overflow-hidden bg-[#0c0d12]">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#07080b] text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-[#1a1e27]">
                      <tr>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Gmail Address</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Orders</th>
                        <th className="px-4 py-3 text-right">Total Spent (COD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1e27]">
                      {customerList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                            No customers have completed orders yet.
                          </td>
                        </tr>
                      ) : (
                        customerList.map((cust, idx) => (
                          <tr key={idx} className="hover:bg-[#11141c]">
                            <td className="px-4 py-3 font-semibold text-white">{cust.name}</td>
                            <td className="px-4 py-3 text-slate-400 font-mono-numbers">{cust.email}</td>
                            <td className="px-4 py-3 font-mono-numbers">{cust.phone}</td>
                            <td className="px-4 py-3 font-mono-numbers">{cust.ordersCount}</td>
                            <td className="px-4 py-3 font-mono-numbers font-bold text-[#00D9FF] text-right">
                              ${cust.totalSpent}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 7: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h2 className="text-lg font-bold text-white">Store Settings & Free-Tier Rules</h2>
                  <p className="text-xs text-slate-400">
                    Configure official contact details, COD notices, and free shipping thresholds.
                  </p>
                </div>

                {settingsSavedNotice && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Store configuration updated successfully.</span>
                  </div>
                )}

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await updateSettings(settingsForm);
                    setSettingsSavedNotice(true);
                    setTimeout(() => setSettingsSavedNotice(false), 3000);
                  }}
                  className="space-y-4 p-5 rounded-xl bg-[#0c0d12] border border-[#1a1e27]"
                >
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Store Name</label>
                    <input
                      type="text"
                      value={settingsForm.siteName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                      className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Support Email</label>
                    <input
                      type="email"
                      value={settingsForm.supportEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                      className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Support Helpline</label>
                    <input
                      type="text"
                      value={settingsForm.supportPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, supportPhone: e.target.value })}
                      className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Cash on Delivery Notice
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.notice}
                      onChange={(e) => setSettingsForm({ ...settingsForm, notice: e.target.value })}
                      className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Free Shipping Threshold ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={settingsForm.freeShippingThreshold}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })
                      }
                      className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white font-mono-numbers"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSettingsForm({
                          siteName: 'AXIBION',
                          supportEmail: 'support@axibion.tech',
                          supportPhone: '+1 (800) 294-2466',
                          notice: 'COD available across all regions. Standard delivery within 48-72 hours.',
                          freeShippingThreshold: 200,
                        });
                      }}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Defaults
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors cursor-pointer"
                    >
                      Save Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 8: ACTIVITY LOGS */}
            {activeTab === 'logs' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">Administrator Activity & Audit Logs</h2>
                    <p className="text-xs text-slate-400">
                      Historical log of catalog modifications, order updates, and configuration events.
                    </p>
                  </div>

                  {activityLogs.length > 0 && (
                    <button
                      onClick={async () => {
                        if (confirm('Clear all activity logs?')) {
                          await clearAllActivityLogs();
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All Logs</span>
                    </button>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-[#0c0d12] border border-[#1a1e27]">
                  {activityLogs.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">
                      No administrative actions logged yet.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#161a22]">
                      {activityLogs.map((log) => (
                        <div key={log.id} className="py-2.5 flex items-start justify-between gap-4 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#00D9FF]">{log.action}</span>
                              <span className="text-[10px] text-slate-500 font-mono-numbers">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-slate-300 mt-0.5">{log.details}</p>
                            <span className="text-[10px] text-slate-500">by {log.adminEmail}</span>
                          </div>

                          <button
                            onClick={async () => {
                              await deleteActivityLog(log.id);
                            }}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer shrink-0"
                            title="Delete log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Product Add / Edit Modal */}
      {/* ---------------------------------------------------- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0c0d12] border border-[#1a1e27] rounded-2xl p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1a1e27]">
              <h3 className="text-sm font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Technology Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. AX-200 Cyber Diagnostic Transceiver"
                    className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. AXIBION Labs"
                    className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white font-mono-numbers"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Discount Price ($ optional)</label>
                  <input
                    type="number"
                    min="0"
                    value={formDiscountPrice}
                    onChange={(e) => setFormDiscountPrice(Number(e.target.value))}
                    className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white font-mono-numbers"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white font-mono-numbers"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Comprehensive technical specifications and product highlights..."
                  className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Product Image URL / Asset</label>
                <input
                  type="text"
                  value={formImages[0] || ''}
                  onChange={(e) => setFormImages([e.target.value])}
                  placeholder="/assets/aistudio/... or image URL"
                  className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white font-mono-numbers"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-[#1a1e27] bg-[#151922] text-[#087BFF]"
                />
                <label htmlFor="featuredCheckbox" className="text-xs text-slate-300 font-medium">
                  Feature on Homepage
                </label>
              </div>

              <div className="pt-3 border-t border-[#1a1e27] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors shadow-md shadow-[#087BFF]/20"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Category Add / Edit Modal */}
      {/* ---------------------------------------------------- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0c0d12] border border-[#1a1e27] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1a1e27]">
              <h3 className="text-sm font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Quantum Security Dongles"
                  className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Slug</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="e.g. quantum-security-dongles"
                  className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Category scope and hardware types..."
                  className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="highlightCategory"
                  checked={catHighlight}
                  onChange={(e) => setCatHighlight(e.target.checked)}
                  className="w-4 h-4 rounded border-[#1a1e27] bg-[#151922] text-[#087BFF]"
                />
                <label htmlFor="highlightCategory" className="text-xs text-slate-300 font-medium">
                  Highlight on Navigation Bar
                </label>
              </div>

              <div className="pt-3 border-t border-[#1a1e27] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Banner Add / Edit Modal */}
      {/* ---------------------------------------------------- */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0c0d12] border border-[#1a1e27] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1a1e27]">
              <h3 className="text-sm font-bold text-white">
                {editingBanner ? 'Edit Banner' : 'Add New Promotional Banner'}
              </h3>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Banner Title</label>
                <input
                  type="text"
                  required
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Cybersecurity Hardware"
                  className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  required
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="Compelling promotional headline..."
                  className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={bannerBadge}
                  onChange={(e) => setBannerBadge(e.target.value)}
                  placeholder="e.g. NEW ARRIVALS / PROMO"
                  className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="/src/assets/images/... or image URL"
                  className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white font-mono-numbers"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bannerActiveCheckbox"
                  checked={bannerActive}
                  onChange={(e) => setBannerActive(e.target.checked)}
                  className="w-4 h-4 rounded border-[#1a1e27] bg-[#151922] text-[#087BFF]"
                />
                <label htmlFor="bannerActiveCheckbox" className="text-xs text-slate-300 font-medium">
                  Active on Homepage
                </label>
              </div>

              <div className="pt-3 border-t border-[#1a1e27] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors"
                >
                  {editingBanner ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Order Add / Edit Modal */}
      {/* ---------------------------------------------------- */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0c0d12] border border-[#1a1e27] rounded-2xl p-6 sm:p-8 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1a1e27]">
              <h3 className="text-sm font-bold text-white">
                {editingOrder ? `Edit Order (${editingOrder.id})` : 'Create Manual Order (COD)'}
              </h3>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={orderCustName}
                    onChange={(e) => setOrderCustName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Customer Gmail</label>
                  <input
                    type="email"
                    required
                    value={orderEmail}
                    onChange={(e) => setOrderEmail(e.target.value)}
                    placeholder="gmail@example.com"
                    className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white font-mono-numbers"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={orderPhone}
                    onChange={(e) => setOrderPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white font-mono-numbers"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Order Status</label>
                  <select
                    value={orderStatusVal}
                    onChange={(e) => setOrderStatusVal(e.target.value as OrderStatus)}
                    className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white cursor-pointer"
                  >
                    {VALID_ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={orderAddress}
                  onChange={(e) => setOrderAddress(e.target.value)}
                  placeholder="Street address, building, floor"
                  className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={orderCity}
                    onChange={(e) => setOrderCity(e.target.value)}
                    className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Area</label>
                  <input
                    type="text"
                    required
                    value={orderArea}
                    onChange={(e) => setOrderArea(e.target.value)}
                    className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={orderPostal}
                    onChange={(e) => setOrderPostal(e.target.value)}
                    className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white font-mono-numbers"
                  />
                </div>
              </div>

              {!editingOrder && (
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#1a1e27]">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">Item Ordered</label>
                    <input
                      type="text"
                      required
                      value={orderItemName}
                      onChange={(e) => setOrderItemName(e.target.value)}
                      placeholder="Product name"
                      className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Price ($)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={orderItemPrice}
                      onChange={(e) => setOrderItemPrice(Number(e.target.value))}
                      className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white font-mono-numbers"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Optional customer or courier notes..."
                  className="w-full bg-[#151922] border border-[#1a1e27] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-3 border-t border-[#1a1e27] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#087BFF] hover:bg-[#0066d6] transition-colors"
                >
                  {editingOrder ? 'Save Order' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
