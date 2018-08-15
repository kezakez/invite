import http from 'http';
import run from './sheets';

const port = 3000;

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  console.log('running');
  await run();
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
