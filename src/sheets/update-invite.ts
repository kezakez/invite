import { google } from 'googleapis';
import getConfig from './config';
import getToken from './auth';

export default async function updateInviteData(code, updateDataArray) {
  const { spreadsheetId } = await getConfig();
  console.log('updating invite data');
  const auth = await getToken();
  const sheets = google.sheets({ version: 'v4', auth });

  // get all the data
  let res;
  try {
    res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'GuestList',
    });
  } catch (err) {
    console.log('The API returned an error: ' + err);
  }

  // store headings
  const heading = res.data.values[0];
  console.log(heading);

  // add row indexs
  const rows = res.data.values;
  const rowsIndexed = rows.map((row, index) => {
    return {
      index,
      data: row,
    };
  });

  // filter out items that dont match
  const rowsFiltered = rowsIndexed.filter((row) => row.data[0] === code);

  // update the row data with matching items
  // updateDataArray.forEach(update => {
  //   const item = rowsFiltered.filter(row => row[1] === update.match.name);

  //   update.data.forEach(data => {
  //     if (data)
  //   });
  // });

  // update the sheet

  console.log(rowsFiltered);

  // // get all the data that matches with row ids
  // let values = [
  //   ['2019-01-01', '2019-01-01', 'Y', 'Chicken', ''],
  //   ['2019-01-01', '2019-01-01', 'Y', 'Beef', ''],
  // ];
  // const data = [
  //   {
  //     range: 'GuestList!C4:G',
  //     values,
  //   },
  // ];

  // try {
  //   const result = await sheets.spreadsheets.values.batchUpdate({
  //     spreadsheetId,
  //     requestBody: {
  //       data,
  //       valueInputOption: 'RAW',
  //     },
  //   });
  //   console.log(result.data.totalUpdatedCells);
  //   return 'ok';
  // } catch (err) {
  //   console.log(err);
  //   return 'Error updating invite data';
  // }
  return 'done';
}
