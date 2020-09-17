// Arrays of objects representing RMB posts
let lodged = [], edited = [];

// List of open votes
let votes = [];

// Asynchronous IIF (communicating with NS API is async)
(async function() {
    await loadPosts();
    loadVotes();
    draw();
})();

// Load all RMB Post IDs from the query string into variables
async function loadPosts() {
    console.log('Decoding URL...');

    let oldestPost = null;
    let lodgedIDs = [], editedIDs = [];
    if(QUERY.lodged != undefined) {
        console.log('Loading newly lodged posts');
        for(let message of QUERY.lodged.split(';')) {
            if(oldestPost == null || message < oldestPost) oldestPost = message;
            if(!lodgedIDs.includes(message)) lodgedIDs.push(message);
        }
    }
    if(QUERY.edited != undefined) {
        console.log('Loading newly edited posts');
        for(let message of QUERY.edited.split(';')) {
            if(oldestPost == null || message < oldestPost) oldestPost = message;
            if(!editedIDs.includes(message)) editedIDs.push(message);
        }
    }

    // If there are no posts to classify, end the method
    if(lodgedIDs.length == 0 && editedIDs.length == 0) return;

    // In order to create post objects, get all since the oldest from the NS API
    console.log('Loading RMB...');
    let doc = await ns.getRMB(VOTING_REGION, oldestPost);
    for(let rmbpost of doc.getElementsByTagName('POST')) {
        let obj = {
            id: rmbpost.getAttribute('id'),
            poster: rmbpost.getElementsByTagName('NATION')[0].textContent,
            text: resolveBB(rmbpost.getElementsByTagName('MESSAGE')[0].textContent)
        };
        if(lodgedIDs.includes(rmbpost.getAttribute('id'))) lodged.push(obj);
        else if(editedIDs.includes(rmbpost.getAttribute('id'))) edited.push(obj);
    }
}

// Load all open votes from the query string into the 'open' variable
function loadVotes() {
    if(QUERY.open != undefined) {
        console.log('Loading open OWL votes...');
        for(let message of QUERY.open.split(';')) votes.push({
            internal: message.split(':')[0],
            title: message.substring(message.split(':')[0].length + 1)  // +1 because the ':' was cut
        });
    }
}

// Appends elements for every lodged / edited post to the document
function draw() {
    console.log('Drawing components...');

    for(let post of lodged) document.getElementById('lodged').append(createRMBQuote(post));
    for(let post of edited) document.getElementById('edited').append(createRMBQuote(post));
    if(lodged.length > 0) document.getElementById('lodged').hidden = false;
    if(edited.length > 0) document.getElementById('edited').hidden = false;
}

// Returns a set up section for classifying a RMB post
function createRMBQuote(post) {

    // Details element containing utilities for the given post
    let container = document.createElement('details');
    container.setAttributeNode(document.createAttribute('open'));
    container.setAttribute('class', 'post');
    container.setAttribute('id', post.id);

    let summary = document.createElement('summary');
    summary.innerHTML = post.poster + ' <a href="https://www.nationstates.net/region=' + VOTING_REGION + '/page=display_region_rmb?postid=' + post.id + '#p' + post.id + '">wrote:</a>';

    let blockquote = document.createElement('blockquote');
    blockquote.setAttribute('cite', 'https://www.nationstates.net/page=rmb/postid=' + post.id);
    blockquote.innerHTML = post.text;

    // Paragraph containing the classification utilities
    let classification = document.createElement('p');

    let signoff = document.createElement('input');
    signoff.setAttribute('type', 'checkbox');
    signoff.setAttribute('class', 'signoff');
    signoff.setAttribute('onchange', 'updateAmount();');

    let legend = document.createElement('i');
    legend.innerText = 'Classify post as '

    let selectStance = document.createElement('select');
    selectStance.setAttribute('class', 'stance');
    for(let ballot in BALLOTS) {
        if(!BALLOTS.hasOwnProperty(ballot)) continue;
        let option = document.createElement('option');
        option.setAttribute('value', ballot);
        option.innerText = BALLOTS[ballot];
        selectStance.appendChild(option);
    }

    let selectVote = document.createElement('select');
    selectVote.setAttribute('class', 'proposal');
    for(let vote of votes) {
        let option = document.createElement('option');
        option.setAttribute('value', encodeURIComponent(vote.internal));
        option.innerText = vote.title;
        selectVote.appendChild(option);
    }

    classification.append(signoff, legend, selectStance, selectVote);

    container.append(summary, blockquote, classification);
    return container;
}

function updateAmount() {
    let amount = 0;
    for(let signoff of document.getElementsByClassName('signoff')) if(signoff.checked) amount++;
    if(amount == 0) document.getElementById('classify').innerText = 'No Posts Marked Classified';
    else document.getElementById('classify').innerHTML = 'Classify <b>' + amount + '</b> Post' + (amount > 1 ? 's' : '');
}