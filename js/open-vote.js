// Functionality for the open-vote.html page

// Validates all entered data
function validate() {
    if(valueOf('title') == '') return warn('Please enter a Proposal Title.');
    else if(valueOf('author') == '') return warn('Please enter the Proposal\'s Author.');
    else if(valueOf('rmb') == '') return warn('Please enter a RMB post ID.');
    else return true;
}

function warn(message) {
    window.alert(message);
    return false;
}

// Encode the entered data into a query string decryptable by the execute.js script
function constructQueryString() {
    let str = '?v=' + BOTV + '&c=create';
    str += '&rmb=' + valueOf('rmb');
    str += '&title=' + encodeURIComponent(valueOf('title'));
    str += '&author=' + encodeURIComponent(valueOf('author'));
    str += '&type=' + (document.getElementById('repeal').checked ? 'repeal_' : '') + valueOf('type');
    console.log(str);
    return str;
}

// Gets the value of the HTML Element with the given name
function valueOf(id) {
    return document.getElementById(id).value;
}

function execute() {
    if(validate()) location.href = 'execute.html' + constructQueryString();
}