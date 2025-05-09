const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = document.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form")
const editProfileNameInput = editProfileModal.querySelector(
    "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
    "#profile-description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");


const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");


editProfileBtn.addEventListener("click", function (){
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;  
  editProfileModal.classList.add("modal_is-opened");
});

editProfileCloseBtn.addEventListener("click", function (){
    editProfileModal.classList.remove("modal_is-opened");
});

newPostBtn.addEventListener("click", function () {
  newPostModal.classList.add("modal_is-opened");
});

newPostCloseBtn.addEventListener("click", function () {
  newPostModal.classList.remove("modal_is-opened");
});

function handleEditProfileSubmit(evt) {
    evt.preventDefault();

    // Update the profile name
    profileNameEl.textContent = editProfileNameInput.value;

    // Update the profile description
    profileDescriptionEl.textContent = editProfileDescriptionInput.value;

    // Close the modal after submitting
    editProfileModal.classList.remove("modal_is-opened");
}

// Attach the event listener to the form
editProfileForm.addEventListener("submit", handleEditProfileSubmit);


// for new post



const addCardFormElement = newPostModal.querySelector(".modal__form");
const nameInput = addCardFormElement.querySelector("#profile-caption-input");
const linkInput = addCardFormElement.querySelector("#new-card-image-input");

// Create the form submission handler.
function handleAddCardSubmit(evt) {
  // Prevent default form submission behavior.
  evt.preventDefault();
  
  // Log both input values to the console.
  console.log("Caption: ", nameInput.value);
  console.log("Image Link: ", linkInput.value);

  // Close the modal.
  newPostModal.classList.remove("modal_is-opened");
}

// Add the event listener for form submission.
addCardFormElement.addEventListener('submit', handleAddCardSubmit);