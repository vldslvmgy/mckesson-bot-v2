const express = require('express');
const bodyParser = require('body-parser');

const MckHelpers = require('./helper');

const app = express();
const port = process.env.PORT || 3939;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/mckesson', async (req, res) => {
    const formattedText = await MckHelpers.parseMenuText();
    const formattedDays = await MckHelpers.parseMenuToDays(formattedText);
    const formattedSelection = await MckHelpers.parseDaysToSelection(formattedDays, req.body.text);
    const menuString = await MckHelpers.printMenuSelection(formattedSelection, req.body.text);

    res.send(menuString);
});
``
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});


