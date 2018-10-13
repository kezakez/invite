export function getNames(data) {
  return data
    .map((item, idx) => {
      const name = item[1];
      if (idx === data.length - 1) {
        return `and ${name}`;
      } else if (idx === data.length - 2) {
        return name;
      } else {
        return `${name},`;
      }
    })
    .join(' ');
}
