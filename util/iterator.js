function interator(myObject){
    Object.defineProperty(myObject),Symbol.interator,{
        enumerable : false,
        writable : false,
        configurable : false,
    }
}