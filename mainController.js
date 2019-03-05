const menuHelper = require('./menuHelper');
const http = require('http');
const path = require('path');
const fs = require('fs');

const PASSWORD = 'password';

async function downloadFile(url, res, callback) {
    // Rename original file
    fs.rename('menu.pdf', 'menu-backup.pdf', () => { });
    const file = fs.createWriteStream('menu.pdf');
    try {
        http.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close(callback);  // close() is async, call cb after close completes.
                // Delete back-up now that the download is sucessful. 
                fs.unlink('menu-backup.pdf', err => {
                    if (err) return err;
                });
            });
        });
    } catch (err) {
        // If download failed, revert rename of original pdf
        fs.rename('menu-backup.pdf', 'menu.pdf', () => { });
        res.send('*** Failed to download new menu.\n' + err);
    }
}

function invalidateMenuCache() {
    const directory = 'menu-cache'
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            if (file !== '.gitignore') {
                fs.unlink(path.join(directory, file), err => {
                    if (err) return err;
                });
            }
        }
    });
}

const processRequest = async (req, res) => {
    let args = req.body.text;
    // Exclusion of ':' means it's not a command (either a day or invalid argument)
    if (!args.includes(':')) {
        return await menuHelper.getMenu(args).then(menu => {
            return menu;
        });
    } else {
        args = args.split(':');
        if (args[0] == 'update') {
            if (args.length > 2) {
                if (args[1] == PASSWORD) {
                    const url = args.slice(2, args.length).join(':');
                    downloadFile(url, res, () => {
                        invalidateMenuCache();
                        return 'Updated menu and invalidated cache.';
                    });
                }
            }
        }
    }
};

module.exports = {
    processRequest
}