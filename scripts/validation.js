const showInputError = (formElement, inputElement, errorMessage) => {
    const errorMsgID = inputElement.id + '-error';
    const errorMsgEl = formElement.querySelector("#" + errorMsgID);
    errorMsgEl.textContent = errorMessage;
    console.log(errorMsgID);
    inputElement.classList.add("modal__input_type_error")
    errorMsgEl.classList.add("modal__error_top_margin")
}

const hideInputError = (formElement, inputElement) => {
    const errorMsgID = inputElement.id + '-error';
    const errorMsgEl = formElement.querySelector("#" + errorMsgID);
    errorMsgEl.textContent = ""
    inputElement.classList.remove("modal__input_type_error")
    errorMsgEl.classList.remove("modal__error_top_margin")

}

const checkInputValidity = (formElement, inputElement, errorMessage) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(".modal__input"));
  const buttonElement = formElement.querySelector(".modal__submit-btn");

  // toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement);
      // toggleButtonState(inputList, buttonElement);
    });
  });
};

const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll(".modal__form"));
  console.log(formList);
  formList.forEach((formEl) => {
    setEventListeners(formEl);
  });
};

enableValidation();
