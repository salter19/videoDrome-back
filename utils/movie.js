const splitter = require('./splitter');

class Movie {
  constructor(data, isOMDB) {
    isOMDB ? this.setFromOMDB(data) : this.setFromOMDB(data);
  }

  setFromOMDB(data) {
    this.Title = data.Title;
    this.Type = data.Type;
    this.Genre = splitter(data.Genre);
    this.Year = data.Year;
    this.Director = splitter(data.Director);
    this.Country = splitter(data.Country);
    this.Subs = splitter(data.Subs)
    this.Formats = splitter(data.Formats);
    this.Actors = splitter(data.Actors);
    this.imdbID = data.imdbID;
  }

  getCard() {
    return this;
  }

}

module.exports = Movie;