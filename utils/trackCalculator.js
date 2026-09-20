/**
 * Non-blocking client-side helper to track calculator usage in MongoDB Atlas
 */
export function trackCalculatorUsage(calculatorType) {
  if (typeof window === 'undefined') return;
  try {
    fetch('/api/calculators/usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ calculatorType }),
    }).catch(() => {
      // non-blocking
    });
  } catch {
    // non-blocking
  }
}
