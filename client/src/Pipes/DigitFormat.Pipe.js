// FUNCTION CONVERT TO INDIAN CURRENCY
export default function DigitFormat(num) {
  if (num === null || num === undefined || isNaN(num)) return "$0";

  num = Number(num);

  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(1)}B`; // Billions
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(1)}M`; // Millions
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(1)}K`; // Thousands
  } else {
    return `$${num.toFixed(2)}`; // Less than 1000
  }
}
