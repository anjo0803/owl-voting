// Communicating back to the Bot via WebHook:
// Modify the payload with valid Discord WebHook fields to customize message data.
// Discord WebHook fields: https://birdie0.github.io/discord-webhooks-guide/discord_webhook.html

const HOOK = {
    payload: {},
    send: function() {
        if(localStorage.getItem('hook') == null || localStorage.getItem('token') == null || localStorage.getItem('name') == null || localStorage.getItem('auth') == null) {
            console.error('Necessary credentials not provided, request denied');
            window.alert('No or not all necessary credentials are registered in your browser. Please get yourself registered by OWL Senior Staff first.');
        } else {
            
            // Finalize the payload before sending it by customizing the username and adding auth keys
            this.payload.username = localStorage.getItem('name');
            if(this.payload.embeds != undefined) for(let embed of this.payload.embeds) {
                embed.color = 0xFF9900;
                embed.footer = {
                    text: localStorage.getItem('auth'),
                    icon_url: "https://anjo0803.github.io/owl-voting/graphics/bot.png"
                };
            } else this.payload.embeds = [{
                color: 0xFF9900,
                footer: {
                    text: localStorage.getItem('auth'),
                    icon_url: "https://anjo0803.github.io/owl-voting/graphics/bot.png"
                }
            }]
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