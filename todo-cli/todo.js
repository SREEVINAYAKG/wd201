const todoList = () => {
  all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    return all.filter(
      (item) => item.dueDate < new Date().toISOString().slice(0, 10),
    );
    // if (todos.dueDate < today){
    //     return all.filter((item)=> item.dueDate<today)
    // }
    // Write the date check condition here and return the array
    // of overdue items accordingly.
  };

  const dueToday = () => {
    return all.filter(
      (item) => item.dueDate === new Date().toISOString().slice(0, 10),
    );
    // if (todos.dueDate == today){
    //     return all.filter((item)=> item.dueDate==today)
    // }
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
  };

  const dueLater = () => {
    return all.filter(
      (item) => item.dueDate > new Date().toISOString().slice(0, 10),
    );
    // if (todos.dueDate < today){
    //     return all.filter((item)=> item.dueDate>today)
    // }
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
  };

  const toDisplayableList = (list) => {
    return list
      .map((value) => {
        const checkbox = value.completed ? "[x]" : "[ ]";
        const displayDate =
          value.dueDate === new Date().toISOString().slice(0, 10)
            ? ""
            : ` ${value.dueDate}`;
        return `${checkbox} ${value.title}${displayDate}`;
      })
      .join("\n");
  };
  // if (todos.dueDate == today){
  //     if (todos.completed == false){
  //         return `[ ] ${list}`
  //     } else{
  //         return `[x] ${list}`
  //     }
  // }else{
  //     if (todos.completed == false){
  //         return `[ ] ${list} ${todos.dueDate}`
  //     } else{
  //         return `[x] ${list} ${todos.dueDate}`
  //     }
  // }
  // Format the To-Do list here, and return the output string
  // as per the format given above.

  // }
  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

// ####################################### #
// DO NOT CHANGE ANYTHING BELOW THIS LINE. #
// ####################################### #

// const todos = todoList();

// const formattedDate = d => {
//   return d.toISOString().split("T")[0]
// }

// var dateToday = new Date()
// const today = formattedDate(dateToday)
// const yesterday = formattedDate(
//   new Date(new Date().setDate(dateToday.getDate() - 1))
// )
// const tomorrow = formattedDate(
//   new Date(new Date().setDate(dateToday.getDate() + 1))
// )

// todos.add({ title: 'Submit assignment', dueDate: yesterday, completed: false })
// todos.add({ title: 'Pay rent', dueDate: today, completed: true })
// todos.add({ title: 'Service Vehicle', dueDate: today, completed: false })
// todos.add({ title: 'File taxes', dueDate: tomorrow, completed: false })
// todos.add({ title: 'Pay electric bill', dueDate: tomorrow, completed: false })

// console.log("My Todo-list\n")

// console.log("Overdue")
// var overdues = todos.overdue()
// var formattedOverdues = todos.toDisplayableList(overdues)
// console.log(formattedOverdues)
// console.log("\n")

// console.log("Due Today")
// let itemsDueToday = todos.dueToday()
// let formattedItemsDueToday = todos.toDisplayableList(itemsDueToday)
// console.log(formattedItemsDueToday)
// console.log("\n")

// console.log("Due Later")
// let itemsDueLater = todos.dueLater()
// let formattedItemsDueLater = todos.toDisplayableList(itemsDueLater)
// console.log(formattedItemsDueLater)
// console.log("\n\n")

module.exports = todoList;
