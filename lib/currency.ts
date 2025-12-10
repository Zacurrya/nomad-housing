export type Currency = "USD" | "GBP" | "EUR" | "INR" | "CNY" | "RUB" | "BHT" | "YEN";

// Ordered list of currencies used by the UI dropdown
export const currencies: Currency[] = [
  "USD",
  "GBP",
  "EUR",
  "INR",
  "CNY",
  "RUB",
  "YEN",
  "BHT",
]; 

export const currencyRates: Record<Currency, number> = {
  USD: 1,
  GBP: 0.8,
  EUR: 0.92,
  INR: 83,
  CNY: 7.2,
  RUB: 90,
  YEN: 133.5,
  BHT: 33.5,
};

// Symbol map for each supported currency code (note: some codes like BHT/YEN are non-ISO aliases used in the app)
export const currencySymbols: Record<Currency, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  INR: "₹",
  CNY: "¥",
  RUB: "₽",
  YEN: "¥",
  BHT: "฿",
};

// Convert a USD amount to the target currency numeric value
export function convertFromUSD(amountUSD: number, currency: Currency): number {
  return amountUSD * currencyRates[currency];
}

// Format a numeric amount in the target currency placing the symbol before the price
export function formatPrice(amount: number, currency: Currency): string {
  const symbol = currencySymbols[currency] ?? "";
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${symbol}${formatted}`;
}

// Convenience: format a USD base amount in the target currency with symbol
export function formatPriceUSD(amountUSD: number, currency: Currency) {
  const converted = convertFromUSD(amountUSD, currency);
  return formatPrice(converted, currency);
}

export function parseUSD(price: string): number {
  const cleaned = price.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned);
}

// Convenience helper for UI: takes a USD price string and returns symbol-first formatted string in target currency
export function formatPriceFromUSDString(price: string, currency: Currency): string {
  const usd = parseUSD(price);
  return formatPriceUSD(usd, currency);
}
