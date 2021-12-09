import express from 'express';

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 123 });
});

app.post('/api', (req, res) => {
  console.log(req.body);

  res.send({ value: req.body.value * 100 });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
