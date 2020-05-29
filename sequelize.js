const Sequelize = require('sequelize')
const CoursesModel = require('./models/courses')
const CategoryModel = require('./models/categories')
const CourseCategoryMappingModel = require('./models/course-category_mapping')
const UserModel = require('./models/users')
const { DATABASE_NAME, USERNAME, PASSWORD, HOST, DIALECT } = require('./constants')
const sequelize = new Sequelize(DATABASE_NAME, USERNAME, PASSWORD, {
  host: HOST,
  dialect: DIALECT,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})
const Category = CategoryModel(sequelize, Sequelize)
const Course = CoursesModel(sequelize, Sequelize)
const User = UserModel(sequelize, Sequelize)
const CourseCategoryMapping = CourseCategoryMappingModel(sequelize, sequelize)
Course.hasMany(CourseCategoryMapping)
Category.hasMany(CourseCategoryMapping)
sequelize.sync({ force: false })
  .then(() => {
    console.log(`Database & tables created here!`)
  })
module.exports = {
  Course,
  Category,
  User,
  CourseCategoryMapping
}
