const fs = require('fs');
const cache = {};
function inconsistentRead(filename, callback) {
    /*
        The problem is in this function, because it behaves 
        synsynchronously in some conditions and async in some.
    */
	if(cache[filename]) {
		 //invoked synchronously
 		callback(cache[filename]);
 	} else {
 		//asynchronous function
 		fs.readFile(filename, 'utf8', function(err, data) {
			cache[filename] = data;
			callback(data);
		});
	}
}

function createFileReader(filename) {
	var listeners = [];
	inconsistentRead(filename, function(value) {
		listeners.forEach(function(listener) {
			listener(value);
		});
	});
	return {
		onDataReady: function(listener) {
			listeners.push(listener);
		}
	};
}

/*
    In this call, since we don't have anything in cache, it will 
    go for fs.readFile, which is an asynchronous call.

    Hence, the callback will be executed on next cycle and execution will resume.

*/
const reader1 = createFileReader('data.txt');
reader1.onDataReady(data => console.log('reader1'));


/*
    In this call, we will have an entry in cache, thus inconsistentRead 
    will behave synchronously.
*/
const reader2 = createFileReader('data.txt'); 
reader2.onDataReady(data => console.log('reader2'));