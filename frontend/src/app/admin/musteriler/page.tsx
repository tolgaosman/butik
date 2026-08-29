import { apiGetAuthed } from "@/lib/api";
import type { AdminCustomer } from "@/lib/admin";
import { CustomersTable } from "./CustomersTable";

async function loadCustomers(): Promise<AdminCustomer[]> {
  try {
    return (await apiGetAuthed<AdminCustomer[]>("/admin/customers")) ?? [];
  } catch {
    return [];
  }
}

export default async function CustomersPage() {
  const customers = await loadCustomers();

  return <CustomersTable customers={customers} />;
}
