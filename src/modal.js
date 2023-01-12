const $modal = document.querySelector('.modal');
const $body = document.querySelector('body');
const $loaderWrap = document.querySelector('.loader-wrap');

const startLoading = () => {
  $loaderWrap.classList.add('visible');
};

export const stopLoading = () => {
  $loaderWrap.classList.remove('visible');
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

export const clickCancelBtn = () => {
  toggleModal();
};
