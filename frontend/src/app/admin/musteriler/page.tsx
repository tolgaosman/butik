import { apiGetAuthed } from "@/lib/api";
import { CustomersTable } from "./CustomersTable";

async function loadCustomers(): Promise<any[]> {
  try {
    return (await apiGetAuthed<any[]>("/admin/customers")) ?? [];
  } catch {
    return [];
  }
}

export default async function CustomersPage() {
  const customers = await loadCustomers();

  return <CustomersTable customers={customers} />;
}
