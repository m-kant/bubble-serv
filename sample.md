# Sample API

Let's create test REST API for manipulate list of users.

- `GET /user` to get list of all users
- `GET /user?search=partOfName` to find users by name
- `GET /user/:id` to fetch user by id
- `GET /user/:id/:prop` to fetch property of concrete user
- `PUT /user` to create new user
- `POST /user/:id` to update user
- `DELETE /user/:id` to delete user

Create in project root folder `api` for all api files. Create subfolder `user` for api-files related to users.

## Users DB

To simulate DB let's install [array-ql](https://www.npmjs.com/package/array-ql) package. Then create file `api/user/users-db.js`:

```javascript
const ArrayQL = require("array-ql");

// sample db
const users = [
    { id: 1, firstName: "Clyde", lastName: "Griffiths", gender: "male", age: 24 },
    { id: 5, firstName: "Sondra", lastName: "Finchley", gender: "female" }
];

options = {
  // applyed to new and existing records, for exmple, age=null will be added to "Sondra"
  default: { firstName: null, lastName: null, gender: null, age: null },
  getters: {
    // getter for field "name"
    name: (row) => `${row.firstName} ${row.lastName}`
  }
};

// export ArrayQL instance
module.exports = new ArrayQL(users, options);
```

## Read methods

Create `api/user/index.get.js` file, it will be served for all `GET /user/...` requests

```javascript
const UsersDB = require("./users-db");

module.exports = function ({ queryParams, pathParams }) {
  const [id, prop] = pathParams;

  // if id given (/user/:id), then one record requested
  if (id !== undefined) {
    // UsersDB drops exception if user will not be found
    const user = UsersDB.getById(id);

    // if prop given (/user/:id/:prop) return just particular prop
    // Have to encode strings as a JSON
    return prop ? JSON.stringify(user[prop]) : user;
  }

  // no "id" and "prop" given, then list is requested (/user)
  // if queryParams.search is undefined
  // complete list will be returned
  return UsersDB.select().where("lastName").like(queryParams.search).getList();  
};
```

## PUT /user

Create `api/user/index.put.js` file:

```javascript
const UsersDB = require("./users-db");

module.exports = function ({ bodyParams }) {
  return UsersDB.insert(bodyParams);
};
```

## POST /user/:id

Create `api/user/index.post.js` file:

```javascript
const UsersDB = require("./users-db");

module.exports = function ({ pathParams, bodyParams }) {
  const [id] = pathParams; // destructuring id from array
  if(id === undefined) throw new Error ("No id specified");
  
  return UsersDB.update({id, ...bodyParams});
};
```

## DELETE /user/:id

Create `api/user/index.delete.js` file:

```javascript
const UsersDB = require("./users-db");

module.exports = function ({ pathParams }) {
  const [id] = pathParams;
  if(id === undefined) throw new Error("No id specified");

  return UsersDB.delete([id]);
};
```

## Conclusion

That's it! It takes about 15 minutes and 60 lines of code to create full-weight CRUD API even with search. Described files are located in `demo/` folder. Run `demo/app.js`, then go to browser and go to `http://localhost:3000/demo`, if everything is ok, you will see series of request to API with received responses.
