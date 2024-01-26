const express = require("express");
const app = express();
app.use(express.json());

//Creating a Book class
class Book {
  constructor(title, author, ISBN) {
    this.title = title;
    this.author = author;
    this.ISBN = ISBN;
  }

  displayInfo() {
    return this;
  }
}

//Creating a EBook class(subclass)
class EBook extends Book {
  constructor(title, author, ISBN, fileFormat) {
    super(title, author, ISBN);
    this.fileFormat = fileFormat;
  }

  displayInfo() {
    return this;
  }
}

//Creating a Library class
class Library {
  constructor() {
    this.books = [];
  }

  //method to add book
  addBook(book) {
    const { fileFormat } = book;
    if (fileFormat === undefined) {
      this.books = [
        ...this.books,
        { title: book.title, author: book.author, ISBN: book.ISBN },
      ]; //updating books array by keeping the state consistent
    } else {
      this.books = [
        ...this.books,
        {
          title: book.title,
          author: book.author,
          ISBN: book.ISBN,
          fileFormat: book.fileFormat,
        },
      ]; //updating books array by keeping the state consistent
    }
  }

  //method to display all books information
  displayBooks() {
    this.books.forEach((eachBook) => console.log(eachBook));
  }

  //method to search a book by its title
  searchByTitle(title) {
    try {
      let searchedBooks = this.books.filter((eachBook) =>
        eachBook.title.toLowerCase().includes(title.toLowerCase())
      );
      if (searchedBooks.length === 0) {
        throw new Error("No Books Found"); //throws an error when none of the books matched
      } else {
        searchedBooks.forEach((eachBook) => console.log(eachBook)); //displaying matched book results
      }
    } catch (error) {
      console.log(error.message); //handling an error
    }
  }
}

Library.prototype.deleteBook = function (ISBN) {
  //adding delete method using prototype object
  this.books = this.books.filter((eachBook) => eachBook.ISBN !== ISBN); //updating the books array
};

//Few Instances of Book class
let book1 = new Book("The Psychology of Money", "Morgan Housel", 9789390166268);
let book2 = new Book("The Great Gatsby", "F.Scott Fitzgerald", 9780743273565);
let book3 = new Book("To Kill a Mockingbird", "Harper Lee", 9780061120084);

//Displaying Book instances information
console.log(book1.displayInfo());
console.log(book2.displayInfo());
console.log(book3.displayInfo());

//Few Instances of EBook class
let eBook1 = new EBook(
  "The Catcher in the Rye",
  "J.D.Salinger",
  9780316769480,
  "PDF"
);
let eBook2 = new EBook("The Hobbit", "J.R.R.Tolkien", 9780345339683, "DOC");
let eBook3 = new EBook("The Alchemist", "Paulo Coelho", 9780061122415, "ZIP");

//Displaying EBook instances information
console.log(eBook1.displayInfo());
console.log(eBook2.displayInfo());
console.log(eBook3.displayInfo());

//Instance of a Library class
let library1 = new Library();

//Adding book instances to the Library
library1.addBook(book1);
library1.addBook(book2);
library1.addBook(book3);
library1.addBook(eBook1);
library1.addBook(eBook2);
library1.addBook(eBook3);

//Displaying all the available books in a Library
library1.displayBooks();

//searching for a book by its title
library1.searchByTitle("The"); // A list of books which contains "The" in their title

library1.searchByTitle("The Alchemist"); //existing book in a library

library1.searchByTitle("The Animal Farm"); //displaying a message when none of the books matched

//ADD Book API
app.post("/addBook", (request, response) => {
  const bookDetails = request.body;
  const { title, author, ISBN, fileFormat } = bookDetails;
  if (fileFormat === undefined) {
    library1.addBook({ title, author, ISBN });
  } else {
    library1.addBook(bookDetails);
  }
  response.send("Book Added Successfully");
});

//GET Books API
app.get("/listBooks", (request, response) => {
  try {
    const booksArray = library1.books;
    if (booksArray.length === 0) {
      throw new Error("There are No Books in the Library");
    }
    response.send(booksArray);
  } catch (error) {
    response.send(error.message);
  }
});

//DELETE Book API
app.delete("/deleteBook", (request, response) => {
  try {
    const booksArray = library1.books;
    if (booksArray.length === 0) {
      throw new Error(
        "The Library is Empty and there are No Books for deletion"
      ); //throws an error when the library is empty
    }
    const { ISBN } = request.body;
    library1.deleteBook(ISBN);
    response.send("Book Deleted Successfully!!!");
  } catch (error) {
    response.send(error.message);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
