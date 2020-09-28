// Communicating with the NationStates API

const BASE = 'https://www.nationstates.net/cgi-bin/api.cgi?';
const RATELIMIT = 30000.0 / 49;
var lastRequest = 0;

let ns = {
    async getRMB(region, sincePost) {
        if(sincePost == null) return;
        return await response('region=' + region + '&q=messages;limit=100;fromid=' + sincePost);
    }
}

// Converts NationStates BBCode into HTML counterparts
function resolveBB(message) {
    return message.split('[u]').join('<u>').split('[/u]').join('</u>').split('[b]').join('<b>').split('[/b]').join('</b>').split('[i]').join('<i>').split('[/i]').join('</i>').split('[quote').join('<q>').split('[/quote]').join('</q>').split('\n').join('<br>');
}

// Delays the current execution - used to meet rate limits
function delay(millis) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve();
        }, millis);
    });
}

// Returns the XML Document returned from the NS API when given the specified arguments. Meets rate limits.
async function response(apiArgs) {
    try {
        let time = new Date().getTime();
        if(time < lastRequest + RATELIMIT) await delay(lastRequest + RATELIMIT - time);
        return await call(apiArgs);
    } catch(error) {
        console.log(error);
        return null;
    }
}

// Returns the XML Document returned from the NS API when given the specified arguments.
function call(apiArgs) {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(this.responseXML);
        }
        xhr.onerror = reject;
        xhr.open("GET", BASE + apiArgs);
        xhr.send();
    });
}