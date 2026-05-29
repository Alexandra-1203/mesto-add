const showInputError = (object, formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(object.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(object.errorClass);
};

const hideInputError = (object, formElement, inputElement) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(object.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(object.errorClass);
};

const checkInputValidity = (object, formElement, formInput) => {
  if (formInput.validity.patternMismatch) {
    formInput.setCustomValidity(formInput.dataset.errorMessage);
  } else {
    formInput.setCustomValidity("");
  }

  if (!formInput.validity.valid) {
    showInputError(object, formElement, formInput, formInput.validationMessage);
  } else {
    hideInputError(object, formElement, formInput);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const disableButton = (config, button) => {
  button.classList.add(config.inactiveButtonClass);
  button.disabled = true;
};

const enableButton = (config, button) => {
  button.classList.remove(config.inactiveButtonClass);
  button.disabled = false;
};

const toggleButtonState = (config, inputList, button) => {
  if (hasInvalidInput(inputList)) {
    disableButton(config, button);
  } else {
    enableButton(config, button);
  }
};

const setEventListeners = (object, formElement) => {
  const inputList = Array.from(
    formElement.querySelectorAll(object.inputSelector),
  );
  const button = formElement.querySelector(object.submitButtonSelector);
  disableButton(config, button);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(object, formElement, inputElement);
      toggleButtonState(object, inputList, button);
    });
  });
};

export const clearValidation = (object, formElement) => {
  const inputList = Array.from(
    formElement.querySelectorAll(object.inputSelector),
  );
  const button = formElement.querySelector(object.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(object, formElement, inputElement);
  });
  disableButton(config, button);
};

export const enableValidation = (object) => {
  const formList = Array.from(document.querySelectorAll(object.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(object, formElement);
  });
};
