// models/todo.js
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // await Todo.overdue();
      const overdue = await Todo.overdue();
      // overdue.forEach(todo => console.log(todo.displayableString()));
      // FILL IN HERE
      console.log("\n");

      console.log("Due Today");
      const dueToday = await Todo.dueToday();
      // dueToday.forEach(todo => console.log(todo.displayableString()));
      // await Todo.dueToday();
      // FILL IN HERE
      console.log("\n");

      console.log("Due Later");
      const dueLater = await Todo.dueLater();
      // dueLater.forEach(todo => console.log(todo.displayableString()));
      // await Todo.dueLater();
      // FILL IN HERE
    }

    static async overdue() {
      const todos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toISOString().split("T")[0],
          },
        },
        order: [["id", "ASC"]],
      });
      todos.forEach((todo) => {
        console.log(todo.displayableString());
      });
      return todos;
      // FILL IN HERE TO RETURN OVERDUE ITEMS
    }

    static async dueToday() {
      const todos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toISOString().split("T")[0],
          },
        },
        order: [["id", "ASC"]],
      });
      todos.forEach((todo) => {
        console.log(todo.displayableString());
      });
      return todos;
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
    }

    static async dueLater() {
      const todos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toISOString().split("T")[0],
          },
        },
        order: [["id", "ASC"]],
      });
      todos.forEach((todo) => {
        console.log(todo.displayableString());
      });
      return todos;
      // FILL IN HERE TO RETURN ITEMS DUE LATER
    }

    static async markAsComplete(id) {
      try {
        await Todo.update(
          { completed: true },
          {
            where: {
              id: id,
            },
          },
        );
      } catch (err) {
        console.log(err);
      }
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      const today = new Date().toISOString().split("T")[0];
      if (this.dueDate === today) {
        return `${this.id}. ${checkbox} ${this.title}`;
      } else {
        return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
      }
      //   let date =
      //     this.dueDate === (new Date().toISOString().split("T")[0])
      //       ? ""
      //       : this.dueDate;
      //   return `${this.id}. ${checkbox} ${this.title} ${date}`.trim();
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};

// --------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// models/todo.js
// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Todo extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//      static async addTask(params) {
//       return  await Todo.create(params);
//     }
//     static associate(models) {
//       // define association here
//     }
//     displayableString() {
//       let checkbox = this.completed ? "[x]" : "[ ]";
//       return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
//     }
//   }
//   Todo.init({
//     title: DataTypes.STRING,
//     dueDate: DataTypes.DATEONLY,
//     completed: DataTypes.BOOLEAN
//   }, {
//     sequelize,
//     modelName: 'Todo',
//   });
//   return Todo;
// };

// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Todo extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Todo.init({
//     title: DataTypes.STRING,
//     dueDate: DataTypes.DATEONLY,
//     completed: DataTypes.BOOLEAN
//   }, {
//     sequelize,
//     modelName: 'Todo',
//   });
//   return Todo;
// };
