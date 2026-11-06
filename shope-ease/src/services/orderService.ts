import { api } from "./api";
import type { Order } from "../types/order";

const ORDERS_PATH = "/orders";

// GET /orders -> all orders
export async function getOrders(): Promise<Order[]> {
  const res = await api.get<Order[]>(ORDERS_PATH);
  return res.data;
}

// GET /orders/:id -> one order (axios throws on 404)
export async function getOrderById(id: number): Promise<Order> {
  const res = await api.get<Order>(`${ORDERS_PATH}/${id}`);
  return res.data;
}

// POST /orders -> creates an order, the server adds the id
export async function createOrder(input: Omit<Order, "id">): Promise<Order> {
  const res = await api.post<Order>(ORDERS_PATH, input);
  return res.data;
}

// PATCH /orders/:id -> change ONLY the status. Nothing else is sent, so no
// other field of the order can be overwritten.
export async function updateOrderStatus(
  id: number,
  status: Order["status"],
): Promise<Order> {
  const res = await api.patch<Order>(`${ORDERS_PATH}/${id}`, { status });
  return res.data;
}
