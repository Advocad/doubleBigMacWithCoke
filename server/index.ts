import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import { generateTokenController } from './token';
import { config } from 'dotenv';

const envResult = config();

if (envResult.error) {
  throw envResult.error;
}

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
  req;
  console.log(req.body);

  res.send({ value: req.body.value * 100 });
});

/*
  data: {
    isPublisher: boolean
    channel: string
  } 
*/
app.post('/rtctoken', (req, res) => {
  console.log('EE');
  res.send(
    generateTokenController({
      channel: req.body.channel,
      isPublisher: req.body.isPublisher,
    })
  );
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
