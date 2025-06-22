const express = require("express");
const streamRoutes = require("./routes/streamRoutes");
require("dotenv").config();
const path = require('path');

const app = express();

app.use("/api/stream", streamRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
