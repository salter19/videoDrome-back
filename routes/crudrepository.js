const { error } = require('console');
const { get } = require('http');
const mysql = require('mysql');
const path = require('path');
const config = require(path.join(__dirname, './../dbml/config.js'));
const MovieCard = require(path.join(__dirname, './../utils/movie.js'));
const splitter = require('./../utils/splitter');

let connection = null;

config.connectionLimit = 10;

const status = {
  serverErr: 500,
  ok: 200,
  created: 201,
  userErr: 400,
  notFound: 404
}

const serverError = status.serverErr + ' - no connection.';

const getID = async(table, col, item) => {
  const id = await connectionFunctions.getItemId(table, col, item);
  return id[0].id; 
}

const getIDs = async(table, col, items) => {

  if (typeof items === 'string') {
    items = splitter(items);
    
  }

  const getMany = async() => {
    const res = await mapArr(items, table, col);
    return res;    
  }

  const getOne = async() => {
    const res =  await mapArr(items, table, col);
    return res;
  }

  const arr =  await items.length > 1 ? await getMany() : await getOne();
  
  return arr;
};

const mapArr = async (arr, table, col) => {

  const res = [];
  let newID;
  let id; 

  for (let item of arr) {
    if (table === 'genres' || table === 'formats' || table === 'category') {
      item = item.toLowerCase();
    } 
    const idIs = await connectionFunctions.getItemId(table, col, item).catch(error);
   
    if (idIs === undefined) {
      newID = await connectionFunctions.saveNewItem(table, col, item).catch(error);
      id = newID
    } else {
      id = idIs[0].id;
    }
    res.push(id);
  }
  return res;
};

const connectionFunctions = {

  connect: () => {
    const func = async (resolve, reject) => {
      const openConnection = () => {
        try {
          connection = mysql.createPool(config);
          resolve(status.created + ' - Connection created succesfully');
        } catch (error) {
          reject(status.serverErr + ' - Something went wrong with the connection.');
        }
      }

      try {
        connection ? reject(status.ok + ' - You are already connected') : openConnection();        
      } catch (error) {
        reject(status.serverErr + ` - No connection.`);
      }
    }
    return new Promise(func)
  },

  close: () => {
    const func = (resolve, reject) => {
      try {
        connection ? reject(serverError)
        :connection.end(resolve(status.ok + ' - connection closed.'));
      } catch (error) {
        reject(serverError)
      }
    }
    return new Promise(func);
  },

  findAllCategories: () => {
    const func = (resolve, reject) => {
      const innerFunc = async () => {
        const sql = 'SELECT * FROM categories';

        const success = (result) => {
          result.length > 0 
          ? resolve(JSON.parse(JSON.stringify(result)))
          : reject(status.notFound + ' - not found.');
        }
        try {
          connection.query(sql, (err, res) => {
            err ? reject(err) : success(res);
          })
        } catch (error) {
          reject(error);
        }
      }
      connection ? innerFunc() : reject(serverError)
    }
    return new Promise(func);
  },

  createMovieCard: (obj, isOMDB) => {

    const func = (resolve, reject) => {
      const innerFunc = async () => {
        const card = await new MovieCard(obj, isOMDB);
        const result = card.getCard();
        resolve(result);
      }
      connection ? innerFunc() : reject(serverError);
    }
    return new Promise(func);
  },

  saveToDatabase: (article) => {

    console.log(article)
    const func = (resolve, reject) => {

      const innerFunc = async() => {
        const title = 'title';
        const catID = await getID('categories', title, article.category).catch(error);
        const formatIDs = await getIDs('formats', title, article.format).catch(error);
        const genresIDs = await getIDs('genres', title, article.genres).catch(error);
        const countryIDs = await getIDs('countries', title, article.country).catch(error);
        const subIDs = await getIDs('subtitles', title, article.sub).catch(error);
        const validSubIDs = subIDs.map((e) => {
          if (e < 1 || e > 2) {
            return 3;
          }
          return e;
        })
        
        console.log(validSubIDs)
        resolve(article);
      }

      connection ? innerFunc() : reject(serverError);
    }
    return new Promise(func);
  }, 

  getItemId: (table, col, item) => {
    const func = async(resolve, reject) => {
      const sql = `SELECT id FROM ${table} WHERE ${col} = ?`

      const success = (result) => {
        result.length > 0 
        ? resolve(JSON.parse(JSON.stringify(result)))
        : reject(status.notFound + ' - not found.');
      }

      const innerFunc = () => {
        try {
          connection.query(sql, item, (err, res) => {
            err ? reject(err) : success(res);
          })
        } catch (error) {
          reject(error);
        }
      }

      connection ? innerFunc() : reject(serverError);
    }
    return new Promise(func);
  }, 

  saveNewItem: (table, col, item) => {

    const sql = `INSERT INTO ${table} (${col}) VALUES ( ? );`
    const func = (resolve, reject) => {
      const innerFunc = async () => {
        const success = (res) => {
          resolve(res.insertId);
        }
        try {
          connection.query(sql, item, (err, res) => {
            err ? reject(status.userErr + ' - Invalid input.') : success(res);
          })
          
        } catch (error) {
          reject(status.userErr + ' - something went wrong with item save. Invalid value.')
        }
      }
      connection ? innerFunc() : reject(serverError);
    }
    return new Promise(func);
  }

}

module.exports = connectionFunctions;