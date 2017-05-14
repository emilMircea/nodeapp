const mongoose = require('mongoose');

// Check node version > 7.6+
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major <= 7 && minor <= 5) {
  console.log('This is an older version of node that doesn\'t support Async + Await! Go to nodejs.org and download version 7.6 or greater. 👌\n ');
  process.exit();
}

// import vital info (variables) from variables.env file
require('dotenv').config({ path: 'variables.env' });

// Connect to our DB and handle bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`⛔ 🚳 ⛔ 🚳 ⛔ 🚳 ⛔ → ${err.message}`);
});

// import all models
require('./models/Store');

// Start the app!
const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
