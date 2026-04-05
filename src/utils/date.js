/** Today's calendar date in local timezone as YYYY-MM-DD (matches <input type="date">). */
export function todayLocalYmd() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** If a deadline string is set and is before today, return today; otherwise unchanged. */
export function normalizeDeadlineNotBeforeToday(deadline) {
  if (deadline == null || deadline === '') return deadline;
  const t = todayLocalYmd();
  return deadline < t ? t : deadline;
}
