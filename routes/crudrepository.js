const mysql = require('mysql');
const path = require('path');
const config = require(path.join(__dirname, './../dbml/config.js'));

let connection = null;

config.connectionLimit = 10;

const status = {
  serverErr: 500,
  ok: 200,
  created: 201,
  userErr: 400,
  notFound: 404
}

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
  }
}

module.exports = connectionFunctions;