const express = require('express');
const bodyParser = require('body-parser');

const MckHelpers = require('./helper');

const app = express();
const port = process.env.PORT || 3939;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/mckesson', async (req, res) => {
    // req.body.text is the day of the week
    res.send(await MckHelpers.getMenu(req.body.text));
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});


