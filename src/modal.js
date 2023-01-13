const $modal = document.querySelector('.modal');
const $body = document.querySelector('body');
const $loaderContainer = document.querySelector('.loader__container');

export const startLoading = () => {
  $loaderContainer.classList.add('visible');
};

export const stopLoading = () => {
  $loaderContainer.classList.remove('visible');
};

const toggleBackdrop = () => {
  $modal.classList.toggle('backdrop');
};

const toggleScrolling = () => {
  $body.classList.toggle('stop-scrolling');
};

export const toggleModal = () => {
  $modal.classList.toggle('visible');
  startLoading();
  toggleBackdrop();
  toggleScrolling();
};

export const clickCancelBtnHandler = () => {
  toggleModal();
};
