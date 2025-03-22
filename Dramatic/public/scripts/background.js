chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.value === true) {
        var quote = message.quote;
        if(quote){
            chrome.runtime.sendMessage({
                target: "popup",
                data: quote
            })
        }
    }
});