import express from 'express';
import Sequelize from 'sequelize';
import shortid from 'shortid';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import { apiKey } from '../config';

// Constants
const PORT = 8080;
const PUSH_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `key=${apiKey}`
};

const sequelize = new Sequelize('swredux', 'app', null, {
  dialect: 'sqlite',
  logging: false,
  storage: 'swredux.sqlite'
});

var Counter = sequelize.define('counter', {
  count: {
    type: Sequelize.INTEGER,
    field: 'count',
    validate: {isInt: true}
  },
  id: {
    type: Sequelize.STRING,
    field: 'id',
    primaryKey: true
  },
  pushToken: {
    type: Sequelize.STRING,
    field: 'push_token'
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Counter.sync();

// APP
const app = express();

app.use(cors());
app.use(bodyParser.json({strict: true, type: 'application/json'}));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send('Bad JSON');
  }
});

app.get('/counters', (req, res) => {
  Counter.findAll()
    .then(counters => res.send(counters.map(c => {return {count: c.count, id: c.id};})));
});

app.post('/counters', (req, res) => {
  const id = shortid.generate();
  Counter.create({count: 0, id})
    .then(counter => res.send({count: counter.count, id: counter.id}));
});

app.get('/counters/:id', (req, res) => {
  Counter.findOne({where: {id: req.params.id}})
    .then(counter => res.send(counter || {}));
});

app.put('/counters/:id', (req, res) => {
  const { count, pushToken } = req.body;
  let to;

  Counter.findOne({where: {id: req.params.id}})
    .then(counter => {
      to = counter.get('pushToken');
      return counter.update({count, pushToken});
    })
    .catch(err => res.status(400).send({error: `${err.errors[0].message} on \`${err.errors[0].path}\``}))
    .then(updated => {
      if (!count) return updated;
      const body = {data: {count}, to};
      fetch('https://gcm-http.googleapis.com/gcm/send', {
        method: 'post', headers: PUSH_HEADERS, body: JSON.stringify(body)})
        .catch(err => console.error(err));

      return updated;
    })
    .then(updated => res.send(updated));
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

