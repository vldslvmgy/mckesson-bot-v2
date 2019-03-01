const fs = require('fs');
const pdf = require('pdf-parse');
const { getCalories } = require('./nutritionController')

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

let dataBuffer = fs.readFileSync('./menu.pdf');

async function parseMenuText() {
    return await pdf(dataBuffer).then(function (data) {

        return data.text
            .replace(/  +/g, ' ')
            .replace('PRICES DO NOT INCLUDE GST.', "")
            .replace('Chef’s Selection', "");
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
        .replace('price', '')
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

function dayOfWeekAsString(dayIndex) {
    return ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"][dayIndex];
}

function getToday() {
    return dayOfWeekAsString((new Date).getDay() - 1)
}

async function getMenu(day) {
    day = day ? day : getToday();
    const formattedText = await parseMenuText();
    const formattedDays = await parseMenuToDays(formattedText);
    const formattedSelection = await parseDaysToSelection(formattedDays, day);
    return await getJSONMenu(formattedSelection, day)
        .then((JSONMenu) => {
            return getFormat(JSONMenu);
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
        format.attachments[0].fields.push({
            title: item.category,
            value: item.food,
            pretext: item.price,
            text: item.calories
        });
    });
    return format;
}

module.exports = {
    getMenu,
}