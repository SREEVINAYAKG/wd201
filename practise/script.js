// console.log('Hello 1');

// // Print message after 100 millisecond
// setTimeout(function() {
//    console.log('Hello 2');
// }, 100);
// console.log('Hello 3');

const formattedDate = d => {
  return d.toISOString().split("T")[0]
}

var dateToday = new Date()
const today = formattedDate(dateToday)
const yesterday = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() - 1))
)
const tomorrow = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() + 1))
)

// console.log("Today: ", today);
// console.log("Yesterday: ", yesterday);
// console.log("Tomorrow: ", tomorrow);