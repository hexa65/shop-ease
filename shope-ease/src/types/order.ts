export const ORDER_STATUSES = ["pending", "completed"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export type NewOrder = Omit<Order, "id">;

export interface CheckoutDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}
