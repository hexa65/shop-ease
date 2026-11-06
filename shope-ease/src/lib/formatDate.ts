// "2026-10-18T17:05:00.000Z" -> "October 18, 2026 at 6:05 PM" (in the user's locale and time zone)
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso; // Better to show the raw text than "Invalid Date".
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}
