const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./api');
const app = express();
app.use(express.json()); // for parsing application/json
app.use(cors());

let urls = "mongodb+srv://doadmin:59LJ3D417if8xjB2@db-mongodb-blr1-12705-a6503f91.mongo.ondigitalocean.com/tokame?authSource=admin&replicaSet=db-mongodb-blr1-12705&tls=true"
mongoose.connect(urls, {
  useNewUrlParser: true, useUnifiedTopology: true, dbName: "tokame"
})

  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB", err);
  });
app.use('/', apiRoutes);

const port = 9531;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
