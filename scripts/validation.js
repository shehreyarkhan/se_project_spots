const settings = {
    formSelector: ".modal__form",
    inputSelector:".modal__input",
    submitButtonSelector: ".modal__submit-btn",
    inactiveButtonClass: "modal__submit-btn_disabled",
    inputErrorClass: "modal__input_type_error",
    inputErrorTopMargin: "modal__error_top_margin",
    errorClass: "modal__error"
}

const showInputError = (formElement, inputElement, errorMessage, config) => {
    const errorMsgID = inputElement.id + "-error";
    const errorMsgEl = formElement.querySelector("#" + errorMsgID);
    errorMsgEl.textContent = errorMessage;
    inputElement.classList.add(config.inputErrorClass);
    errorMsgEl.classList.add(config.inputErrorTopMargin);
  };
  
  const hideInputError = (formElement, inputElement, config) => {
    const errorMsgID = inputElement.id + "-error";
    const errorMsgEl = formElement.querySelector("#" + errorMsgID);
    console.log(errorMsgID);
    errorMsgEl.textContent = "";
    inputElement.classList.remove(config.inputErrorClass);
    errorMsgEl.classList.remove(config.inputErrorTopMargin);
  };
  
  const checkInputValidity = (formElement, inputElement, config) => {
    if (!inputElement.validity.valid) {
      showInputError(formElement, inputElement, inputElement.validationMessage, config);
    } else {
      hideInputError(formElement, inputElement, config);
    }
  };
  
  const hasInvalidInput = (inputList) => {
    return inputList.some((input) => !input.validity.valid);
  };
  
  const toggleButtonState = (inputList, buttonElement, config) => {
    if (hasInvalidInput(inputList)) {
      disabledButton(buttonElement, config);
    } else {
      buttonElement.disabled = false;
      buttonElement.classList.remove(config.inactiveButtonClass);
    }
  };

  const disabledButton = (buttonElement, config) => {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  }
  
  const resetValidation = (formElement, inputList, config) => {
   inputList.forEach((input) => {
    hideInputError(formElement, input, config);
   });
  }

  const setEventListeners = (formElement, config) => {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
  
    // Initialize button state
    toggleButtonState(inputList, buttonElement, config);
  
    inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        checkInputValidity(formElement, inputElement, config);
        toggleButtonState(inputList, buttonElement, config);
      });
    });
  };
  
  const enableValidation = (config) => {
    const formList = Array.from(document.querySelectorAll(config.formSelector));
    formList.forEach((formElement) => {
      setEventListeners(formElement, config);
    });
  };
  
  enableValidation(settings);
  