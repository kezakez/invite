An invite site that uses google sheets to store the responses.

Modify files in views and public to change the invite details.

Example config/config.json
```
{
  "spreadsheetId": "googlespreadsheetId"
}
```

Read https://developers.google.com/sheets/api/quickstart/nodejs for information about getting a spreadsheetId credentials.json and token.json file.

Content is rendered server side, a SecretKey is unique per party group to view the invite details and rsvp for all members of the group.

A google spread sheet is required to store the rsvp details. The column headings of the sheet should be: 
SecretKey,Guest,Attending,MealChoice,SpecialDiet,FavouriteSong,Lock,LastWrite,LastWriteIp,LastView,LastViewIp

The most up to date docker image is available here: https://hub.docker.com/r/kezakez/invite

To run locally
Use `yarn watch` to start the server in development mode.
