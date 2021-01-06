const { error } = require('console');
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

  const tmp = splitter(items);

  const getMany = async() => {
    const res = await mapArr(tmp, table, col);
    return res;    
  }

  const getOne = async() => {
    const res =  await mapArr(tmp, table, col);
    return res;
  }

  const arr =  items.length > 1 ? await getMany() : await getOne();
  return arr;
};

const mapArr = async (arr, table, col) => {

  const res = [];

  for (const item of arr) {
    const id = await connectionFunctions.getItemId(table, col, item);
    res.push(id[0].id);
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

    const func = (resolve, reject) => {

      const innerFunc = async() => {
        const title = 'title';
        const catID = await getID('categories', title, article.category).catch(error);
        const formatIDs = await getIDs('formats', title, article.format).catch(error);
        
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

      try {
        connection.query(sql, item, (err, res) => {
          err ? reject(err) : success(res);
        })
      } catch (error) {
        reject(error);
      }
    }
    return new Promise(func);
  }

}

module.exports = connectionFunctions;