'use strict';

const {
	postBook,
	getAll,
	getId,
	postComment,
	deleteId,
	deleteAll
} = require("../controllers/mainController");

module.exports = function (app) {

  app.route('/api/books')
    .get(getAll)
    .post(postBook)
    .delete(deleteAll);

  app.route('/api/books/:id')
    .get(getId)
    .post(postComment)
    .delete(deleteId)
};
