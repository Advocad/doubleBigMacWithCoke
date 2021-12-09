import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {});

io.on('connection', s => {
  s.on('test', d => {
    console.log(d);
  });
  console.log('Socket connectied');
  s.send({ value: '123123' });
});

app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 123 });
});

app.post('/api', (req, res) => {
  console.log(req.body);

  res.send({ value: req.body.value * 100 });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
