const request = require('request');
const level = require('level');

const db = level('./mydb');

exports.updateStore = db => {
  db
    .createReadStream()
    .on('data', function(data) {
      if (!data.value) {
        request(`http://${data.key}`, (err, res, body) => {
          if (res.statusCode === 200) {
            db.put(data.key, body);
          }
        });
      }
      console.log(data.key, '=', data.value);
    })
    .on('error', function(err) {
      console.log('Oh my!', err);
    })
    .on('close', function() {
      console.log('Stream closed');
    })
    .on('end', function() {
      console.log('Stream ended');
    });
};

exports.updateStore(db);
