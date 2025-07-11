// Card template 
const cardTemplate = document.querySelector("#card-template").content;

import { deleteCard, likeCard, unlikeCard } from "./api.js";

// Function to create a card
export function createCard(card, deleteCardCallback, openImageCallback, likeCallback, userId) {

  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteCardButton = cardElement.querySelector(".card__delete-button");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeButton = cardElement.querySelector(".card__like-button");

  // Создаем элемент для отображения количества лайков
  const likeCounter = document.createElement("span");

  likeCounter.classList.add("card__like-counter");
  likeCounter.textContent = card.likes.length;
  cardLikeButton.after(likeCounter);

  cardImage.src = card.link;
  cardTitle.textContent = card.name;

  // Remove delete card element from a card if the card owner is another groupmate
  if (card.owner && card.owner._id !== userId) {
    deleteCardButton.style.display = "none";
  }

  // Check if there's our like on a card
  if (card.likes.some((like) => like._id === userId)) {
    cardLikeButton.classList.add("card__like-button_is-active");
  }

  deleteCardButton.addEventListener("click", () => {
    deleteCardCallback(card._id, cardElement);
  });

  cardImage.addEventListener("click", () => {
    openImageCallback(card);
  });

  cardLikeButton.addEventListener("click", () =>
    likeCallback(card._id, cardLikeButton, likeCounter)
  );

  return cardElement;
}

// Function to delete a card
export function handleDeleteCard(cardId, cardElement) {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log("Ошибка при удалении карточки:", err);
    });
}

export function handleLikeCard(cardId, cardLikeButton, likeCounter) {
  const isCardLiked = cardLikeButton.classList.contains("card__like-button_is-active");
  const likePromise = isCardLiked ? unlikeCard(cardId) : likeCard(cardId);

  likePromise
    .then((updatedCard) => {
      likeCounter.textContent = updatedCard.likes.length;
      cardLikeButton.classList.toggle("card__like-button_is-active");
    })
    .catch((err) => {
      console.log("Ошибка при лайке:", err);
    });
}