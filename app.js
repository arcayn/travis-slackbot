const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const utils = require('./functions.js');
const handlers = require('./handlers.js');
const config = require('./config.js')
const app = express();

const port = config.obj["port"];
const slackApiToken = config.obj["slack-token"];
const serverKey = config.obj["SSLCertificateKeyFile"];
const serverCert = config.obj["SSLCertificateFile"];
const serverCa = config.obj["SSLCertificateCaFile"];

app.use(bodyParser.json({
    verify: function(req, res, buf, encoding) {
        req.rawBody = buf.toString();
    }
}));

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
	res.setHeader('Content-Type', 'application/json');
        return res.status(400).send(utils.makeError('Malformed JSON payload'));
    }

    next();
});

app.get('/', (req, res) => {
	return res.status(200).send('travis-slackbot works!');
});

app.post('/listener', (req, res) => {
	var contenttype = req.headers['content-type'];
	res.setHeader('Content-Type', 'application/json');
	if (!contenttype || contenttype.indexOf('application/json') !== 0) {
		return res.status(400).send(utils.makeError('Incorrect content type'));
	}
	if (req.body["token"] !== slackApiToken) {
		return res.status(403).send(utils.makeError('Incorrect api token'));
	}
	if (!utils.authorise(req))
		return res.status(403).send(utils.makeError('Invalid signature'));
	var retObject = handlers.handle(req.body);
	return res.status(retObject["status"]).send(retObject["content"]);
});

https.createServer({
  key: fs.readFileSync(serverKey),
  cert: fs.readFileSync(serverCert),
  ca: fs.readFileSync(serverCa)
}, app).listen(port, _ => {
	console.log('travis-slackbot operating on port ' + port.toString());
});
