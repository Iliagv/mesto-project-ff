import { cardTemplate } from "../index.js";

// Function to create a card
export function createCard(card, deleteCardCallback, openImageCallback, likeCallback) {

  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteCardButton = cardElement.querySelector(".card__delete-button");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = card.link;
  cardTitle.textContent = card.name;

  deleteCardButton.addEventListener("click", () => {
    deleteCardCallback(cardElement);
  });

  cardImage.addEventListener("click", () => {
    openImageCallback(card);
  });
  
  cardLikeButton.addEventListener("click", likeCallback);

  return cardElement;
}

// Function to delete a card
export function deleteCard(cardElement) {
  cardElement.remove();
}

// Function to add the ability to like a card
export function likeCard(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}
