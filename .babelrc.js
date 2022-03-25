const { resolve } = require("path");

module.exports = {
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "dnd-5th-ruleset": resolve(__dirname),
        },
      },
    ],
  ],
};
