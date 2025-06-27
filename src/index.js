import { createCard, deleteCard, likeCard } from "./components/card.js";
import {
  openPopup,
  closePopup,
  closePopupByEscape,
  closePopupByOverlay,
} from "./components/modal.js";
import "./styles/index.css";
import { initialCards } from "./scripts/cards.js";

// @todo: DOM узлы
const places = document.querySelector(".places");
const profile = document.querySelector(".profile");

// Card template 
export const cardTemplate = document.querySelector("#card-template").content;

// Cписок карточек
const placesList = places.querySelector(".places__list");

// Popups
const editPopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const popups = document.querySelectorAll(".popup");

// Image popup elements
const imagePopupPicture = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");

// Buttons
const profileEditButton = profile.querySelector(".profile__edit-button");
const profileAddButton = profile.querySelector(".profile__add-button");
const closeButtons = document.querySelectorAll(".popup__close");

// Forms
const editProfileForm = document.forms["edit-profile"];
const newCardForm = document.forms["new-place"];

// Form inputs
const nameInput = editProfileForm.querySelector(".popup__input_type_name");
const jobInput = editProfileForm.querySelector(
  ".popup__input_type_description"
);
const newCardNameInput = newCardForm.querySelector(
  ".popup__input_type_card-name"
);
const newCardUrlInput = newCardForm.querySelector(".popup__input_type_url");

// Profile title and description
const profileTitle = profile.querySelector(".profile__title");
const profileDesc = profile.querySelector(".profile__description");

// @todo: Вывести карточки на страницу
initialCards.forEach((element) => {
  const cardElement = createCard(element, deleteCard, openImagePopup, likeCard);
  // добавляем карточку в конец списка карточек
  placesList.append(cardElement);
});

// Edit popup opening
profileEditButton.addEventListener("click", function () {
  openPopup(editPopup);

  // add initial fillers of profile form inputs
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDesc.textContent;
});

// Обработчик «отправки» формы профиля
function handleFormSubmit(evt) {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы

  profileTitle.textContent = nameInput.value;
  profileDesc.textContent = jobInput.value;

  closePopup(editPopup); // для автоматического закрытия попапа
}

// Прикрепляем обработчик к форме: он будет следить за событием “submit” - «отправка»
editProfileForm.addEventListener("submit", handleFormSubmit);

// Обработчик «отправки» формы добавления карточки
function handleCardFormSubmit(evt) {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы

  const card = {
    name: newCardNameInput.value,
    link: newCardUrlInput.value,
  };
  // Создаем карточку по введеным параметрам со всеми аргументами
  const newCard = createCard(card, deleteCard, openImagePopup, likeCard);

  placesList.prepend(newCard);
  closePopup(newCardPopup); // для автоматического закрытия попапа
}

// Прикрепляем обработчик к форме: он будет следить за событием “submit” - «отправка»
newCardForm.addEventListener("submit", handleCardFormSubmit);

// Add popup opening by listener
profileAddButton.addEventListener("click", function () {
  openPopup(newCardPopup);
});

// Function for image popup opening
function openImagePopup(card) {
  imagePopupPicture.src = card.link;
  imagePopupCaption.textContent = card.name;

  openPopup(imagePopup);
}

// Operate with close buttons
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    closePopup(popup);
  });
});

// Adding smooth open/close to all popups
popups.forEach((popup) => {
  popup.classList.add("popup_is-animated");
});
