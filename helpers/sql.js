const { BadRequestError } = require("../expressError");

/**
 * Generates the SQL query for a partial update based on the provided data object.
 *
 * @param {Object} dataToUpdate - An object containing the fields to be updated.
 * @param {Object} jsToSql - An object that maps JavaScript-style keys to their corresponding SQL column names.
 * @returns {Object} An object with setCols (a string of columns to be updated in SQL SET clause)
 *                   and values (an array of values for the SET clause in SQL query).
 * @throws {BadRequestError} Throws an error if no data is provided.
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
