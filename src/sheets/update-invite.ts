import { google } from 'googleapis';

import getData from './get-data';
import getConfig from './config';
import getToken from './auth';

export default async function updateInviteData(code, updateDataArray) {
  console.log('updating invite data');
  const { spreadsheetId } = await getConfig();
  const auth = await getToken();

  console.log({ updateDataArray });
  const rows = await getData(spreadsheetId, auth);

  // store headings
  const headings = rows[0].reduce((acc, heading, idx, array) => {
    acc[heading] = {
      column: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[idx],
      index: idx,
    };
    return acc;
  }, {});
  console.log({ headings });

  // add row indexes
  const rowsIndexed = rows.map((row, index) => {
    return {
      index,
      data: row,
    };
  });

  // filter out items that dont match
  const codeIndex = headings['SecretKey'].index;
  const rowsFiltered = rowsIndexed.filter(
    (row) => row.data[codeIndex] === code,
  );

  // key data based on headings
  const rowsKeyed = rowsFiltered.map((row) => {
    //row.data.map();
    return {
      index: row.index,
      data: row.data,
    };
  });

  // update the row data with matching items
  // updateDataArray.forEach(update => {
  //   const item = rowsFiltered.filter(row => row[1] === update.match.name);

  //   update.data.forEach(data => {
  //     if (data)
  //   });
  // });

  // update the sheet

  console.log(rowsKeyed);

  // get all the data that matches with row ids
  const data = [
    {
      range: 'GuestList!C4:I4',
      values: [
        [
          'localhost',
          '2019-01-01',
          '2019-01-01',
          'Yes',
          'Chicken',
          '',
          'Flametrees',
        ],
      ],
    },
    {
      range: 'GuestList!C6:I6',
      values: [
        [
          'localhost',
          '2019-01-01',
          '2019-01-01',
          'No',
          'Beef',
          '',
          'Flametrees',
        ],
      ],
    },
  ];

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const result = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        data,
        valueInputOption: 'RAW',
      },
    });
    console.log(`updated cells: ${result.data.totalUpdatedCells}`);
  } catch (err) {
    console.log(err);
    return 'Error updating invite data';
  }
  return 'done';
}
