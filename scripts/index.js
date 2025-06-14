const intialCards = [
  {
  name: "Golden Gate Bridge",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"
  },
  {  
  name: "Val Thorens",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
}, 
{
  name: "Restaurant terrace",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
}, 
{
  name: "An outdoor cafe",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
}, 
{
  name: "A very long bridge, over the forest and through the trees",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
}, 
{
  name: "Tunnel with morning light",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
}, 
{
  name: "Mountain house",
  link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
}, 
];

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = document.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
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

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
// TODO - select the name element

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

const cardTemplate =document.querySelector ("#card-template")
.content.querySelector(".card");
const cardsList = document.querySelector(".cards__list")
function getCardElement(data) {
  // 1. Change const to let for cardElement because you reassign it to null later
  let cardElement = cardTemplate.cloneNode(true);
  
  // 2. Select elements inside the card
  const cardTitleEl = cardElement.querySelector(".card__title"); 
  const cardImageEl = cardElement.querySelector(".card__image");

  // 3. Fix capitalization: use .textContent, not .TextContent
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;  // <-- fix here

  // 4. Like button toggle
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-btn_active");
  });

  // 5. Delete button removes card and sets variable to null
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
  cardDeleteBtnEl.addEventListener("click", () => {
    cardElement.remove();
    cardElement = null; // OK now since cardElement is let
  });

  // 6. Clicking image opens preview modal and sets preview content correctly
  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;                 // <-- set image alt attribute
    previewModal.querySelector(".modal__caption").textContent = data.name;  // <-- set caption text

    openModal(previewModal);
  });

  return cardElement;
}


function openModal (modal){
  modal.classList.add("modal_is-opened");
}

function closeModal (modal){
  modal.classList.remove("modal_is-opened");
}

editProfileBtn.addEventListener("click", function (){
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;  
  closeModal(editProfileModal);
  openModal(editProfileModal);
});

// Open Edit Profile modal
editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;  
  openModal(editProfileModal);
});

// Open New Post modal
newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

// Universal close handler for all modal close buttons
const closeButtons = document.querySelectorAll('.modal__close-btn');

closeButtons.forEach((button) => {
  const modal = button.closest('.modal');
  button.addEventListener('click', () => closeModal(modal));
});

// Handle Edit Profile form submit
function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);




const addCardFormElement = newPostModal.querySelector(".modal__form");
const nameInput = addCardFormElement.querySelector("#profile-caption-input");
const linkInput = addCardFormElement.querySelector("#new-card-image-input");

// Create the form submission handler.
function handleAddCardSubmit(evt) {
  // Prevent default form submission behavior.
  evt.preventDefault();
  
   const inputValues = {
    name: nameInput.value,    // use the correct input variable here
    link: linkInput.value
  };
   const cardElement = getCardElement(inputValues); 
   cardsList.prepend(cardElement);

  // Close the modal.
  newPostModal.classList.remove("modal_is-opened");
}

// Add the event listener for form submission.
addCardFormElement.addEventListener('submit', handleAddCardSubmit);

intialCards.forEach(function (item) {
  const cardElement = getCardElement(item); 
  cardsList.append(cardElement);
});