export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/&/g, "and") // replace & with 'and'
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/[^a-z0-9-]/g, ""); // optional: remove special characters
};