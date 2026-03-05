/**
 * Generate a random alphanumeric string of the given length.
 * @param {number} len - Desired length of the returned string (defaults to 10).
 * @returns {string} The generated string containing ASCII letters and digits.
 */
function randString(len = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

/**
 * Produce a sample value appropriate for a database-like field type.
 *
 * @param {string|any} type - Field data type hint (e.g., "int", "varchar", "json"); falsy returns a short random string.
 * @param {number} index - Row index used for generated numeric or incremental values.
 * @returns {string|number|boolean|object} A representative sample value: an incrementing number for integer/serial types, a random alphanumeric string for character/text types, an ISO date string for time/date types, a boolean for boolean types, an object for JSON types, a numeric string with two decimals for float/double/real types, or a short random string otherwise.
 */
function sampleValueForType(type, index) {
  if (!type) return randString(8);
  const t = String(type).toLowerCase();
  if (t.includes("int") || t.includes("serial")) return index + 1;
  if (t.includes("char") || t.includes("text") || t.includes("varchar")) return randString(12);
  if (t.includes("time") || t.includes("date")) return new Date().toISOString();
  if (t.includes("bool")) return Math.random() > 0.5;
  if (t.includes("json")) return { sample: true, i: index };
  if (t.includes("float") || t.includes("double") || t.includes("real")) return (Math.random() * 100).toFixed(2);
  return randString(8);
}

/**
 * Generate sample rows for each table.
 * @param {Array} tables - Array of table descriptors; each may include `id`, `name`, and `fields` (array of objects with `name` and `type` or `dataType`).
 * @param {number} count - Number of rows to generate per table.
 * @returns {Object} An object mapping each table's name (or `table_<id>`) to an array of generated row objects.
 */
export function generateSampleData(tables = [], count = 5) {
  const out = {};
  tables.forEach((table) => {
    const rows = [];
    for (let i = 0; i < count; i++) {
      const row = {};
      (table.fields || []).forEach((f, idx) => {
        const key = f.name || `col_${idx}`;
        row[key] = sampleValueForType(f.type || f.dataType || "", i);
      });
      rows.push(row);
    }
    out[table.name || `table_${table.id}`] = rows;
  });
  return out;
}

export default generateSampleData;
