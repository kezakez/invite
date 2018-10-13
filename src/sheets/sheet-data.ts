import util from 'util';
import { google } from 'googleapis';
import nowToString from './time';

export async function getData(spreadsheetId, auth) {
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

export async function updateLastView(
  spreadsheetId,
  auth,
  rowsThatMatch,
  ipAddress,
) {
  // update last view information
  const now = nowToString();
  const updateModel = rowsThatMatch.map((row) => {
    const rowNumber = row.index + 1;
    return {
      range: `GuestList!I${rowNumber}:J${rowNumber}`, //TODO fix up col references
      values: [[now, ipAddress]],
    };
  });
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        data: updateModel,
        valueInputOption: 'USER_ENTERED',
      },
    });
    //console.log(`updated cells: ${result.data.totalUpdatedCells}`);
  } catch (err) {
    console.log(err);
    return 'Error updating invite data';
  }
}

export async function updateData(
  spreadsheetId,
  auth,
  rowsFiltered,
  updateDataArray,
  ipAddress,
): Promise<string> {
  // create update model
  const updateModel = rowsFiltered.map((row) => {
    const rowNumber = row.index + 1;
    console.log({ row });
    // TODO make this work with any column names
    const inputValues = updateDataArray.filter(
      (updateItem) => updateItem['guest'] === row.data[1],
    )[0];
    console.log({ inputValues });
    // TODO make this work with any column names
    const updateValues = [
      inputValues['attending'],
      inputValues['mealChoice'],
      inputValues['specialDiet'],
      inputValues['favouriteSong'],
    ];
    return {
      range: `GuestList!C${rowNumber}:H${rowNumber}`, //TODO fix up col references
      values: [[...updateValues, nowToString(), ipAddress]],
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
    console.log('Error updating invite data');
    console.log(err);
    return 'Error updating invite data';
  }
  return 'done';
}
