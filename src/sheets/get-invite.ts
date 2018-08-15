import { google } from 'googleapis';
import getConfig from './config';
import getToken from './auth';

export default async function getInviteData(code) {
  const { spreadsheetId } = await getConfig();
  const auth = await getToken();
  const sheets = google.sheets({ version: 'v4', auth });
  console.log('getting invite data ' + spreadsheetId);

  let res;
  try {
    res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'GuestList',
    });
  } catch (err) {
    console.log('The API returned an error: ' + err);
  }

  const rows = res.data.values;
  if (rows.length < 1) {
    console.log('No data found.');
  }

  const rowsThatMatch = rows.filter((row) => row[0] === code);
  // todo update lastview
  // rowsThatMatch.map(row => )
  return rowsThatMatch;
}
