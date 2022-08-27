export const formatCurrency = (value: number) => {
  return `HKD ${new Intl.NumberFormat('en-HK').format(value)}`;
}