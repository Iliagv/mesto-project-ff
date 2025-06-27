// Function for opening a popup
export function openPopup(popupElement) {
  popupElement.classList.add("popup_is-opened");

  document.addEventListener("keydown", closePopupByEscape);
  document.addEventListener("click", closePopupByOverlay);
}

// Function for closing a popup
export function closePopup(popupElement) {
  popupElement.classList.remove("popup_is-opened");

  document.removeEventListener("keydown", closePopupByEscape);
  document.addEventListener("click", closePopupByOverlay);
}

// Function for closing popup by Escape
export function closePopupByEscape(evt) {
  const openedPopup = document.querySelector(".popup_is-opened");
  if (evt.key === "Escape") {
    closePopup(openedPopup);
  }
}

// Function for closing popup by Overlay
export function closePopupByOverlay(evt) {
  const openedPopup = document.querySelector(".popup_is-opened");
  if (evt.target === openedPopup) {
    closePopup(openedPopup);
  }
}
