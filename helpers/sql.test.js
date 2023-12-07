const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate function", () => {
  it("should generate SQL update query for valid input", () => {
    const dataToUpdate = { firstName: "Alice", age: 30 };
    const jsToSql = { firstName: "first_name", age: "age" };

    const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(setCols).toBe(`"first_name"=$1, "age"=$2`);
    expect(values).toEqual(["Alice", 30]);
  });

  it("should throw BadRequestError for empty input", () => {
    const dataToUpdate = {};
    const jsToSql = {};

    expect(() => sqlForPartialUpdate(dataToUpdate, jsToSql)).toThrow(BadRequestError);
  });

});
