// index.js
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
const editModalDescriptionInput = editModal.querySelector("#profile-description-input");
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
const modalCloseTypePreview = previewModal.querySelector(".modal__close-btn_type_preview");


const deleteModal = document.querySelector("#delete-modal");
const deleteModalXBtn = deleteModal.querySelector(".modal__close-btn_type_preview");

const deleteBtn = deleteModal.querySelector(".modal__submit-btn");
const deleteModalCloseBtn = deleteModal.querySelector("#modal-close-btn");

let selectedCard;
let selectedCardId;

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
  .catch(console.error);

api.getUserInfo().then((user) => {
  profileName.textContent = user?.name;
  profileDescription.textContent = user?.about.trim();
  profileImage.src = user?.avatar;
}).catch(console.error);

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) closeModal(openModal);
  }
}

function handleOverlayClick(event) {
  if (event.target.classList.contains("modal_opened")) {
    closeModal(event.target);
  }
}

function getCardElement(data) {
  const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  const cardId = data._id;
  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_liked");
  }
  
  cardLikeBtn.addEventListener("click", () => {
    const isLiked = cardLikeBtn.classList.contains("card__like-button_liked");
    api.changeLikeStatus(cardId, isLiked)
      .then(() => {
        cardLikeBtn.classList.toggle("card__like-button_liked");
      })
      .catch(console.error);
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.alt = data.name;
  });

  cardDeleteBtn.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = cardId;
    openModal(deleteModal);
  });

  return cardElement;
}

function handleDeleteSubmit() {
  if (selectedCard && selectedCardId) {
    const submitButton = deleteBtn;
    submitButton.textContent = "Deleting...";
    submitButton.disabled = true;

    api.deleteCard(selectedCardId)
      .then(() => {
        selectedCard.remove();
        closeModal(deleteModal);
      })
      .catch(console.error)
      .finally(() => {
        submitButton.textContent = "Delete";
        submitButton.disabled = false;
        selectedCard = null;
        selectedCardId = null;
      });
  }
}

deleteBtn.addEventListener("click", handleDeleteSubmit);

function handleEditFormSubmit(e) {
  e.preventDefault();
  const submitButton = e.submitter;
  submitButton.textContent = "Saving...";
  submitButton.disabled = true;

  api.editUserInfo({ 
    name: editModalNameInput.value, 
    about: editModalDescriptionInput.value 
  })
  .then(() => {
    profileName.textContent = editModalNameInput.value;
    profileDescription.textContent = editModalDescriptionInput.value;
    closeModal(editModal);
  })
  .catch(console.error)
  .finally(() => {
    submitButton.textContent = "Save";
    submitButton.disabled = false;
  });
}

function handleAddCardSubmit(e) {
  e.preventDefault();
  const submitButton = e.submitter;
  submitButton.textContent = "Saving...";
  submitButton.disabled = true;

  api.addPostCards(cardNameInput.value, cardLinkInput.value)
    .then((card) => {
      const newCard = getCardElement({
        name: card.name,
        link: card.link,
        _id: card._id,
        isLiked: card.isLiked
      });
      cardsList.prepend(newCard);
      cardForm.reset();
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = "Save";
      submitButton.disabled = false;
      disabledButton(cardSubmitBtn, settings);
    });
}

function handleAvatarSubmit(e) {
  e.preventDefault();
  const submitButton = e.submitter;
  submitButton.textContent = "Saving...";
  submitButton.disabled = true;

  api.editAvatarInfo(avatarInput.value)
    .then((data) => {
      profileImage.src = data.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = "Save";
      submitButton.disabled = false;
      disabledButton(avatarSubmitBtn, settings);
    });
}

profileEditBtn.addEventListener("click", () => {
  openModal(editModal);
  editModalNameInput.value = profileName.textContent.trim();
  editModalDescriptionInput.value = profileDescription.textContent.trim();
  resetValidation(editFormElement, [editModalNameInput, editModalDescriptionInput], settings);
});

profileCloseButton.addEventListener("click", () => closeModal(editModal));
editFormElement.addEventListener("submit", handleEditFormSubmit);

cardModalBtn.addEventListener("click", () => openModal(cardModal));
cardModalCloseBtn.addEventListener("click", () => closeModal(cardModal));
cardForm.addEventListener("submit", handleAddCardSubmit);

modalCloseTypePreview.addEventListener("click", () => closeModal(previewModal));

avatarModalBtn.addEventListener("click", () => openModal(avatarModal));
avatarModalCloseBtn.addEventListener("click", () => closeModal(avatarModal));
avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteModalCloseBtn.addEventListener("click", () => closeModal(deleteModal));
deleteModalXBtn.addEventListener("click", () => closeModal(deleteModal));

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", handleOverlayClick);
});
