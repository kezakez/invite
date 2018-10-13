export function getNames(data) {
  return data
    .map((item, idx) => {
      const name = item[1];
      if (data.length === 1) return name;
      if (idx === data.length - 1) {
        return `& ${name}`;
      } else if (idx === data.length - 2) {
        return name;
      } else {
        return `${name},`;
      }
    })
    .join(' ');
}
