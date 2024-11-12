export interface ShortDate {
  year: number;
  month: number;
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export const shortDate = {
  copy(date: ShortDate): ShortDate {
    return { year: date.year, month: date.month };
  },
  fromDate: (date: Date): ShortDate => {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    };
  },
  fromId(str: string): ShortDate {
    const [year, month] = str.split('-').map(Number);
    return { year, month };
  },
  toId(date: ShortDate): string {
    return `${date.year}-${date.month}`;
  },
  eq(a: ShortDate, b: ShortDate): boolean {
    return a.year === b.year && a.month === b.month;
  },
  gt(a: ShortDate, b: ShortDate): boolean {
    return a.year > b.year || (a.year === b.year && a.month > b.month);
  },
  gte(a: ShortDate, b: ShortDate): boolean {
    return shortDate.gt(a, b) || shortDate.eq(a, b);
  },
  lt(a: ShortDate, b: ShortDate): boolean {
    return a.year < b.year || (a.year === b.year && a.month < b.month);
  },
  lte(a: ShortDate, b: ShortDate): boolean {
    return shortDate.lt(a, b) || shortDate.eq(a, b);
  },
  addMonths: (date: ShortDate, months: number): ShortDate => {
    const newYear = date.year + Math.floor((date.month + months - 1) / 12);
    const newMonth = mod(date.month + months - 1, 12) + 1;
    return {
      year: newYear,
      month: newMonth,
    };
  },
  subMonths: (date: ShortDate, months: number): ShortDate => {
    return shortDate.addMonths(date, -months);
  },
  next(date: ShortDate): ShortDate {
    return shortDate.addMonths(date, 1);
  },
  prev(date: ShortDate): ShortDate {
    return shortDate.addMonths(date, -1);
  },
  toDate: (date: ShortDate): Date => {
    return new Date(date.year, date.month - 1, 1);
  },
  monthDiff(a: ShortDate, b: ShortDate): number {
    return (b.year - a.year) * 12 + b.month - a.month;
  },
  min(...dates: ShortDate[]): ShortDate {
    return dates.reduce((acc, date) => (shortDate.lt(date, acc) ? date : acc));
  },
  max(...dates: ShortDate[]): ShortDate {
    return dates.reduce((acc, date) => (shortDate.gt(date, acc) ? date : acc));
  },
};
