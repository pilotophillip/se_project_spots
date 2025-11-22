import "../pages/index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "./validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

/* ---------- API ---------- */
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "d20ffb61-63a0-420d-b40b-e34b0dd064f3",
    "Content-Type": "application/json",
  },
});

/* ---------- tiny helpers ---------- */
const qs = (sel, root = document) => root.querySelector(sel);

/* ---------- init after DOM ---------- */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function init() {
  // Profile modal
  const editProfileBtn = qs(".profile__edit-btn");
  const editProfileModal = document.getElementById("edit-profile-modal");
  const editProfileForm = editProfileModal?.querySelector(".modal__form");
  const editProfileNameInput = editProfileModal?.querySelector(
    "#profile-name-input"
  );
  const editProfileDescriptionInput = editProfileModal?.querySelector(
    "#profile-description-input"
  );

  const profileNameEl = qs(".profile__name");
  const profileDescriptionEl = qs(".profile__description");

  // Avatar modal
  const avatarBtn = qs(".profile__avatar-btn");
  const avatarModal = document.getElementById("avatar-modal");
  const avatarForm = avatarModal?.querySelector("#edit-avatar-form");
  const avatarInput = avatarModal?.querySelector("#profile-avatar-input");
  const avatarImageEl = qs(".profile__avatar");

  // New post modal
  const newPostBtn = qs(".profile__add-btn");
  const newPostModal = document.getElementById("new-post-modal");
  const addCardFormElement = newPostModal?.querySelector(".modal__form");
  const nameInput = newPostModal?.querySelector("#profile-caption-input");
  const linkInput = newPostModal?.querySelector("#new-card-image-input");

  // Preview modal
  const previewModal = document.getElementById("preview-modal");
  const previewImageEl = previewModal?.querySelector(".modal__image");
  const modalCaptionEl = previewModal?.querySelector(".modal__caption");

  // Cards
  const cardTemplate =
    document.querySelector("#card-template")?.content?.querySelector(".card") ||
    null;
  const cardsList = qs(".cards__list");

  let selectedCardId;
  let cardToDelete;
  let currentUserId;

  // Delete modal
  const deleteModal = document.getElementById("delete-modal");
  const deleteForm = deleteModal?.querySelector("#delete-form");
  const deleteButtons =
    deleteModal?.querySelectorAll(".modal__submit-btn") || [];
  const deleteCancelBtn = deleteButtons[1];

  /* ---------- modal helpers ---------- */
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("modal_is-opened");
    document.addEventListener("keydown", handleEscClose);
    modal.addEventListener("mousedown", handleOverlayClose);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("modal_is-opened");
    document.removeEventListener("keydown", handleEscClose);
    modal.removeEventListener("mousedown", handleOverlayClose);
  }

  function handleEscClose(evt) {
    if (evt.key === "Escape") {
      const openedModal = document.querySelector(".modal.modal_is-opened");
      if (openedModal) closeModal(openedModal);
    }
  }

  function handleOverlayClose(evt) {
    if (evt.target.classList.contains("modal")) closeModal(evt.target);
  }

  /* ---------- Create card ---------- */
  function getCardElement(data) {
    if (!cardTemplate) return document.createTextNode("");

    const cardElement = cardTemplate.cloneNode(true);

    const cardTitleEl = cardElement.querySelector(".card__title");
    const cardImageEl = cardElement.querySelector(".card__image");
    const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
    const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");

    cardImageEl.src = data.link;
    cardImageEl.alt = data.name;
    cardTitleEl.textContent = data.name;

    // LIKE BUTTON
    const isLiked = data.likes?.some((u) => u._id === currentUserId);
    if (isLiked) cardLikeBtnEl.classList.add("card__like-btn_active");

    cardLikeBtnEl.addEventListener("click", () => {
      const isCurrentlyLiked = cardLikeBtnEl.classList.contains(
        "card__like-btn_active"
      );

      api
        .changedLikeStatus(data._id, isCurrentlyLiked)
        .then((updatedCard) => {
          const likedNow = updatedCard.likes.some(
            (u) => u._id === currentUserId
          );
          cardLikeBtnEl.classList.toggle("card__like-btn_active", likedNow);
        })
        .catch(console.error);
    });

    // DELETE BUTTON
    cardDeleteBtnEl.addEventListener("click", () => {
      selectedCardId = data._id;
      cardToDelete = cardElement;
      openModal(deleteModal);
    });

    // PREVIEW
    cardImageEl.addEventListener("click", () => {
      previewImageEl.src = data.link;
      previewImageEl.alt = data.name;
      modalCaptionEl.textContent = data.name;
      openModal(previewModal);
    });

    return cardElement;
  }

  function renderCard(item, method = "prepend") {
    cardsList[method](getCardElement(item));
  }

  /* ---------- Edit Profile ---------- */
  editProfileBtn?.addEventListener("click", () => {
    editProfileNameInput.value = profileNameEl.textContent;
    editProfileDescriptionInput.value = profileDescriptionEl.textContent;

    const inputs = Array.from(
      editProfileForm.querySelectorAll(settings.inputSelector)
    );
    resetValidation(editProfileForm, inputs, settings);

    openModal(editProfileModal);
  });

  editProfileForm?.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const submitBtn = evt.submitter;
    setButtonText(submitBtn, true);

    api
      .editUserInfo({
        name: editProfileNameInput.value,
        about: editProfileDescriptionInput.value,
      })
      .then((data) => {
        profileNameEl.textContent = data.name;
        profileDescriptionEl.textContent = data.about;
        closeModal(editProfileModal);
      })
      .catch(console.error)
      .finally(() => setButtonText(submitBtn, false));
  });

  /* ---------- Avatar ---------- */
  avatarBtn?.addEventListener("click", () => {
    avatarForm.reset();

    const inputs = Array.from(
      avatarForm.querySelectorAll(settings.inputSelector)
    );
    resetValidation(avatarForm, inputs, settings);

    openModal(avatarModal);
  });

  avatarForm?.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const submitBtn = evt.submitter;
    setButtonText(submitBtn, true);

    api
      .editAvatarInfo(avatarInput.value)
      .then((data) => {
        avatarImageEl.src = data.avatar;
        closeModal(avatarModal);
      })
      .catch(console.error)
      .finally(() => setButtonText(submitBtn, false));
  });

  /* ---------- Delete Card ---------- */
  deleteForm?.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const submitBtn = evt.submitter;
    setButtonText(submitBtn, true, "Delete", "Deleting...");

    api
      .deleteCard(selectedCardId)
      .then(() => {
        cardToDelete.remove();
        cardToDelete = null;
        selectedCardId = null;
        closeModal(deleteModal);
      })
      .catch(console.error)
      .finally(() => setButtonText(submitBtn, false, "Delete", "Deleting..."));
  });

  deleteCancelBtn?.addEventListener("click", () => {
    selectedCardId = null;
    cardToDelete = null;
    closeModal(deleteModal);
  });

  /* ---------- New Card + Validation Reset ---------- */
  newPostBtn?.addEventListener("click", () => {
    const inputs = Array.from(
      addCardFormElement.querySelectorAll(settings.inputSelector)
    );
    resetValidation(addCardFormElement, inputs, settings);
    openModal(newPostModal);
  });

  addCardFormElement?.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const submitBtn = evt.submitter;
    setButtonText(submitBtn, true);

    const inputValues = {
      name: nameInput.value,
      link: linkInput.value,
    };

    api
      .addNewCard(inputValues)
      .then((newCard) => {
        renderCard(newCard, "prepend");
        addCardFormElement.reset();

        if (submitBtn) disableButton(submitBtn, settings);
        closeModal(newPostModal);
      })
      .catch(console.error)
      .finally(() => setButtonText(submitBtn, false));
  });

  /* ---------- Initial Data ---------- */
  api
    .getAppInfo()
    .then(([userData, cards]) => {
      currentUserId = userData._id;

      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;
      avatarImageEl.src = userData.avatar;

      cards.forEach((item) => renderCard(item, "append"));
    })
    .catch(console.error);

  /* ---------- VALIDATION ---------- */
  enableValidation(settings);
}
