import express from 'express';
import bodyParser from 'body-parser';

import remoteIpAddress from './ip-address';
import { getInviteData, updateInviteData } from './sheets';

function transformBody(body): string[][] {
  const result: string[][] = [];
  Object.keys(body).map((key) => {
    const valueArray = Array.isArray(body[key]) ? body[key] : [body[key]];
    valueArray.map((item, index) => {
      if (!result[index]) {
        result[index] = [];
      }
      result[index][key] = item;
    });
  });
  return result;
}

const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', async (req, res) => {
  console.log(`requested root showing index.ejs`);
  res.render('index');
});

app.get('/invite/:inviteId', async (req, res) => {
  const inviteId = req.params.inviteId;
  if (inviteId) {
    console.log(`requested invite with inviteId: ${inviteId}`);
    const data = await getInviteData(inviteId, remoteIpAddress(req));
    const isValidInvite = data && data.length > 0;
    if (isValidInvite) {
      console.log(`showing invite.ejs with data`, data);
      res.render('invite', { title: 'Hey', data: data });
      return;
    }
  }
  console.log(`invalid invite id showing index.ejs`);
  res.render('index');
});

app.post('/invite/:inviteId', (req, res, next) => {
  Promise.resolve()
    .then(async function() {
      const inviteId = req.params.inviteId;
      console.log(`posted invite with inviteId: ${inviteId}`);
      const inviteData = transformBody(req.body);
      const resultStatus = await updateInviteData(
        inviteId,
        inviteData,
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

app.get('/thanks/:inviteId', async (req, res) => {
  const inviteId = req.params.inviteId;
  console.log(`showing thanks with inviteId: ${inviteId}`);
  res.render('thanks', { inviteLink: `/invite/${inviteId}` });
});

app.use(function(error, req, res, next) {
  res.status(500);
  res.render('error', { title: '500: Internal Server Error', error: error });
});

app.listen(port, () =>
  console.log(`Server running at http://127.0.0.1:${port}/`),
);
