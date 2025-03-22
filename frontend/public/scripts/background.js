chrome.runtime.onMessage.addListener((message) => {
    if (message.value == true && message.target === "background") {
        var quote = message.quote;
        console.log(quote)
        if(quote){
            console.log(quote)
            // chrome.runtime.sendMessage({
            //     target: "popup",
            //     data: quote
            // })
            chrome.storage.sync.set({ quote: quote })
        }
    }
});