const initialCards = [
  {
    name: "Griffin Wooldridge",
    link: " https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileName = document.querySelector("#user-name");
const profileDescription = document.querySelector("#profile-description");
const profileEditBtn = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const editModal = document.querySelector("#edit-modal");
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

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const modalCloseTypePreview = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

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
    const index = initialCards.findIndex(
      (item) => item.name === data.name && item.link === data.link
    );
    if (index !== -1) {
      initialCards.splice(index, 1);
    }
    cardElement.remove();
  });

  return cardElement;
}

function handleEditFormSubmit(e) {
  e.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleAddCardSubmit(e) {
  e.preventDefault();

  // Check for non-empty inputs
  if (!cardNameInput.value.trim() || !cardLinkInput.value.trim()) {
    return; // Prevent submission of an empty card
  }

  const inputValues = {
    name: cardNameInput.value.trim(),
    link: cardLinkInput.value.trim(),
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);

  // Reset the form and disable the button
  cardForm.reset();
  cardSubmitBtn.disabled = true; // Disable the button
  cardSubmitBtn.classList.add("modal__submit-btn_disabled"); // Add disabled styling

  resetValidation(cardForm, [cardNameInput, cardLinkInput], settings);

  closeModal(cardModal);
}

function toggleEditSubmitButton() {
  const isNameChanged =
    editModalNameInput.value.trim() !== profileName.textContent.trim();
  const isDescriptionChanged =
    editModalDescriptionInput.value.trim() !==
    profileDescription.textContent.trim();

  const hasChanges = isNameChanged || isDescriptionChanged;

  const editSubmitBtn = editFormElement.querySelector(".modal__submit-btn");
  editSubmitBtn.disabled = !hasChanges;
  editSubmitBtn.classList.toggle("modal__submit-btn_disabled", !hasChanges);
}

profileEditBtn.addEventListener("click", () => {
  openModal(editModal);

  editModalNameInput.value = profileName.textContent.trim();
  editModalDescriptionInput.value = profileDescription.textContent.trim();

  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );

  toggleEditSubmitButton();
});

profileCloseButton.addEventListener("click", () => closeModal(editModal));
editModal.addEventListener("click", handleOverlayClick);

modalCloseTypePreview.addEventListener("click", () => closeModal(previewModal));
previewModal.addEventListener("click", handleOverlayClick);

editFormElement.addEventListener("submit", (e) => {
  if (editFormElement.querySelector(".modal__submit-btn").disabled) {
    e.preventDefault();
  } else {
    handleEditFormSubmit(e);
  }
});
editFormElement.addEventListener("submit", (e) => {
  if (editFormElement.querySelector(".modal__submit-btn").disabled) {
    e.preventDefault();
  } else {
    handleEditFormSubmit(e);
  }
});

[editModalNameInput, editModalDescriptionInput].forEach((input) => {
  input.addEventListener("input", toggleEditSubmitButton);
});


cardModalBtn.addEventListener("click", () => openModal(cardModal));
cardModalCloseBtn.addEventListener("click", () => closeModal(cardModal));
cardModal.addEventListener("click", handleOverlayClick);

cardForm.addEventListener("submit", (e) => handleAddCardSubmit(e));

[cardNameInput, cardLinkInput].forEach((input) => {
  input.addEventListener("input", () => {
    const allValid = cardNameInput.value.trim() && cardLinkInput.value.trim();
    cardSubmitBtn.disabled = !allValid;
    cardSubmitBtn.classList.toggle("modal__submit-btn_disabled", !allValid);
  });
});


