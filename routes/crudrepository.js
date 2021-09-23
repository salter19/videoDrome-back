const { error } = require('console');
const { query } = require('express');
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

// ---- helper functions ----

// get item id
const getID = async(table, col, item) => {
  const id = await connectionFunctions.getItemId(table, col, item);
  return id[0].id; 
}

// get multiple item ids
const getIDs = async(table, col, items) => {

  if (typeof items === 'string') {
    items = splitter(items);
    
  }

  const getMany = async() => {
    const res = await mapArr(items, table, col);
    return res;    
  }

  const getOne = async() => {
    items.push('-');
    const res =  await mapArr(items, table, col);
    return res;
  }

  const arr =  await items.length > 1 ? await getMany() : await getOne();
  
  return arr;
};

// map array for getIDs
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

// ---- THE OBJECT FOR CONNECTION ----
const connectionFunctions = {

  connect: () => {

    const func = async (resolve, reject) => {

      const openConnection = () => {
        try {
          // connection = mysql.createPool(config);
          connection = mysql.createConnection(config);
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

  // convert to OMDB from DB or vice versa
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

  // get all
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

  findMovieByTitleFromDB: (title) => {

    // TODO: decode result into readable format
    
    const func = (resolve, reject) => {
      const _title = `%${title}%`;
      sql = `SELECT * FROM movies WHERE name LIKE ?`;

      const success = (result) => {
        result.length > 0
        ? resolve(JSON.parse(JSON.stringify(result)))
        : reject(status.notFound + ' - not found.');
      }

      const innerFunc = async () => {

        try {
          connection.query(sql, _title, (err, res) => {
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

  findMovieByTitleAndYearFromDB: (title, year) => {

    // TODO: decode result into readable format

    const func = (resolve, reject) => {

      const _title = `%${title}%`
      sql = `SELECT * FROM movies WHERE name LIKE ? AND release_year = ?`;

      const success = (result) => {
        result.length > 0
        ? resolve(JSON.parse(JSON.stringify(result)))
        : reject(status.notFound + ' - not found.');
      }

      const innerFunc = async () => {

        try {
          connection.query(sql, [_title, year], (err, res) => {
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

  // save a movie to DB
  saveToDatabase: (movie) => {

    // TODO: create table items (titles) dynamically from inserted data
    // NOTE: validate new items: no duplicates allowed, if possible check typos / give suggestions

    const func = (resolve, reject) => {

      const innerFunc = async() => {
        const title = 'title';
        const releaseYear = Number(movie.Year);
        const catID = await getID('categories', title, movie.Type).catch(error);
        const formatIDs = await getIDs('formats', title, movie.Formats).catch(error);
        const genreIDs = await getIDs('genres', title, movie.Genre).catch(error);
        const countryIDs = await getIDs('countries', 'name', movie.Country).catch(error);
        const subIDs = await getIDs('subtitles', title, movie.Subs).catch(error);
        const validSubIDs = subIDs.map((e) => {
          if (e < 1 || e > 2) {
            return 3;
          }
          return e;
        })
        
        const valuesToPost = {
          category: catID, 
          name: movie.Title, 
          release_year: releaseYear,
          country_of_origin: countryIDs[0], 
          country_of_origin_2: countryIDs[1],
          subtitle: subIDs[0], 
          subtitle_2: subIDs[1],
          genre: genreIDs[0], 
          genre_2: genreIDs[1],
          format_1: formatIDs[0], 
          format_2: formatIDs[1]
        };

        const marks = '?, '.repeat(10) + '?';
        
        const sql = `INSERT INTO movies SET ?`;

        try {
          const query = connection.query(sql, valuesToPost, (err, res) => {
            err ? 
              reject(status.userErr + ' - Invalid value, could not save movie')
              : resolve(res.insertId);
          });

        } catch (error) {
          reject(status.userErr + ' - Invalid value, movie was not saved.\n' + error);
          
        }
        
        resolve(movie);
      }

      connection ? innerFunc() : reject(serverError);
    }
    return new Promise(func);
  }, 

  // get item id from given table and under a given column
  getItemId: (table, col, item) => {
    const func = async(resolve, reject) => {
      const sql = `SELECT id FROM ${table} WHERE ${col} = ?`;

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

  // save given item into DB
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