export function formatIsoDate(date: Date): string {
  const [isoDateString] = date.toISOString().split("T");

  return isoDateString;
}
