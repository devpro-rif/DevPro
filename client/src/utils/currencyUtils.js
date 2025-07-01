// Convert cents to dollars for display
export const centsToDollars = (cents) => {
  return (cents / 100).toFixed(2);
};

// Convert dollars to cents for API calls
export const dollarsToCents = (dollars) => {
  return Math.round(parseFloat(dollars) * 100);
};

// Format currency for display
export const formatCurrency = (amount, isCents = true) => {
  const value = isCents ? centsToDollars(amount) : amount;
  return `$${value}`;
}; 