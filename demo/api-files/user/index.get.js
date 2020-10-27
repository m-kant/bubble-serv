/**
 * Serves methods:
 * GET user/
 * GET user/?search=partOfName
 * GET user/:id
 * GET user/:id/:property
 */

const UsersDB = require("./users-db");

module.exports = function ({ queryParams, pathParams }) {
  const [id, prop] = pathParams;

  // if id given, then one record requested
  if (id !== undefined) {
    // UsersDB drops exception if user will not be found
    const user = UsersDB.getById(id);

    // if prop given return just particular prop
    // Have to encode strings/udefined as a JSON
    return prop ? JSON.stringify(user[prop]) : user;
  }

  // list is requested
  // if queryParams.search is undefined
  // complete list will be returned
  return UsersDB.select().where("lastName").like(queryParams.search).getList();
};
