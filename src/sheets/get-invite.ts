import { getToken, getConfig, getData } from './cache';
import { updateLastView } from './sheet-data';

export default async function getInviteData(code: string, ipAddress: string) {
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

  if (rowsThatMatch.length === 0) return null;

  // update entry, no need to wait on a result
  updateLastView(spreadsheetId, auth, rowsThatMatch, ipAddress);

  return rowsThatMatch.map((row) => row.data);
}
