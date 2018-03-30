"use strict";
// Functions
Object.defineProperty(exports, "__esModule", { value: true });
function getRandom(min, max, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.includedMin, includedMin = _c === void 0 ? true : _c, _d = _b.includedMax, includedMax = _d === void 0 ? false : _d;
    if (min > max)
        return getRandom(max, min, { includedMin: includedMin, includedMax: includedMax });
    if (includedMax)
        max++;
    if (!includedMin)
        min++;
    return Math.floor(Math.random() * (max - min) + min);
}
exports.getRandom = getRandom;
;
function randomPick(list) {
    return list[getRandom(0, list.length)];
}
exports.randomPick = randomPick;
;
function getRandomChar(len) {
    return new Array(len)
        .fill(null)
        .map(randomPick.bind(null, 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ123456789')).join('');
}
exports.getRandomChar = getRandomChar;
;
function Assert(val) { return val; }
exports.Assert = Assert;
;
function noLeftSpace(literals) {
    var str = '';
    if (typeof literals === 'string') {
        str = literals;
    }
    else if (Array.isArray(literals)) {
        var args = Array.from(arguments).map(function (i) { return i.toString(); });
        var i = 0;
        while (i < literals.length) {
            str += literals[i++];
            if (i < args.length) {
                var lines_1 = args[i].split('\n');
                var startSpace = literals[i - 1].split('\n').pop();
                if (lines_1.length !== 1 && !startSpace.trim()) {
                    for (var g = 1; g < lines_1.length; g++) {
                        lines_1[g] = startSpace + lines_1[g];
                    }
                    ;
                    str += lines_1.join('\n');
                }
                else {
                    str += args[i];
                }
            }
        }
    }
    ;
    var lines = str.split('\n');
    if (!lines[0].trim())
        lines.splice(0, 1);
    if (!lines[lines.length - 1].trim())
        lines.splice(lines.length - 1, 1);
    var minSpaceCount = function (countList) {
        return Math.min.apply(Math, countList) || Math.min.apply(Math, countList.slice(1))
            || 0;
        ;
    }(lines.map(function (str) {
        var space = str.match(/^\s+/);
        return space ? space[0].length : 0;
    }));
    if (minSpaceCount === 0)
        return str;
    var replaceSpaceExp = new RegExp('^\\s{' + minSpaceCount + '}');
    lines = lines.map(function (line) { return line.replace(replaceSpaceExp, ''); });
    return lines.join('\n');
}
exports.noLeftSpace = noLeftSpace;
;
exports.o_0 = noLeftSpace;
