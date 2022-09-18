import { createDefenderHelper } from "./defendHelper.js";

export default {
    process : (message, html, data) => {

        // hover
        html.find('span.pan-to-token').hover(function(e){
            let tokenId = this.dataset.token;
            let token = canvas.tokens.get(tokenId);                       
            token._onHoverIn(e);
       
        },function(e){
            let tokenId = this.dataset.token;
            let token = canvas.tokens.get(tokenId);                       
            token._onHoverOut(e);
          
        })

        // pan
        html.find('span.pan-to-token').click(function(e){
            let tokenId = this.dataset.token;
            let token = canvas.tokens.get(tokenId);                                    
            const position = token.position
            canvas.animatePan(position)
        })

        // roll defend
        html.find('button.roll-defend').click(async (e)=>{
            const settings = JSON.parse(e.target.dataset.settings);
            const token = canvas.tokens.get(settings.token);
            const chatMessage = game.messages.get(settings.chatMessageID);
            const targetNumber = settings.targetNumber;
            const defendHelper = createDefenderHelper(token.actor, {targetNumber: targetNumber, chatMessage: chatMessage});
            defendHelper.render(true);
        })
    }
}