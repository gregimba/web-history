const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const level = require('level');

const db = level('./mydb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'hbs');

app.get('/', (req, res) => res.render('main'));

app.post('/', (req, res) => {
  const { url } = req.body;

  // On post, attempt to get value for url from db
  db.get(url, (err, value) => {
    // if not in db, add to db
    if (err) {
      db.put(url, '', err => {
        if (err) return console.log(err);
      });
      // serve html(value)
      res.end('please wait');
    } else {
      if (value) {
        res.end(value);
      } else {
        res.end('please wait');
        // serve html(value)
      }
    }
  });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
