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

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close");
const previewImageEl = previewModal.querySelector(".modal__image");
// TODO - select the name element

const cardTemplate =document.querySelector ("#card-template")
.content.querySelector(".card");
const cardsList = document.querySelector(".cards__list")

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title"); 
  const cardImageEl = cardElement.querySelector(".card__image");


  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.TextContent = data.name;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
  cardLikeBtnEl.addEventListener("click", ()=> {
     cardLikeBtnEl.classList.toggle("card__like-btn_active")
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
  cardDeleteBtnEl.addEventListener("click", () => {
    cardElement.remove();
    cardElement = null;
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    //todo - set the other property values
    openModal(previewModal)
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
  // editProfileModal.classList.add("modal_is-opened");
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", function (){
   // editProfileModal.classList.remove("modal_is-opened");
   closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  // newPostModal.classList.add("modal_is-opened");
  openModal(editProfileModal);
});

newPostCloseBtn.addEventListener("click", function () {
  // newPostModal.classList.remove("modal_is-opened");
  closeModal(editProfileModal);
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
  
   const inputValues = {
     name: captionInputEl.value,
     link: linkInputEl.value
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