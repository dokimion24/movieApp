import { getMovies } from './api.js';

const $movies = document.querySelector('ul');
const $moreBtn = document.querySelector('.more');
const $searchForm = document.querySelector('form');
const $input = $searchForm.querySelector('input');
const $searchBtn = $searchForm.querySelector('button');
const $searchText = document.querySelector('.search-result');

const moveInfo = {
  title: '',
  year: '',
  page: '',
};

$searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  moveInfo.title = $input.value;
  moveInfo.page = 1;

  const movies = await getMovies(moveInfo);

  $searchText.innerHTML = `'${moveInfo.title}' 의 검색결과`;
  $searchText.style.display = 'none';

  renderMovies(movies, true);
});

$moreBtn.addEventListener('click', async () => {
  moveInfo.page += 1;
  const movies = await getMovies(moveInfo);
  if (moveInfo.page * 10 <= movies.totalResults) {
    renderMovies(movies, false);
  }
});

const movies = [];

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
};
