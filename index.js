require("dotenv").config(); // load the environment variables
const dayjs = require("dayjs");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { TwitterApi } = require("twitter-api-v2");
const Twit = require("twit");

// console.log(process.env);
dayjs().format();

console.log("🚀 Starting the app");

var twit = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const doc = new GoogleSpreadsheet(
    "1hfyJImP8m38dRnhKUJ_m5V7g3aIkAuTJSbvbiNCxzVw"
); // this is the specific spreadsheet I want to access; I have shared my service account email address with the spreadsheet

const accessSheet = async () => {
    try {
        // this is the function that authenticates the service account and accesses the spreadsheet
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        });
        await doc.loadInfo();
        console.log(doc.title);
        // loading the spreadsheet and logging the title
        const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
        // const rows = await sheet.getRows(); // this is the array of rows in the spreadsheet
        // console.log(rows); // this is the array of rows in the spreadsheet
        return sheet;
    } catch (error) {
        console.log(
            "Attention 🚨 there was an error at spreadsheet data",
            error
        );
    }
};

const getTweet = async () => {
    const data = await accessSheet();
    console.log("📝 Getting the tweets");
    // this is the function that gets the tweets from the spreadsheet
    const rows = await data.getRows({
        offset: 1, // skips the header
    });

    // checks if a Tweet is ready and if it has been published yet

    rows.forEach(async (row) => {
        if (row.Ready === "TRUE" && row.Published === "FALSE") {
            console.log(row);

            // this is the function that publishes the tweet
            twit.post(
                "statuses/update",
                {
                    status: `${row.Name}: ${row.Description} | 👉🏼 ${row.URL} |  ${row.Handle} | ${row.Hashtags}`,
                },
                function (err, data, response) {
                    // console.log(data);
                    console.log(response);
                }
            );

            // this is the function that updates the spreadsheet
            let now = dayjs();

            row.Published = "TRUE";
            row.Timestamp = now;
            await row.save();
            console.log("The End");
        } else {
            console.log("Nothing to post!");
        }
    });
};

getTweet();
