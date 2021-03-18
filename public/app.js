let database = firebase.database();
let ref = database.ref('books');

let myLibrary = [];

const booksContainer = document.querySelector('.books');
const form = document.getElementById('form');
const overlay = document.querySelector('.overlay');
const titleInput = document.getElementById('input-title');
const authorInput = document.getElementById('input-author');
const pagesInput = document.getElementById('input-pages');
const readInput = document.getElementById('haveRead');

const yesButton = document.getElementById('yesButton');
yesButton.addEventListener('click', (e) => {
    selectReadOption(e);
});

const noButton = document.getElementById('noButton');
noButton.addEventListener('click', (e) => {
    selectReadOption(e);
});

const addBookButton = document.getElementById('add');
addBookButton.addEventListener('click', (e) => {
    addBookToLibraryArray(new Book(titleInput.value, authorInput.value, pagesInput.value, false));
    e.preventDefault();
    clearInputs();
    form.classList.toggle('display-none');
    overlay.classList.toggle('display-none');
});

const addNewBookButton = document.getElementById('add-new-book');
addNewBookButton.addEventListener('click', (e) => {
    form.classList.toggle('display-none');
    overlay.classList.toggle('display-none');
});

const xClose = document.getElementById('x');
xClose.addEventListener('click', (e) => {
    clearInputs();
    form.classList.toggle('display-none');
    overlay.classList.toggle('display-none');
});

// Constructor
function Book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.uniqueID = ""
}

Book.prototype.info = function() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'already read' : 'have not read yet'}`;
}

function selectReadOption(e) {
    e.preventDefault();
    let element = e.target;

    if (element.id === "yesButton" && element.nextSibling.classList.contains('selected')) {
        noButton.classList.toggle('selected');
    } else if (element.id === "noButton" && element.previousSibling.classList.contains('selected')) {
        yesButton.classList.toggle('selected');
    }

    element.classList.toggle('selected');
}

function clearInputs() {
    titleInput.value = "";
    authorInput.value = "";
    pagesInput.value = "";
    yesButton.classList.remove('selected');
    noButton.classList.remove('selected');
}


function addBookToLibraryArray(book) {
    ref.push(book)
}

// Created to refresh the page
function removeAllBooksFromUI() {
    
    while(booksContainer.firstChild) {
        booksContainer.removeChild(booksContainer.firstChild);
    }
}

function removeSpecificBook(title) {
    myLibrary.forEach(book => {
        if (book.title === title) {
            ref.child(book.uniqueID).remove();
        }
    });
}

function displayBooks() {
    removeAllBooksFromUI();

    myLibrary.forEach(book => {
        // Creating elements and assign their respective data
        let bookCardContainer = document.createElement('div');

        let titleBarContainer = document.createElement('div');

        let bookTitle = document.createElement('h3');
        bookTitle.textContent = book.title;

        let editIcon = document.createElement('i');

        let bookAuthorH4 = document.createElement('h4');
        bookAuthorH4.textContent = 'Author';

        let bookAuthor = document.createElement('p');
        bookAuthor.textContent = `${book.author}`;

        let bookPagesH4 = document.createElement('h4');
        bookPagesH4.textContent = 'Pages';

        let bookPages = document.createElement('p');
        bookPages.textContent = `${book.pages}`;

        let bookRead = document.createElement('button');
        bookRead.textContent = `${book.read ? 'Read' : 'Not Read'}`
        bookRead.addEventListener('click', (e) => {
            e.target.classList.toggle('haveRead');
            e.target.classList.toggle('haventRead');
            e.target.textContent = e.target.classList.contains('haveRead') ? 'Read' : 'Not Read';
            e.target.classList.contains('haveRead') ? book.read = true : book.read = false;

            // Update book in the database
            ref.child(book.uniqueID).update(book);
        });

        let bookButtonsContainer = document.createElement('div');
        
        // Remove button
        let removeBookButton = document.createElement('button');
        removeBookButton.textContent = "Remove";
        removeBookButton.addEventListener('click', (e) => {
            e.preventDefault();
            let card = e.target.parentElement;
            let container = card.parentElement;

            let title = container.querySelector('h3').textContent;
            removeSpecificBook(title);
        })

        // Add classes to all of the created elements
        bookCardContainer.classList.add('book-card');
        titleBarContainer.classList.add('title-bar');
        bookTitle.classList.add('book-title');
        editIcon.classList.add('far');
        editIcon.classList.add('fa-edit')
        editIcon.classList.add('edit-icon');
        bookAuthor.classList.add('book-author');
        bookPages.classList.add('book-pages');
        bookRead.classList.add('read');
        bookRead.classList.add(`${book.read ? 'haveRead' : 'haventRead'}`);
        removeBookButton.classList.add('remove-book');
        removeBookButton.classList.add('read');
        bookButtonsContainer.classList.add('book-buttons');

        // Appends elements to the card container then container is added to the DOM element that
        // holds all of the cards
        titleBarContainer.appendChild(bookTitle);
        titleBarContainer.appendChild(editIcon);
        bookButtonsContainer.appendChild(bookRead);
        bookButtonsContainer.appendChild(removeBookButton);
        bookCardContainer.appendChild(titleBarContainer);
        bookCardContainer.appendChild(bookAuthorH4);
        bookCardContainer.appendChild(bookAuthor);
        bookCardContainer.appendChild(bookPagesH4);
        bookCardContainer.appendChild(bookPages);
        bookCardContainer.appendChild(bookButtonsContainer);        
        booksContainer.appendChild(bookCardContainer);
    });
}

// Database setup
function populateBooksArray() {
    ref.on('value', updateBookData, errorWithData)
}

function updateBookData(data) {
    var books = data.val();

    // books = data.val() returns null it means that there are no books in the database
    // thefore there shouldn't be any books in memory either
    if (books === null) {
        removeAllBooksFromUI();
        myLibrary = []; 
        return
    }

    let keys = Object.keys(books);
    myLibrary = [];
    
    for (let i = 0; i < keys.length; i++) {
        // Set uniqueID field to their specific Firebase unique ID to each book stored in the database
        books[keys[i]].uniqueID = keys[i];
        myLibrary.push(books[keys[i]]);
    }

    displayBooks();
}

function errorWithData(err) {
    console.log(err);
}

populateBooksArray();