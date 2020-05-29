module.exports = (sequelize, type) => {
  return sequelize.define('courses', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    popularity: type.STRING,
    author: type.STRING,
    difficulty_level: type.STRING,
    name: type.STRING,
    createdByUser: type.STRING,
    updateByUser: type.STRING,
  })
}
