const fs = require("fs");
const path = require("path");

exports.handleStream = (req, res, filePath) => {
  const fullPath = path.resolve(filePath);
  const stat = fs.statSync(fullPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.status(416).send("Requiere encabezado Range");
    return;
  }

  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, fileSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);
  fs.createReadStream(fullPath, { start, end }).pipe(res);
};
