const express = require('express');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable provided by Railway or default to 3000

app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { noticeNumber, taxPayerID } = req.body;

  const scrapeProcess = spawn('node', ['src/scrape_file.js', noticeNumber, taxPayerID]);

  let outputData = '';

  await new Promise((resolve, reject) => {
    scrapeProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    scrapeProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    scrapeProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      resolve();
    });

    scrapeProcess.on('error', (err) => {
      console.error(`child process error: ${err}`);
      reject(err);
    });
  });

  res.json({ output: outputData });
});

// Listen on `0.0.0.0` and the provided `PORT` environment variable
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening at http://0.0.0.0:${port}`);
});
