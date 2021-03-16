let myLibrary = [];

// Cosntructor
function Book(title, author, pages, read) {
    this.title = tile
    this.author = author
    this.pages = pages
    this.read = read
    this.info = () => `${this.title} by ${this.author}, ${this.pages} pages, ${read ? 'already read' : 'have not read yet'}`
}


function addBookToLibrary(book) {
    myLibrary.push(book);
}