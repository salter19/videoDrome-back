const EXPRESS = require('express');
const path = require('path');
const DB = require(path.join(__dirname, './crudrepository.js'));
const omdb = require(path.join(__dirname, './connectOMDB.js'));

// create router
const router = EXPRESS.Router();
router.use(EXPRESS.json());

// helper func for cardCreation
const createCard = async(result) => {

  if (result.Title) {
    result.Subs = '-';
    result.Formats = 'dvd';
    
    try {   
      const movieCard = await DB.createMovieCard(result, true);
      return movieCard;
    } catch (error) {
      return '404 - movie not found';
    }
  } else {
    return '404 - movie not found';
  }
}

// ---- DB getters ----

// get all category entries from database
router.get('/categories/', async (req, res) => {
  try {
    const result = await DB.findAllCategories();
    res.send(result);
  } catch (error) {
    res.send(error + 'could not fetch categories');
  }
});


// get movie by title from database
router.get(`/:title([A-Za-z0-9_%]+)/`, async(req, res) => {
  try {
    title = req.params.title
    console.log(`about to search ${title} from DB`);
    const result = await DB.findMovieByTitleFromDB(title);
    console.log(result)
    res.send(result);

  } catch (error) {
    res.send(error)
  }
});

// get movie by title and year from database
router.get(`/:title([A-Za-z0-9_%]+)/:year([0-9]+)`, async(req, res) => {
  try {
    title = req.params.title
    year = req.params.year
    const result = await DB.findMovieByTitleAndYearFromDB(title, year);
    console.log(`${title} from ${year}`);
    console.log(result);
    res.send(result);

  } catch (error) {
    res.send(error)
  }
});

// ---- OMDB getters ----
router.get(`/omdb/:title([A-Za-z0-9_%]+)`, async(req, res) => {
  try {
    console.log("in the router")
    const result = await omdb.connectTitle(req.params.title);
    const card = await createCard(result);
    res.send(card);

  } catch (error) {
    res.send(error);
  }
});

router.get('/omdb/:title([A-Za-z0-9_%]+)/:year([0-9]+)', async(req, res) => {
  try {
    const result = await omdb.connect(req.params.title, req.params.year);
    const card = await createCard(res, result);
    res.send(card);
  } catch (error) {
    res.send(error);
  }
});

// ---- Post to DB ----
router.post('/', async(req, res) => {
  try {
    const result = await DB.saveToDatabase(req.body);

    console.log(result)
    result ? res.send('201 - created!') : res.send('500 - error occured');
    
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;