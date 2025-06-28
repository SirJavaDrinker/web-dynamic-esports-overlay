const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { log } = require('node:console');

const hostname = 'localhost';

// Change the below line if port 9999 is for some reason already taken up.
// TODO: Make port & hostname editable via json file or other method outside of direct editing.
const port = 9999;

const server = http.createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    // Adding font and setting up canvas to be used in draw.js
    res.end(`
      <!DOCTYPE html>
      <html>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap" rel="stylesheet">
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
    // Serves draw.js
    const filePath = path.join(__dirname, 'draw.js');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Loading error: could not load draw.js');
      }
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(data);
    });
  } 
  
  else if (url === '/data' && method === 'GET') {
    // Serves JSON data.json
    const data = fs.readFileSync('data.json', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  } 

  else if (url === '/colors' && method === 'GET') {
    // Serves JSON colors.json
    const data = fs.readFileSync('colors.json', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  }
  
  else if (url === '/data' && method === 'POST') {
    // Recieves updated JSON data and writes to data.json
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      fs.writeFileSync('data.json', body, 'utf-8');
      res.writeHead(200);
      res.end('Data saved');
    });
  } 
  
  else if (url === '/admin' && method === 'GET') {
    const htmlPath = path.join(__dirname, 'adminpage.html');
    const dataPath = path.join(__dirname, 'data.json');
    const colorDataPath = path.join(__dirname, 'colors.json');
    const packageDataPath = path.join(__dirname, 'package.json');
    
    try {
      const jsonContent = await fs.promises.readFile(dataPath, 'utf-8');
      const htmlContent = await fs.promises.readFile(htmlPath, 'utf-8');
      const colorDataContent = await fs.promises.readFile(colorDataPath, 'utf-8');
      const packageDataContent = await fs.promises.readFile(packageDataPath, 'utf-8');

      const output = htmlContent
        .replace('${json}', jsonContent)
        .replace('${colors}', colorDataContent)
        .replace('${p_data}', packageDataContent); 
      
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(output);
    } catch (error) {
      const errorMsg = error.path?.includes('data.json') ? 'Error loading data.json' : 'Error loading admin.html';
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(errorMsg);
    }
  }

  else if (url.startsWith('/logos/') && method === 'GET') {
    const fileName = url.substring(7);
    const filePath = path.join(__dirname, 'logos', fileName);
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('Image not found');
      }
      
      // Set type base on extension
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
  else if (url.startsWith('/icon/') && method === 'GET') {
    fs.readFile("LEAGUE_ICON.png", (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('Image not found');
      }
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end(data);
    });
  }
  else if (url === '/logos-list' && method === 'GET') {
    const logosPath = path.join(__dirname, 'logos');
    
    // Serves files within the /logos/ file
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

      //console.log(imageFiles);
      
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
  console.log(`----------------------------------------------------------------`)
  console.log(` | ${hostname}:${port}/         will display the overlay.`)
  console.log(` | ${hostname}:${port}/admin    will provide the control panel.`)
  console.log(`----------------------------------------------------------------`)
  console.log(`You may press ctrl+c to close the server.`);
});