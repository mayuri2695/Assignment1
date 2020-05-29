const { Course, CourseCategoryMapping, Category } = require('../sequelize')
const _ = require('underscore');
var Sequelize = require('sequelize');

class Courses {
  Courses() {

  }
  // fetch category list
  fetchAllCourses(params) {
    let finalResponse;
    return new Promise(function (resolve, reject) {
      Course.findAll({
        offset: params.offset ? parseInt(params.offset) : null,
        limit: params.limit ? parseInt(params.limit) : null,
        include: [
          {
            model: CourseCategoryMapping
          }
        ]
      })
        .then(function (result) {
          finalResponse = result;
          let categoryIds = [];
          _.each(finalResponse, function (item) {
            //pluck all the category id
            _.each(item.course_category_mappings, function (categoryMapping) {
              categoryIds.push(categoryMapping.categoryId)
            });
          });
          return Category.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: categoryIds
              }
            }
          });
        })
        .then(result => {
          let data = [];
          _.each(finalResponse, function (item) {
            let category = [];
            let categoryArray = [];
            _.each(item.course_category_mappings, function (categoryMapping) {
              category.push(categoryMapping.categoryId)
            });
            //find the name of category
            _.each(category, function (categoryId) {
              _.filter(result, function (item) {
                if (item.id == categoryId) {
                  categoryArray.push(item.categoryName);
                  return item.categoryName;
                }
              });
            });
            let object = {}
            object.id = item.id;
            object.popularity = item.popularity;
            object.author = item.author;
            object.difficulty_level = item.difficulty_level;
            object.name = item.name
            object.category = categoryArray
            data.push(object);
          })
          return resolve(data);
        })
        .catch(function (err) {
          return reject(err);
        });
    })
  }

  // add new course
  addNewCourse(params) {
    return new Promise(function (resolve, reject) {
      let p1 = Promise.resolve();
      p1
        .then(function () {
          if (!params.name) {
            return Promise.reject({ error: "Course Name is Mandatory" });
          }
          if (!params.author) {
            return Promise.reject({ error: "Author is Mandatory" });
          }
          else {
            return Course.create({
              name: params.name,
              popularity: params.popularity,
              author: params.author,
              difficulty_level: params.difficulty_level,
              createdByUser: params.userName
            });
          }
        })
        .then(result => {
          return CourseCategoryMapping.create({
            categoryId: params.categoryId,
            courseId: result.id
          })
        })
        .then(function () {
          let response = {
            message: "Course created successfully"
          };
          return resolve(response);
        })
        .catch(err => {
          console.error(err);
          return reject(err);
        });
    });
  }

  // update course details
  updateCourseDetails(params) {
    return new Promise(function (resolve, reject) {
      let objectToBeUpdate = {
        updateByUser: params.userName
      };
      if (params.popularity) {
        objectToBeUpdate.popularity = params.popularity;
      };
      if (params.author) {
        objectToBeUpdate.author = params.author;
      };
      if (params.popularity) {
        objectToBeUpdate.popularity = params.popularity;
      };
      if (params.difficulty_level) {
        objectToBeUpdate.difficulty_level = params.difficulty_level;
      };
      if (params.categoryId) {
        objectToBeUpdate.categoryId = params.categoryId;
      };
      Course.update(objectToBeUpdate, {
        where: {
          id: params.id,
        }
      })
        .then(result => {
          return CourseCategoryMapping.findOne({
            where: {
              courseId: params.id,
              categoryId: params.categoryId
            }
          });
        })
        .then(result => {
          if (result) {
            return Promise.resolve();
          } else {
            return CourseCategoryMapping.create({
              courseId: params.id,
              categoryId: params.categoryId
            })
          }
        })
        .then(function () {
          return resolve({ sucess: true })
        })
        .catch(err => {
          console.error(err);
          return reject(err);
        });
    });
  }

  //delete course 
  deleteCourse(params) {
    return new Promise(function (resolve, reject) {
      let courseData;
      CourseCategoryMapping.destroy({
        where: {
          courseId: params.id
        }
      })
        .then(function () {
          return Course.destroy({
            where: {
              id: params.id
            }
          })
        })
        .then(function (deletedData) {
          var response = {
            status: 200,
            message: 'sucess',
            data: deletedData
          }
          return resolve(response)
        }).catch(function (err) {
          var errorResponse = {
            status: 500,
            message: 'error',
            data: err
          }
          return reject(errorResponse)
        });
    });
  }

  //sort course
  sortCourse(params) {
    return new Promise(function (resolve, reject) {
      let p1 = Promise.resolve();
      let orderClause = [];
      p1
        .then(function () {
          if (!params.sortingParameter || !params.sortingType) {
            return Promise.reject({ error: "sorting type and sorting paramter is mandatory" });
          }
          if (params.sortingParameter == 'name' || params.sortingParameter == 'difficulty_level' || params.sortingParameter == 'author' || params.sortingParameter == 'popularity' || params.sortingParameter == 'id') {
            orderClause.push(params.sortingParameter);
            orderClause.push(params.sortingType);
          } else {
            return Promise.reject({ error: "invalid sorting paramter" });

          }
          return Course.findAll({
            limit: params.limit,
            offset: params.offset,
            order: [orderClause],
          });
        })
        .then(resolve)
        .catch(reject)
    });
  }

  filterCourseByCategory(params) {
    return new Promise(function (resolve, reject) {
      CourseCategoryMapping.findAll({
        offset: parseInt(params.offset) ? parseInt(params.offset) : null,
        limit: parseInt(params.limit) ? parseInt(params.limit) : null,
        where: {
          categoryId: params.categoryId
        }
      })
        .then(result => {
          let courseIds = _.pluck(result, 'courseId');
          return Course.findAll({
            where: {
              id: {
                [Sequelize.Op.in]: courseIds
              }
            },
            include: [
              {
                model: CourseCategoryMapping
              }
            ]
          })
        })
        .then(function (result) {
          return resolve(result);
        }).catch(function (err) {
          return reject(err);
        });
    });
  }
}

module.exports = {
  courseClass: Courses
};

