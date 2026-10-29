export function formaterDate(date: Date): string {
  return date.toLocaleDateString("fr-CA", { timeZone: "UTC" });
}