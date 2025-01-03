const http = require("http");
const fs = require("fs");

const host = '127.0.0.1';
const port = 8084;
let count = 0;
let messageHistory = [];    //create an array to store objects, inside these objects, store time, clientID, text


const some_mime_types = {
    '.html': 'text/html',
    '.ico': 'image/png',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.zip': 'application/zip',
}

const requestListener = (request, response) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      console.log(`Got a request for ${request.url}, body=${body}`);

      

      

      if(request.url === '/post_message'){    //handles request, request.url uses pathway of url from client request
        const message = JSON.parse(body);
        messageHistory.push(message);
        response.writeHead(200);    //200 = succseful, 404 = error not found, 500 = server error
        response.end("message received");    //end the request so the server stops looking
        return;   
      }

      if(request.url === '/get_messages'){
        response.setHeader('Content-Type', 'application/json');   //sets http header, informs the client what tpye of data is sent
        response.writeHead(200);
        response.end(JSON.stringify(messageHistory));   //converts messages in messagehistory array to json format
        return;

      }

      let filename = request.url.substring(1); // cut off the '/'
      if (filename.length === 0) 
        filename = 'client.html';
      const last_dot = filename.lastIndexOf('.');
      const extension = last_dot >= 0 ? filename.substring(last_dot) : '';
      if(filename === 'ajax'){
        count++;
        response.setHeader('Content-Type', 'application/json');
        response.writeHead(200);
        response.end(`{"push_count":${count}}`);
        return;
    }
      if (filename === 'generated.html') {
          response.setHeader("Content-Type", "text/html");
          response.writeHead(200);
          response.end(`<html><body><h1>Random number: ${Math.random()}</h1></body></html>`);
      } else if (extension in some_mime_types && fs.existsSync(filename)) {
          fs.readFile(filename, null, (err, data) => {
              response.setHeader("Content-Type", some_mime_types[extension]);
              response.writeHead(200);
              response.end(data);
          });
      } else {
          response.setHeader("Content-Type", "text/html");
          response.writeHead(404);
          response.end(`<html><body><h1>404 - Not found</h1><p>There is no file named "${filename}".</body></html>`);
      }
    });
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});