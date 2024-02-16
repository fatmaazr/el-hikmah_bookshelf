import { dialogReview } from "./dialog-review.js";
import { saveData, isStorageExist, loadDataFromStorage } from "./storage.js";

export const books = [];
export const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.querySelector('.form-input');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Buku berhasil ditambahkan'
        })
        submitForm.reset();
        unread++;
        updateUnread();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
        loadLocalStorageReadCount();
    }
});

function addBook() {
    const bookTitle = document.getElementById('input-title').value;
    const bookAuthor = document.getElementById('input-author').value;
    const time = document.getElementById('input-date').value;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, bookTitle, bookAuthor, time, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, time, isFinished) {
    return {
        id,
        title,
        author,
        time,
        isFinished
    }
}

function makeBook (bookObject) {
    const textTitle = document.createElement('h4');
    textTitle.classList.add('book-title');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.classList.add('name-author');
    textAuthor.innerText = "Penulis: " + bookObject.author;

    const textTime = document.createElement('p');
    textTime.classList.add('book-date');
    textTime.innerText = "Memiliki sejak: " + bookObject.time;

    const textContainer = document.createElement('div');
    textContainer.classList.add('book-container');
    textContainer.append(textTitle, textAuthor, textTime);

    const container = document.createElement('div');
    container.classList.add('book-item');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isFinished) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoFromFinished(bookObject.id);
            read--;
            updateRead();
        });

        const trashButtonFinished = document.createElement('button');
        trashButtonFinished.classList.add('trash-button');

        trashButtonFinished.addEventListener('click', function () {
            deleteBookRead(bookObject.id);
        });

        const undoDelete = document.createElement('div');
        undoDelete.classList.add('undo-delete');
        undoDelete.append(undoButton, trashButtonFinished);

        const review = document.createElement('button');
        review.classList.add('main-button', 'review-button');
        review.innerText = "Review";
        review.addEventListener('click', function () {
            dialogReview.showModal();
        });

        const finishedButton = document.createElement('div');
        finishedButton.classList.add('finished-button');
        finishedButton.append(undoDelete, review);

        container.append(finishedButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function () {
            addToFinished(bookObject.id);
            unread--;
            updateUnread();
        });

        const trashButtonUnfinished = document.createElement('button');
        trashButtonUnfinished.classList.add('trash-button');

        trashButtonUnfinished.addEventListener('click', function () {
            deleteBookUnread(bookObject.id);
        });

        container.append(checkButton, trashButtonUnfinished);
    }

    return container;
}

document.addEventListener(RENDER_EVENT, function () {
    const unfinished = document.querySelector('.unfinished');
    unfinished.innerHTML = '';

    const finished =  document.querySelector('.finished');
    finished.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isFinished) {
            unfinished.append(bookElement);
        } else {
            finished.append(bookElement);
        }
    }
});

function addToFinished (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isFinished = true;
    read++;
    updateRead();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoFromFinished (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isFinished = false;
    unread++;
    updateUnread();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function deleteBookUnread (bookId) {
    const bookTarget = findBookIndex(bookId);

    Swal.fire({
        title: 'Anda yakin akan menghapusnya?',
        text: "Data yang sudah dihapus tidak dapat dikembalikan lagi",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1f3015',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
        if (result.isConfirmed) {
            if (bookTarget == -1) return;
            books.splice(bookTarget, 1);
            unread--;
            updateUnread();
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();

            Swal.fire(
            'Dihapus!',
            'Data berhasil dihapus',
            'success'
            );
        } 
    });
}

function deleteBookRead (bookId) {
    const bookTarget = findBookIndex(bookId);

    Swal.fire({
        title: 'Anda yakin akan menghapusnya?',
        text: "Data yang sudah dihapus tidak dapat dikembalikan lagi",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1f3015',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
        if (result.isConfirmed) {
            if (bookTarget == -1) return;
            books.splice(bookTarget, 1);
            read--;
            updateRead();
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();

            Swal.fire(
            'Dihapus!',
            'Data berhasil dihapus',
            'success'
            );
        } 
    });
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}


function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

//mengatur username
const storedUsername = localStorage.getItem('username');

if (storedUsername) {
    document.querySelector('.username').value = storedUsername;
}

document.querySelector('.username').addEventListener('input', function() {
    localStorage.setItem('username', this.value);
});

//menghitung banyaknya buku yang sudah dibaca dan belum di baca
let read = 0;
let unread = 0;

function updateRead() {
    document.querySelector('.book-total-read').innerText = read;
    localStorage.setItem('read', read);

}

function updateUnread() {
    document.querySelector('.book-total-unread').innerText = unread;
    localStorage.setItem('unread', unread);
}

function loadLocalStorageReadCount() {
    if (localStorage.getItem('read')) {
        read = parseInt(localStorage.getItem('read'));
    }
    if (localStorage.getItem('unread')) {
        unread = parseInt(localStorage.getItem('unread'));
    }
    updateRead();
    updateUnread();
}

//membuat fitur pencarian buku
document.getElementById('search-button').addEventListener('click', function() {
    const searchInput = document.querySelector('.search-book-title').value.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchInput) || book.author.toLowerCase().includes(searchInput));
    renderBooks(filteredBooks);
})

document.querySelector('.search-book-title').addEventListener('input', function () {
    const searchInput = document.querySelector('.search-book-title').value.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchInput) || book.author.toLowerCase().includes(searchInput));
    renderBooks(filteredBooks);
});

function renderBooks(books) {
    const unfinished = document.querySelector('.unfinished');
    unfinished.innerHTML = '';
    const finished =  document.querySelector('.finished');
    finished.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isFinished) {
            unfinished.append(bookElement);
        } else {
            finished.append(bookElement);
        }
    }
}