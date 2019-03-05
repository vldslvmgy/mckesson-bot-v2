const fs = require('fs');
const pdf = require('pdf-parse');

const { getCalories } = require('./nutritionController');

const SOUP_EMPORIUM = "Soup Emporium";
const MORNING_EDITIONS = "Morning Editions";
const FRESH_GRILL = "Fresh Grill";
const CULINARY_TABLE = "Culinary Table";
const MENUTAIMENT = "Menutaiment";
const PANINI_SPECIAL = "Panini";
const AMIGO = "AMIGO’S";

const MONDAY = "Mon";
const TUESDAY = "Tue";
const WEDNESDAY = "Wed";
const THURSDAY = "Thurs";
const FRIDAY = "Frid";

let dataBuffer = {};


function dayOfWeekAsString(dayIndex) {
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][dayIndex];
}

function getToday() {
    return dayOfWeekAsString((new Date).getDay() - 1)
}

function getFullDayName(day) {
    if (day) {
        day = day.toLowerCase();
        if (day.includes("mon")) {
            return "monday";
        } else if (day.includes("tue")) {
            return "tuesday";
        } else if (day.includes("wed")) {
            return "wednesday";
        } else if (day.includes("thur")) {
            return "thursday";
        } else if (day.includes("fri")) {
            return "friday";
        } else {
            return getToday();
        }
    }
    return getToday();
}
async function parseMenuText() {
    return await pdf(dataBuffer).then(function (data) {

        return data.text
            .replace(/  +/g, ' ')
            .replace('PRICES DO NOT INCLUDE GST.', "")
            .replace('Chef’s Selection', "");
    }).catch(e => {
        console.log(e);
    });
}

async function parseMenuToDays(menuText) {

    const days = [];
    const monday = menuText
        .substring(menuText.indexOf(MONDAY), menuText.indexOf(TUESDAY)).trim();
    const tuesday = menuText
        .substring(menuText.indexOf(TUESDAY), menuText.indexOf(WEDNESDAY)).trim();
    const wednesday = menuText
        .substring(menuText.indexOf(WEDNESDAY), menuText.indexOf(THURSDAY)).trim();
    const thursday = menuText
        .substring(menuText.indexOf(THURSDAY), menuText.indexOf(FRIDAY)).trim();
    const friday = menuText
        .substring(menuText.indexOf(FRIDAY), menuText.indexOf(AMIGO)).trim();

    days.push(monday);
    days.push(tuesday);
    days.push(wednesday);
    days.push(thursday);
    days.push(friday);

    return days;
}

async function parseDaysToSelection(formattedDays, day) {

    let selectedDay;

    if (day) {
        day = day.toLowerCase();

        if (day.includes("mon")) {
            selectedDay = formattedDays[0];
        } else if (day.includes("tue")) {
            selectedDay = formattedDays[1];
        } else if (day.includes("wed")) {
            selectedDay = formattedDays[2];
        } else if (day.includes("thur")) {
            selectedDay = formattedDays[3];
        } else if (day.includes("fri")) {
            selectedDay = formattedDays[4];
        } else {
            return;
        }
    } else {
        selectedDay = formattedDays[0];
    }

    const menu = [];

    const soupEmporium = selectedDay
        .substring(selectedDay.indexOf(SOUP_EMPORIUM), selectedDay.indexOf(MORNING_EDITIONS))
        .replace(/\n/g, " ")
        .replace(/  +/g, " ")
        .trim();
    const morningEditions = selectedDay
        .substring(selectedDay.indexOf(MORNING_EDITIONS), selectedDay.indexOf(FRESH_GRILL))
        .replace(/\n/g, " ")
        .replace(/  +/g, " ")
        .trim();

    const freshGrill = selectedDay
        .substring(selectedDay.indexOf(FRESH_GRILL), selectedDay.indexOf(CULINARY_TABLE))
        .replace(/\n/g, " ")
        .replace(/  +/g, " ")
        .trim();

    const culinaryTable = selectedDay
        .substring(selectedDay.indexOf(CULINARY_TABLE), selectedDay.indexOf(MENUTAIMENT))
        .replace(/\n/g, " ")
        .replace(/  +/g, " ")
        .trim();

    const menutaiment = selectedDay
        .substring(selectedDay.indexOf(MENUTAIMENT), selectedDay.indexOf(PANINI_SPECIAL))
        .replace(/\n/g, " ")
        .replace(/  +/g, " ")
        .trim();

    const paniniSpecial = selectedDay
        .substring(selectedDay.indexOf(PANINI_SPECIAL), selectedDay.length)
        .replace(/\n/g, " ")
        .replace(/  +/g, " ")
        .trim();

    menu.push(soupEmporium);
    menu.push(morningEditions);
    menu.push(freshGrill);
    menu.push(culinaryTable);
    menu.push(menutaiment);
    menu.push(paniniSpecial);

    return menu;
}

