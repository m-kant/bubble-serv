/**
 * Serves methods:
 * PUT user/
 * to create new user
 */

const UsersDB = require("./users-db");

module.exports = function ({ bodyParams }) {
    return UsersDB.insert(bodyParams);
};