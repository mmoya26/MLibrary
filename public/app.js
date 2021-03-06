let database = firebase.database();
let ref = database.ref('books');

let myLibrary = [];
let temporaryBook = null;

// DOM Elements
const booksContainer = document.querySelector('.books');
const addNewBookButton = document.getElementById('add-new-book');
const form = document.getElementById('form');
const xClose = document.getElementById('x');
const overlay = document.querySelector('.overlay');
const titleInput = document.getElementById('input-title');
const authorInput = document.getElementById('input-author');
const pagesInput = document.getElementById('input-pages');
const addBookButton = document.getElementById('add');
const doneButton = document.getElementById('done');
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');

yesButton.addEventListener('click', (e) => {
    selectReadOption(e);
});

noButton.addEventListener('click', (e) => {
    selectReadOption(e);
});

addBookButton.addEventListener('click', (e) => {
    e.preventDefault();

    if(!validateForm(false)) {
        return;
    }

    addBook(new Book(titleInput.value, authorInput.value, pagesInput.value, yesButton.classList.contains('selected') ? true : false));
    clearInputs();

    // Hiding form and overlay
    form.classList.toggle('display-none');
    overlay.classList.toggle('display-none');
});

doneButton.addEventListener('click', (e) => { 
    e.preventDefault();

    if(!validateForm(true)) {
        return;
    }

    temporaryBook.title = titleInput.value;
    temporaryBook.author = authorInput.value;
    temporaryBook.pages = pagesInput.value;
    temporaryBook.read = yesButton.classList.contains('selected') ? true : false
    updateBook(temporaryBook);
    clearInputs();

    // Hiding form and overlay
    form.classList.toggle('display-none');
    overlay.classList.toggle('display-none');
    doneButton.classList.toggle('display-none');
    addBookButton.classList.toggle('display-none');
});

addNewBookButton.addEventListener('click', (e) => {
    form.classList.toggle('display-none');
    overlay.classList.toggle('display-none');
});

xClose.addEventListener('click', (e) => {
    clearInputs();
    temporaryBook = null;
    form.classList.toggle('display-none');
    overlay.classList.toggle('display-none');

    if (!addBookButton.classList.contains('display-none')) {
        console.log("Add button being displayed");
    } else {
        addBookButton.classList.toggle('display-none');
        doneButton.classList.toggle('display-none');
    }   
    
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

function updateBook(book) {
    ref.child(book.uniqueID).update(book);
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

function validateForm(editMode) {
    let returnBool = true;

    for (let i = 0; i < myLibrary.length; i++) { 
        if(titleInput.value === "" || authorInput.value === "" || pagesInput.value === "") {
            alert("Ensure to fill out all three required fields, title, author, and page number.");
            returnBool = false;
            break;
        }

        if (!editMode) {
            if (titleInput.value.toUpperCase() === myLibrary[i].title.toUpperCase()) {
                alert("Book with the same title already exists, choose a different title for the book being added/edited.");
                returnBool = false;
                break;
            }
        } else {
            if (titleInput.value.toUpperCase() === temporaryBook.title.toUpperCase()) {
                // Nothing happens if the title stays the same as the one being edited.
            } else if (titleInput.value.toUpperCase() === myLibrary[i].title.toUpperCase()) {
                alert("Book with the same title already exists, choose a different title for the book being added/edited.");
                returnBool = false;
                break;
            }
        }
        
    }

    return returnBool;
}


// Adds book to Firebase database which will then update the myLibrary array due to
// Firebase event that updates UI when the data in the database is updated
function addBook(book) {
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

// Displays all of the books found in myLibrary array
function displayBooks() {
    removeAllBooksFromUI();

    myLibrary.forEach(book => {
        // Creating elements and assign their respective data
        let bookCardContainer = document.createElement('div');

        let titleBarContainer = document.createElement('div');

        let bookTitle = document.createElement('h3');
        bookTitle.textContent = book.title;

        let editIcon = document.createElement('i');
        editIcon.addEventListener('click', (e) => {           
            form.classList.toggle('display-none');
            overlay.classList.toggle('display-none');
            addBookButton.classList.toggle('display-none');
            doneButton.classList.toggle('display-none');
            
            let bookCardElement = e.target.parentElement.parentElement;
            let bookTitle = bookCardElement.querySelector('.title-bar .book-title').textContent;
            let bookAuthor = bookCardElement.querySelector('.book-author').textContent;
            let bookPages = bookCardElement.querySelector('.book-pages').textContent;
            let bookRead = bookCardElement.querySelector('.book-buttons .read').classList.contains('haveRead') ? true : false;

            myLibrary.forEach(book => {
                if (book.title === bookTitle) {
                    console.log(book.title);
                    temporaryBook = book;
                    console.log(temporaryBook);
                }
            });

            setUpBookForEdit(bookTitle, bookAuthor, bookPages, bookRead);
        });

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

// Set-up all of the form fields to be auto-filled for the user to start editing
function setUpBookForEdit(title, author, pages, read) {
    titleInput.value = title;
    authorInput.value = author;
    pagesInput.value = pages;

    if (read) {
        yesButton.classList.toggle('selected');
    } else {
        noButton.classList.toggle('selected');
    }
}

// Database setup
function populateBooksArray() {
    // UpdateBookData will be called when the ref.on() is successful
    // errorWithData will be called when the ref.on() is unsuccessful
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