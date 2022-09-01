function concat(translate) {
  return function(){
    var outStr = '';
    for(var arg in arguments){
        if(typeof arguments[arg]!='object'){
            outStr += arguments[arg];
        }
    }
    return translate(outStr);
  }
}

module.exports = concat;