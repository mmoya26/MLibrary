let myLibrary = [];

const booksContainer = document.querySelector('.books');

const buttonFormContainer = document.querySelector('.new-book-form-container');

const titleInput = document.getElementById('input-title');
const authorInput = document.getElementById('input-author');
const pagesInput = document.getElementById('input-pages');
const readInput = document.getElementById('haveRead');

const addBookButton = document.getElementById('add');
addBookButton.addEventListener('click', (e) => {
    addBookToLibrary(new Book(titleInput.value, authorInput.value, pagesInput.value, readInput.checked ? true : false));
    e.preventDefault();
    clearInputs();
    buttonFormContainer.classList.toggle('display-none');
});

const addNewBookButton = document.getElementById('add-new-book');
addNewBookButton.addEventListener('click', (e) => {
    buttonFormContainer.classList.toggle('display-none');
});

// Cosntructor
function Book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.info = () => `${this.title} by ${this.author}, ${this.pages} pages, ${read ? 'already read' : 'have not read yet'}`
}

function clearInputs() {
    titleInput.value = "";
    authorInput.value = "";
    pagesInput.value = "";
    readInput.checked = false;
}


function addBookToLibrary(book) {
    myLibrary.push(book);
    displayBooks();
}

// Created to refresh the page
function removeAllBooks() {
    
    while(booksContainer.firstChild) {
        booksContainer.removeChild(booksContainer.firstChild);
    }
}

function removeSpecificBook(title) {
    let filteredBooks = myLibrary.filter(book => {
        return book.title != title;
    });

    myLibrary = filteredBooks;
    displayBooks();
}

function displayBooks() {

    removeAllBooks();

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
        
        // Remove button
        let removeBookButton = document.createElement('button');
        removeBookButton.textContent = "Remove Book";
        removeBookButton.addEventListener('click', (e) => {
            e.preventDefault();
            let card = e.target.parentElement;
            let container = card.parentElement;

            let title = card.querySelector('h3').textContent;
            removeSpecificBook(title);
            
            container.removeChild(card);
        })

        // Add classes to all of the created elements
        bookCardContainer.classList.add('book-card');
        bookTitle.classList.add('book-title');
        bookAuthor.classList.add('book-author');
        bookPages.classList.add('book-pages');
        bookRead.classList.add('book-read');
        removeBookButton.classList.add('remove-book');

        // Appends elements to the card container then container is added to the DOM element that
        // holds all of the cards
        bookCardContainer.appendChild(bookTitle);
        bookCardContainer.appendChild(bookAuthor);
        bookCardContainer.appendChild(bookPages);
        bookCardContainer.appendChild(bookRead);
        bookCardContainer.appendChild(removeBookButton);
        booksContainer.appendChild(bookCardContainer);
    });
}