const { WebClient } = require('@slack/client');
const MckHelpers = require('./helper');
const lasagnaHelper = require('./lasagnaHelper');


const LASAGNA_ALERT = ":alert: It's Lasagna day! :alert:"

const web = new WebClient(process.env.SLACK_TOKEN);

async function isLasagnaDay() {
    let menu = await MckHelpers.getMenu()
    if (menu.toLowerCase().indexOf('lasagna') != -1) {
        console.log("lasagna is present");
    }
}

(async () => {
    let menu = await MckHelpers.getMenu()
    const lasagnaDay = await isLasagnaDay();
    if (!lasagnaDay) {
            // See: https://api.slack.com/methods/chat.postMessage
    const res = await web.chat.postMessage({ channel: 'GGGE91DEG', text: menu });

    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
    }
})();


