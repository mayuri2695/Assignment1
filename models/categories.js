module.exports = (sequelize, type) => {
  return sequelize.define('categories', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    categoryName: type.STRING,
  })
}
