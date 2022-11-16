const loading = require("loading-cli");
const chalk = require("chalk");

const Loader = loading({
  text: "",
  color: "yellow",
  interval: 40,
  frames: ["◐", "◓", "◑", "◒"],
});


const Log = {
  success: (message) => {
    console.log(chalk.green(message));
  },
  error: (message) => {
    console.log(chalk.red(message));
  },
  info: (message) => {
    console.log(chalk.blue(message));
  },
  warn: (message) => {
    console.log(chalk.yellow(message));
  },
  any: (message) => {
    console.log(message);
  }
}

module.exports = {
  Loader,
  Log,
}
