const { BadRequestError } = require('../expressError');

function sqlForPartialUpdate(data, jsonToSql) {
  const keys = Object.keys(data);
  if (keys.length === 0) throw new BadRequestError('No Data to Update');

  const cols = keys.map((colName, i) => `"${jsonToSql[colName] || colName}"=$${i + 1}`);

  return {
    setCols: cols.join(', '),
    values: Object.values(data),
  };
}

module.exports = { sqlForPartialUpdate };
