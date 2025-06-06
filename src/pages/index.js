import {
  enableValidation,
  resetValidation,
  disableButton,
  settings,
} from "../scripts/validation.js";

import "./index.css";

import logo from "../images/logo.svg";

import avatar from "../images/avatar.jpg";

import edit from "../images/edit.svg";

import plus from "../images/plus.svg";

//card images and captions that are posted on the page
const initialCards = [
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

console.log(initialCards);

const logoElement = document.querySelector(".header__logo");
logoElement.src = logo;

const avatarElement = document.querySelector(".profile__avatar");
avatarElement.src = avatar;

const editElement = document.querySelector(".profile__edit-btn");
editElement.src = edit;

const plusElement = document.querySelector(".profile__add-btn");
plusElement.src = plus;

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const cardImageLink = document.querySelector(".card__image");
const cardCaption = document.querySelector(".card__title");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close");
const cardModalLinkInput = cardModal.querySelector("#card-link-input");
const cardModalCaptionInput = cardModal.querySelector("#card-name-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageElement = previewModal.querySelector(".modal__image");
const previewModalCaptionElement =
  previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close_type_preview"
);

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

//card information
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-btn");
  const cardDelete = cardElement.querySelector(".card__delete");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-btn_liked");
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageElement.src = data.link;
    previewModalCaptionElement.textContent = data.name;
    previewModalImageElement.alt = data.name;
  });

  cardDelete.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

//function to open the modal
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

//function to close the modal once the "x" is clicked
function closeModal(modal) {
  modal.classList.remove("modal_opened");
  // Remove Escape key listener when no modals are open

  document.removeEventListener("keydown", handleEscapeKey);
}

// Function to handle Escape key
function handleEscapeKey(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal.modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

// Function to close the modal when clicking on the overlay
function closeModalOnOverlayClick(modal) {
  modal.addEventListener("mousedown", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
}
// Add overlay click functionality for each modal
[editModal, cardModal, previewModal].forEach((modal) => {
  closeModalOnOverlayClick(modal);
});

//Saves any profile changes once the user edits the profile
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

//Save the new post information, user can add images and add captions for the images
function handlePostFormSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: cardModalCaptionInput.value,
    link: cardModalLinkInput.value,
  };

  const cardElement = getCardElement(inputValues);
  cardList.prepend(cardElement);

  cardForm.reset();

  disableButton(cardSubmitBtn, settings);
  closeModal(cardModal);
}

//Once edit profile is clicked the modal will open
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent.trim();
  editModalDescriptionInput.value = profileDescription.textContent.trim();
  //optional
  resetValidation(editFormElement, settings);
  openModal(editModal);
});

//To close edit profile
editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

//Once new post is clicked the modal will be opened
cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

//To close the new post modal
cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

//To close the preview image
previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

//To save edit profile and new post information
editFormElement.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handlePostFormSubmit);

//adds the new card to the front of the list
initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardList.prepend(cardElement);
});

enableValidation(settings);
