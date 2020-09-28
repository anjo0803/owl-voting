// Decode a query string into an object:
// The QUERY object has the key-value pairs of the query string.

let undecoded = window.location.search.replace('?', '');
let decoded = {};

if(undecoded.length > 0) {
    let pairs = undecoded.split('&');
    for(let pair of pairs) {
        let split = pair.split('=');
        decoded[decodeURIComponent(split[0])] = decodeURIComponent(split[1]);
    }
}

const QUERY = decoded;