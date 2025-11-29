export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(value);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};
