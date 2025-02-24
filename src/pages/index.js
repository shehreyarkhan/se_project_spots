import "./index.css";
import Api from "../utils/Api.js";

import { disabledButton, enableValidation, settings } from "../scripts/validation.js";



const profileName = document.querySelector("#user-name");
const profileDescription = document.querySelector("#profile-description");
const profileImage = document.querySelector("#user-image");
const profileEditBtn = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const editModal = document.querySelector("#edit-modal");
const avatarModalBtn = document.querySelector("#profile__avatar-btn");
const editFormElement = editModal.querySelector(".modal__form");
const profileCloseButton = editModal.querySelector("#modal-close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector("#add-modal-close-btn");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const avatarModal = document.querySelector("#avatar-modal");
const avatarModalCloseBtn = avatarModal.querySelector("#modal-close-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");


const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const modalCloseTypePreview = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

const deleteModal = document.querySelector("#delete-modal");
const deleteBtn = deleteModal.querySelector(".modal__submit-btn");
const deleteModalCloseBtn = deleteModal.querySelector("#modal-close-btn");

// Initial card rendering
enableValidation(settings);

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "92dcf13b-9213-4fca-8c66-c8527311427d",
    "Content-Type": "application/json",
  },
});


api.getAppInfo()
  .then(([cards]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

  api.getUserInfo().then((user)=>{console.log(user);
    profileName.textContent = user?.name;
    profileDescription.textContent = user?.about.trim();
    const userImg = user?.avatar;
    profileImage.src=userImg;
  })
// Open and close modal utility functions
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

// Handle Escape key to close modal
function handleEscapeKey(event) {
  if (event.key === "Escape") {
    const openModal = documesnt.querySelector(".modal_opened");
    if (openModal) closeModal(openModal);
  }
}

// Handle clicks on the overlay to close modal
function handleOverlayClick(event) {
  if (event.target.classList.contains("modal_opened")) {
    closeModal(event.target);
  }
}

// Get card element with like and delete functionality
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  cardNameEl.textContent = data.name;

  const cardImageEl = cardElement.querySelector(".card__image");
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button_liked");
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.alt = data.name;
  });

  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtn.addEventListener("click", () => {
    openModal(deleteModal);
    // cardElement.remove();
    
  });

  return cardElement;
}

// Handle profile edit form submission
function handleEditFormSubmit(e) {
  e.preventDefault();
  api.editUserInfo({name: editModalNameInput.value, about: editModalDescriptionInput.value})
  .then((data)=>{
    profileName.textContent = editModalNameInput.value;
    profileDescription.textContent = editModalDescriptionInput.value;
    closeModal(editModal);
  }).catch(console.error);
}

// Handle add card form submission
function handleAddCardSubmit(e) {
  e.preventDefault();
  
  api.addPostCards(cardNameInput.value, cardLinkInput.value).then((card)=>{
    console.log(card);
    // const inputValues = { name: card.name, link: card.link };
    // const cardElement = getCardElement(inputValues);
    // cardsList.prepend(cardElement);

  }).catch(console.error());
  // Reset the form and disable the button after submission
  cardForm.reset();
  disabledButton(cardSubmitBtn, settings);

  closeModal(cardModal);
}

function handleAvatarSubmit(e) {
  e.preventDefault();
  api.editAvatarInfo (avatarInput.value).then((data)=>{
    console.log(data.avatar);
  }).catch(console.error());
  // Reset the form and disable the button after submission
  avatarForm.reset();
  disabledButton(avatarSubmitBtn, settings);

  closeModal(avatarModal);
}

// Event listeners
profileEditBtn.addEventListener("click", () => {
  openModal(editModal);
  editModalNameInput.value = profileName.textContent.trim();
  editModalDescriptionInput.value = profileDescription.textContent.trim();
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
});

profileCloseButton.addEventListener("click", () => closeModal(editModal));
editFormElement.addEventListener("submit", handleEditFormSubmit);

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => closeModal(cardModal));
cardForm.addEventListener("submit", handleAddCardSubmit);

modalCloseTypePreview.addEventListener("click", () => closeModal(previewModal));

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarModalCloseBtn.addEventListener("click", () => closeModal(avatarModal));
avatarForm.addEventListener("submit", handleAvatarSubmit);


deleteModalCloseBtn.addEventListener("click", () => closeModal(deleteModal));
deleteModal.addEventListener("click", cardElement.remove());

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", handleOverlayClick);
});


