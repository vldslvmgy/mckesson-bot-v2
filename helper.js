const fs = require('fs');
const pdf = require('pdf-parse');

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
        .trim();
    const morningEditions = selectedDay
        .substring(selectedDay.indexOf(MORNING_EDITIONS), selectedDay.indexOf(FRESH_GRILL))
        .trim();

    const freshGrill = selectedDay
        .substring(selectedDay.indexOf(FRESH_GRILL), selectedDay.indexOf(CULINARY_TABLE))
        .trim();

    const culinaryTable = selectedDay
        .substring(selectedDay.indexOf(CULINARY_TABLE), selectedDay.indexOf(MENUTAIMENT))
        .trim();

    const menutaiment = selectedDay
        .substring(selectedDay.indexOf(MENUTAIMENT), selectedDay.indexOf(PANINI_SPECIAL))
        .trim();

    const paniniSpecial = selectedDay
        .substring(selectedDay.indexOf(PANINI_SPECIAL), selectedDay.length)
        .trim();

    menu.push(soupEmporium);
    menu.push(morningEditions);
    menu.push(freshGrill);
    menu.push(culinaryTable);
    menu.push(menutaiment);
    menu.push(paniniSpecial);

    return menu;
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

module.exports = {
    parseMenuText,
    parseMenuToDays,
    parseDaysToSelection,
    printMenuSelection
}