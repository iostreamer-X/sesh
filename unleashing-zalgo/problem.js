const fs = require('fs');
const cache = {};
function inconsistentRead(filename, callback) {
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

const reader1 = createFileReader('data.txt'); 
reader1.onDataReady(data => console.log('reader1'));

const reader2 = createFileReader('data.txt'); 
reader2.onDataReady(data => console.log('reader2'));

/*
	When we run this program, we will notice that only the following is printed:
	
	reader1

	We need to diagnose what the problem is, and how to fix it.
*/