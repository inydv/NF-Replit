module.exports = (slug) => {
  const formattedSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  const dateSuffix = `on-${day}-${month}-${year}`;

  return `${formattedSlug}-${dateSuffix}`;
};
