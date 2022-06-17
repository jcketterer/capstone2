const { sqlForPartialUpdate } = require('./sql');
const { BadRequestError } = require('../expressError');

describe('testing sql for partial updates function', function () {
  test('works when both data and jsonToSql included', function () {
    const data = {
      name: 'testUser',
      firstName: 'test',
      lastName: 'user',
    };
    const jsonToSql = { firstName: 'first_name', lastName: 'last_name' };
    const { setCols, values } = sqlForPartialUpdate(data, jsonToSql);

    expect(setCols).toEqual('"name"=$1, "first_name"=$2, "last_name"=$3');
    expect(values).toEqual(['testUser', 'test', 'user']);
  });

  test('should work with just data provided and no json', function () {
    const data = {
      name: 'testUser',
      email: 'test@user.com',
    };
    const jsonToSql = {};
    const { setCols, values } = sqlForPartialUpdate(data, jsonToSql);

    expect(setCols).toEqual(`"name"=$1, "email"=$2`);
    expect(values).toEqual(['testUser', 'test@user.com']);
  });

  test('throws BadRequestError with empty data', function () {
    try {
      const data = {};
      const jsonToSql = {};
      const { setCols, values } = sqlForPartialUpdate(data, jsonToSql);
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
