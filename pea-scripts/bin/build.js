const Fs =require('fs');
const Path =require('path');

const BrowserFunctionPath =Path.join(__dirname,'../dist/function.browser.js');
const NodeFunctionPath =Path.join(__dirname,'../dist/function.node.js');

Fs.writeFileSync(
    BrowserFunctionPath,
    format2ECMA6(
        Fs.readFileSync(Path.join(__dirname,'../src/function.browser.js')).toString()
        +Fs.readFileSync(Path.join(__dirname,'../src/function.both.js')).toString()
    )
);

Fs.writeFileSync(
    NodeFunctionPath,
    format2node(
        Fs.readFileSync(Path.join(__dirname,'../src/function.node.js')).toString()
        +Fs.readFileSync(Path.join(__dirname,'../src/function.both.js')).toString()
    )
);

console.log('ok');

function format2node(string){
    return string.replace(/^function (\w+)\s?\(/mg,function(matched,p1){
        return `exports.${p1} =${matched}`;
    });
};

function format2ECMA6(string){
    return string.replace(/^function/mg,'export function');
};