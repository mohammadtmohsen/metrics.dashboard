export const formatNumber = (n: number): string => new Intl.NumberFormat().format(n);

export const formatDate = (t: number): string => new Date(t).toISOString();
