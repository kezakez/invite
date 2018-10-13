import { getToken, getConfig, getData, updateData } from './cache';

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

export default async function updateInviteData(code, reqBody, ipAddress) {
  const updateDataArray = transformBody(reqBody);
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

  // update data
  return updateData(
    spreadsheetId,
    auth,
    rowsFiltered,
    updateDataArray,
    ipAddress,
  );
}
