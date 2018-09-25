import { google } from 'googleapis';
import util from 'util';

import getData from './get-data';
import getConfig from './config';
import getToken from './auth';

export default async function updateInviteData(
  code,
  updateDataArray,
  ipAddress,
) {
  console.log('updating invite data');
  const { spreadsheetId } = await getConfig();
  const auth = await getToken();

  console.log({ updateDataArray });
  const rows = await getData(spreadsheetId, auth);

  // store headings
  const headings = rows[0].reduce((acc, heading, idx) => {
    acc[heading] = {
      column: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[idx],
      index: idx,
    };
    return acc;
  }, {});
  //console.log({ headings });

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

  // create update model
  const updateModel = rowsFiltered.map((row) => {
    const rowNumber = row.index + 1;
    console.log({ row });
    // TODO make this work with any column names
    const inputValues = updateDataArray.filter(
      (updateItem) => updateItem.guest === row.data[1],
    )[0];
    console.log({ inputValues });
    // TODO make this work with any column names
    const updateValues = [
      inputValues.attending,
      inputValues.mealChoice,
      inputValues.specialDiet,
      inputValues.favouriteSong,
    ];
    return {
      range: `GuestList!C${rowNumber}:H${rowNumber}`, //TODO fix up col references
      values: [[...updateValues, new Date().toString(), ipAddress]],
    };
  });

  console.log(util.inspect(updateModel, { showHidden: false, depth: null }));

  // update the sheet
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
  return 'done';
}
