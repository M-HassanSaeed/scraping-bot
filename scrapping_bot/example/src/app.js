const express = require('express');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/scrape', async (req, res) => {
  try {
    const { noticeNumber, taxPayerID } = req.body;

    const scrapeProcess = spawn('node', ['src/scraper.js', noticeNumber, taxPayerID]);

    let outputData = '';

    await new Promise((resolve, reject) => {
      scrapeProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      scrapeProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        reject(new Error(`Scraping error: ${data}`)); // Reject promise with error message
      });

      scrapeProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        resolve();
      });

      scrapeProcess.on('error', (err) => {
        console.error(`child process error: ${err}`);
        reject(err); // Reject promise with error
      });
    });

    res.json({ output: outputData });
  } catch (error) {
    console.error(error); // Log the error for troubleshooting
    res.status(500).json({ error: 'Scraping failed' }); // Send a meaningful error response
  }
});

// Listen on `0.0.0.0` and the provided `PORT` environment variable
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening at http://0.0.0.0:${port}`);
});
