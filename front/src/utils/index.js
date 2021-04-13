export function colorHash(str) {
  let hash = 0;
  for (const c of str + "TFNS") {
    hash = c.codePointAt(0) + ((hash << 5) - hash);
  }
  const hue = Math.floor(hash % 360);
  const color = `hsl(${hue}, 100%, 30%)`;
  return color;
}

export function getDate(date) {
  date = date.constructor.name == "Date" ? date : new Date(date)
  const y = date.getFullYear()
  const m = ("00" + (date.getMonth() + 1)).slice(-2);
  const d = ("00" + date.getDate()).slice(-2);
  return `${y}/${m}/${d}`;
}

export function getTime(date) {
  date = date.constructor.name == "Date" ? date : new Date(date)
  const h = ("00" + date.getHours()).slice(-2);
  const m = ("00" + date.getMinutes()).slice(-2);
  return `${h}:${m}`;
}

export function getDateTime(date) {
  date = date.constructor.name == "Date" ? date : new Date(date)
  return `${getDate(date)} ${getTime(date)}`;
}
