const EXPRESS = require('express');
const path = require('path');
const DB = require(path.join(__dirname, './crudrepository.js'));
const omdb = require(path.join(__dirname, './connectOMDB.js'));
// const Movie = require(path.join(__dirname, './../dbFeed/movie.js'));

// create router
const router = EXPRESS.Router();
router.use(EXPRESS.json());

// helper func for cardCreation
const createCard = async(res, result) => {

  if (result.Title) {
    result.Subs = '-';
    result.Formats = 'dvd';

    try {   
      const movieCard = await DB.createMovieCard(result, true);
      res.send(movieCard);
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send('404 - movie not found');
  }
}

// get all category entries from database
router.get('/categories/', async (req, res) => {
  try {
    const result = await DB.findAllCategories();
    res.send(result);
  } catch (error) {
    res.send(error + 'could not fetch categories');
  }
});


router.get(`/omdb/:title([A-Za-z0-9_%]+)`, async(req, res) => {
  try {
    const result = await omdb.connectTitle(req.params.title);
    const card = await createCard(res, result);

    card ? res.send('card created') : res.send('400 - could not create card');

  } catch (error) {
    res.send(error);
  }
});

router.get('/omdb/:title([A-Za-z0-9_%]+)/:year([0-9]+)', async(req, res) => {
  try {
    const result = await omdb.connect(req.params.title, req.params.year);
    const card = await createCard(res, result);
    
    card ? res.send('card created') : res.send('400 - could not create card');

  } catch (error) {
    res.send(error);
  }
});

router.post('/', async(req, res) => {
  try {
    const result = await DB.saveToDatabase(req.body);

    result ? res.send('201 - created!') : res.send('500 - error occured');
    
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;