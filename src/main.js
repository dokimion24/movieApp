import { getMovies, getMovieDetail } from './api/api.js';

const $movies = document.querySelector('ul');
const $moreBtn = document.querySelector('.more');
const $searchForm = document.querySelector('form');
const $searchInput = $searchForm.querySelector('input');
const $searchText = document.querySelector('.area-text');
const $searchTextResult = document.querySelector('.text__result');
const $header = document.querySelector('.header');
const $modal = document.querySelector('.modal');
const $modalContent = $modal.querySelector('.modal-content');
const $body = document.querySelector('body');

const movieInfo = {
  title: '',
  year: '',
  page: '',
};

$searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  movieInfo.title = $searchInput.value;
  movieInfo.page = 1;
  const movies = await getMovies(movieInfo);
  if (movies.Response === 'False') {
    alert(movies.Error);
    movies = [];
  }
  $searchTextResult.innerHTML = `'${movieInfo.title}' 의 검색결과`;
  $searchText.style.display = 'block';

  renderMovies(movies, true);
});

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
      const movieDetailInfo = await getMovieDetail(movie.imdbID);
      openModal(movieDetailInfo);
    });

    $modal.addEventListener('click', (event) => {
      if (event.target === event.currentTarget) {
        $modal.style.display = 'none';
        $body.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        $body.classList.remove('stop-scrolling');
        $modalContent.innerHTML = '';
      }
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
const openModal = (movie) => {
  $modal.style.display = 'block';
  $body.classList.add('stop-scrolling');
  renderMovieDetail(movie);
};

const renderMovieDetail = async (movie) => {
  const movieDetail = await getMovieDetail(movie.imdbID);
  const $movieDetail = document.createElement('div');
  console.log('start');
  $movieDetail.className = 'movie-detail';
  $modalContent.innerHTML = '';
  $movieDetail.innerHTML = `
      <div class="poster" style="background-image: url(${
        movieDetail.Poster === 'N/A'
          ? 'https://img.icons8.com/windows/512/no-image.png'
          : movieDetail.Poster.replace('SX300', 'SX500')
      }) ;"></div>
      <div class="specs">
        <h2 class="title">${movieDetail.Title}</h2> 
        <div class="label">
          <span>${movieDetail.Released} ·</span>
          <span>${movieDetail.Country}</span>
        </div>
        <span>${movieDetail.Genre}</span>
        <div class="director">
          <span>Director</span>
          <span>Director ${movieDetail.Writer}</span>
        </div>
        <div class="rating">
          <span>⭐ ${movieDetail?.Ratings[0]?.Value}</span>
        </div>
      </div>
  `;

  $modalContent.append($movieDetail);
};
