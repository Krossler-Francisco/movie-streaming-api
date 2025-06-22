const streamService = require("../services/streamService");

exports.streamMovie = (req, res) => {
  const filePath = "./assets/buck-bunny.mp4";
  streamService.handleStream(req, res, filePath);
};
