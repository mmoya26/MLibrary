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
    const booksContainer = document.querySelector('.books');
    
    myLibrary.forEach(book => {
        // Creating elements and assign their respective data
        let bookCardContainer = document.createElement('div');

        let bookTitle = document.createElement('h3');
        bookTitle.textContent = book.title;

        let bookAuthor = document.createElement('p');
        bookAuthor.textContent = `Book Author: ${book.author}`;

        let bookPages = document.createElement('p');
        bookPages.textContent = `Book Pages: ${book.pages}`;

        let bookRead = document.createElement('p');
        bookRead.textContent = `Have read: ${book.read}`

        // Add classes to all of the created elements
        bookCardContainer.classList.add('book-card');
        bookTitle.classList.add('book-title');
        bookAuthor.classList.add('book-author');
        bookPages.classList.add('book-pages');
        bookRead.classList.add('book-read');

        // Appends elements to the card container then container is added to the DOM element that
        // holds all of the cards
        bookCardContainer.appendChild(bookTitle);
        bookCardContainer.appendChild(bookAuthor);
        bookCardContainer.appendChild(bookPages);
        bookCardContainer.appendChild(bookRead);
        booksContainer.appendChild(bookCardContainer);
    });
}

// Temporary books data
let bookOne = new Book("Jersey Shore", "MTV", 365, true);
let bookTwo = new Book("Another Book", "Author 2", 100, false);
let bookThree = new Book("Book number three", "Author 3", 150, true);

addBookToLibrary(bookOne);
addBookToLibrary(bookTwo);
addBookToLibrary(bookThree);


displayBooks();