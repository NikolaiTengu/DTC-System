const { stringify } = require("csv-stringify/sync");

function toCsv(rows) {
  return stringify(rows, { header: true });
}

module.exports = { toCsv };
