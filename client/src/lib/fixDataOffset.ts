export const fixDateOffset = (dateString: string | Date) => {
  const d = new Date(dateString);
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
};