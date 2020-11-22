// Communicating with the NationStates API

const BASE = 'https://www.nationstates.net/cgi-bin/api.cgi?';
const RATELIMIT = 30000.0 / 49;
var lastRequest = 0;

let ns = {
    async getRMB(region, sincePost) {
        if(sincePost == null) return;
        return await response('region=' + region + '&q=messages;limit=100;fromid=' + sincePost);
    },
    async getWA() {
        return await response('wa=1&q=members');
    }
}

// Converts NationStates BBCode into HTML counterparts
function resolveBB(message) {
    return message  // First, resolve the simple tags
            .replace(/\[u\]/gmi, '<u>').replace(/\[\/u\]/gmi, '</u>')           // [u] tags
            .replace(/\[b\]/gmi, '<b>').replace(/\[\/b\]/gmi, '</b>')           // [b] tags
            .replace(/\[i\]/gmi, '<i>').replace(/\[\/i\]/gmi, '</i>')           // [i] tags
            .replace(/\[pre\]/gmi, '<pre>').replace(/\[\/pre\]/gmi, '</pre>')   // [pre] tags
            .replace(/\[strike\]/gmi, '<s>').replace(/\[\/strike\]/gmi, '</s>') // [strike] tags
            .replace(/\[sup\]/gmi, '<sup>').replace(/\[\/sup\]/gmi, '</sup>')   // [sup] tags
            .replace(/\[sub\]/gmi, '<sub>').replace(/\[\/sub\]/gmi, '</sub>')   // [sub] tags

            // And then, the more complex ones which take arguments
            .replace(/\[quote=.+?;\d+\]/gmi, '<q>')         .replace(/\[\/quote\]/gmi, '</q>')          // [quote] tags
            .replace(/\[url=.*?\]/gmi, '<u>')               .replace(/\[\/url\]/gmi, '</u>')            // [url] tags
            .replace(/\[nation(=.+?)?\]/gmi, '<i>')         .replace(/\[\/nation\]/gmi, '</i>')         // [nation] tags
            .replace(/\[region\]/gmi, '<i>')                .replace(/\[\/region\]/gmi, '</i>')         // [region] tags
            .replace(/\[proposal=.*?\]/gmi, '<u>')          .replace(/\[\/proposal\]/gmi, '</u>')       // [proposal] tags
            .replace(/\[resolution=.*?\]/gmi, '<u>')        .replace(/\[\/resolution\]/gmi, '</u>')     // [resolution] tags
            .replace(/\[spoiler(=.*?)?\]/gmi, '<details>')  .replace(/\[\/spoiler\]/gmi, '</details>')  // [spoiler] tags

            // Lastly, resolve lists and newlines.
            .replace(/\[list(=.*?)?\]/gmi, '<ul>').replace(/\[\*\]/, '<li>').replace(/\[\/list\]/gmi, '</ul>')  // [list] tags
            .replace('\n', '<br>'); // Newlines
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
