export function calculateTotalCost(tests) {
  if (!Array.isArray(tests)) {
    return 0;
  }

  let totalCost = 0;
  for (const test of tests) {
    totalCost += test?.amount_to_pay || 0;
  }
  return totalCost;
}
