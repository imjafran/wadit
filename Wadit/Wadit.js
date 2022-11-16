const fs = require("fs");
const archiver = require("archiver");

const Wadit = {
  DefaultConfig() {
    const dir = __dirname.split("/").pop();
    // slug
    const slug =
      dir
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") + ".zip";

    const config = {
      input: "",
      output: slug,
      excludes: [
        "node_modules",
        "package-lock.json",
        "package.json",
        "wadit.js",
        slug,
      ],
      after: [""],
      before: [""],
      compress_level: 9,
    };

    return config;
  },

  get Config(){
    return this.DefaultConfig()
  },
  
  ConfigFile: "wadit.json",
  Output: fs.createWriteStream(__dirname + "/example.zip"),

  constructor(ConfigFile = null) {
    if (ConfigFile) {
      this.ConfigFile = ConfigFile;
    }

    this.LoadConfig();
  },


  LoadConfig() {
    // check if config file exists
    if (fs.existsSync(this.ConfigFile)) {
      // read config file
      const config = fs.readFileSync(this.ConfigFile, "utf8");
      // parse config file
      this.Config = JSON.parse(config);
    } else {
      // get default config
      this.Config = this.DefaultConfig();
    }

    return this.Config;
  },

  // Create config file
  CreateConfig() {
    // get default config
    const config = this.DefaultConfig();
    // write config file
    fs.writeFileSync(this.ConfigFile, JSON.stringify(config, null, 4));
  },

  // get excludes
  get Excludes() {
    return this.Config.excludes;
  },

  //   Compress
  Compress() {
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    });

    archive.pipe(this.output);

    archive.glob("**", {
      cwd: __dirname,
      ignore: ["**/node_modules/**", "**/example.zip"],
    });

    archive.finalize();
  },
};

module.exports = Wadit;
