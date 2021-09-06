'use strict';

const App = require('./app');

let app = new App();
app.run().catch((err) => {
  console.log(err);
  process.exit(1);
});