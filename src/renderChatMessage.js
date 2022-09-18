import { createDefenderHelper } from "./defendHelper.js";
import { attackCommand } from "./createCombatHelper.js";

export default {
    process: (message, html, data) => {

        // hover
        html.find('span.pan-to-token').hover(function (e) {
            let tokenId = this.dataset.token;
            let token = canvas.tokens.get(tokenId);
            token._onHoverIn(e);

        }, function (e) {
            let tokenId = this.dataset.token;
            let token = canvas.tokens.get(tokenId);
            token._onHoverOut(e);

        })

        // pan
        html.find('span.pan-to-token').click(function (e) {
            let tokenId = this.dataset.token;
            let token = canvas.tokens.get(tokenId);
            const position = token.position
            canvas.animatePan(position)
        })

        // roll defend
        html.find('button.roll-defend').click(async (e) => {
            const settings = JSON.parse(e.target.dataset.settings);
            const token = canvas.tokens.get(settings.token);
            const originChatMessage = game.messages.get(settings.chatMessageID);
            const targetNumber = settings.targetNumber;
            const defendHelper = createDefenderHelper(token.actor, 
                { token: token, 
                  targetNumber: targetNumber,
                  originChatMessage: originChatMessage,
                  rollId: settings.rollId
                });
            defendHelper.render(true);
        })

        html.find('button.reroll').click(async (e) =>{
           const settings = JSON.parse(e.target.dataset.settings);
           
           // recreate targets
            const targets = settings.targets.map(t => canvas.tokens.get(t));
            const actor = game.actors.get(settings.actorID);
            const originalChatMessage = game.messages.get(settings.chatMessageID);

            // re-execue the command
            attackCommand.callback(actor, settings.options, targets, originalChatMessage);            

        })

        html.find('.adjust').click(async(e)=>{
            const settings = JSON.parse(e.target.dataset.settings);      
            const originalChatMessage = game.messages.get(settings.chatMessageID);
           
            // recreate the flavor as a HTML DOM
            const element = document.createElement('div');
            element.innerHTML = originalChatMessage.flavor;
            const newTotal = parseInt(settings.total + 2);
            element.querySelector('.attack-result').innerHTML = `Attack Result: ${settings.total + 2} `;
      
            settings.total = newTotal;
      
            
            element.querySelector('.adjust').dataset.settings = JSON.stringify(settings);          
      
            // update the target number for each target
            element.querySelector('ul').childNodes.forEach((li)=>{
                const button = li.querySelector('button');
                let settings = JSON.parse(button.dataset.settings);
                settings.targetNumber = parseInt(settings.targetNumber) + 2;
                button.dataset.settings = JSON.stringify(settings);                
            })

            // update the chat message
            originalChatMessage.update({
                flavor: element.outerHTML
            })        

            
        })
    }
}