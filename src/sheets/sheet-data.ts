import util from 'util';
import { google } from 'googleapis';
import nowToString from './time';
import { Result } from './result';

export async function getData(spreadsheetId, auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  console.log('getting data from sheet ' + spreadsheetId);

  let res;
  try {
    res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'GuestList!A:G',
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
      range: `GuestList!J${rowNumber}:K${rowNumber}`, //TODO fix up col references
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

function getLock(current: string): number {
  return Number.parseInt(current) || 0;
}

export async function updateData(
  spreadsheetId,
  auth,
  rowsFiltered,
  updateDataArray,
  ipAddress,
): Promise<Result> {
  // create update model
  let updateModel;
  try {
    updateModel = rowsFiltered.map((row) => {
      const rowNumber = row.index + 1;
      console.log({ row });
      // TODO make this work with any column names
      const inputValues = updateDataArray.filter(
        (updateItem) => updateItem['guest'] === row.data[1],
      )[0];
      // TODO make this work with any column names
      const dataLock = row.data[6];
      if (getLock(inputValues['lock']) !== getLock(dataLock)) {
        console.log(
          `The data was already updated input: '${getLock(
            inputValues['lock'],
          )}' data: '${getLock(dataLock)}'`,
        );
        throw new Error('The data was already updated');
      }
      console.log({ inputValues });
      // TODO make this work with any column names
      const updateValues = [
        inputValues['attending'],
        inputValues['mealChoice'],
        inputValues['specialDiet'],
        inputValues['favouriteSong'],
      ];
      return {
        range: `GuestList!C${rowNumber}:I${rowNumber}`, //TODO fix up col references
        values: [
          [...updateValues, getLock(dataLock) + 1, nowToString(), ipAddress],
        ],
      };
    });
  } catch (error) {
    return Result.alreadySaved;
  }

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
    console.log(`Error updating invite data`);
    console.log(err);
    return Result.error;
  }
  return Result.success;
}
