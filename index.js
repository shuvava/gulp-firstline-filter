'use strict';

const fs = require('fs');
const streamfilter = require('streamfilter');
const _ = require('lodash');

const firstline = path => new Promise((resolve, reject) => {
    const rs = fs.createReadStream(path);
    let line = '';
    let pos = 0;
    rs.on('data', (chunk) => {
        const index = chunk.indexOf('\n');
        line += chunk;
        if (index === -1) {
            pos += chunk.length;
        } else {
            pos += index;
            rs.close();
        }
    })
        .on('close', () => resolve(line.slice(0, pos)))
        .on('error', err => reject(err));
});

module.exports = (pattern, opt) => {
    const options = Object.assign({ restore: false }, opt);
    return streamfilter((file, enc, cb) => fs.exists(file.path, (exists) => {
        if (exists) {
            firstline(file.path)
                .then((line) => {
                    if (pattern instanceof RegExp) {
                        return pattern.test(line);
                    } else if (_.isFunction(pattern)) {
                        return pattern(line);
                    }
                    throw new Error('Expected RegExp or function as pattern');
                })
                .then(match => cb(!match));
        } else {
            cb(true);
        }
    }), {
        objectMode: true,
        passthrough: options.passthrough !== false,
        restore: options.restore,
    });
};
