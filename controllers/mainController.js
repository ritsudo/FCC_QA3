const Book = require("../models/Book");
const Comment = require("../models/Comment");

const mongoose = require('mongoose');

const postBook = (req, res) => {
	console.log("postBook called");
	
	if(!req.body.title) {
		res.send("missing required field title");
	} else {
	
	let newbookTitle = req.body.title;
	
	Book.findOne({title: newbookTitle})
		.then((book) => {
			if(book) {
				res.send("book already exists");
			} else {
				let newBook = new Book({title: newbookTitle});
				newBook
					.save()
					.then(res.json({
						_id: newBook._id,
						title: newBook.title
					}))
					.catch((err) => console.log(err));
					
			}
		})
		.catch((err) => console.log(err));
	
	}
	//      let title = req.body.title;
      //response will contain new book object including atleast _id and title

};
const getAll = (req, res) => {
	console.log("getAll called");
	
	Book.find({})
		.then((books) => {
			var booksArr = [];
			var bookCounter = 0;
			
			books.forEach(function(book) {
				booksArr[bookCounter] = {
					_id: book._id,
					title: book.title,
					commentcount: book.commentcount
				}
				bookCounter +=1;
			});
			
			res.send(booksArr);
		})
		.catch((err) => console.log(err));
	
	      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

};
const getId = (req, res) => {
	console.log("getId called");
	
	let bookid = req.params.id;
	
	Book.findById(bookid)
		.then((result) => {
			if (!result) {
				res.send("no book exists");
			} else {
				
				Comment.find({parentId: result._id})
						.then((comments) => {
							let commentsArr = [];
							let commentsCounter = 0;
							
							comments.forEach(function(comment){
								commentsArr[commentsCounter] = comment.comment;
								commentsCounter += 1;
							});
							
							res.json({
								comments: commentsArr,
								_id: result._id,
								title: result.title,
								commentcount: result.commentcount
							});
							
						})
						.catch((err) => console.log(err));
			}
		})
		.catch((err) => console.log(err));
	
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

	//json res example {"comments":["tester","testx","testx"],"_id":"64cfb90dfe6bad08b2dbf421","title":"Poster","commentcount":3,"__v":3}
};
const postComment = (req, res) => {
	if(!req.params.id) {
		res.send("missing required field id");
	} else {
		if(!req.body.comment) {
			res.send("missing required field comment");
		} else {
				let bookid = req.params.id;
				let comment = req.body.comment;
				
				Book.findById(bookid)
					.then((book) => {
						if (!book) {
							res.send("no book exists");
						} else {

							let prevCount = book.commentcount;
							book.commentcount = prevCount += 1;
							
							book
								.save()
								.then((updRes) => {
											let newComment = new Comment({
											parentId: bookid,
											comment: comment});
									
											newComment
											.save()
											.then(
												res.redirect('/api/books/' + bookid)
//												res.json({
//												_id: newComment._id
//												res.redirect to getId
//												})
											)
											.catch((err) => console.log(err));
								})
								.catch((err) => console.log(err));
								

						}
					})
					.catch((err) => console.log(err));
		}
	
	}
	console.log("postComment called");
	//      
//      
      //json res format same as .get

};
const deleteId = (req, res) => {
	if(!req.params.id) {
		res.send("missing required field id");
	} else {
		let bookid = req.params.id;
		
		Book.findById(bookid)
			.then((result) => {
				if (!result) {
					res.send("no book exists");
				} else {
					Book.findByIdAndRemove(bookid)
						.then(() => res.send("delete successful"))
						.catch((err) => console.log(err));
				}
			})
			.catch((err) => console.log(err));
	}
	console.log("deleteId called");
	//      
      //if successful response will be 'delete successful'

};
const deleteAll = (req, res) => {
	console.log("deleteAll called");
	
	Book.deleteMany({})
		.then(() => {res.send("complete delete successful");})
		.catch((err) => console.log(err));
	      //if successful response will be 'complete delete successful'
};

module.exports = {
	postBook,
	getAll,
	getId,
	postComment,
	deleteId,
	deleteAll
};