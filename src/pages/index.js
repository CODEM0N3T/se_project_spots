//new branch test
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

import Api from "../utils/Api.js";

import { saveButtonText, setButtonText } from "../utils/helpers.js";

//card images and captions that are posted on the page
// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "af55dabc-a2a8-47d2-ba72-0d3ca8cfac83",
    "Content-Type": "application/json",
  },
});

//Destructure the secong item in the callback of the .then()
api
  .getAppInfo()
  .then(([cards, user]) => {
    api.userId = user._id;
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
    avatarElement.src = user.avatar;

    cards.forEach((item) => {
      const cardElement = getCardElement(item, user._id);
      cardList.prepend(cardElement);
    });
  })
  .catch(console.error);

//Selectors - Here I selected elements in order to add functionality
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
const avatarModalButton = document.querySelector(".profile__avatar-btn");
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

//Avatar form element
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close");
const avatarModalLinkInput = avatarModal.querySelector("#profile-avatar-input");

//Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close");
const deleteModalCancelBtn = deleteForm.querySelector(".modal__cancel-btn");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageElement = previewModal.querySelector(".modal__image");
const previewModalCaptionElement =
  previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close_type_preview"
);

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

//This fuction checks if the like button is active or not, and changes the status when clicked
function handleLike(evt, id) {
  evt.preventDefault();

  const likeButton = evt.target;

  const isLiked = likeButton.classList.contains("card__like-btn_liked");

  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      likeButton.classList.toggle("card__like-btn_liked", !isLiked);
    })
    .catch(console.error);
}

//card information
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  0;
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-btn");
  const cardDelete = cardElement.querySelector(".card__delete");

  const isLiked = data.isLiked || false;

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  if (isLiked) {
    cardLikeButton.classList.add("card__like-btn_liked");
  } else {
    cardLikeButton.classList.remove("card__like-btn_liked");
  }

  cardLikeButton.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageElement.src = data.link;
    previewModalCaptionElement.textContent = data.name;
    previewModalImageElement.alt = data.name;
  });

  cardDelete.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data._id)
  );

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

  const saveButton = evt.submitter;
  setButtonText(saveButton, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      // done TODO - Use data argument instead of the input values
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(saveButton, false);
    });
}

//Save the new post information, user can add images and add captions for the images
function handlePostFormSubmit(evt) {
  evt.preventDefault();
  const saveButton = evt.submitter;
  setButtonText(saveButton, true);

  const inputValues = {
    name: cardModalCaptionInput.value,
    link: cardModalLinkInput.value,
  };

  api
    .createCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data); // includes _id
      cardList.prepend(cardElement);
      cardForm.reset();
      disableButton(cardSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(saveButton, false);
    });
}

//handles profile picture link submission
function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const saveButton = evt.submitter;
  setButtonText(saveButton, true);

  api
    .editAvatarInfo(avatarModalLinkInput.value)
    .then((data) => {
      avatarElement.src = data.avatar;
      avatarForm.reset();
      disableButton(avatarSubmitBtn, settings);
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(saveButton, false);
    });
}

//after the delete modal is open, Delete button submission
function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const deleteButton = evt.submitter;
  setButtonText(deleteButton, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId) // pass the ID the the api function
    .then(() => {
      // remove the card from the DOM
      selectedCard.remove();

      // close the modal
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteButton, false, "Delete", "Deleting...");
    });
}

//handles when the user clicks on delete button on the card, in or der to open the selete modal
function handleDeleteCard(cardElement, cardId) {
  //evt.target.closest(".card").remove();

  selectedCard = cardElement;
  selectedCardId = cardId;
  console.log(cardId);
  openModal(deleteModal);
}

//Once edit profile is clicked the modal will open
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent.trim();
  editModalDescriptionInput.value = profileDescription.textContent.trim();
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

//Eventlisteners after selecting the element, to add functionality to buttons
//To close the new post modal
cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

//To close the preview image
previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

//To save edit profile and new post information
editFormElement.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handlePostFormSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
enableValidation(settings);
