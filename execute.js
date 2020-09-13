// Execute the WebHook with the provided data and command

(async function() {
    if(QUERY.c == 'register') register();
    else if(QUERY.c == 'create') openVote();
    else if(QUERY.c == 'classify') classifyPosts();
    else if(QUERY.c == 'update') updateVote();
})();

function register() {
    localStorage.setItem('hook', QUERY.hook);
    localStorage.setItem('token', QUERY.token);
}

async function openVote() {
    HOOK.payload = {
        content: '/createvote',
        embeds: [
            {
                fields: [
                    {
                        name: 'title',
                        value: decodeURIComponent(QUERY.title),
                        inline: true
                    }, {
                        name: 'author',
                        value: decodeURIComponent(QUERY.author),
                        inline: true
                    }, {
                        name: 'rmb',
                        value: QUERY.rmb,
                        inline: true
                    }, {
                        name: 'type',
                        value: QUERY.type,
                        inline: true
                    }
                ]
            }
        ]
    }
    trigger();
    finish('Action has been executed')
}

async function classifyPosts() {
    for(let message in QUERY) {
        if(!QUERY.hasOwnProperty(message)) continue;
        if(message == 'c' || message == 'v') continue;

        HOOK.payload = {
            content: '/classify',
            embeds: [
                {
                    fields: [
                        {
                            name: 'post',
                            value: message,
                            inline: true
                        }, {
                            name: 'ballot',
                            value: BALLOTS[QUERY[message].split(':')[0]],
                            inline: true
                        }, {
                            name: 'proposal',
                            value: decodeURIComponent(QUERY[message].split(':')[1]),
                            inline: true
                        }
                    ]
                }
            ]
        }
        await delay(1000);
        trigger();
    }
    finish('Action has been executed')
}

async function updateVote() {
    HOOK.payload = {
        content: '/updatevote',
        embeds: [
            {
                fields: [
                    {
                        name: 'internal',
                        value: decodeURIComponent(QUERY.internal),
                        inline: true
                    }, {
                        name: 'open',
                        value: QUERY.open,
                        inline: true
                    }, {
                        name: 'rmb',
                        value: QUERY.rmb,
                        inline: true
                    }, {
                        name: 'title',
                        value: decodeURIComponent(QUERY.title),
                        inline: true
                    }, {
                        name: 'author',
                        value: decodeURIComponent(QUERY.author),
                        inline: true
                    }, {
                        name: 'type',
                        value: QUERY.type,
                        inline: true
                    }, {
                        name: 'reco',
                        value: QUERY.reco,
                        inline: true
                    }, {
                        name: 'reason',
                        value: QUERY.reason,
                        inline: true
                    }, {
                        name: 'dashboard',
                        value: QUERY.dashboard,
                        inline: true
                    }
                ]
            }
        ]
    }
    trigger();
    finish('Action has been executed')
}

// Delays the current execution - used to meet rate limits
function delay(millis) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve();
        }, millis);
    });
}

function trigger() {
    console.log('Executing WebHook');
    HOOK.send();
}

function finish(message) {
    document.getElementById('status').innerText = message;
}