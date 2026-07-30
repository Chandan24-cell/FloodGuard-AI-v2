export function formatNumber(value) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

export function formatCompactNumber(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

export function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short"
  }).format(date);
}

export function riskTone(riskLevel) {
  switch (riskLevel?.toLowerCase()) {
    case "extreme":
      return "critical";
    case "high":
      return "high";
    case "moderate":
      return "medium";
    default:
      return "low";
  }
}
