const Promise = require('bluebird');

function someAsyncFunction() {
    return Promise.resolve(Math.random());
}

function someOtherAsyncFunction(seed) {
    return Promise.resolve(Math.random() + 200*seed);
}

Promise.coroutine(function* () {
    const result1 = yield someAsyncFunction();
    const result2 = yield someOtherAsyncFunction(result1);
    console.log(result1, result2);
})();

/*
    Coroutines provide a simple way to write synchronous code.
    In olden days, we'd write promise chains like these:

    someAsyncFunction()
    .then(
        function(result1) {
            console.log(result1);
            return someOtherAsyncFunction(seed);
        }
    )
    .then(
        function(result2) {
            console.log(result2);
        }
    );

    Coroutines solve this problem through generators, and provide
    an easy way of programming promise chains.

    Our goal is to create a Promise.coroutine like function.
    This function should take a generator function and behave exactly the one
    above.
*/