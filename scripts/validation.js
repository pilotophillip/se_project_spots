const showInputError = (formEl, inputEl, errorMsg) => {
  const errorMsgEl = document.querySelector("#${inputEl.id}-error");
  errorMsgEl.textContent = errorMsg;
};

const checkInputValidity = (formEL, inputEl) => {
  if (!inputElement.validity.valid) {
    showInputError(formEl, inputEl, inputElement.validationMessage);
  }
};

const setEventListener = (formEl) => {
  const inputList = Array.from(formEl.querySelectorAll(".modal__input"));
  const buttonElement = formEl.querySelector(".modal__button");

  // TODO - handle intial states
  // toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement);
      // toggleButtonState(inputList, buttonElement);
    });
  });
};

const enableValidation = () => {
  const formList = document.querySelectorAll(".modal__form");
  formList.forEach((formEl) => {
    setEventListener(formEl);
  });
};

enableValidation();
