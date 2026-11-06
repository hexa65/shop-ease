export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// A customer before the server gives it an id.
export type NewCustomer = Omit<Customer, "id">;
