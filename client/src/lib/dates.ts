export function getMonthName(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long' });
}

export function getYearYear(date: Date): number {
  return date.getFullYear();
}

export function getPastThreeMonths(): { date: Date; monthYear: string }[] {
  const months = [];
  const now = new Date();

  for (let i = 3; i >= 1; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      date,
      monthYear: `${getMonthName(date)} ${date.getFullYear()}`,
    });
  }

  return months;
}

export function getCurrentMonthYear(): string {
  const now = new Date();
  return `${getMonthName(now)} ${now.getFullYear()}`;
}
