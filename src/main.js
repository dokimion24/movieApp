import { getMovies } from './api/api.js';

const $movies = document.querySelector('ul');
const $moreBtn = document.querySelector('.more');
const $searchForm = document.querySelector('form');
const $searchInput = $searchForm.querySelector('input');
const $searchText = document.querySelector('.area-text');
const $searchTextResult = document.querySelector('.text__result');

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

  $searchTextResult.innerHTML = `'${movieInfo.title}' 의 검색결과`;
  $searchText.style.display = 'block';

  renderMovies(movies, true);
});

// $moreBtn.addEventListener('click', async () => {
//   movieInfo.page += 1;
//   const movies = await getMovies(movieInfo);
//   if (moviInfo.page * 10 <= movies.totalResults) {
//     renderMovies(movies, false);
//   }
// });

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
  });

  // 무한 스크롤
  (() => {
    const callback = (entries, observer) => {
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
