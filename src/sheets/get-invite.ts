import getData from './get-data';
import getConfig from './config';
import getToken from './auth';

export default async function getInviteData(code) {
  console.log('getting invite data');

  const { spreadsheetId } = await getConfig();
  const auth = await getToken();

  const rows = await getData(spreadsheetId, auth);

  const rowsThatMatch = rows.filter((row) => row[0] === code);

  // todo update lastview
  // rowsThatMatch.map(row => )
  return rowsThatMatch;
}
