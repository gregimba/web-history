const request = require('request');
const level = require('level');

exports.updateStore = db => {
  db
    .createReadStream()
    .on('data', function(data) {
      if (!data.value) {
        request(`http://${data.key}`, (err, res, body) => {
          if (err) {
            console.log(err);
            db.del(data.key);
          } else {
            if (res.statusCode === 200) {
              db.put(data.key, body);
            }
          }
        });
      }
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
