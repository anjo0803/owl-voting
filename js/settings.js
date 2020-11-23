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
if((QUERY.hook == undefined || QUERY.token == undefined || QUERY.auth == undefined || QUERY.name == undefined) && 
        (localStorage.getItem('hook') == null || localStorage.getItem('token') == null || localStorage.getItem('name') || localStorage.getItem('auth') == null)) {
    window.alert('You\'ve got no or not all necessary credentials for using this interface registered!\nActions you take most probably won\'t be relayed.\nPlease get registered by OWL Senior Staff first.');
}

// Command prefix.
const PREFIX = pre;
