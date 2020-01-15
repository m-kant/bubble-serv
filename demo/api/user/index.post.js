/**
 * Serves methods:
 * POST user/:id with user data
 * to update user data
 */

const UsersDB = require("./users-db");

module.exports = function ({ pathParams, bodyParams }) {
	const [id] = pathParams; // destructuring id from array
	if(id === undefined) throw new Error ("No id specified");

    return UsersDB.update({id, ...bodyParams});
};
