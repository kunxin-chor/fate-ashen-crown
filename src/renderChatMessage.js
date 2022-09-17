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
    }
}