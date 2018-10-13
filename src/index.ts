import express from 'express';
import bodyParser from 'body-parser';

import remoteIpAddress from './ip-address';
import { getInviteData, updateInviteData } from './sheets';
import { getNames } from './names';

const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/invite/:inviteId', (req, res, next) => {
  Promise.resolve()
    .then(async function() {
      const inviteId = req.params.inviteId;
      if (inviteId) {
        console.log(`requested invite with inviteId: ${inviteId}`);
        const data = await getInviteData(inviteId, remoteIpAddress(req));
        const isValidInvite = data && data.length > 0;
        if (isValidInvite) {
          console.log(`showing invite.ejs with data`, data);
          res.render('invite', { data, names: getNames(data) });
          return;
        }
      }
      console.log(`invalid invite id showing index.ejs`);
      res.render('index');
    })
    .catch(next);
});

app.post('/invite/:inviteId', (req, res, next) => {
  Promise.resolve()
    .then(async function() {
      const inviteId = req.params.inviteId;
      console.log(`posted invite with inviteId: ${inviteId}`);

      const resultStatus = await updateInviteData(
        inviteId,
        req.body,
        remoteIpAddress(req),
      );
      if (resultStatus === 'done') {
        res.redirect(`/thanks/${inviteId}`);
      } else {
        throw new Error(resultStatus);
      }
    })
    .catch(next);
});

app.get('/thanks/:inviteId', (req, res) => {
  const inviteId = req.params.inviteId;
  console.log(`showing thanks with inviteId: ${inviteId}`);
  res.render('thanks', { inviteLink: `/invite/${inviteId}` });
});

app.get('/*', (req, res) => {
  console.log(`requested root showing index.ejs`);
  res.render('index');
});

app.use(function(error, req, res, next) {
  res.status(500);
  res.render('error', { title: '500: Internal Server Error', error: error });
});

app.listen(port, () =>
  console.log(`Server running at http://127.0.0.1:${port}/`),
);
