const ArrayQL = require("array-ql");

const users = [
    { id: 1, firstName: "Clyde", lastName: "Griffiths", gender: "male", age: 24 },
    { id: 5, firstName: "Sondra", lastName: "Finchley", gender: "female" }
];

options = {
  // applyed to new and existing records, for exmple age=null will be added to "Sondra"
  default: { firstName: null, lastName: null, gender: null, age: null },
  getters: {
    // getter for field "name"
    name: (row) => `${row.firstName} ${row.lastName}`
  }
};

module.exports = new ArrayQL(users, options);