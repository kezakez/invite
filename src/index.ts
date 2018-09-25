import express from 'express';
import bodyParser from 'body-parser';

import { getInviteData, updateInviteData } from './sheets';

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
    const data = await getInviteData(inviteId, req.connection.remoteAddress);
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

app.post('/invite/:inviteId', async (req, res) => {
  const inviteId = req.params.inviteId;
  console.log(`posted invite with inviteId: ${inviteId}`);
  const inviteData = transformBody(req.body);
  const resultStatus = await updateInviteData(
    inviteId,
    inviteData,
    req.connection.remoteAddress,
  );
  res.render('thanks', { message: resultStatus });
});

app.listen(port, () =>
  console.log(`Server running at http://127.0.0.1:${port}/`),
);
