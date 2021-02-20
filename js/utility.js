// Utility JavaScript file.
// Contains several constants/values used throughout the web interface.

let undecoded = window.location.search.replace('?', '');
let decoded = {};

if(undecoded.length > 0) {
    let pairs = undecoded.split('&');
    for(let pair of pairs) {
        let split = pair.split('=');
        decoded[decodeURIComponent(split[0])] = decodeURIComponent(split[1]);
    }
}

// Object representing the decoded query string
const QUERY = decoded;

// Name of the OWL Voting Region
const VOTING_REGION = 'the_south_pacific_wa_voting_center';

// List of valid ballots
const BALLOTS = {
    f: 'For',
    a: 'Against',
    x: 'Abstain',
    n: 'No Recommendation',
    p: 'Present',
    d: '[DISMISS]'
};

// Conduct a simple version check.
const BOTV = 4;
let pre = '-';
if(QUERY.v == undefined) {  // No version defined
    window.alert('Your link here does not specify a bot version. Do not expect things to work unless you know exactly what you\'re doing.');
} else if(QUERY.v == 'beta') {  // Beta version
    pre = '.';
    document.getElementById('interface-version').textContent = 'beta';
} else {    // Normal version
    const LINKV = parseInt(QUERY.v);

    // Alert if version too new/old
    if(LINKV > BOTV) {
        window.alert('The link bringing you here claims a newer bot version than that of this page. Be advised that things might not work properly!');
        document.getElementById('interface-version').textContent = 'using v' + LINKV + ' link @ v' + BOTV;
    } else if(LINKV < BOTV) {
        window.alert('The link bringing you here claims an older bot version than that of this page. Be advised that things might not work properly!');
        document.getElementById('interface-version').textContent = 'using v' + LINKV + ' link @ v' + BOTV;
    } else document.getElementById('interface-version').textContent = 'v' + BOTV;
}

// Check whether credentials are registered
document.getElementById('page-state').setAttribute('class', 'auth-approved');
for(let credential of ['hook', 'token', 'auth', 'name']) if(QUERY[credential] == undefined && localStorage.getItem(credential) == null) {
    window.alert('Insufficient credentials at [' + credential + '] - please get registered by OWL Senior Staff first!');
    document.getElementById('page-state').setAttribute('class', 'auth-denied');
    break;
}

// Command prefix.
const PREFIX = pre;
