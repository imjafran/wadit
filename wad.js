module.exports = {
  input: "**",
  output: "out.zip",
  excludes: [
    "node_modules/**",
    ".git",
    ".gitignore",
    "package-lock.json",
    "package.json",
    "test/ignore.txt"
  ],
  compress_level: 9,  
};
