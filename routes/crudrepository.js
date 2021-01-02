const mysql = require('mysql');
const path = require('path');
const config = require(path.join(__dirname, './../dbml/config.js'));

let connection = null;

config.connectionLimit = 10;
