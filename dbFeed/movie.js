class Movie {
  constructor(data) {
    this._name = data.Title;
    this._category = data.Type;
    this._genres = data.Genre.split(', ');
    this._year = data.Year;
    this._director = data.Director.split(', ');
    this._country = data.Country.split(', ');
    this._sub = '';
    this._sub2 = '';
    this._format = '';
    this._format2 = '';
    this._actors = data.Actors.split(', ');
  }

  getCard() {
    return this;
  }

}

module.exports = Movie;