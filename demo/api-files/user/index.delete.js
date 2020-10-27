/**
 * Serves methods:
 * DELETE user/id
 * to delete users by id
 */

const UsersDB = require("./users-db");

module.exports = function ({ pathParams }) {
  const [id] = pathParams;
  if (id === undefined) throw new Error("No id specified");

  return UsersDB.delete([id]);
};
