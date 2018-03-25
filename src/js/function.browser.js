
export function parseHTML(aHTMLString){
    var dom =document.implementation.createHTMLDocument('pea3nut');
    dom.documentElement.innerHTML =aHTMLString;
    return dom.body;
}
/**
 * @link http://javascript.ruanyifeng.com/dom/element.html#toc12
 * */
export function getElementPosition(e) {
    var x = 0;
    var y = 0;
    while (e !== null)  {
        x += e.offsetLeft;
        y += e.offsetTop;
        e = e.offsetParent;
    }
    return {x: x, y: y};
}

