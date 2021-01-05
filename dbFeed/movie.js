const splitter = (data) => {
  if (typeof data === 'string') {
    const re = /\s*(?:,|$)\s*/;

    return data.split(re);

  }
}

class Movie {
  constructor(data, isOMDB) {
    console.log('coming from omdb? ' + isOMDB)
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
    this.format = '';
    this.format2 = '';
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
    this.format = data.format;
    this.format2 = data.format2;
    this.actors = splitter(data.actors);
    this.imdbID = data.imdbID;
  }

  getCard() {
    console.log('heres return')
    console.log(this)
    return this;
  }

}

module.exports = Movie;