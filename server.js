const http=require('http');
const app=require('./app');
require('dotenv').config();
const port=process.env.port || 8000;
const IP=process.env.IP || 'localhost';
const server=http.createServer(app);
server.listen(port, IP ,() => console.log(`listening on ${IP}:${port}`));
