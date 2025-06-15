const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const hostname = '127.0.0.1';
const port = 9999;

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/' && method === 'GET') {
    // Serve HTML
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
      <head>
        <title>Canvas App</title>
      </head>
      <body>
        <canvas id="canvas" width="1920" height="1080"></canvas>
        <script src="/draw.js"></script>
      </body>
      </html>
    `);
  } 
  
  else if (url === '/draw.js' && method === 'GET') {
    // Serve JS
    const filePath = path.join(__dirname, 'draw.js');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading JS');
      }
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(data);
    });

  } 
  
  else if (url === '/data' && method === 'GET') {
    // Serve JSON data
    const data = fs.readFileSync('data.json', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);

  } 
  
  else if (url === '/data' && method === 'POST') {
    // Receive and save new JSON data
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      fs.writeFileSync('data.json', body, 'utf-8');
      res.writeHead(200);
      res.end('Data saved');
    });

  } else if (url === '/admin' && method === 'GET') {
    const htmlPath = path.join(__dirname, 'adminpage.html');
    const dataPath = path.join(__dirname, 'data.json');

    // Read data.json first
    fs.readFile(dataPath, 'utf8', (err, jsonContent) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Error loading data.json');
      }

      // Then read admin.html
      fs.readFile(htmlPath, 'utf8', (err, htmlContent) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          return res.end('Error loading admin.html');
        }

        // Inject the JSON into the HTML
        const output = htmlContent.replace('${json}', jsonContent);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(output);
      });
    });
}
else if (url.startsWith('/logos/') && method === 'GET') {
  const fileName = url.substring(7); // Remove '/logos/'
  const filePath = path.join(__dirname, 'logos', fileName);
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Image not found');
    }
    
    // Set appropriate content type based on file extension
    const ext = path.extname(fileName).toLowerCase();
    const contentType = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    }[ext] || 'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}
else if (url === '/logos-list' && method === 'GET') {
  const logosPath = path.join(__dirname, 'logos');
  
  fs.readdir(logosPath, (err, files) => {
    if (err) {
      res.writeHead(500);
      return res.end('[]');
    }
    
    // Filter for image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext);
    });

    console.log(imageFiles);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(imageFiles));
  });
}
else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});