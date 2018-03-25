export function afterLoad(fn){
    if(document.readyState !=='loading'){
        setTimeout(fn);
    }else{
        document.addEventListener('DOMContentLoaded' ,fn);
    };
};
export function setDefalut(obj ,key ,val){
    if(key in obj) return false;
    obj[key] =val;
    return true;
};

export function getPeanutAge(){
    let now=new Date();
    var nowYear=now.getFullYear();
    var nowMonth=now.getMonth()+1;
    var nowDay=now.getDay();
    if(nowMonth>=5 && nowDay>=18){
        return nowYear-1995+1;
    }else{
        return nowYear-1995;
    }
};

export function getRandom(min,max,{includedMin=true,includedMax=false,isInt=true}={}){
    if(!includedMin && includedMax){
        return -getRandom.call(null ,-max ,-min ,{includedMin:includedMax,includedMax:includedMin,isInt});
    }

    if(includedMin && includedMax && !isInt){
        console.wran('getRandom: could not create both sides included random number.');
        console.wran('miss max side.');
        includedMax=false;
    }

    var random=null;
    if(!includedMax){
        random =Math.random()*(max-min)+min;
        if(isInt) random=Math.floor(random);
    }else if(includedMax && isInt){
        random =Math.floor(
            Math.random()*(max+1-min)+min
        );
    };

    if(!includedMin && random===min){
        return getRandom.apply(null ,arguments);
    }else{
        return random;
    }
};

export function getRandomChar(len){
    var str ="abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ123456789";
    var random =[];
    for(let i =0 ;i<len ;i++){
        let rand = Math.floor(Math.random() * str.length);
        random.push(str.charAt(rand));
    };
    return random.join('');
};

export function renderMarkDown(text){
    if(!text)return '<p></p>';
    var Marked =require('marked');
    // 清理共同缩进的空格
    let lines =text.split('\n');
    for(let i=0 ;i<lines.length-2 ;i++){
        if(lines[i][0] ==='<') continue; // Vue渲染组件时会移除头部空格，因此需要检测跳过
        let num1 =lines[i].match(/^[\t ]*/)[0].length;
        let num2 =lines[++i].match(/^[\t ]*/)[0].length;
        if(/^[\t ]*$/.test(lines[i]) && num1!==num2) break;
    }
    var replaceSpace =function(){
        for(let line of lines){
            if(!/^([\t ]*|<.+)$/.test(line)) return line.match(/^[\t ]*/)[0].length;
        };
    }();
    if(replaceSpace !==0){
        let exp =new RegExp(`^[\t ]{${replaceSpace}}`);
        lines =lines.map(line=>line.replace(exp,''));
    }
    // 修正打头 > 被转义成 &gt;
    for(let i=0 ;i<lines.length ;i++){
        lines[i] =lines[i].replace(/^\&gt; / ,'> ');
    };

    text =lines.join('\n');
    // 自定义渲染逻辑
    // @- xxx -@
    // @| xxx |@
    // @@[xxx](xxx)@@
    text =text
        .replace(
            /@@ ?\[(.+?)\] ?\(([\W\w]+?)\) ?@@/g
            //,'<i class="tb-detail" rbd-tooltip="$2">$1</i>'
            ,function(str ,group1 ,group2){
                return `<i class="tb-detail" rbd-tooltip="${encodeURIComponent(group2)}">${group1}</i>`
            },
        )
        .replace(/@\- ?/g ,'<i class="tb-not">')
        .replace(/@\| ?/g ,'<i class="tb-hidden">')
        .replace(/\-@|\|@/g ,'</i>')
    ;
    // 自定义渲染逻辑
    // ;;at;; => @
    text =text.replace(/;;at;;/g ,'@');
    // 自定义渲染逻辑
    // ;;lt;; => <
    // ;;gt;; => >
    text =text.replace(/;;lt;;/g ,'<').replace(/;;gt;;/g ,'>');


    var markdown =Marked(text);
    var dom =HTMLParser(markdown);

    /**
     * 修正
     * > text1
     * > text2
     * 会渲染为 <blockquote><p>text1\ntext2</p></blockquote> 的bug
     *
     * 增加
     * > —— 出自xxx
     * => <p class="markdown-render-quite---"></p> 这个会自动检测简写
     * > xxx:\s
     * => <p class="markdown-render-quite-xxx"></p>
     * */
    Array.from(
        dom.querySelectorAll('blockquote p')
    ).forEach(function(pElt){
        pElt.innerHTML=pElt.innerHTML.replace(/\n/g,'<br />');
        if(pElt.innerHTML.substr(0,2) ==='——'){
            pElt.classList.add('markdown-render-quite---');
        }else if(/^[\w\-]{1,10}: /.test(pElt.innerHTML)){
            pElt.classList.add(
                'markdown-render-quite-'
                +pElt.innerHTML.substr(
                    0,
                    pElt.innerHTML.indexOf(':')
                )
            );
        }else if(/<br[ \/]*>——/.test(pElt.innerHTML)){// 检测简写
            pElt.innerHTML =pElt.innerHTML
                .replace(/<br[ \/]*>—— ?/ ,'</p><p class="markdown-render-quite---">—— ')
                +'</p>'
            ;
        }
    });
    /**
     * 替换自定义HTML实体标记 &pea-empty;
     * */
    Array.from(
        dom.querySelectorAll('pre,code')
    ).forEach(function(elt){
        elt.innerHTML=elt.innerHTML.replace(/\&pea-empty;/g,'');
    });
    /**
     * 修正a标签的target
     * */
    Array.from(
        dom.getElementsByTagName('a')
    ).forEach(function(elt){
        if(
            elt.getAttribute('href').substr(0,4) ==='http'
            || elt.getAttribute('href').substr(0,2) ==='//'
        ){
            elt.target ='_blank';
        };
    });
    /**
     * 增加![](xxx)父元素的类
     * <p><img /></p> => <p class="markdown-render-only-img-p"><img /></p>
     * */
    Array.from(
        dom.querySelectorAll('p img')
    ).forEach(function(elt){
        if(elt.parentNode.childNodes.length ===1){
            elt.parentNode.classList.add('markdown-render-only-img-p');
        }
    });

    return dom.innerHTML;
};

