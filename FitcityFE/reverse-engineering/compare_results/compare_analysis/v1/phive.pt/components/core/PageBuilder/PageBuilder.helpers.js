export function isHeader({ name }, index) {
  return name.toLowerCase().includes("header") && index === 0;
}

export function isFooter({ name }, index, array) {
  return name.toLowerCase().includes("footer") && index === array.length - 1;
}
