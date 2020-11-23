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
const BOTV = 3;
let pre = '-';
if(QUERY.v == undefined) {  // No version defined
    window.alert('Your link here does not specify a bot version. Do not expect things to work unless you know exactly what you\'re doing.');
} else if(QUERY.v == 'beta') {  // Beta version
    pre = '.';
} else {    // Normal version
    const LINKV = parseInt(QUERY.v);

    // Alert if version too new/old
    if(LINKV > BOTV) {
        window.alert('The link bringing you here claims a newer bot version than that of this page. Be advised that things might not work properly!');
    } else if(LINKV < BOTV) {
        window.alert('The link bringing you here claims an older bot version than that of this page. Be advised that things might not work properly!');
    }
}

// Check whether credentials are registered
if(QUERY.hook == undefined && localStorage.getItem('hook') == null) window.alert('Insufficient credentials at [hook] - please get registered by OWL Senior Staff first!')
else if(QUERY.token == undefined && localStorage.getItem('token') == null) window.alert('Insufficient credentials at [token] - please get registered by OWL Senior Staff first!')
else if(QUERY.auth == undefined && localStorage.getItem('auth') == null) window.alert('Insufficient credentials at [auth] - please get registered by OWL Senior Staff first!')
else if(QUERY.name == undefined && localStorage.getItem('name') == null) window.alert('Insufficient credentials at [name] - please get registered by OWL Senior Staff first!')

// Command prefix.
const PREFIX = pre;
