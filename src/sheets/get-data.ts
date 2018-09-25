import { google } from 'googleapis';

export default async function getData(spreadsheetId, auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  console.log('getting data from sheet ' + spreadsheetId);

  let res;
  try {
    res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'GuestList!A:F',
    });
  } catch (err) {
    console.log('The API returned an error: ' + err);
  }

  const rows = res.data.values;
  if (rows.length < 1) {
    console.log('No data found.');
  }

  return rows;
}
