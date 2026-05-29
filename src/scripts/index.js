/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
} from "./components/modal.js";
import {
  getUserInfo,
  getCardList,
  setUserInfo,
  setUserAvatar,
  addCard,
  changeLikeCardStatus,
  deletePost,
} from "./components/api.js";
import { enableValidation, clearValidation } from "./components/validation.js";

// Создание объекта с настройками валидации
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// включение валидации вызовом enableValidation
// все настройки передаются при вызове
enableValidation(validationSettings);

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".popup__input_type_description",
);

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

const removeCardPopup = document.querySelector(".popup_type_remove-card");
const removeCardForm = removeCardPopup.querySelector(".popup__form");
const removeCardSubmitButton = removeCardPopup.querySelector(".popup__button");

const popupInfo = document.querySelector(".popup_type_info");
const logo = document.querySelector(".header__logo");
const statisticPopap = document.querySelector(".popup_type_info");

let currentDeleteCardElement = null;
let currentDeleteCardId = null;

let currentUserId = null;

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const renderLoading = (
  button,
  isLoading,
  loadingText = "Сохранение...",
  defaultText = "Сохранить",
) => {
  if (isLoading) {
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = defaultText;
    button.disabled = false;
  }
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const button = profileForm.querySelector(".popup__button");
  renderLoading(button, true);
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      // Код отвечающий за обновление данных на странице
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => renderLoading(button, false));
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  const button = avatarForm.querySelector(".popup__button");
  renderLoading(button, true);
  setUserAvatar({ avatar: avatarInput.value })
    .then((userAvatar) => {
      profileAvatar.style.backgroundImage = `url('${userAvatar.avatar}')`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => renderLoading(button, false));
};

const handleDeleteCard = (cardElement, cardId) => {
  currentDeleteCardElement = cardElement;
  currentDeleteCardId = cardId;
  openModalWindow(removeCardPopup);
};

const handleConfirmDelete = (evt) => {
  evt.preventDefault();
  const button = removeCardForm.querySelector(".popup__button");
  renderLoading(button, true);

  deletePost({ _id: currentDeleteCardId })
    .then(() => {
      deleteCard(currentDeleteCardElement);
      closeModalWindow(removeCardPopup);
      currentDeleteCardElement = null;
      currentDeleteCardId = null;
    })
    .catch((err) => console.log(err))
    .finally(() => renderLoading(button, false));
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const button = cardForm.querySelector(".popup__button");
  renderLoading(button, true);
  addCard({ name: cardNameInput.value, link: cardLinkInput.value })
    .then((cardData) => {
      placesWrap.prepend(
        createCardElement(cardData, currentUserId, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: handleLike,
          onDeleteCard: handleDeleteCard,
        }),
      );
      closeModalWindow(cardFormModalWindow);
      cardForm.reset();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => renderLoading(button, false));
};

const handleLike = (likeButton, cardId, isLiked, likeCountElement) => {
  changeLikeCardStatus(cardId, isLiked)
    .then((updatedCard) => {
      likeCard(
        likeButton,
        likeCountElement,
        updatedCard.likes.length,
        !isLiked,
      );
    })
    .catch((err) => console.log(err));
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);
removeCardForm.addEventListener("submit", handleConfirmDelete);

const fillStatistic = (stats) => {
  const info = statisticPopap.querySelector(".popup__info");
  const list = statisticPopap.querySelector(".popup__list");

  info.innerHTML = "";
  list.innerHTML = "";

  const addInfo = (key, value) => {
    const template = document.getElementById("popup-info-definition-template");
    const item = template.content.cloneNode(true);
    item.querySelector(".popup__info-term").textContent = key;
    item.querySelector(".popup__info-description").textContent = value;
    info.appendChild(item);
  };

  addInfo("Всего пользователей:", stats.allUsers);
  addInfo("Всего лайков:", stats.allLikes);
  addInfo("Максимально лайков от одного:", stats.maxLikes);
  addInfo("Чемпион лайков:", stats.maxUser);

  stats.popularCards.forEach((card) => {
    const template = document.getElementById(
      "popup-info-user-preview-template",
    );
    const fragment = template.content.cloneNode(true);
    const li = fragment.querySelector(".popup__list-item");
    li.textContent = card;
    list.appendChild(fragment);
  });
};

const showStatistic = () => {
  getCardList()
    .then((cards) => {
      if (cards.length === 0) {
        alert("Пока нет карточек для статистики");
        return;
      }

      const users = [];
      let sumLikes = 0;
      const likes = {};

      cards.forEach((card) => {
        if (!users.includes(card.owner._id)) {
          users.push(card.owner._id);
        }
        sumLikes += card.likes.length;

        card.likes.forEach((like) => {
          const userId = like._id;
          const userName = like.name;
          likes[userId] = likes[userId] || { count: 0, name: userName };
          likes[userId].count++;
        });
      });

      const userMaxLikes = { count: 0, name: "" };
      Object.values(likes).forEach((like) => {
        if (userMaxLikes.count < like.count) {
          userMaxLikes.count = like.count;
          userMaxLikes.name = like.name;
        }
      });

      const popularCards = [...cards]
        .sort((a, b) => b.likes.length - a.likes.length)
        .map((card) => card.name);

      const statistic = {
        allUsers: users.length,
        allLikes: sumLikes,
        maxLikes: userMaxLikes.count,
        maxUser: userMaxLikes.name,
        popularCards: popularCards,
      };

      fillStatistic(statistic);
      openModalWindow(popupInfo);
    })
    .catch((err) => console.log(err));
};

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(validationSettings, profileForm);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(validationSettings, avatarForm);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(validationSettings, cardForm);
  openModalWindow(cardFormModalWindow);
});

logo.addEventListener("click", () => {
  showStatistic();
});

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;

    cards.forEach((cardData) => {
      placesWrap.append(
        createCardElement(cardData, userData._id, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: handleLike,
          onDeleteCard: handleDeleteCard,
        }),
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
