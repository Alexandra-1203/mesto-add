import { deletePost, changeLikeCardStatus } from "./api.js";

export const likeCard = (likeButton, cardId, isLiked, likeCountElement) => {
  return changeLikeCardStatus(cardId, isLiked)
    .then((card) => {
      likeCountElement.textContent = card.likes.length;
      likeButton.classList.toggle("card__like-button_is-active")
    })
    .catch((err) => console.log(err));
};

export const deleteCard = (cardElement, cardId) => {
  return deletePost({ _id: cardId })
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCardElement = (
  data,
  currentUser,
  { onPreviewPicture, onLikeIcon, onDeleteCard },
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(
    ".card__control-button_type_delete",
  );
  const cardImage = cardElement.querySelector(".card__image");
  const likeCountElement = cardElement.querySelector(".card__like-count");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;
  likeCountElement.textContent = data.likes.length;

  const isLikedByCurrentUser = data.likes.some(like => like._id === currentUser);

  if (isLikedByCurrentUser) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (currentUser !== data.owner._id) {
    deleteButton.remove();
  }

  if (onLikeIcon) {
    likeButton.addEventListener("click", () => {
      const isLiked = likeButton.classList.contains("card__like-button_is-active");
      onLikeIcon(likeButton, data._id, isLiked, likeCountElement)
    });
  }

  if (onDeleteCard) {
    deleteButton.addEventListener("click", () => {
      onDeleteCard(cardElement, data._id);
    });
  } 

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () =>
      onPreviewPicture({ name: data.name, link: data.link }),
    );
  }

  return cardElement;
};
