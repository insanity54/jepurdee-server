const cookieParser = require('cookie-parser');


const main = (app, session) => {
  app.use(cookieParser());

  const seedDatastore = (cb) => {
    session.insert({ type: 'sessionId', sessionId: 0 }, cb);
  }

  const ensureSeededDatastore = (req, res, next) => {
    session.findOne({ type: 'sessionId' }, (err, doc) => {
      if (err) {
        // error finding
        throw err;
      } else if (!doc) {
        // there is no seed
        seedDatastore((err, num, doc) => {
          if (err) throw new Error(`could not seed. ${err}`);
          return next();
        });
      } else {
        // already seeded
        return next();
      }
    })
  }

  app.get('/api/v1/join-url', ensureSeededDatastore, function(req, res) {
    // gen a new session id
    // insert session id to database
    // return session id to client
    session.findOne({ type: 'sessionId' }, (err, doc) => {
      if (err) return res.error(err);
      if (typeof doc.sessionId === 'undefined') return res.error('sessionId not found');
      let sessionId = doc.sessionId;
      sessionId += 1;
      session.update(
        { type: 'sessionId' },
        { type: 'sessionId', sessionId: sessionId },
        {},
        (err, n, doc) => {
        if (err) return res.error(err);
        let response = { sessionId: sessionId };
        return res.json(response);
      });
    });
  });

  // app.get('/api/v1/session/:sessionId', function (req, res) => {
  //
  // });

  app.get('/return', function(req, res) {
    if (req.cookies.cookie) res.send(req.cookies.cookie);
    else res.send(':(')
  });
}

module.exports = main;
