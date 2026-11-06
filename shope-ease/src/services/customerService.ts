import { api } from "./api";
import type { Customer, NewCustomer } from "../types/customer";
import type { CheckoutDetails } from "../types/order";

export async function getCustomers(): Promise<Customer[]> {
  const { data } = await api.get<Customer[]>("/customers");
  return data;
}

export async function findCustomerByEmail(
  email: string,
): Promise<Customer | null> {
  const { data } = await api.get<Customer[]>("/customers", {
    params: { email: email.trim().toLowerCase() },
  });
  return data[0] ?? null;
}

export async function createCustomer(customer: NewCustomer): Promise<Customer> {
  const { data } = await api.post<Customer>("/customers", customer);
  return data;
}

export async function findOrCreateCustomer(
  details: CheckoutDetails,
): Promise<Customer> {
  const existing = await findCustomerByEmail(details.email);
  if (existing) {
    return existing;
  }

  return createCustomer({
    name: details.name.trim(),
    email: details.email.trim().toLowerCase(),
    phone: details.phone.trim(),
  });
}
