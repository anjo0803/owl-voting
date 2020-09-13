// Communicating back to the Bot via WebHook:
// Modify the payload with valid Discord WebHook fields to customize message data.
// Discord WebHook fields: https://birdie0.github.io/discord-webhooks-guide/discord_webhook.html

const HOOK = {
    target: 'https://discordapp.com/api/webhooks/' + localStorage.getItem('hook') + '/' + localStorage.getItem('token'),
    payload: {},
    send: function() {
        if(localStorage.getItem('hook') == null || localStorage.getItem('token') == null) console.error('No credentials provided, request denied');
        else $.ajax({
            url: this.target,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(this.payload),
            error: function() {
                console.error('Your request could not be executed.');
            }
        });
    }
}
