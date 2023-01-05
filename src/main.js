import { getMovies } from './api.js';

const $movies = document.querySelector('ul');
const $moreBtn = document.querySelector('.more');
const $searchForm = document.querySelector('form');
const $searchInput = $searchForm.querySelector('input');
const $searchText = document.querySelector('.text');
const $searchTextResult = document.querySelector('.text-result');

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

    $movie.innerHTML = `
      <h3>${movie.Title}</h3>
      <img src='${movie.Poster}' alt='${movie.Title}' />
    `;
    $movies.append($movie);
  });

  // 무한 스크롤
  (() => {
    const options = { threshold: 0.2 };

    const callback = (entries, observer) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const movies = await getMovies(movieInfo);
          if (movies.totalResults >= movieInfo.page * 10) {
            renderMovies(movies, false);
            movieInfo.page += 1;
          } else {
            io.unobserve(entry.target);
          }
        }
      });
    };

    const io = new IntersectionObserver(callback, options);
    io.observe(document.querySelector('li:last-child'));
  })();
};
