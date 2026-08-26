import { apiGetAuthed } from "@/lib/api";
import { OrdersTable } from "./OrdersTable";

async function loadOrders(): Promise<any[]> {
  try {
    return (await apiGetAuthed<any[]>("/admin/orders")) ?? [];
  } catch {
    return [];
  }
}

export default async function OrdersPage() {
  const orders = await loadOrders();

  return <OrdersTable orders={orders} />;
}
