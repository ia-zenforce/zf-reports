console.log("PROCESS ENV PORT: ", process.env.PORT);

const jsreport = require("./")({
  rootDirectory: __dirname,
  httpPort: process.env.PORT
});

if (process.env.JSREPORT_CLI) {
  module.exports = jsreport;
} else {
  jsreport
    .init()
    .then(() => {})
    .catch(e => {
      console.trace(e);
      process.exit(1);
    });
}
