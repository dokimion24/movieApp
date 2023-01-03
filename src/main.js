const $movies = document.querySelector('ul');
const $moreBtn = document.querySelector('.more');
const $searchForm = document.querySelector('form');
const $input = $searchForm.querySelector('input');
const $searchBtn = $searchForm.querySelector('button');

const search = {
  title: '',
  year: '',
  page: '',
};

// searchformEl.addEventListener('input', () => {
//   searchText = inputEl.value;
// });

$searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  search.title = $input.value;
  search.page = 1;
  const movies = await getMovies();
  console.log(movies);
  console.log(search);
  renderMovies(movies, true);
});

$moreBtn.addEventListener('click', async () => {
  search.page++;
  const movies = await getMovies();
  if (search.page * 10 <= movies.totalResults) {
    renderMovies(movies, false);
  }
});

const movies = [];

// 검색 영화 가져오기
const getMovies = async () => {
  const s = `&s=${search.title}`;
  const y = `&y=${search.year}`;
  const p = `&page=${search.page}`;
  const res = await fetch(`https://omdbapi.com/?apikey=7035c60c${s}${y}${p}`);
  const json = await res.json();
  if (json.Response === 'True') {
    const { Search, totalResults } = json;
    return {
      Search,
      totalResults,
    };
  }
  return json.Error;
};

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
