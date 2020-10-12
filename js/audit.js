// Viewing and re-classifying RMB posts.

// An object serving as list of classified posts for the viewed Vote.
// Every classified post has its stance as value to its RMB post ID.
// Example: If post 12345 was classified "For" and post 54321 was marked "Against", this would be saved as:
// 12345: 'f', 54321: 'a'
let classified = {};

// Asynchronous Immediately Invoked Function (communicating with NS API is async!)
(async function() {
    document.getElementById('internal').innerText = QUERY.internal;
    document.getElementById('open').innerText = QUERY.open == 'true' ? '[VOTING IS OPEN]' : '[VOTING IS CLOSED]';
    document.getElementById('title').innerText = QUERY.title;
    await loadPosts();
    document.getElementById('loading').hidden = true;
})();

// Load all RMB Post IDs from the different stances into the classified variable
async function loadPosts() {
    console.log('Loading posts!');

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
        if(parseInt(rmbpost.getAttribute('id')) > newestPost) continue; // Skip too new votes
        let obj = { // Create a post object to better save data
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