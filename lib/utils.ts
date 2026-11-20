export const formatDate = (unixSeconds: number) =>
  new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const getDateRange = (days: number) => {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days);
  const iso = (d: Date) => d.toISOString().split("T")[0];
  return { from: iso(from), to: iso(to) };
};

export const debounce = <A extends unknown[]>(fn: (...args: A) => void, ms: number) => {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};
