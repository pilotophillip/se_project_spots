const showInputError = (formEl, inputEl, errorMsg) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = errorMsg;
  inputEl.classList.add("modal__input_type_error");
};

const hideInputError = (formEl, inputEl) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textContent = "";
  inputEl.classList.remove("modal__input_type_error");
};

const checkInputValidity = (formEl, inputEl) => {
  if (!inputElement.validity.valid) {
    showInputError(formEl, inputEl, inputElement.validationMessage);
  } else {
    hideInputError(formEl, InputEl);
  }
};

const hasInvalidInput = (inputList) => {
  inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonEl) => {
  if (hasInvalidInput(inputList)) {
    disabledButton(buttonEl);
  } else {
    buttonEl.disabled = false;
    //remove the disabled class
  }
};

const disableButton = (buttonEL) => {
  buttonEl.disabled = true;
  //add a modifier class to the buttonEl to make it grey
  // Dont forget the CSS
};

const resetValidation = (formEl, inputlist) => {
  inputlist.forEach((input) => {
    hideInputError(formEl, input);
  });
};

const setEventListener = (formEl) => {
  const inputList = Array.from(formEl.querySelectorAll(".modal__input"));
  const buttonElement = formEl.querySelector(".modal__button");

  toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement);
      toggleButtonState(inputList, buttonElement);
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
