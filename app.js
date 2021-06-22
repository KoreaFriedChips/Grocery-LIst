// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElem;
let editFlag = false;
let editId = "";

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener("submit", addItem);
// clear all items
clearBtn.addEventListener("click", clearItems);
// load items
window.addEventListener("DOMContentLoaded", setupItems);

// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString(); // get unique value for id using date
    if (value && !editFlag) {
        createListItem(id, value);
        // display alert
        displayAlert("item added", "success");
        // show container
        container.classList.add("show-container");
        // add to local storage (for refresh)
        addToLocalStorage(id, value);
        // set back to default
        setBackToDefault();
    }
    else if (value && editFlag) {
        editElem.innerHTML = value;
        displayAlert("item edited", "success");
        // edit local storage
        editLocalStorage(editId, value);
        setBackToDefault();
    }
    else { // if user doesn't enter anything
        displayAlert("invalid. try again.", "danger");
    }
}
// display alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    // remove alert
    setTimeout(function () {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}
// set back to default
function setBackToDefault() {
    //console.log("set back");
    grocery.value = "";
    editFlag = false;
    editId = "";
    submitBtn.textContent = "add";
}

// clear all items
function clearItems() {
    const items = document.querySelectorAll(".grocery-item");
    if (items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item);
        })
    }
    container.classList.remove("show-container");
    displayAlert("empty list", "success");
    setBackToDefault();
    localStorage.removeItem("list");
}
// edit function
function editItem(e) {
    //console.log("edit");
    const element = e.currentTarget.parentElement.parentElement; // access grocery-item
    // set edit item
    editElem = e.currentTarget.parentElement.previousElementSibling; // gets title p tag
    // set form value
    grocery.value = editElem.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
    submitBtn.textContent = "edit";
}
// delete function
function deleteItem(e) {
    //console.log("delete");
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length == 0) {
        container.classList.remove("show-container");
    }
    displayAlert("item removed", "success");
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}

// ****** LOCAL STORAGE **********
// localStorage API , access by default
function addToLocalStorage(id, value) {
    const grocery = { id, value };
    let items = getLocalStorage();
    items.push(grocery);
    console.log(items);
    localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter(function (item) { // don't select the item removed
        if (item.id != id) {
            return item;
        }
    })
    localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map(function (item) {
        if (item.id == id) {
            item.value = value;
        }
        return item;
    })
    localStorage.setItem("list", JSON.stringify(items));
}
function getLocalStorage() { // get all items in the storage
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

// ****** SETUP ITEMS **********
function setupItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id, item.value);
        })
        container.classList.add("show-container");
    }
}

function createListItem(id, value) {
    const item = document.createElement("article"); // make new article (item)
    item.classList.add("grocery-item"); // add class
    const attr = document.createAttribute("data-id"); // add id
    attr.value = id;
    item.setAttributeNode(attr);
    item.innerHTML = `<p class="title">${value}</p>
                        <div class="btn-container">
                            <button type="button" class="edit-btn">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="delete-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>`;

    // since items are added dynamically we can only access buttons here
    const deleteBtn = item.querySelector(".delete-btn");
    const editBtn = item.querySelector(".edit-btn");
    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);

    // append child
    list.appendChild(item);
}