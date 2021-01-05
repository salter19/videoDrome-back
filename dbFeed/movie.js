class Movie {
  constructor(data) {
    this.name = data.Title;
    this.category = data.Type;
    this.genres = data.Genre.split(', ');
    this.year = data.Year;
    this.director = data.Director.split(', ');
    this.country = data.Country.split(', ');
    this.sub = data.Subs.split(', ');
    this.format = '';
    this.format2 = '';
    this.actors = data.Actors.split(', ');
    this.imdbID = data.imdbID;
  }

  getCard() {
    return this;
  }

}

module.exports = Movie;