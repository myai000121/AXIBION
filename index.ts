export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: string;
  brand: string;
  images: string[];
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isSample?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  postalCode: string;
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'Cash on Delivery';
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  highlight?: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  active: boolean;
  badge?: string;
}

export interface WebsiteSettings {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  notice: string;
  freeShippingThreshold: number;
}

export interface ActivityLog {
  id: string;
  adminEmail: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
