// Altering an OWL Vote's settings and re-classifying RMB posts.

// A list of classified posts for the viewed Vote.
// Objects have the RMB Post ID as key and a stance as value.
let classified = {};

// Asynchronous IIF (communicating with NS API is async)
(async function() {
    document.getElementById('top').innerText = QUERY.title;
    document.getElementById('internal').innerText = QUERY.internal;
    document.getElementById('open').value = QUERY.open;
    document.getElementById('rmb').value = QUERY.rmb;
    document.getElementById('title').value = QUERY.title;
    document.getElementById('author').value = QUERY.author;
    document.getElementById('type').value = QUERY.type;
    document.getElementById('reco').value = QUERY.reco;
    document.getElementById('reason').value = QUERY.reason;
    document.getElementById('dashboard').value = QUERY.dashboard;
    await loadPosts();
})();

// Load all RMB Post IDs from the different stances into the classified variable
async function loadPosts() {
    console.log('Loading posts!');

    // Track the oldest post in order to know from where on to load the RMB
    let oldestPost = null;
    let newestPost = null;
    for(let ballot in BALLOTS) {
        if(!BALLOTS.hasOwnProperty(ballot)) continue;
        if(QUERY[ballot] == undefined) continue;
        for(let message of QUERY[ballot.toLowerCase().replace(' ', '_')].split(';')) {
            classified[message] = ballot;
            if(oldestPost == null || message < oldestPost) oldestPost = message;
            if(newestPost == null || message > newestPost) newestPost = message;
        }
    }

    // Create a segment for every transferred RMB Post
    if(oldestPost == null) return;
    console.log('Loading RMB...')
    let doc = await ns.getRMB(VOTING_REGION, oldestPost);
    for(let rmbpost of doc.getElementsByTagName('POST')) {
        if(parseInt(rmbpost.getAttribute('id')) > newestPost) continue;
        let obj = {
            id: rmbpost.getAttribute('id'),
            poster: rmbpost.getElementsByTagName('NATION')[0].textContent,
            text: resolveBB(rmbpost.getElementsByTagName('MESSAGE')[0].textContent)
        }
        document.getElementById('votes').append(createRMBQuote(obj));
        document.getElementById('votes').append(document.createElement('br'));
    }
}

function createRMBQuote(post) {

    // Details element containing utilities for the given post
    let container = document.createElement('details');
    container.setAttributeNode(document.createAttribute('open'));
    container.setAttribute('class', classified[post.id]);
    container.setAttribute('id', post.id);

    let summary = document.createElement('summary');
    summary.innerHTML = post.poster + ' <a href="https://www.nationstates.net/region=' + VOTING_REGION + '/page=display_region_rmb?postid=' + post.id + '#p' + post.id + '">wrote:</a>';

    let blockquote = document.createElement('blockquote');
    blockquote.setAttribute('cite', 'https://www.nationstates.net/page=rmb/postid=' + post.id);
    blockquote.innerHTML = post.text;

    // The button used to initiate the reclassification.
    // THE .SETATTRIBUTE METHOD FOR "ONCLICK" **MUST** BE ADJUSTED WHENEVER THE URL DECODING IN CLASSIFY.JS IS CHANGED!
    let reclassify = document.createElement('button');
    reclassify.setAttribute('class', 'reclassify');
    reclassify.setAttribute('onclick', 'location.href = "classify.html?v=' + BOTV + '&edited=' + post.id + '&open=' + encodeURIComponent(QUERY.internal) + ':' + encodeURIComponent(QUERY.title) + '";');
    reclassify.innerText = 'RECLASSIFY';

    container.append(summary, blockquote, reclassify);
    return container;

}

/*
Wraps the information entered into the manage-vote.html page into a query string for the execute.html page.
The following values are transferred:
    - "internal"
    - "open"
    - "rmb"
    - "title"
    - "author"
    - "type"
All derive their value from that of the HTML element with the same ID.
*/
function constructQueryString() {
    let str = '?v=' + BOTV + '&c=update';
    str += '&internal=' + encodeURIComponent(document.getElementById('internal').innerText);
    str += '&open=' + valueOf('open');
    str += '&rmb=' + valueOf('rmb');
    str += '&title=' + encodeURIComponent(valueOf('title'));
    str += '&author=' + encodeURIComponent(valueOf('author'));
    str += '&type=' + valueOf('type');
    if(!document.getElementById('reco_settings').hidden) {
        str += '&reco=' + valueOf('reco');
        str += '&reason=' + valueOf('reason');
        str += '&dashboard=' + valueOf('dashboard');
    } else str += '&reco=-1&reason=-1&dashboard=-1';
    console.log(str);
    return str;
}

function valueOf(id) {
    return document.getElementById(id).value;
}

function execute() {
    location.href = 'execute.html' + constructQueryString();
}