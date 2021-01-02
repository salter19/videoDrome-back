const path = require('path');
const DB =  require(path.join(__dirname, './routes/crudrepository.js'));
const EXPRESS = require('express');
const APP = EXPRESS();
const CORS = require('cors');

APP.use(CORS());

const port = 8080;


const server = APP.listen(port, async () => {
  try {
    await DB.connect();
    console.log(`Listening on port ${server.address().port}`);
  } catch (err) {
    console.log(err + ' catch here');
    await DB.close();
    server.close();
  }
});