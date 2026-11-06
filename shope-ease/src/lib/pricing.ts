export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_FEE = 5;

// Shipping is free from the threshold up. An empty cart has no shipping.
export function getShippingFee(subtotal: number): number {
  if (subtotal <= 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return SHIPPING_FEE;
}

// Subtotal plus shipping, rounded to whole cents.
export function getOrderTotal(subtotal: number): number {
  return Math.round((subtotal + getShippingFee(subtotal)) * 100) / 100;
}
