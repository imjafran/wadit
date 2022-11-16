const chalk = require("chalk");
const { Log } = require("./Helper");
const Wad = require("./Wad");

class CLI {
  get ParsableArgs() {
    return [
      {
        name: "config",
        short: "c",
        description: "Path to config file",
        type: "string",
        default: "wadit.config.js",
      },

      {
        name: "version",
        short: "v",
        description: "Show version of Wad",
        type: null,
      },

      {
        name: "help",
        short: "h",
        description: "Show help",
        type: null,
      },

      {
        name: "init",
        short: "i",
        description: "Initialize Wad & create config file",
        type: "string",
        default: "wadit.config.js",
      },
      {
        name: "overwrite",
        short: "o",
        description: "Force create config file",
        type: "boolean",
        default: true,
      },
    ];
  }

  get ShortTags() {
    return this.ParsableArgs.map((arg) => arg.short);
  }

  get LongTags() {
    return this.ParsableArgs.map((arg) => arg.name);
  }

  get Help() {
    return `${chalk.cyan(`▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ███ █ ▄▄▀█ ▄▀██▄██▄ ▄
█▄▀ ▀▄█ ▀▀ █ █ ██ ▄██ █
██▄█▄██▄██▄█▄▄██▄▄▄██▄█
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`)}
${chalk.grey.italic("Usage: ")}${chalk.yellow("wadit")} ${chalk.inverse("[options]")}

${chalk.grey("Wad It, or just zip it. compresses current working directory safely, fast and easy.")}

${chalk.inverse("[options]")}
    ${chalk.yellow("-c")}, --config         ${chalk.underline(
      "String"
    )}    Path to config file
    ${chalk.yellow("-v")}, --version        ${chalk.dim.italic(
      "null"
    )}      Show version of Wad
    ${chalk.yellow("-h")}, --help           ${chalk.dim.italic(
      "null"
    )}      Show help. Ex: ${chalk.cyan("wadit help")}
    ${chalk.yellow("-i")}, --init           ${chalk.underline(
      "String"
    )}    Create config file. Ex: ${chalk.cyan("wadit -i wadit.config.js")}
    ${chalk.yellow("-o")}, --overwrite      ${chalk.underline(
      "Boolean"
    )}   Overwrite config file. Ex: ${chalk.cyan("wadit -i -o")}

${chalk.grey("Developed by Jafran Hasan")} 
${chalk.grey("For more info, visit: ")}${chalk.underline(
      "https://jafran.me/wadit"
    )}
`;
  }

  get Args() {
    let args = process.argv.slice(2);

    if (args.length === 0) {
      return {};
    }

    let formattedArgs = {};

    for (let i = 0; i < args.length; i++) {
      let arg = args[i];
      const argTag = arg.replace("-", "");
      const argDetails = this.ParsableArgs.find(
        (a) => a.name === argTag || a.short === argTag
      );

      if (!argDetails) {
        Log.error(`Invalid argument: ${arg}`);
        Log.any(this.Help);
        process.exit(1);
      }

      const nextArg = args[i + 1] || null;
      const nextArgValue =
        nextArg && typeof nextArg == "string" && nextArg.startsWith("-")
          ? false
          : true;

      let value = "default" in argDetails ? argDetails.default : true;

      if (arg.startsWith("-") && nextArgValue) {
        value = nextArg || value;
        i++;
      }  

      formattedArgs[argDetails.name] = value;
    }

    return formattedArgs;
  }

  Run() {
    const args = this.Args;
 
    // Show Help
    if (args.help) {
      return Log.any(this.Help);
    }

    // Check Version

    if (args.version) {
      return Log.warn("wadit v" + require("../package.json").version);
    }

    // Initialize
    if (args.init) {
      let ConfigFileName =
        args.init && args.init !== true ? args.init : "wadit.config.js";
      if (!ConfigFileName.endsWith(".js")) {
        ConfigFileName += ".js";
      }
      let isOverwrite = args.overwrite || false;

      return new Wad().Init(ConfigFileName, isOverwrite);
    }

    // Build
    this.Build(args);
  }

  Build(args = {}) {
    let ConfigFile = null;

    if ("config" in args && args.config) {
      ConfigFile = args.config;
    }

    const wad = new Wad(ConfigFile);

    try {
      wad.Build();
    } catch (error) {
      Log.error(error);
    }
  }
}

module.exports = CLI;
