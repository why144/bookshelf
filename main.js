var books = [];
const RENDER_EVENT = "render-event";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKS_SELF";

document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");
  inputBook.addEventListener("submit", function (event) {
    event.preventDefault();
    tambahBuku();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function isBookCompleted() {
  const checkButton = document.getElementById("inputBookIsComplete");
  if (checkButton.checked) {
    return true;
  } else {
    return false;
  }
}

function generateBookid() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function tambahBuku() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const bookCompleted = isBookCompleted();
  const bookId = generateBookid();
  const bookObject = generateBookObject(bookId, title, author, year, bookCompleted);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function buatDaftar(bookObject) {
  const bookTitle = document.createElement("h3");
  bookTitle.classList.add("book-title");
  bookTitle.innerText = bookObject.title;
  const author = document.createElement("p");
  author.innerText = "Penulis: " + bookObject.author;
  const year = document.createElement("p");
  year.innerText = "Tahun: " + bookObject.year;
  const btnAction = document.createElement("div");
  btnAction.classList.add("action");
  const action = faction();
  function faction() {
    if (!bookObject.isCompleted) {
      const bookCompleted = document.createElement("button");
      bookCompleted.classList.add("green");
      bookCompleted.innerText = "Selesai dibaca";

      bookCompleted.addEventListener("click", function () {
        addBookCompleted(bookObject.id);
      });

      const deleteBook = document.createElement("button");
      deleteBook.classList.add("red");
      deleteBook.innerText = "Hapus";

      deleteBook.addEventListener("click", function () {
        if (confirm("yakin ingin menghapus buku?")) {
          addDeleteBook(bookObject.id);
        }
      });

      btnAction.append(bookCompleted, deleteBook);
    } else {
      const bookInCompleted = document.createElement("button");
      bookInCompleted.classList.add("green");
      bookInCompleted.innerText = "Belum selesai dibaca";

      bookInCompleted.addEventListener("click", function () {
        addBookInCompleted(bookObject.id);
      });
      const deleteBook = document.createElement("button");
      deleteBook.classList.add("red");
      deleteBook.innerText = "Hapus";
      deleteBook.addEventListener("click", function () {
        if (confirm("yakin ingin menghapus buku?")) {
          addDeleteBook(bookObject.id);
        }
      });
      btnAction.append(bookInCompleted, deleteBook);
    }
    return btnAction;
  }

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(bookTitle, author, year, action);
  article.setAttribute("id", `book-${bookObject.id}`);

  return article;
}

function addBookCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookInCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addDeleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
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

document.getElementById("inputBookIsComplete").addEventListener("click", function () {
  const btnSubmit = document.querySelector("#bookSubmit > span");
  const checkButton = document.getElementById("inputBookIsComplete");
  if (checkButton.checked) {
    btnSubmit.innerText = "selesai dibaca";
    return true;
  } else {
    btnSubmit.innerText = "belum selesai dibaca";
    return false;
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  incompleteBookshelfList.innerHTML = "";

  const completeBookshelfList = document.getElementById("completeBookshelfList");
  completeBookshelfList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = buatDaftar(bookItem);
    if (!bookItem.isCompleted) {
      incompleteBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement);
    }
  }
});

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser anda tidak mendukung local storage");
    return false;
  }
  return true;
}
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const dataStorage = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(dataStorage);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.getElementById("searchSubmit").addEventListener("click", function (evet) {
  const title = document.getElementById("searchBookTitle").value.toLowerCase();
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);
  const searchedBooks = data.filter(function (book) {
    return book.title.toLowerCase().includes(title);
  });
  if (searchedBooks.length === 0) {
    alert("Buku tidak ditemukan!");
    return location.reload();
  }
  if (title !== "") {
    for (const book of searchedBooks) {
      books = [];
      books.push(book);
    }
    evet.preventDefault();
    document.dispatchEvent(new Event(RENDER_EVENT));
  } else {
    loadDataFromStorage();
  }
});
