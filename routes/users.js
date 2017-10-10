"use strict";
var express = require('express');
var router = express.Router();
var userChecker = require('../helper/userChecker');
const passwordHash = require('password-hash');

module.exports = function(db) {



  router.get('/', userChecker, function(req, res, next) {
    db.query(`SELECT * FROM users WHERE userid = ${req.session.user.userid}`, (err, data) => {
      res.render('users/profile', { title: 'user profile', page: "profile", user:req.session.user, item: data.rows[0]});
    })
  });

  router.post('/', userChecker, function(req, res) {
    console.log("router(/profile), method(post), req.body: ");
    console.log(req.body);
    let email = req.body.email;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let role = req.body.role;
    let isFullTime = (req.body.isfulltime ? true : false);
    let sqlQuery = '';
    console.log("isfulltime:", isFullTime);
    console.log("password:", password);

    //getting fn, ln, ft data

    req.session.user.firstname = firstname
    req.session.user.lastname = lastname
    req.session.user.role = role
    req.session.user.isfulltime = isFullTime

    if(req.body.password) {
      password = passwordHash.generate(req.body.password);
      sqlQuery = `UPDATE users SET password = '${password}', firstname = '${firstname}',
      lastname = '${lastname}', role = '${role}', isfulltime = ${isFullTime} WHERE
      email = '${email}'`;
      db.query(sqlQuery);
      res.redirect('/projects')
    } else {
      sqlQuery = `UPDATE users SET firstname = '${firstname}',
      lastname = '${lastname}', role = '${role}', isfulltime = ${isFullTime} WHERE
      email = '${email}'`;
      db.query(sqlQuery);
      res.redirect('/projects')
    }
  });
  return router;
}
