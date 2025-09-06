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
  // Profile modal elements
  const editProfileBtn = qs(".profile__edit-btn");
  const editProfileModal = document.getElementById("edit-profile-modal");
  const editProfileForm = editProfileModal
    ? editProfileModal.querySelector(".modal__form")
    : null;
  const editProfileNameInput = editProfileModal
    ? editProfileModal.querySelector("#profile-name-input")
    : null;
  const editProfileDescriptionInput = editProfileModal
    ? editProfileModal.querySelector("#profile-description-input")
    : null;

  const profileNameEl = qs(".profile__name");
  const profileDescriptionEl = qs(".profile__description");

  // New post modal elements
  const newPostBtn = qs(".profile__add-btn");
  const newPostModal = document.getElementById("new-post-modal");
  const addCardFormElement = newPostModal
    ? newPostModal.querySelector(".modal__form")
    : null;
  const nameInput = newPostModal
    ? newPostModal.querySelector("#profile-caption-input")
    : null;
  const linkInput = newPostModal
    ? newPostModal.querySelector("#new-card-image-input")
    : null;

  // Preview modal elements
  const previewModal = document.getElementById("preview-modal");
  const previewImageEl = previewModal
    ? previewModal.querySelector(".modal__image")
    : null;
  const modalCaptionEl = previewModal
    ? previewModal.querySelector(".modal__caption")
    : null;

  // Card template and list (declare BEFORE any use)
  const cardTemplate =
    document.querySelector("#card-template")?.content?.querySelector(".card") ||
    null;
  const cardsList = qs(".cards__list");

  let selectedCardId;

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
      if (openedModal) {
        closeModal(openedModal);
      }
    }
  }

  function handleOverlayClose(evt) {
    // close only when clicking the overlay itself
    if (evt.target.classList.contains("modal")) {
      closeModal(evt.target);
    }
  }

  /* ---------- Create a card element from data ---------- */
  function getCardElement(data) {
    if (!cardTemplate) return document.createTextNode("");
    const cardElement = cardTemplate.cloneNode(true);

    const cardTitleEl = cardElement.querySelector(".card__title");
    const cardImageEl = cardElement.querySelector(".card__image");

    cardImageEl.src = data.link || "";
    cardImageEl.alt = data.name || "";
    cardTitleEl.textContent = data.name || "";

    const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
    cardLikeBtnEl?.addEventListener("click", (evt) => {
      evt.currentTarget.classList.toggle("card__like-btn_active");
    });

    // Delete card
    const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
    cardDeleteBtnEl?.addEventListener("click", () => {
      // optional: keep selectedCardId if you later call API
      // selectedCardId = data._id;
      cardElement.remove();
    });

    // Preview modal handler
    cardImageEl.addEventListener("click", () => {
      if (!previewModal) return;
      if (previewImageEl) {
        previewImageEl.src = data.link || "";
        previewImageEl.alt = data.name || "";
      }
      if (modalCaptionEl) modalCaptionEl.textContent = data.name || "";
      openModal(previewModal);
    });

    return cardElement;
  }

  // Universal render card function
  function renderCard(item, method = "prepend") {
    if (!cardsList) return;
    const el = getCardElement(item);
    cardsList[method](el);
  }

  /* ---------- Openers ---------- */
  editProfileBtn?.addEventListener("click", () => {
    if (!editProfileModal) return;
    if (editProfileNameInput && profileNameEl) {
      editProfileNameInput.value = profileNameEl.textContent || "";
    }
    if (editProfileDescriptionInput && profileDescriptionEl) {
      editProfileDescriptionInput.value =
        profileDescriptionEl.textContent || "";
    }
    if (editProfileForm) {
      const inputs = Array.from(
        editProfileForm.querySelectorAll(settings.inputSelector)
      );
      resetValidation(editProfileForm, inputs, settings);
    }
    openModal(editProfileModal);
  });

  newPostBtn?.addEventListener("click", () => {
    if (!newPostModal) return;
    openModal(newPostModal);
  });

  // Close buttons: universal modal close handler
  document.querySelectorAll(".modal__close-btn").forEach((button) => {
    const modal = button.closest(".modal");
    button.addEventListener("click", () => closeModal(modal));
  });

  /* ---------- Form submit handlers ---------- */
  function handleEditProfileSubmit(evt) {
    evt.preventDefault();

    const submitBtn = evt.submitter;
    setButtonText(submitBtn, true);

    api
      .editUserInfo({
        name: editProfileNameInput?.value || "",
        about: editProfileDescriptionInput?.value || "",
      })
      .then((data) => {
        if (data) {
          if (profileNameEl) profileNameEl.textContent = data.name || "";
          if (profileDescriptionEl)
            profileDescriptionEl.textContent = data.about || "";
        }
        closeModal(editProfileModal);
      })
      .catch(console.error)
      .finally(() => {
        setButtonText(submitBtn, false);
      });
  }
  editProfileForm?.addEventListener("submit", handleEditProfileSubmit);

  function handleAddCardSubmit(evt) {
    evt.preventDefault();

    const inputValues = {
      name: nameInput?.value || "",
      link: linkInput?.value || "",
    };

    renderCard(inputValues, "prepend");

    // Clear form inputs after adding card
    addCardFormElement?.reset();

    // Disable submit button after resetting the form
    if (evt.submitter) disableButton(evt.submitter, settings);

    // Close the modal
    closeModal(newPostModal);
  }
  addCardFormElement?.addEventListener("submit", handleAddCardSubmit);

  /* ---------- Initial data ---------- */
  api
    .getAppInfo()
    .then((cards) => {
      // cards is expected to be an array (from your code)
      if (Array.isArray(cards)) {
        cards.forEach((item) => renderCard(item, "append"));
      }
    })
    .catch(console.error);

  // (Optional) If you want local persistence, you can add it later
}
