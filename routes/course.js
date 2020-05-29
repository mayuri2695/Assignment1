'use strict';


var express = require('express');
var router = express.Router();
var course = require("../worker/course.js");
var courseObj = new course.courseClass();


router.get('/getAllCourses', function (req, res, next) {
  let params = {};
  if (req.query.limit && req.query.offset) {
    params = {
      limit: req.query.limit,
      offset: req.query.offset
    }
  }
  courseObj.fetchAllCourses(params)
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

router.post('/addCourse', function (req, res, next) {
  let params = {
    name: req.body.name,
    popularity: req.body.popularity,
    author: req.body.author,
    difficulty_level: req.body.difficulty_level,
    createdByUser: req.user.username,
    categoryId: req.body.categoryId
  }
  courseObj.addNewCourse(params)
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

router.post('/updateCourseDetails', function (req, res, next) {
  let params = {
    categoryId: req.body.categoryId,
    popularity: req.body.popularity,
    author: req.body.author,
    difficulty_level: req.body.difficulty_level,
    updateByUser: req.user.username,
    id: req.body.id
  }
  courseObj.updateCourseDetails(params)
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

router.post('/deleteCourse', function (req, res, next) {
  let params = {
    id: req.body.id
  }
  courseObj.deleteCourse(params)
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

router.post('/sortCourse', function (req, res, next) {
  let params = {
    sortingParameter: req.body.sortingParameter,
    sortingType: req.body.sortingType
  }
  courseObj.sortCourse(params)
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

router.get('/filterCourseByCategory', function (req, res, next) {
  let params = {
    categoryId: req.query.categoryId
  }
  courseObj.filterCourseByCategory(params)
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

router.get('/filterCourseByNameOrAuthor', function (req, res, next) {
  let params = {
    name: req.query.name
  }
  courseObj.filterCourseByName(params)
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

