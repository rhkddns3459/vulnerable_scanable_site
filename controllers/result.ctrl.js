const router = require("express");
const mysql = require("mysql2");
const user = require("../models/users");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'diss'
  });
  db.connect();

  const scanResultList = async(req, res) => {
    let userEmail = req.email;
    db.query('SELECT * FROM scan WHERE scanUserEmail = ? ORDER BY scanID DESC', [userEmail], function(err, result) {
        const uniqueMap = {};
        const dataList = [];

        for (const diss of result) {
            if (!uniqueMap[diss.scanID]) {
                uniqueMap[diss.scanID] = true;
                dataList.push(diss);
            }
        };

        res.json(dataList);
    })
}

  const scanResult = async(req ,res) => {
    let scanId = req.params.scanId;
    db.query('SELECT * FROM scan WHERE scanId = ?', [scanId], function(err, result){
        var dataList = [];
        for (var diss of result){
            dataList.push(diss)
        };
        res.json(dataList);
    });
}



module.exports = {
    scanResultList,
    scanResult,
}
