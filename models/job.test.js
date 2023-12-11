"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "New Job",
    salary: 60000,
    equity: 0.05,
    company_handle: "c1", // Ensure it matches an existing company handle
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual(newJob);

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE title = 'New Job'`);
    expect(result.rows).toEqual([
      {
        title: "New Job",
        salary: 60000,
        equity: 0.05,
        company_handle: "c1",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Job.create(newJob);
      await Job.create(newJob);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs.length).toBeGreaterThan(0);
  });

});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    const job = await Job.get(1); // Assuming '1' is a valid job ID
    expect(job).toBeTruthy();
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(9999); // Assuming '9999' is an invalid job ID
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  test("works", async function () {
    const updateData = {
      title: "Updated Job",
      salary: 70000,
      equity: 0.1,
      company_handle: "c2", // Assuming 'c2' is a valid company handle
    };

    const job = await Job.update(1, updateData); // Assuming '1' is a valid job ID
    expect(job.title).toEqual("Updated Job");
    expect(job.salary).toEqual(70000);
    expect(job.equity).toEqual(0.1);
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(9999, {}); // Assuming '9999' is an invalid job ID
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(1, {}); // Assuming '1' is a valid job ID
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(1); // Assuming '1' is a valid job ID

    const res = await db.query(
      "SELECT id FROM jobs WHERE id=1"
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(9999); // Assuming '9999' is an invalid job ID
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
