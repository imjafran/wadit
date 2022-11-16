const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const chalk = require("chalk");
const loading = require("loading-cli");

const Loader = loading({
  text: "",
  color: "yellow",
  interval: 40,
  frames: ["◐", "◓", "◑", "◒"],
});

class Wad {
  _ConfigFile = "wad.js";

  // Current directory
  get Dir() {
    return path.resolve(process.cwd());
  }

  get ConfigFile() {
    return path.join(this.Dir, this._ConfigFile);
  }

  get DefaultConfig() {
    const ConfigFileName = path.basename(this.ConfigFile);
    // slug
    const OutputFile =
      path
        .basename(this.Dir)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") + ".zip";

    let Excludes = [];

    // check if node_modules exists
    if (fs.existsSync(path.join(this.Dir, "node_modules"))) {
      Excludes.push("**node_modules**");
    }

    const excludesIfExist = [
      ".git",
      ".gitignore",
      "package-lock.json",
      "package.json",
      "webpack.config.js",
      "rollup.config.js",
      "gulpfile.js",
      "gruntfile.js",
      "yarn.lock",
      "composer.lock",
      "composer.json",
      "composer.phar",
      "tailwind.config.js",
      "postcss.config.js",
      "babel.config.js",
      ".babelrc",
      "vue.config.js",
      "nuxt.config.js",
      ".vscode",
    ];

    // check if files exists
    for (const file of excludesIfExist) {
      if (fs.existsSync(path.join(this.Dir, file))) {
        Excludes.push(file);
      }
    }

    Excludes.push(ConfigFileName, OutputFile);

    const config = {
      input: "**",
      output: OutputFile,
      excludes: Excludes,
      compress_level: 9,
      before: [],
      after: [],
    };

    return config;
  }

  _Config = null;

  get Config() {
    const config = this._Config || this.DefaultConfig;
    return Object.assign(this.DefaultConfig, config);
  }

  constructor(_ConfigFile = null) {
    if (_ConfigFile) {
      this._ConfigFile = _ConfigFile;
    }

    this.LoadConfig();
  }

  LoadConfig() {
    // check if config file exists
    if (fs.existsSync(this.ConfigFile)) {
      // require module from config file
      this._Config = require(this.ConfigFile);

      return true;
    }

    return this;
  }

  // Create config file
  CreateConfig(name = null, overwrite = false) {
    Loader.start(chalk.yellow("Creating config file..."));

    if (name) {
      this.ConfigFile = name;
    }

    if (fs.existsSync(this.ConfigFile) && !overwrite) {
      Loader.warn(chalk.yellow("Config file already exists!"));
      return false;
    }

    // get default config
    const config = this.DefaultConfig;

    // write config file as module
    fs.writeFileSync(
      this.ConfigFile,
      `module.exports = ${JSON.stringify(config, null, 2)};`
    );

    Loader.succeed(chalk.green("Config file created!"));
    Loader.stop();

    return true;
  }

  // get excludes
  get Excludes() {
    const Excludes = this.Config.excludes;
    // check if output file is in excludes
    if (Excludes.indexOf(this.Config.output) === -1) {
      Excludes.push(this.Config.output);
    }
    // check if config file is in excludes
    if (Excludes.indexOf(this._ConfigFile) === -1) {
      Excludes.push(this._ConfigFile);
    }

    return Excludes;
  }

  get Input() {
    return this.Config.input || "**";
  }

  getSize(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }

  Execute(commands, args = []) {
    if (!commands || !commands.length) return;

    for (const command of commands) {
      if (typeof command === "function") {
        try {
          command(args);
        } catch (error) {
          Loader.warn(chalk.yellow("Function Error! ", error));
        }
      } else if (typeof command === "string") {
        try {
          const exec = require("child_process").execSync;
          exec(command, { stdio: "inherit" });
        } catch (error) {
          Loader.warn(chalk.yellow("Command Error!", command), error);
        }
      }
    }
  }

  FormatTime(time) {
    // readable time minute, second and millisecond
    const ms = time % 1000;
    time = (time - ms) / 1000;
    const secs = time % 60;
    time = (time - secs) / 60;
    const mins = time % 60;

    if (mins) {
      return `${mins} min ${secs} sec ${ms} ms`;
    }

    if (secs) {
      return `${secs} sec ${ms} ms`;
    }

    return `${ms} ms`;
  }

  Compress() {
    const Output = fs.createWriteStream(
      path.join(this.Dir, this.Config.output)
    );

    Loader.start(chalk.yellow("Compressing..."));

    this.Execute(this.Config.before);

    const startedTime = new Date().getTime();

    const archive = archiver("zip", {
      zlib: { level: this.Config.compress_level || 9 }, // Sets the compression level.
    });

    archive.pipe(Output); 
    
    archive.glob(
      this.Input,
      {
      cwd: this.Dir,
      ignore: this.Excludes,
    });

    Output.on("close", () => {
      Loader.stop();

      const endedTime = new Date().getTime();

      const time = this.FormatTime(endedTime - startedTime);

      // execute from after array
      this.Execute(this.Config.after, {
        output: this.Config.output,
        size: archive.pointer(),
      });

      const message = chalk.green(
        `
✅ Built ${chalk.yellow(this.Config.output)} ; Size: ${chalk.yellow(
          this.getSize(archive.pointer())
        )} ; Time: ${chalk.yellow(time)}
`
      );
      console.log(message);
    });

    archive.finalize();
  }
}

module.exports = Wad;
