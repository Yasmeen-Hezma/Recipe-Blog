const mongoose = require('mongoose');
mongoose.connect(process.env.MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => { console.log('Connected to db') });
require('./Category');
require('./Recipe');

