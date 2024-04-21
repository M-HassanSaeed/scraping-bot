const express = require('express');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
