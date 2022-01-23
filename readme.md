# sheet2tweet

Tweets rows from Google Sheets when they're updated to a specific account

-   Only tweets row when column "PUBLISH" is set to "READY"
-   Updates the value of "PUBLISH" to "TRUE" after posting
-   Adds date and time of post to "TIMESTAMP" column

## Libraries

-   dotenv
-   google spreadsheet
-   Twit
-   dayjs

## To Do:

-   Deploy script
-   Let it run on a daily basis
