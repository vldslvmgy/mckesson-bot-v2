const MckHelpers = require('./helper');

const LASAGNA_ALERT = ":alert: It's Lasagna day! :alert:"

async function hasLasagna() {
    let menu = await MckHelpers.getMenu()
    if (menu.toLowerCase().indexOf('lasagna') != -1) {
        console.log("lasagna is present");
    }
}




