function asyncDecorator(fn){

    function newFunction(req,res,next){
        fn(req,res,next).catch(next);
    }

    return newFunction;
}

module.exports = asyncDecorator;



