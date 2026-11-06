// One place for every query key, so a typo can never hide in a component.
// `as const` freezes each array so TypeScript treats it as exact values.
export const queryKeys = {
  products: {
    all: ["products"] as const,
    // One folder per product: ["products", 3]
    detail: (id: number | null) => ["products", id] as const,
  },

  orders: {
    all: ["orders"] as const,
    detail: (id: number) => ["orders", id] as const,
  },
  customers: {
    all: ["customers"] as const,
  },
};
