const $modal = document.querySelector('.modal');
const $body = document.querySelector('body');
const $loaderContainer = document.querySelector('.loader__container');

const startLoading = () => {
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

// 취소 버튼 핸들러
export const clickCancelBtnHandler = () => {
  toggleModal();
};
