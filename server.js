const express = require('express');
const bodyParser = require('body-parser');
const mainController = require('./mainController')

const app = express();
const port = process.env.PORT || 3939;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/mckesson', async (req, res) => {
    await mainController.processRequest(req, res).then((menu) => {
        return res.send(menu);
    });
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});


