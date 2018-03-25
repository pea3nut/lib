function formatDate(
    timestamp=new Date ,
    {hasTime=true ,fillZeroOfDate=true ,fillZeroOfTime=true}={}
){
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
};


function getRandom(min,max,{includedMin=true,includedMax=false,isInt=true}={}){
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

function getRandomChar(len){
    var str ="abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ123456789";
    var random =[];
    for(let i =0 ;i<len ;i++){
        let rand = Math.floor(Math.random() * str.length);
        random.push(str.charAt(rand));
    };
    return random.join('');
};

function getRandomItem(arrayLike){
    let rand = Math.floor(Math.random() * arrayLike.length);
    return  arrayLike[rand];
};

function debounce({fn,idle=10,context=null,run=false,runSync=false}){
    var timer = null;
    var wrapper =function(){
        clearTimeout(timer);
        timer = setTimeout(()=>{
            fn.apply(context,arguments);
        } ,idle);
    };
    if(run)wrapper();
    else if (runSync) fn.call(context);
    return wrapper;
};