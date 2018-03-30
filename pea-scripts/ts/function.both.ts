
// Functions

export function getRandom(
    min:number,
    max:number,
    {includedMin=true,includedMax=false}={},
):number{

    if(min>max) return getRandom(max,min,{includedMin,includedMax});

    if(includedMax) max++;
    if(!includedMin) min++;

    return Math.floor(Math.random()*(max-min)+min);

};

export function randomPick<T>(list:T[]):T{
    return list[getRandom(0,list.length)];
};

export function getRandomChar(len:number):string{
    return new Array(len)
        .fill(null)
        .map(
            randomPick.bind(null,'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ123456789')
        ).join('')
    ;
};

export function Assert<T>(val:T){return val};

export function noLeftSpace(stringArr:TemplateStringsArray, ...values:any[]):string;
export function noLeftSpace(str:string):string;
export function noLeftSpace(literals:any):string{
    var str ='';
    if(typeof literals ==='string'){
        str =literals;
    }else if(Array.isArray(literals)){
        let args =Array.from(arguments).map(i=>i.toString());
        let i = 0;
        while (i < literals.length) {
            str += literals[i++];
            if (i < args.length) {
                let lines =args[i].split('\n');
                let startSpace =literals[i-1].split('\n').pop();
                if(lines.length!==1 && !startSpace.trim()){
                    for(let g=1 ;g<lines.length ;g++){
                        lines[g] =startSpace +lines[g];
                    };
                    str +=lines.join('\n');
                }else{
                    str += args[i];
                }
            }
        }
    };



    var lines =str.split('\n');

    if(!lines[0].trim())lines.splice(0,1);
    if(!lines[lines.length-1].trim())lines.splice(lines.length-1,1);

    var minSpaceCount =function(countList){
        return Math.min(...countList)
            || Math.min(...countList.slice(1))
            || 0;
        ;
    }(lines.map(function(str:string):number{
        let space =str.match(/^\s+/);
        return space?space[0].length:0;
    }));

    if(minSpaceCount===0)return str;

    var replaceSpaceExp =new RegExp('^\\s{'+minSpaceCount+'}');

    lines =lines.map(line=>line.replace(replaceSpaceExp,''));


    return lines.join('\n');
};
export const o_0 =noLeftSpace;

// Types

export type ToString<T> =string;
export type IndexMap<K extends string ,V> ={
    [key in K] :V;
};
export type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
