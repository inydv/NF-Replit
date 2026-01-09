// Import moment for DateFormat
import moment from "moment";

// // Default export for DateFormat using moment
// export default function DateFormat(date) {
//   if (!date) return "Invalid date"; // Guard clause for empty date
//   return moment(date).fromNow(true); // 'true' removes "ago"
// }

// Named export for TimeAgoFormat
export default function TimeAgoFormat(date) {
  if (!date) return "Invalid date"; // Guard clause for empty date

  const now = new Date();
  const past = new Date(date);
  if (isNaN(past)) return "Invalid date"; // Handle invalid dates gracefully

  const diffMs = now - past; // Difference in milliseconds
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Determine the appropriate time format
  if (diffMins < 360) {
    return `New`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays === 1) {
    return `Yesterday`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }
}
