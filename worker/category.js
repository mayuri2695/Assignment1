const { Category } = require('../sequelize')

class categories {
  categories() {

  }
  // fetch category list
  fetchAllCategories(params) {
    return new Promise(function (resolve, reject) {
      Category.findAll({
      }).then(function (result) {
        return resolve(result);
      }).catch(function (err) {
        return reject(err);
      });
    })
  }

  // add new category
  addCategories(params) {
    return new Promise(function (resolve, reject) {
      let p1 = Promise.resolve();
      p1
        .then(function () {
          if (!params.categoryName) {
            return Promise.reject({ error: "Category Name is Mandatory" });
          } else {
            return Category.findOne({
              where: {
                categoryName: params.categoryName
              }
            })
          }
        })
        .then(result => {
          if (result) {
            return ({ message: "Category Already Added" })
          } else {
            return Category.create({
              categoryName: params.categoryName
            })
          }
        })
        .then(result => {
          return resolve(result);
        })
        .catch(err => {
          console.error(err);
          return reject(err);
        });
    });
  }
}

module.exports = {
  categoryClass: categories
};