export function formatDate(timestamp=new Date ,{hasTime=true ,fillZeroOfDate=true ,fillZeroOfTime=true}={}){
    var date;
    if(timestamp instanceof Date){
        date=timestamp;
    }else if(typeof timestamp ==='number'){
        date =new Date(timestamp);
    }else if(typeof timestamp ==='string'){
        var arr =timestamp.match(/\d+/g);
        arr[1] &&arr[1]--;//修正月份-1
        date =new Date(...arr);
    }else{
        throw new Error('formatDate: could not parse arguments[0] => '+timestamp);
    }




    var arr1 =[];
    arr1.push(date.getFullYear());
    arr1.push(date.getMonth()+1);
    arr1.push(date.getDate());
    if(fillZeroOfDate)fillZero(arr1);
    if(hasTime===false) return arr1.join('-');
    var arr2 =[];
    arr2.push(date.getHours());
    arr2.push(date.getMinutes());
    arr2.push(date.getSeconds());
    if(fillZeroOfTime)fillZero(arr2);
    return arr1.join('-')+' '+arr2.join(':')

    function fillZero(arr){
        for(var i=0 ;i<arr.length ;i++){
            let temp=arr[i];
            temp =temp>9 ?temp :'0'+temp;
            arr[i]=temp;
        };
    };
}


export function isMobile() {
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ){
        return true;
    }
    else {
        return false;
    }
}

export function HTMLParser(aHTMLString){
    var dom =document.implementation.createHTMLDocument("example");
    dom.documentElement.innerHTML =aHTMLString;
    return dom.body;
}

export function fRes(){
    var reObj ={};
    var argn =Array.from(arguments);

    if(argn[0] ===true){
        reObj.errcode =0;
        reObj.errmsg ='ok';
    }else{
        reObj.errcode =1;
        reObj.errmsg ='error';
    };
    if(typeof argn[0] ==='boolean') argn.shift();


    if(typeof argn[0] ==='string'){
        reObj.errmsg =argn[0];
    }else if(typeof argn[0] ==='object'){
        for(let key in argn[0]){
            reObj[key]=argn[0][key];
        };
    };

    return JSON.stringify(reObj);
}


export function formatAxiosResponse({data ,status ,statusText}){
    if(status!==200 && status!==304){
        throw new Error(`formatAxiosResponse: Server response ${status} ${statusText}`)
    }
    if(data.errcode){
        throw new Error(`formatAxiosResponse: ${JSON.stringify(data,null,'   ')}`);
    };
    delete data.errcode;
    delete data.errmsg;
    return data;
}

export function clearObjOfNull(obj){
    for(let key in obj){
        obj[key]=null;
    }
}



export function deleteEqualItem(arr1,arr2){
    for(var i=0 ;i<arr1.length ;i++){
        var index =arr2.indexOf(arr1[i]);
        if(index!==-1){
            arr1.splice(i,1);
            arr2.splice(index,1);
        };
    };
};






export function copyObject(target){
    var obj ={};
    for(let key in target){
        var opd = Object.getOwnPropertyDescriptor(target ,key);

        if (
            opd
            &&(
                !opd.writable
                || !opd.configurable
                || !opd.enumerable
                || opd.get
                || opd.set
            )
        ){
            Object.defineProperty(obj ,key ,opd);
        }else{
            obj[key] =target[key];
        };
    };
    return obj;
};

export function parseURL(url=document.URL){
    var arr  =url.match(/^(?:(https?)\:)?\/\/([\w\_\.]+)((?:\/[^\/?]*)*)\/?(?:\?(.+))?$/);
    var data ={
        protocol:arr[1],
        domain:arr[2],
        path:arr[3],
        query:arr[4],
    };
    if(data.query && data.query.indexOf('=')!==-1){
        data.query ={};
        for(let item of arr[4].split('&')){
            let tmp =item.split('=');
            data.query[tmp[0]]=tmp[1];
        };
    }
    return data;
}

export function sleep(ms){
    var ts =+new Date;
    while(true){
        if(+new Date -ts >=ms) break;
    }
    return +new Date -ts;
}

