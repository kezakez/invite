import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { google } from 'googleapis';
import util from 'util';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'config/token.json';

export default async () => {
  // Load client secrets from a local file.
  const readFile = util.promisify(fs.readFile);
  let credentials;
  try {
    console.log('reading credentials file');
    const content = await readFile(
      path.join(process.cwd(), 'config/credentials.json'),
    );
    credentials = JSON.parse(content.toString());
  } catch (err) {
    console.log('Error loading client secret file:', err);
  }

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  // Check if we have previously stored a token.
  let token;
  try {
    console.log('reading token file');
    token = await readFile(TOKEN_PATH);
  } catch (err) {
    const getNewTokenAsync = util.promisify(getNewToken);
    token = await getNewTokenAsync(oAuth2Client);
  }

  oAuth2Client.setCredentials(JSON.parse(token));

  return oAuth2Client;
};

async function getNewToken(oAuth2Client, callback) {
  console.log('getting new token');
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          'Error while trying to retrieve access token',
          err,
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
