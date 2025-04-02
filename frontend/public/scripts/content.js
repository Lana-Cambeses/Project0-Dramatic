
chrome.storage.sync.clear()


const observedVideos = new WeakSet();
var current = "";
function setCurrent(c){
    current = c;
}


var paused = false;
var inner_div;
var button;
function updateButtonPosition(){
  if(paused && inner_div){
    try{
      const updatedSub =  document.querySelector("#appMountPoint").getElementsByClassName("player-timedtext-text-container")[0];
      rect = updatedSub.getBoundingClientRect()
      Object.assign(inner_div.style, {
        position: `absolute`,
        zIndex: 9999,
        top: `${rect.top + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
        pointerEvents: `none`
        }
      )
      Object.assign(button.style, {
        position: "absolute",
        display: `flex`,
        justifyContent: `center`,
        zIndex: 9998,
        top: `${rect.top + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        textAlign: `center`,
        // background: "grey",
        // border: "none",
        // padding: "30px",
        borderRadius: "10px",
        cursor: "pointer"
      });
    }catch(e){}
  }
}

const observer = new MutationObserver(() => {
    updateButtonPosition()
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      if (!observedVideos.has(video)) {
        video.addEventListener('pause', () => {
            paused = true;
            console.log('Media was paused!');
            try { 
                inner_div =  document.querySelector("#appMountPoint").getElementsByClassName("player-timedtext-text-container")[0]
                var quote =  inner_div.innerText;
                if (quote != current) { 
                    setCurrent(quote); 
                } 
                if (!document.querySelector('#quote-button')) {
                    button = document.createElement("button");
                    const rect = inner_div.getBoundingClientRect();
                    button.id = "quote-button";
                    
                    Object.assign(button.style, {
                        position: "absolute",
                        display: `flex`,
                        justifyContent: `center`,
                        zIndex: 9998,
                        top: `${rect.top + window.scrollY}px`,
                        left: `${rect.left + window.scrollX}px`,
                        width: `${rect.width}px`,
                        height: `${rect.height}px`,
                        textAlign: `center`,
                        // background: "grey",
                        // border: "none",
                        // padding: "30px",
                        borderRadius: "10px",
                        cursor: "pointer"
                    });

                    button.addEventListener("click", function () {
                        console.log("Clicked quote:", quote);
                        chrome.runtime.sendMessage({ target: "background", value: true, quote});
                    });
                    
                    document.body.appendChild(button);

                    const rect2 = button.getBoundingClientRect();
                    Object.assign(inner_div.style, {
                      position: `absolute`,
                      zIndex: 9999,
                      top: `${rect.top + window.scrollY}px`,
                      left: `${rect.left + window.scrollX}px`,
                      pointerEvents: `none`
                      }
                    )
                    inner_div.id = "inner"
                    document.body.appendChild(inner_div);
                }

        } catch (e) {}
        });
        video.addEventListener('play', () =>{
            paused = false;
            console.log('Media was unpaused')
            if (document.querySelector('#quote-button')){
                document.body.removeChild(document.querySelector('#quote-button'))
                document.body.removeChild(document.querySelector('#inner'))
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

