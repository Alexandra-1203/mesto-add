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

const toggleButtonState = (object, inputList, button) => {
  if (hasInvalidInput(inputList)) {
    button.classList.add(object.inactiveButtonClass);
    button.disabled = true;
  } else {
    button.classList.remove(object.inactiveButtonClass);
    button.disabled = false;
  }
};

const setEventListeners = (object, formElement) => {
  const inputList = Array.from(
    formElement.querySelectorAll(object.inputSelector),
  );
  const button = formElement.querySelector(object.submitButtonSelector);
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
  if (inputList.length === 0) {
    button.classList.remove(object.inactiveButtonClass);
    button.disabled = false;
    return;
  }

  if (!inputList) {
    return;
  }

  inputList.forEach((inputElement) => {
    hideInputError(object, formElement, inputElement);
  });
  button.classList.add(object.inactiveButtonClass);
  button.disabled = true;
};

export const enableValidation = (object) => {
  const formList = Array.from(document.querySelectorAll(object.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(object, formElement);
  });
};
