const path = require('path');
const axios = require('axios');
const config = require(path.join(__dirname, './../dbml/config.js'));


const status = {
  serverErr: 500,
  ok: 200,
  created: 201,
  userErr: 400,
  notFound: 404
}

const baseUrl = `http://www.omdbapi.com/?apikey=${config.omdbApi}`


const connectOMDB = {
  
  connect: (title, year) => {
    const func = async (resolve, reject) => {
      try {     
        const _url = baseUrl + `&t=${title}&y=${year}`;
        const response = await axios.get(_url);
        const data = await response.data;

        console.log(`In connectOMDB with ${data.Title} and ${data.Year}`);
        console.log(data)
        resolve(data);

      } catch (error) {
        reject(status.notFound + ' - not found.')
      }      
    }
    return new Promise(func);
  },

  connectTitle: (title) => {
    const func = async (resolve, reject) => {
      console.log(`here with title ${title}`);
      try {
        console.log(title);
        const _url = baseUrl + `&t=${title}`;
        const response = await axios.get(_url);
        const data = await response.data;

        resolve(data);
      } catch (error) {
        reject(status.notFound + ' - not found.')
      }
    }
    return new Promise(func);
  }
}

module.exports = connectOMDB;