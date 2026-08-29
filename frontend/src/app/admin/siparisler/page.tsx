import { apiGetAuthed } from "@/lib/api";
import type { AdminOrder } from "@/lib/admin";
import { OrdersTable } from "./OrdersTable";

async function loadOrders(): Promise<AdminOrder[]> {
  try {
    return (await apiGetAuthed<AdminOrder[]>("/admin/orders")) ?? [];
  } catch {
    return [];
  }
}

export default async function OrdersPage() {
  const orders = await loadOrders();

  return <OrdersTable orders={orders} />;
}
