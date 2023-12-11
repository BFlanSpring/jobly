const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {
  static async create({ title, salary, equity, company_handle }) {
    const duplicateCheck = await db.query(
      `SELECT id
       FROM jobs
       WHERE title = $1`,
      [title]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate job title: ${title}`);
    }

    const result = await db.query(
      `INSERT INTO jobs
       (title, salary, equity, company_handle)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
      [title, salary, equity, company_handle]
    );

    const job = result.rows[0];
    return job;
  }

  static async findAll(filters = {}) {
    const { title, minSalary, hasEquity } = filters;

    let baseQuery = `
      SELECT id,
             title,
             salary,
             equity,
             company_handle AS "companyHandle"
      FROM jobs`;

    let whereExpressions = [];
    let queryValues = [];

    if (title) {
      queryValues.push(`%${title}%`);
      whereExpressions.push(`title ILIKE $${queryValues.length}`);
    }

    if (minSalary !== undefined) {
      queryValues.push(minSalary);
      whereExpressions.push(`salary >= $${queryValues.length}`);
    }

    if (hasEquity !== undefined && hasEquity) {
      whereExpressions.push(`equity > 0`);
    }

    if (whereExpressions.length > 0) {
      baseQuery += " WHERE " + whereExpressions.join(" AND ");
    }

    baseQuery += " ORDER BY title";

    const jobsRes = await db.query(baseQuery, queryValues);
    return jobsRes.rows;
  }

  static async get(id) {
    const jobRes = await db.query(
      `SELECT id,
              title,
              salary,
              equity,
              company_handle AS "companyHandle"
       FROM jobs
       WHERE id = $1`,
      [id]
    );

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No job with ID: ${id}`);

    return job;
  }

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data);
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, title, salary, equity, company_handle AS "companyHandle"`;

    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job with ID: ${id}`);

    return job;
  }

  static async remove(id) {
    const result = await db.query(
      `DELETE
       FROM jobs
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job with ID: ${id}`);
  }
}

module.exports = Job;
