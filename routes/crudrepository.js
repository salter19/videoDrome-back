const mysql = require('mysql');
const path = require('path');
const config = require(path.join(__dirname, './../dbml/config.js'));
const MovieCard = require(path.join(__dirname, './../dbFeed/movie.js'))

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
          
        }
      }
      connection ? innerFunc() : reject(serverError)
    }
    return new Promise(func);
  },

  createMovieCard: (obj) => {

    const func = (resolve, reject) => {
      const innerFunc = async () => {
        const card = await new MovieCard(obj);
        resolve(status.created + ' -  card created: ' + card._name + ' ');
      }
      connection ? innerFunc() : reject(serverError);
    }
    return new Promise(func);
  }

  

}

module.exports = connectionFunctions;