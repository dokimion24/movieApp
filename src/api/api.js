const getMovies = async (movieInfo) => {
  console.log(movieInfo);
  const s = `&s=${movieInfo.title}`;
  const y = `&y=${movieInfo.year}`;
  const p = `&page=${movieInfo.page}`;
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

export { getMovies };
