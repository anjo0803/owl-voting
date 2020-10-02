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
const BOTV = 2;

// Command prefix.
const PREFIX = '.';

if(QUERY.v == undefined) {
    window.alert('Your link here does not specify a bot version. Do not expect things to work unless you know exactly what you\'re doing.');
} else {
    const LINKV = parseInt(QUERY.v);
    if(LINKV > BOTV) {
        window.alert('The link bringing you here claims a newer bot version than that of this page. Be advised that things might not work properly!');
    } else if(LINKV < BOTV) {
        window.alert('The link bringing you here claims an older bot version than that of this page. Be advised that things might not work properly!');
    }
}

if((QUERY.hook == undefined || QUERY.token == undefined) && (localStorage.getItem('hook') == null || localStorage.getItem('token') == null)) {
    window.alert('You\'ve got no credentials for using this interface registered!\nAny action you take will not be registered.');
}
