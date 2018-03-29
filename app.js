const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const level = require('level');
const { updateStore } = require('./updatestore');

const db = level('./mydb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'hbs');

app.get('/', (req, res) => res.render('main'));
app.get('/:url', (req, res) => {
  const { url } = req.params;
  console.log(typeof url);
  db.get(url, (err, webpage) => {
    if (err) {
      // console.log('error', err);
    }

    if (webpage === '') {
      res.render('wait');
    } else {
      res.end(webpage);
    }
  });
});

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
      res.redirect(`/${url}`);
    } else {
      if (value) {
        res.redirect(`/${url}`);
        res.end(value);
      } else {
        res.redirect(`/${url}`);

        // serve html(value)
      }
    }
  });
});

setInterval(() => updateStore(db), 30000);

app.listen(3000, () => console.log('Example app listening on port 3000!'));
