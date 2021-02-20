// Viewing and re-classifying RMB posts.

// An object serving as list of classified posts for the viewed Vote.
// Every classified post has its stance as value to its RMB post ID.
// Example: If post 12345 was classified "For" and post 54321 was marked "Against", this would be saved as:
// 12345: 'f', 54321: 'a'
let classified = {};

// List of WA member nations in order to identify voters as (non-)WA members
let wa = [];

// Asynchronous Immediately Invoked Function (communicating with NS API is async!)
(async function() {
    await loadWA();
    await loadPosts();
    document.getElementById('temp-load').hidden = true;
    for(let section of document.getElementsByClassName('content')) section.hidden = false;
})();

// Load all WA members in order to identify voters as WA members
async function loadWA() {
    console.log('Loading WA members...');

    let doc = await ns.getWA();
    for(let member of doc.getElementsByTagName('MEMBERS')[0].textContent.split(',')) wa.push(member);
}

// Load all RMB Post IDs from the different stances into the classified variable
async function loadPosts() {
    console.log('Decoding URL...');

    // Get the specified post from where on to load the RMB
    let oldestPost = QUERY.start;

    // Track the newest post in order to know from where on to skip the RMB
    let newestPost = null;
    for(let ballot in BALLOTS) {
        if(!BALLOTS.hasOwnProperty(ballot)) continue;
        if(QUERY[ballot] == undefined) continue;
        for(let message of QUERY[ballot.toLowerCase().replace(' ', '_')].split(';')) {
            classified[message] = ballot;
            if(newestPost == null || message > newestPost) newestPost = message;
        }
    }
    if(oldestPost == null) return;

    // Create a segment for every transferred RMB Post
    console.log('Loading RMB...')
    let doc = await ns.getRMB(VOTING_REGION, oldestPost);
    for(let rmbpost of doc.getElementsByTagName('POST')) {
        if(parseInt(rmbpost.getAttribute('id')) > newestPost + 20000) continue; // Skip too recent votes
        let obj = { // Create a post object to save data more efficiently
            id: rmbpost.getAttribute('id'),
            poster: rmbpost.getElementsByTagName('NATION')[0].textContent,
            text: resolveBB(rmbpost.getElementsByTagName('MESSAGE')[0].textContent)
        }
        document.getElementById('audit').append(createRMBQuote(obj));
    }
}

function createRMBQuote(post) {

    // Details element containing utilities for the given post
    let container = document.createElement('details');
    container.setAttribute('class', 'rmb-post');
    container.setAttribute('name', post.id);
    container.setAttributeNode(document.createAttribute('open'));

    let summary = document.createElement('summary');
    summary.setAttribute('class', 'rmb-post-quotee ' + (wa.includes(post.poster) ? 'wa-member' : 'non-wa'));
    summary.innerHTML = post.poster + ' <a href="https://www.nationstates.net/region=' + VOTING_REGION + '/page=display_region_rmb?postid=' + post.id + '#p' + post.id + '">wrote:</a>';

    let blockquote = document.createElement('blockquote');
    blockquote.setAttribute('cite', 'https://www.nationstates.net/page=rmb/postid=' + post.id);
    blockquote.innerHTML = post.text;

    // The div used to initiate the reclassification.
    // THE .SETATTRIBUTE METHOD FOR "ONCLICK" **MUST** BE ADJUSTED WHENEVER THE URL DECODING IN CLASSIFY.JS IS CHANGED!
    let postoptions = document.createElement('div');
    postoptions.setAttribute('class', 'post-options ' + (classified[post.id] == undefined ? 'irrelevant' : classified[post.id]));
    postoptions.setAttribute('onclick', 'location.href = "classify.html?v=' + BOTV + '&reclassify=' + post.id + '&open=' + encodeURIComponent(QUERY.internal) + ':' + encodeURIComponent(QUERY.title) + '";');

    // Continuity between classification and reclassification interfaces. CSS should inject the "For/Against/whatever" text in there.
    let legend_span = document.createElement('span');
    postoptions.append(legend_span);

    container.append(summary, blockquote, postoptions);
    return container;

}