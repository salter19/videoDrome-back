const EXPRESS = require('express');
const path = require('path');
const DB = require(path.join(__dirname, './crudrepository.js'));
const omdb = require(path.join(__dirname, './connectOMDB.js'));
// const Movie = require(path.join(__dirname, './../dbFeed/movie.js'));

// create router
const router = EXPRESS.Router();
router.use(EXPRESS.json());

// get all category entries from database
router.get('/categories/', async (req, res) => {
  try {
    const result = await DB.findAllCategories();
    res.send(result);
  } catch (error) {
    res.send(error + 'could not fetch categories');
  }
});

// get omdb stuff
router.get('/omdb/', async (req, res) => {
  try {
    const result = await omdb.connect();
    // const movie = new Movie(result);
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

router.get('/omdb/:title([A-Za-z0-9_%]+)/:year([0-9]+)', async(req, res) => {
  try {
    const result = await omdb.connect(req.params.title, req.params.year);
    DB.createMovieCard(result);
    res.send('Done!');
  } catch (error) {
    res.send(error);
  }
})

module.exports = router;