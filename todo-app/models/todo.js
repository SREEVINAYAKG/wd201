'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User,{
        foreignKey:'userId'
      })
      // define association here
    }
    static addTodo({title, dueDate,userId}) {
      return this.create({title:title, dueDate:dueDate, completed:false,userId})
    }
    static getTodos(userId){
      return this.findAll({
        where:{
          userId,
        }
      });
    }
    static async remove(id,userId){
      return this.destroy({
        where:{
          id,
          userId
        }
      })
    }

    // markAsCompleted(){
    //   return this.update({completed:true})
    // }

    async setCompletionStatus(completed) {
      return this.update({ completed });
    }

  }
  Todo.init({
    title:DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};