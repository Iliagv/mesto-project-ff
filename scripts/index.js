// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const places = document.querySelector(".places");

// список карточек
const placesList = places.querySelector(".places__list");

// @todo: Функция создания карточки
function createCard(card, deleteCardCallBack) {
  source = card.link;
  title = card.name;

  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteCardButton = cardElement.querySelector(".card__delete-button");

  cardElement.querySelector(".card__image").src = source;
  cardElement.querySelector(".card__title").textContent = title;

  deleteCardButton.addEventListener("click", () => {
    deleteCardCallBack(cardElement);
  });

  return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach((element) => {
  const cardElement = createCard(element, deleteCard);
// добавляем карточку в конец списка карточек
  placesList.append(cardElement);
});
