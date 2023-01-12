import { getMovies, getMovieDetail } from './api/api.js';
import { toggleModal, clickCancelBtn, stopLoading } from './modal.js';

const $movies = document.querySelector('ul');
const $searchForm = document.querySelector('form');
const $searchInput = $searchForm.querySelector('input');
const $searchText = document.querySelector('.area-text');
const $searchTextResult = document.querySelector('.text__result');
const $modal = document.querySelector('.modal');
const $modalContent = document.querySelector('.modal-content');

//함수 작명 handler
//movieInfo 객체 지역
//render 함수 기능 최소화

const movieInfo = {
  title: '',
  year: '',
  page: '',
};

const showSearchingText = () => {
  $searchTextResult.innerHTML = `'${movieInfo.title}' 의 검색결과`;
  $searchText.style.display = 'block';
};

const searchMovieHandler = async (event) => {
  event.preventDefault();

  movieInfo.title = $searchInput.value;
  movieInfo.page = 1;
  const movies = await getMovies(movieInfo);

  showSearchingText();
  renderMovies(movies, true);
};

const renderMovies = (movies, isFirst) => {
  if (isFirst) {
    $movies.innerHTML = '';
  }
  movies.Search.forEach((movie) => {
    const $movie = document.createElement('li');
    $movie.className = 'movie-item';

    $movie.innerHTML = `
      <img src='${
        movie.Poster === 'N/A'
          ? 'https://img.icons8.com/windows/512/no-image.png'
          : movie.Poster
      }' alt='${movie.Title}' />
      <h3>${movie.Title}</h3>
    `;
    $movies.append($movie);

    $movie.addEventListener('click', async () => {
      toggleModal();
      const movieDetailInfo = await getMovieDetail(movie.imdbID);
      renderMovieDetail(movieDetailInfo);
    });
  });

  // 무한 스크롤
  (() => {
    const callback = (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          movieInfo.page += 1;

          const movies = await getMovies(movieInfo);
          if (movies.totalResults >= movieInfo.page * 10) {
            renderMovies(movies, false);
          } else {
            io.unobserve(entry.target);
          }
        }
      });
    };

    const io = new IntersectionObserver(callback);
    io.observe(document.querySelector('.movie-item:last-child'));
  })();
};

//영화 상세 페이지 open

const renderMovieDetail = async (movieDetailInfo) => {
  $modalContent.innerHTML = `
      <div class="poster" style="background-image: url(${
        movieDetailInfo.Poster === 'N/A'
          ? 'https://img.icons8.com/windows/512/no-image.png'
          : movieDetailInfo.Poster.replace('SX300', 'SX500')
      }) ;"></div>
      <div class="specs">
        <h2 class="title">${movieDetailInfo.Title}</h2>
        <div class="label">
          <span>${movieDetailInfo.Released} ·</span>
          <span>${movieDetailInfo.Country}</span>
        </div>
        <span>${movieDetailInfo.Genre}</span>
        <div class="director">
          <span>Director</span>
          <span>Director ${movieDetailInfo.Writer}</span>
        </div>
        <div class="rating">
          <span>⭐ ${movieDetailInfo?.Ratings[0]?.Value}</span>
        </div>
      </div>
      <div class="cancel-btn">
        <span class="material-symbols-outlined">close</span>
      </div>
  `;
  const $cancelBtn = document.querySelector('.cancel-btn');
  $cancelBtn.addEventListener('click', clickCancelBtn);

  stopLoading();
};

$modal.addEventListener('click', (event) => {
  if (event.target === event.currentTarget) {
    toggleModal();
    $modalContent.innerHTML = '';
  }
});

$searchForm.addEventListener('submit', searchMovieHandler);
