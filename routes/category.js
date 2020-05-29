'use strict';

var express = require('express');
var router = express.Router();
var category = require("../worker/category.js");
var categoryObj = new category.categoryClass();

router.get('/getAllCategories', function (req, res, next) {
  categoryObj.fetchAllCategories()
    .then(result => {
      var response = {
        data: result
      };
      res.send(response);
    })
    .catch(err => {
      return res.status(400).send(err);
    })
})

router.post('/addCategory', function (req, res, next) {
  let params = {
    categoryName: req.body.categoryName
  }
  categoryObj.addCategories(params)
    .then(result => {
      var response = {
        data: result
      };
      res.send(response);
    })
    .catch(err => {
      return res.status(400).send(err);
    })
})

module.exports = router;

