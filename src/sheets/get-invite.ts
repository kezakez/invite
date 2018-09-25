import { google } from 'googleapis';

import getData from './get-data';
import getConfig from './config';
import getToken from './auth';

export default async function getInviteData(code, ipAddress) {
  console.log('getting invite data');

  const { spreadsheetId } = await getConfig();
  const auth = await getToken();

  const rows = await getData(spreadsheetId, auth);

  // add row indexes
  const rowsIndexed = rows.map((row, index) => {
    return {
      index,
      data: row,
    };
  });

  const rowsThatMatch = rowsIndexed.filter((row) => row.data[0] === code);

  // update last view information
  const updateModel = rowsThatMatch.map((row) => {
    const rowNumber = row.index + 1;
    return {
      range: `GuestList!I${rowNumber}:J${rowNumber}`, //TODO fix up col references
      values: [[new Date().toString(), ipAddress]],
    };
  });

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const result = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        data: updateModel,
        valueInputOption: 'RAW',
      },
    });
    console.log(`updated cells: ${result.data.totalUpdatedCells}`);
  } catch (err) {
    console.log(err);
    return 'Error updating invite data';
  }

  return rowsThatMatch.map((row) => row.data);
}
