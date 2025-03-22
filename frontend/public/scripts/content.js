
chrome.storage.sync.clear()


const observedVideos = new WeakSet();
var current = "";
function setCurrent(c){
    current = c;
}


var paused = false;
const observer = new MutationObserver(() => {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      if (!observedVideos.has(video)) {
        video.addEventListener('pause', () => {
            paused = true;
            console.log('Media was paused!');
            try { 
                const inner_div =  document.querySelector("#appMountPoint").getElementsByClassName("player-timedtext-text-container")[0]
                var quote =  inner_div.innerText;
                if (quote != current) { 
                    setCurrent(quote); 
                } 
                

                if (!document.querySelector('#quote-button')) {
                    const button = document.createElement("button");
                    const rect = inner_div.getBoundingClientRect();
                    button.id = "quote-button";
                    Object.assign(button.style, {
                        position: "absolute",
                        zIndex: 9999,
                        top: `${rect.top + window.scrollY}px`,
                        left: `${rect.left + window.scrollX}px`,
                        width: `${rect.width}px`,
                        height: `${rect.height}px`,
                        background: "transparent",
                        border: "4px solid black",
                        padding: "30px",
                        borderRadius: "10px",
                        cursor: "pointer"
                      });
                    button.addEventListener("click", function () {
                        console.log("Clicked quote:", quote);
                        chrome.runtime.sendMessage({ target: "background", value: true, quote});
                    });
    
                    document.body.appendChild(button);
                }


                chrome.runtime.onMessage()

     
        } catch (e) {}
        });
        video.addEventListener('play', () =>{
            paused = false;
            console.log('Media was unpaused')
            if (document.querySelector('#quote-button')){
                document.body.removeChild(document.querySelector('#quote-button'))
            }
        })
        observedVideos.add(video);

      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

