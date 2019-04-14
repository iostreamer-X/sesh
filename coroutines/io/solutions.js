function someAsyncFunction() {
    return Promise.resolve(Math.random());
}

function someOtherAsyncFunction(seed) {
    return Promise.resolve(Math.random() + 200*seed);
}

function* someGenerator(params) {
    const result1 = yield someAsyncFunction();
    const result2 = yield someOtherAsyncFunction(result1);
    return [result1, result2];
}



/* 
    This is our core logic. It's a recursive function,
    all it does, is extract values from an iterator.
    If the done key in extracted object is true, it simply returns
    the extracted result(wrapped in a promise).

    If not, then it assumes that extracted result was a promise.
    And a recursive call is registered in that promise's then callback.

    This way, we load our promises lazily and execute our generator function.
*/

function _executor(iterator, result) {
    const { value: promise, done } = iterator.next(result);
    if (done) {
        return Promise.resolve(promise);
    }
    return promise.then(
        result => _executor(iterator, result)
    );
}

// It's simply a wrapper which provides some basic functionalities
// like, receiving and forwarding params, extracting an iterator from given generator
function co(generator) {
    return function executor(params) {
        const iterator = generator(params);
        return _executor(iterator);
    }
}


// Example usage
co(function* (params) {
    const result = yield co(someGenerator)(params);
    console.log(result);
})({
    whoa: 111
});