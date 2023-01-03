const inputEl = document.querySelector('input');
const buttonEl = document.querySelector('button');
const moviesEl = document.querySelector('ul');
const moreEl = document.querySelector('.more');

let searchText = '';
let pageNumber = 1;

inputEl.addEventListener('input', () => {
  searchText = inputEl.value;
});

buttonEl.addEventListener('click', async () => {
  const movies = await getMovies();
  const { Search } = movies;
  console.log(Search);

  renderMovies(Search, true);
});

moreEl.addEventListener('click', async () => {
  const movies = await getMovies();
  const { Search, totalResults } = movies;

  renderMovies(Search, false);
});

let movies = [];

const getMovies = async () => {
  const res = await fetch(
    `https://omdbapi.com/?apikey=7035c60c&s=${searchText}&page=${pageNumber}`
  );
  const json = await res.json();
  return json;
};

const renderMovies = (movies, isFirst) => {
  const movieEls = movies.map((movie) => {
    const { Title, Year, Type, Poster } = movie;
    const movieEl = document.createElement('li');
    const titleEl = document.createElement('h3');
    const posterEl = document.createElement('img');

    titleEl.textContent = Title;
    posterEl.src = Poster;
    movieEl.append(titleEl, posterEl);
    return movieEl;
  });

  if (isFirst) {
    moviesEl.innerHTML = '';
  }
  moviesEl.append(...movieEls);
};
