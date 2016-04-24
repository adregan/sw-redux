import express from 'express';
import Sequelize from 'sequelize';
import shortid from 'shortid';
import bodyParser from 'body-parser';

// Constants
const PORT = 8080;

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
    .then(counter => res.send({count: counter.count, id: counter.id} || {}));
});

app.put('/counters/:id', (req, res) => {
  Counter.findOne({where: {id: req.params.id}})
    .then(counter => counter.update({count: req.body.count}))
    .catch(err => res.status(400).send({error: `${err.errors[0].message} on \`${err.errors[0].path}\``}))
    .then(updated => res.send({count: updated.count, id: updated.id}));
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);

