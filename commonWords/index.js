var fs = require('fs');
var path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);

async function load() {
    const Files = await readdir(path.join(__dirname));
    var f;
    Files.forEach(ff => {
        if (!ff.endsWith('.txt')) return;
        f += fs.readFileSync(path.join(__dirname, ff), {
            encoding: "utf-8"
        });
    });
    return new Set(f.split('\r\n')); 


}

async function remove(input) {
       var stopwords = await load()
 
    if (!Array.isArray(input)) {
        input = input.replace(/(?:[,.*`])|(?:'t)|<(?:[^\d>]+|:[A-Za-z0-9]+:)\w+>|/gi, '').split(' ');
        return input.filter(function (word) {
            return !stopwords.has(word)
        }).join(' ');
    } else {
        return input.filter(function (word) {
            return !stopwords.has(word)
        });
    }
}

module.exports = {
    load: load,
    remove: remove
}