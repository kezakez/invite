export { default as getInviteData } from './get-invite';
export { default as updateInviteData } from './update-invite';

// export async function run() {
//   // gets current data values
//   const dataArray = await getInviteData('test123');
//   console.log(dataArray);

//   // updates fields and last write time, returns error string or ok
//   const resultStatus = await updateInviteData('test123', [
//     {
//       match: { name: 'Test Name' },
//       data: [{ coming: 'Y' }, { mealChoice: 'Beef' }],
//     },
//     {
//       match: { name: 'Test Name2' },
//       data: [{ coming: 'Y' }, { mealChoice: 'Beef' }],
//     },
//   ]);
//   console.log(resultStatus);
// }

// export default run;
