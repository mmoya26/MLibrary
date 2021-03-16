let myLibrary = [];

// Cosntructor
function Book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.info = () => `${this.title} by ${this.author}, ${this.pages} pages, ${read ? 'already read' : 'have not read yet'}`
}


function addBookToLibrary(book) {
    myLibrary.push(book);
}

function displayBooks() {
    myLibrary.forEach(book => {
        console.log(book);
    })
}

// Temporary books data
let bookOne = new Book("Jersey Shore", "MTV", 365, true);
let bookTwo = new Book("Another Book", "Author 2", 100, false);
let bookThree = new Book("Book number three", "Author 3", 150, true);

addBookToLibrary(bookOne);
addBookToLibrary(bookTwo);
addBookToLibrary(bookThree);


displayBooks();