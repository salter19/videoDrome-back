const EXPRESS = require('express');
const path = require('path');
const DB = require(path.join(__dirname, './crudrepository.js'));
const omdb = require(path.join(__dirname, './connectOMDB.js'));

// create router
const router = EXPRESS.Router();
router.use(EXPRESS.json());

const error_msg = {
  server_err: '500 - database not found',
  unknown_err: '400 - invalid input, something went wrong', 
  not_found_err: '404 - movie not found'
};

// helper func for card creation regarding OMDB results
const createCardFromOMDBItem = async(result) => {

  if (result.Title) {
    result.Subs = '-';
    result.Formats = 'dvd';
    
    try {   
      const movieCard = await DB.createMovieCard(result, true);
      return movieCard;

    } catch (error) {
      return error_msg.unknown_err;
    }
  } else {
    return error_msg.not_found_err;
  }
}

// ---- DB getters ----

// get all category entries from database
router.get('/categories/', async (req, res) => {
  try {
    const result = await DB.findAllCategories();
    res.send(result);

  } catch (error) {
    res.send(`${error_msg.server_err}\n${error}`);
  }
});


// get movie by title from database
router.get(`/:title([A-Za-z0-9_%]+)/`, async(req, res) => {
  try {

    // check local database
    const result = await DB.findMovieByTitleFromDB(req.params.title);

    // return result
    res.send(result);

  } catch (error) {

    // if connection fails, return error msg
    res.send(`${error_msg.server_err}\n${error}`)
  }
});

// get movie by title and year from database
router.get(`/:title([A-Za-z0-9_%]+)/:year([0-9]+)`, async(req, res) => {
  try {

    // check local database
    const result = await DB.findMovieByTitleAndYearFromDB(req.params.title, req.params.year);

    // send result
    res.send(result);

  } catch (error) {
    res.send(`${error_msg.server_err}\n${error}`)
  }
});

// ---- OMDB getters ----
// get with title
router.get(`/omdb/:title([A-Za-z0-9_%]+)`, async(req, res) => {
  try {
    const result = await omdb.connectTitle(req.params.title);

    // convert result into movie card for future handling
    const card = await createCardFromOMDBItem(result);

    // return movie card
    res.send(card);

  } catch (error) {
    res.send(`${error_msg.server_err}\n${error}`);
  }
});

// get with title and year
router.get('/omdb/:title([A-Za-z0-9_%]+)/:year([0-9]+)', async(req, res) => {
  try {
    const result = await omdb.connect(req.params.title, req.params.year);

    // convert result into movie card for future handling
    const card = await createCardFromOMDBItem(result);

    // return movie card
    res.send(card);
    
  } catch (error) {
    res.send(`${error_msg.server_err}\n${error}`;
  }
});

// ---- Post to DB ----
router.post('/', async(req, res) => {
  try {
    const result = await DB.saveToDatabase(req.body);

    console.log(result)

    result ? res.send('201 - created!') : res.send(error_msg.unknown_err);
    
  } catch (error) {
    res.send(`${error_msg.server_err}\n${error}`);
  }
});

module.exports = router;