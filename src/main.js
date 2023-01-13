import { getMovies, getMovieDetail } from './getMovieData.js';
import { toggleModal, clickCancelBtnHandler, stopLoading } from './modal.js';

const $searchForm = document.querySelector('form');
const $searchInput = $searchForm.querySelector('input');
const $searchTextResult = document.querySelector('.search--result');
const $modal = document.querySelector('.modal');
const $modalContent = document.querySelector('.modal__content');
const $movieContainer = document.querySelector('main div');

const $moviList = document.querySelector('ul');
const $movieItems = document.querySelectorAll('movie__tiem');

//함수 작명 handler
//movieInfo 객체 지역
//render 함수 기능 최소화

const movieInfo = {
  title: '',
  year: '',
  page: '',
};

const clearSearchInput = () => {
  $searchInput.value = '';
};

const clearSearchMovie = () => {
  $moviList.innerHTML = '';
};

const clearMovieDetail = () => {
  $modalContent.innerHTML = '';
};

const deleteMovieListUI = () => {
  $movieContainer.classList.remove('movie__container');
};

const showSearchText = (num) => {
  if (num) {
    $searchTextResult.innerHTML = `'${movieInfo.title}' 의 검색결과 ${num}개 검색되었습니다.`;
  } else {
    $searchTextResult.innerHTML = `검색 결과가 없습니다.`;
  }
};

// 무한 스크롤
const scrollInfinity = () => {
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
  io.observe(document.querySelector('.movie__item:last-child'));
};

//영화 검색 핸들러
const searchMovieHandler = async (event) => {
  event.preventDefault();
  clearSearchMovie();

  movieInfo.title = $searchInput.value.trim();
  movieInfo.page = 1;

  if (movieInfo.title === '') {
    alert('영화 제목을 입력하세요');
    deleteMovieListUI()
    showSearchText(false)
    return;
  }
  if (movieInfo.title.length < 3) {
    alert('3글자 이상 입력하세요');
    showSearchText(false)
    deleteMovieListUI()
    return;
  }

  const movies = await getMovies(movieInfo);
  console.log(movies);
  if (movies.Response === 'False') {
    showSearchText(movies.totalResults);
    deleteMovieListUI();
    alert('검색 결과가 없습니다');
    return;
  }

  showSearchText(movies.totalResults);
  $movieContainer.classList.add('movie__container');
  renderMovies(movies);
  clearSearchInput();
};

const renderMovies = (movies) => {
  movies.Search.forEach((movie) => {
    const $movie = document.createElement('li');
    $movie.className = 'movie__item';
    $movie.innerHTML = `
      <img src='${
        movie.Poster === 'N/A'
          ? '../img/no-image.png'
          : movie.Poster
      }' alt='${movie.Title}' />
      <div class="movie__item--info">
        <h3>${movie.Title}</h3>
      </div>
    `;
    $moviList.append($movie);

    $movie.addEventListener('click', async () => {
      toggleModal();
      const movieDetailInfo = await getMovieDetail(movie.imdbID);
      renderMovieDetail(movieDetailInfo);
    });
  });

  scrollInfinity();
};

//영화 상세 페이지 render
const renderMovieDetail = async (movieDetailInfo) => {
  $modalContent.innerHTML = `
      <div class="poster" style="background-image: url(${
        movieDetailInfo.Poster === 'N/A'
          ? '../img/no-image.png'
          : movieDetailInfo.Poster.replace('SX300', 'SX500')
      }) ;"></div>
      <div class="specs">
        <h2 class="title">${movieDetailInfo.Title}</h2>
        <div class="label">
          <span>${movieDetailInfo.Released} ·</span>
          <span>${movieDetailInfo.Country}</span>
        </div>
        <div class="plot">${movieDetailInfo.Plot}</div>
        <div class="genre">
          <div class="blod">Genre</div>
          <span>${movieDetailInfo.Genre}</span>
        </div>
        <div class="director">
          <div class="blod">Director</div>
          <span>${movieDetailInfo.Writer}</span>
        </div>
        <div class="rating">
          <div class="blod">Rating</div>
          <span>⭐ ${movieDetailInfo?.Ratings[0]?.Value}</span>
        </div>
      </div>
      <div class="cancel-btn">
        <span class="material-symbols-outlined">close</span>
      </div>
  `;
  const $cancelBtn = document.querySelector('.cancel-btn');
  $cancelBtn.addEventListener('click', clickCancelBtnHandler);

  stopLoading();
};

$modal.addEventListener('click', (event) => {
  if (event.target === event.currentTarget) {
    toggleModal();
    clearMovieDetail();
  }
});

$searchForm.addEventListener('submit', searchMovieHandler);
