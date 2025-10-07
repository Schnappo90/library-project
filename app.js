/* ======================================
   1. DOM ELEMENTS & GLOBAL VARIABLES
====================================== */

const libraryDisplay = document.querySelector(".book-grid");
const form = document.querySelector("form");
const inputs = form.querySelectorAll("input");
const sidebar = document.querySelector(".sidebar-form");
const openMenu = document.querySelector(".open-button");
const close = document.querySelector(".close-button");
const overlay = document.querySelector(".overlay");

const totalFilter = document.querySelector(".total-label");
const totalReadFilter = document.querySelector(".total-read-label");
const totalUnreadFilter = document.querySelector(".total-unread-label");
const favouriteFilter = document.querySelector(".total-favourites-label");

const totalBookCount = document.querySelector(".total-count");
const totalReadCount = document.querySelector(".total-read-count");
const totalUnreadCount = document.querySelector(".total-unread-count");
const favouriteCount = document.querySelector(".total-favourite-count");

const myLibrary = [];

/* ======================================
   2. SIDEBAR CONTROLS
====================================== */

openMenu.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("active");
});

close.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("active");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("active");
});

/* ======================================
   3. BOOK CONSTRUCTOR & METHODS
====================================== */

function Book(title, author, pages, isRead, isFavourite = false) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = Boolean(isRead);
  this.isFavourite = isFavourite;
  this.id = crypto.randomUUID();
}

Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${this.isRead}`;
};

Book.prototype.toggle = function () {
  this.isRead = !this.isRead;
};

Book.prototype.toggleFavourite = function () {
  this.isFavourite = !this.isFavourite;
};

/* ======================================
   4. CORE DATA FUNCTIONS
====================================== */

function addBookToLibrary(title, author, pages, isRead, isFavourite) {
  const newBook = new Book(title, author, pages, isRead, isFavourite);
  myLibrary.unshift(newBook);
}

// takes the captured element and deletes it
function removeFromLibrary(indexNum) {
  myLibrary.splice(indexNum, 1);
}

function showDeleteAlert(selectedBookId) {
  const alert = document.createElement("div");
  alert.classList.add("alert");

  alert.innerHTML =
    '<div class="alert-content"><h3 class="alert-title">Delete book?</h3><p>Are you sure you want to remove this book from your library? You will be unable to undo this action.</p></div><div class="buttons-group"><button class="confirm-btn btn">Confirm</button><button class="cancel-btn btn">Cancel</button></div>';

  document.body.appendChild(alert);

  overlay.classList.add("active");

  const confirmBtn = alert.querySelector('.confirm-btn');
  const cancelBtn = alert.querySelector('.cancel-btn');

  //======== confirm button ========
  confirmBtn.addEventListener("click", () => {
    const indexToDelete = myLibrary.findIndex(
      (book) => book.id === selectedBookId
    );

    removeFromLibrary(indexToDelete);
    renderLibrary(myLibrary);
    alert.remove();
    overlay.classList.remove("active");
  });

  // ======== cancel button ========

  cancelBtn.addEventListener("click", closeAlert);

  const closeOnOverlayClick = () => closeAlert();
  overlay.addEventListener("click", closeOnOverlayClick);

  function closeAlert() {
    alert.remove();
    overlay.classList.remove('active');
    overlay.removeEventListener("click", closeOnOverlayClick);
  }
}

/* ======================================
   5. FILTER FUNCTIONS
====================================== */

function filterRead() {
  const result = myLibrary.filter((book) => book.isRead === true);
  renderLibrary(result);
}

function filterUnread() {
  const result = myLibrary.filter((book) => book.isRead == false);
  renderLibrary(result);
}

function filterFavourite() {
  const result = myLibrary.filter((book) => book.isFavourite == true);
  renderLibrary(result);
}

/* ======================================
   6. UI UPDATE FUNCTIONS
====================================== */

function updateCardDisplay(isReadValue, textEl, cardEl) {
  if (isReadValue === true) {
    textEl.textContent = "Read";
    updateBookCounters();
    cardEl.classList.remove("not-read-border");
    cardEl.classList.add("read-border");
  } else {
    textEl.textContent = "Not Read";
    updateBookCounters();
    cardEl.classList.remove("read-border");
    cardEl.classList.add("not-read-border");
  }
}

function updateBookCounters() {
  totalBookCount.textContent = myLibrary.length;
  totalReadCount.textContent = myLibrary.filter(
    (book) => book.isRead == true
  ).length;
  totalUnreadCount.textContent = myLibrary.filter(
    (book) => book.isRead == false
  ).length;
  favouriteCount.textContent = myLibrary.filter(
    (book) => book.isFavourite == true
  ).length;
}

function toggleFavouriteIcon(item, icon) {
  item.toggleFavourite();
  updateBookCounters();
  if (item.isFavourite === true) {
    icon.innerHTML =
      '<svg class="favourite-true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>heart</title><path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" /></svg>';
  } else {
    icon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>heart-outline</title><path d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" /></svg>';
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* ======================================
   7. RENDER FUNCTION
====================================== */

function renderLibrary(arr) {
  libraryDisplay.textContent = "";

  if (arr.length === 0) {
    const libraryEmpty = document.createElement("div");
    libraryEmpty.innerHTML =
      '<svg class="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>information-outline</title><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" /></svg> <p class="empty-library-msg">Add books to your library to see them displayed here.</p>';
    libraryDisplay.append(libraryEmpty);
  }

  arr.forEach((book) => {
    const card = document.createElement("div");
    card.classList.add("book-card");
    const dataId = document.createAttribute("data-id");
    dataId.value = book.id;
    card.setAttributeNode(dataId);

    const titleEl = document.createElement("h3");
    titleEl.textContent = book.title;
    const authorEl = document.createElement("p");
    authorEl.textContent = `By ${book.author}`;
    const pagesEl = document.createElement("p");
    pagesEl.textContent = `${book.pages} Pages`;

    const readStatusDisplay = document.createElement("div");
    readStatusDisplay.classList.add("read-status-display");
    const readEl = document.createElement("p");
    readEl.textContent = book.isRead ? "Read" : "Not Read";
    readStatusDisplay.append(readEl);

    const bookInfo = document.createElement("div");
    bookInfo.classList.add("book-info");
    bookInfo.append(titleEl, authorEl, pagesEl, readStatusDisplay);

    const deleteBtn = document.createElement("div");
    deleteBtn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>';
    deleteBtn.classList.add("delete-btn");

    const toggleButton = document.createElement("div");
    toggleButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>book-read-toggle</title><path d="M13 17.5C13 19.25 13.69 20.83 14.82 22H6C4.89 22 4 21.11 4 20V4C4 2.9 4.89 2 6 2H7V9L9.5 7.5L12 9V2H18C19.1 2 20 2.89 20 4V11.03C19.84 11 19.67 11 19.5 11C15.91 11 13 13.91 13 17.5M19 20C17.62 20 16.5 18.88 16.5 17.5C16.5 17.1 16.59 16.72 16.76 16.38L15.67 15.29C15.25 15.92 15 16.68 15 17.5C15 19.71 16.79 21.5 19 21.5V23L21.25 20.75L19 18.5V20M19 13.5V12L16.75 14.25L19 16.5V15C20.38 15 21.5 16.12 21.5 17.5C21.5 17.9 21.41 18.28 21.24 18.62L22.33 19.71C22.75 19.08 23 18.32 23 17.5C23 15.29 21.21 13.5 19 13.5Z" /></svg>';
    toggleButton.classList.add("toggle-btn");

    const favouriteIcon = document.createElement("div");
    favouriteIcon.classList.add("favourite-icon");
    favouriteIcon.innerHTML = book.isFavourite
      ? '<svg class="favourite-true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>heart</title><path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" /></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>heart-outline</title><path d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" /></svg>';

    const cardActions = document.createElement("div");
    cardActions.append(toggleButton, deleteBtn, favouriteIcon);
    cardActions.classList.add("card-actions");

    updateCardDisplay(book.isRead, readEl, card);
    card.append(bookInfo, cardActions);
    libraryDisplay.appendChild(card);

    toggleButton.addEventListener("click", () => {
      book.toggle();
      updateCardDisplay(book.isRead, readEl, card);
    });

    deleteBtn.addEventListener("click", (e) => {
      const card = e.currentTarget.closest(".book-card");
      const selectedBookId = card.dataset.id;
      showDeleteAlert(selectedBookId);
    });

    card.addEventListener("dblclick", () => {
      toggleFavouriteIcon(book, favouriteIcon);
    });

    favouriteIcon.addEventListener("click", () => {
      toggleFavouriteIcon(book, favouriteIcon);
    });
  });

  updateBookCounters();
}

/* ======================================
   8. FILTER EVENT LISTENERS
====================================== */

totalFilter.addEventListener("click", () => {
  renderLibrary(myLibrary);
});

totalReadFilter.addEventListener("click", () => {
  if (myLibrary.filter((book) => book.isRead === true).length === 0) return;
  filterRead();
});

totalUnreadFilter.addEventListener("click", () => {
  if (myLibrary.filter((book) => book.isRead === false).length === 0) return;
  filterUnread();
});

favouriteFilter.addEventListener("click", () => {
  if (myLibrary.filter((book) => book.isFavourite).length === 0) return;
  filterFavourite();
});

/* ======================================
   9. INITIAL TEST DATA
====================================== */

addBookToLibrary("The Midnight Library", "Matt Haig", 288, true);
addBookToLibrary("Educated", "Tara Westover", 352, false);
addBookToLibrary(
  "Sapiens: A Brief History of Humankind",
  "Yuval Noah Harari",
  498,
  true
);
addBookToLibrary("Atomic Habits", "James Clear", 320, true);
addBookToLibrary(
  "The Subtle Art of Not Giving a F*ck",
  "Mark Manson",
  224,
  false
);
addBookToLibrary("The Creative Act: A Way of Being", "Rick Rubin", 432, true, true);

/* ======================================
   10. FORM HANDLING & INIT
====================================== */

renderLibrary(myLibrary);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = form.querySelector("#title").value;
  const pages = form.querySelector("#pages").value;
  const author = form.querySelector("#author").value;
  const readStatus = form.querySelector("#readStatus");
  const isRead = readStatus ? readStatus.value === "true" : false;

  addBookToLibrary(title, author, pages, isRead);
  showToast("Book added to library.");
  updateBookCounters();
  renderLibrary(myLibrary);
  form.reset();
});


const filterOptions = document.querySelectorAll('.book-stats-wrapper p');

filterOptions.forEach(filter => {
  filter.addEventListener('click', () => {
    let activeFilter = document.querySelector('.book-stats-wrapper p.active-filter');

    if(activeFilter) {
      activeFilter.classList.remove('active-filter')
    }
    filter.classList.add('active-filter');
  })
})