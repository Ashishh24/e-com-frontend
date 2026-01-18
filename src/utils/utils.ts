export const getDiscountPercentage = (
  price: number,
  discountedPrice?: number,
): number => {
  if (!discountedPrice || discountedPrice >= price) return 0;

  return Math.round(((price - discountedPrice) / price) * 100);
};
