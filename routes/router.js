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

router.get('/:title([A-Za-z0-9_%]+)/:year([0-9]+)', async(req, res) => {
  try {
    const result = await DB.getInsertFromDB(req.params.title, req.params.year);
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

// router.get('/title:([A-Za-z0-9_%]+)', async(req, res) => {
//   try {
//     const result = await DB.g
//   } catch (error) {
//     res.sendStatus(error);
//   }
// })

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