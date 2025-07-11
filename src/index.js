import { createCard, handleDeleteCard, handleLikeCard } from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";
import "./styles/index.css";
import { enableValidation, clearValidation } from './components/validation.js';
import { 
  getUserInfo, 
  getInitialCards, 
  updateProfile, 
  addNewCard,
  updateAvatar 
} from "./components/api.js";

// @todo: DOM узлы
const places = document.querySelector(".places");
const profile = document.querySelector(".profile");

// Cписок карточек
const placesList = places.querySelector(".places__list");

// Popups
const editPopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const avatarPopup = document.querySelector(".popup_type_avatar");
const popups = document.querySelectorAll(".popup");

// Image popup elements
const imagePopupPicture = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");

// Avatar image
const avatarImage = document.querySelector(".profile__image");

// Buttons
const profileEditButton = profile.querySelector(".profile__edit-button");
const profileAddButton = profile.querySelector(".profile__add-button");
const closeButtons = document.querySelectorAll(".popup__close");

// Forms
const editProfileForm = document.forms["edit-profile"];
const newCardForm = document.forms["new-place"];
const avatarForm = document.forms["update-avatar"];

// Form inputs
const nameInput = editProfileForm.querySelector(".popup__input_type_name");
const jobInput = editProfileForm.querySelector(
  ".popup__input_type_description"
);
const newCardNameInput = newCardForm.querySelector(
  ".popup__input_type_card-name"
);
const newCardUrlInput = newCardForm.querySelector(".popup__input_type_url");
const avatarInput = avatarForm.querySelector(".popup__input_type_avatar-url");

// Profile title and description
const profileTitle = profile.querySelector(".profile__title");
const profileDesc = profile.querySelector(".profile__description");

// Config object for validation
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

enableValidation(validationConfig);

// Profile edit popup opening
profileEditButton.addEventListener("click", function () {
  // add initial fillers of profile form inputs
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDesc.textContent;

  // add clearance of validation errors from previous openings
  clearValidation(editProfileForm, validationConfig);

  openPopup(editPopup);
});

// Обработчик «отправки» формы профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы

  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";

  updateProfile(nameInput.value, jobInput.value)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDesc.textContent = userData.about;
      closePopup(editPopup);
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

// Прикрепляем обработчик к форме: он будет следить за событием “submit” - «отправка»
editProfileForm.addEventListener("submit", handleProfileFormSubmit);

// Обработчик «отправки» формы добавления карточки
function handleCardFormSubmit(evt) {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы

  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";

  const card = {
    name: newCardNameInput.value,
    link: newCardUrlInput.value,
  };

  addNewCard(card.name, card.link)
    .then((card) => {
      const cardElement = createCard(
        card,
        handleDeleteCard,
        openImagePopup,
        handleLikeCard,
        userId
      );

      placesList.prepend(cardElement);
      closePopup(newCardPopup); // для автоматического закрытия попапа
      newCardForm.reset(); // очищаем форму
      
      clearValidation(newCardForm, validationConfig); // очищаем валидацию формы
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

// Прикрепляем обработчик к форме: он будет следить за событием “submit” - «отправка»
newCardForm.addEventListener("submit", handleCardFormSubmit);

// Add new card popup opening by listener
profileAddButton.addEventListener("click", function () {
  newCardForm.reset(); // очищаем форму 
  clearValidation(newCardForm, validationConfig); // очищаем валидацию формы 
  
  openPopup(newCardPopup);
});

// Function for image popup opening
function openImagePopup(card) {
  imagePopupPicture.src = card.link;
  imagePopupPicture.alt = card.name;
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

let userId = null;

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;

    // Обновляем профиль данными с сервера
    profileTitle.textContent = userData.name;
    profileDesc.textContent = userData.about;
    avatarImage.style.backgroundImage = `url(${userData.avatar})`;

    // Отображаем карточки с сервера
    cards.forEach((card) => {
      const cardElement = createCard(
        card,
        handleDeleteCard,
        openImagePopup,
        handleLikeCard,
        userId
      );
      // добавляем карточку в конец списка карточек
      placesList.append(cardElement);
    });
  })
  .catch((err) => {
    console.log("Ошибка при загрузке данных:", err);
  });

// Avatar popup opening by listener 
avatarImage.addEventListener("click", () => {
  avatarForm.reset();

  clearValidation(avatarForm, validationConfig);
  openPopup(avatarPopup);
});

// Обработчик «отправки» формы редактирования аватара
function handleAvatarFormSubmit(evt) {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы
  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  submitButton.textContent = "Сохранение...";

  updateAvatar(avatarInput.value)
    .then((userData) => {
      avatarImage.style.backgroundImage = `url(${userData.avatar})`;
      closePopup(avatarPopup);
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

// Прикрепляем обработчик к форме: он будет следить за событием “submit” - «отправка»
avatarForm.addEventListener("submit", handleAvatarFormSubmit);
