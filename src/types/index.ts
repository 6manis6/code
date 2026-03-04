export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: "clothing" | "figures" | "accessories";
  image: string;
  stock: number;
  featured: boolean;
  createdAt: Date;
}

export interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AnimeItem {
  _id: string;
  title: string;
  score: string;
  image: string;
  mal?: string;
}
