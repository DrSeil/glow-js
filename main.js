const http = require('http');

var GlowDataFetcher = require('./GlowDataFetcher');

var GlowStorage = require('./GlowStorage');
var GlowUtils = require('./GlowUtils');

// Function to process the request value (replace with your actual logic)
var credentials = GlowUtils.getSavedCredentials();
  var g = new GlowDataFetcher(credentials.email, credentials.password, new GlowStorage({}));
const server = http.createServer((req, res) => {
  let data = '';

  function processRequest(value) {
    g.pushData(value);
    // You can perform any operation on the value here
  }
  // Collect data from the request body
  req.on('data', (chunk) => {
    data += chunk;
  });

  // Once data is received, call the processRequest function
  req.on('end', () => {
    try {
      const requestValue = JSON.parse(data); // Assuming JSON data
      processRequest(requestValue.value);
      res.writeHead(200);
      res.end('Request processed successfully!');
    } catch (error) {
      console.error('Error processing request:', error);
      res.writeHead(500);
      res.end('Error: Invalid request data');
    }
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});