const getMovies = async (moveInfo) => {
  console.log(moveInfo);
  const s = `&s=${moveInfo.title}`;
  const y = `&y=${moveInfo.year}`;
  const p = `&page=${moveInfo.page}`;
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
