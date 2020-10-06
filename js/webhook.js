// Communicating back to the Bot via WebHook:
// Modify the payload with valid Discord WebHook fields to customize message data.
// Discord WebHook fields: https://birdie0.github.io/discord-webhooks-guide/discord_webhook.html

const HOOK = {
    payload: {},
    send: function() {
        if(localStorage.getItem('hook') == null || localStorage.getItem('token') == null || localStorage.getItem('auth') == null) console.error('No credentials provided, request denied');
        else {
            payload.username = localStorage.getItem('auth')
            $.ajax({
                url: 'https://discordapp.com/api/webhooks/' + localStorage.getItem('hook') + '/' + localStorage.getItem('token'),
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(this.payload),
                error: function() {
                    console.error('Webhook could not be fired.');
                }
            });
        }
    }
}