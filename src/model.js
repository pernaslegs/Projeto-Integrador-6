const { DataTypes } = require('sequelize');
const database = require('./database');
module.exports = database.define('Livro', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING(100), allowNull: false },
  autor: { type: DataTypes.STRING(100), allowNull: false },
  isbn: { type: DataTypes.STRING(13), allowNull: false, unique: true },
  ano: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'livros', timestamps: false });