const getPrice = (unformattedString) => unformattedString
    .substring(unformattedString.search(/\d/))
    .trim();

const getFood = (unformattedString, categoryString) => unformattedString
    .substring(unformattedString.indexOf(categoryString), unformattedString.search(/\d/))
    .replace('/Combo', '')
    .replace('Combo', '')
    .replace('/ Combo', '')
    .replace('price', '')
    .replace('Price', '')
    .replace(categoryString, '')
    .trim();

const getJSONMenu = async (menuSelections, selectedDay) => {
    return {
        day: selectedDay,
        items: [
            {
                category: SOUP_EMPORIUM,
                food: getFood(menuSelections[0], SOUP_EMPORIUM),
                price: getPrice(menuSelections[0]),
                calories: await getCalories(getFood(menuSelections[0], SOUP_EMPORIUM), true)
            },
            {
                category: MORNING_EDITIONS,
                food: getFood(menuSelections[1], MORNING_EDITIONS),
                price: getPrice(menuSelections[1]),
                calories: await getCalories(getFood(menuSelections[1], MORNING_EDITIONS), false)
            },
            {
                category: FRESH_GRILL,
                food: getFood(menuSelections[2], FRESH_GRILL),
                price: getPrice(menuSelections[2]),
                calories: await getCalories(getFood(menuSelections[2], FRESH_GRILL), false)
            },
            {
                category: CULINARY_TABLE,
                food: getFood(menuSelections[3], CULINARY_TABLE),
                price: getPrice(menuSelections[3]),
                calories: await getCalories(getFood(menuSelections[3], CULINARY_TABLE), false)
            },
            {
                category: MENUTAIMENT,
                food: getFood(menuSelections[4], MENUTAIMENT),
                price: getPrice(menuSelections[4]),
                calories: await getCalories(getFood(menuSelections[4], MENUTAIMENT), false)
            },
            {
                category: PANINI_SPECIAL,
                food: getFood(menuSelections[5], PANINI_SPECIAL),
                price: getPrice(menuSelections[5]),
                calories: await getCalories(getFood(menuSelections[5], PANINI_SPECIAL), false)
            }
        ]
    }
}

async function printMenuSelection(formattedSelection, day) {
    if (formattedSelection != null) {
        let selectedDay;

        if (day) {
            day = day.toLowerCase();

            if (day.includes("mon")) {
                selectedDay = "*Monday*"
            } else if (day.includes("tue")) {
                selectedDay = "*Tuesday*";
            } else if (day.includes("wed")) {
                selectedDay = "*Wednesday*";
            } else if (day.includes("thur")) {
                selectedDay = "*Thursday*";
            } else if (day.includes("fri")) {
                selectedDay = "*Friday*";
            } else {
                return;
            }
        } else {
            selectedDay = "*Monday*"
        }

        return selectedDay + "\n\n" + formattedSelection.join("\n");

    } else {
        return "Please enter /mckesson [day]"
    }
}

function getCachedMenu(day) {
    day = getFullDayName(day);
    if (fs.existsSync(`./menu-cache/${day}.json`)) {
        return JSON.parse(fs.readFileSync(`./menu-cache/${day}.json`, 'utf8'));
    }
};

function cacheMenu(menu, day) {
    // If the day argument is partial (ex: 'tues'), get the full day string
    day = getFullDayName(day);
    if (day) {
        fs.writeFile(`./menu-cache/${day}.json`, JSON.stringify(menu), 'utf8', err => {
            if (err) console.log(err);
        });
    }
}

async function getMenu(day) {
    day = getFullDayName(day);
    const cachedMenu = getCachedMenu(day);
    if (cachedMenu) return cachedMenu;
    dataBuffer = fs.readFileSync('./menu.pdf');
    const formattedText = await parseMenuText();
    const formattedDays = await parseMenuToDays(formattedText);
    const formattedSelection = await parseDaysToSelection(formattedDays, day);
    return await getJSONMenu(formattedSelection, day)
        .then((JSONMenu) => {
            const formattedMenu = getFormat(JSONMenu);
            cacheMenu(formattedMenu, day);
            return formattedMenu;
        });

}

function getFormat(menuString) {
    const format = {
        attachments: [
            {
                color: '#f4a442',
                title: menuString.day,
                fields: [],
            },
        ],
    };

    menuString.items.forEach((item) => {
        const calories = String(item.calories).split('.')[0];
        format.attachments[0].fields.push({
            title: item.category,
            value: `*Item*: ${item.food}\n*Price*: ${item.price.replace('Chef’s Selection', '')}\n*Calories (approx.)*: ${calories}`,
            pretext: item.price.replace('Chef’s Selection', ''),
            text: item.calories
        });
    });
    return format;
}

module.exports = {
    getMenu,
};