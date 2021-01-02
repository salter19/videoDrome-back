const EXPRESS = require('express');
const path = require('path');
const DB = require(path.join(__dirname, './crudrepository.js'));

// create router
const router = EXPRESS.Router();
router.use(EXPRESS.json());

// get all category entries from database
router.get('/categories/', async (req, res) => {
  try {
    const result = await DB.findAllCategories();
    res.send(result);
  } catch (error) {
    res.statusCode(500);
    res.send(error + 'could not fetch categories');
  }
});