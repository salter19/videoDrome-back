const splitter = require('./splitter');

class Movie {
  constructor(data, isOMDB) {
    isOMDB ? this.setFromOMDB(data) : this.setFromApp(data);
  }

  setFromOMDB(data) {
    this.name = data.Title;
    this.category = data.Type;
    this.genres = splitter(data.Genre);
    this.year = data.Year;
    this.director = splitter(data.Director);
    this.country = splitter(data.Country);
    this.sub = splitter(data.Subs)
    this.format = splitter(data.Formats);
    this.actors = splitter(data.Actors);
    this.imdbID = data.imdbID;
  }

  setFromApp(data) {
    this.name = data.name;
    this.category = data.category;
    this.genres = splitter(data.genres);
    this.year = data.year;
    this.director = splitter(data.director);
    this.country = splitter(data.country);
    this.sub = splitter(data.sub);
    this.format = splitter(data.Formats);
    this.actors = splitter(data.actors);
    this.imdbID = data.imdbID;
  }

  getCard() {
    return this;
  }

}

module.exports = Movie;


// Title: 'The Matrix',
// Year: '1999',
// Rated: 'R',
// Released: '31 Mar 1999',
// Runtime: '136 min',
// Genre: 'Action, Sci-Fi',
// Director: 'Lana Wachowski, Lilly Wachowski',
// Writer: 'Lilly Wachowski, Lana Wachowski',
// Actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
// Plot: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
// Language: 'English',
// Country: 'United States, Australia',
// Awards: 'Won 4 Oscars. 42 wins & 51 nominations total',
// Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
// Ratings: [
//   { Source: 'Internet Movie Database', Value: '8.7/10' },
//   { Source: 'Rotten Tomatoes', Value: '88%' },
//   { Source: 'Metacritic', Value: '73/100' }
// ],
// Metascore: '73',
// imdbRating: '8.7',
// imdbVotes: '1,748,071',
// imdbID: 'tt0133093',
// Type: 'movie',
// DVD: '15 May 2007',
// BoxOffice: '$171,479,930',
// Production: 'Village Roadshow Prod., Silver Pictures',
// Website: 'N/A',
// Response: 'True'