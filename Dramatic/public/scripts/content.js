// (function () {
//     const injectSidebar = () => {
//     const columns = document.getElementById("columns");
//     if (!columns || document.getElementById("yt-app-sidebar")) return;

//     const primary = columns.querySelector('#primary');
//     const secondary = columns.querySelector('#secondary');
//     if(!secondary || !primary) return;

//     columns.style.display = "flex";
//     secondary.style.display = "none";


//     // primary.style.width = "60vw";
//     primary.style.flex = "0 0 75%"
    
    
//     //   Create sidebar
//       const sidebar = document.createElement("div");
//       sidebar.id = "yt-app-sidebar"
//       sidebar.style.display = "flex"
//       sidebar.style.position = "relative";
//       sidebar.style.flex = "0 0 25%"
//       sidebar.style.margin.top = "10"
//       sidebar.style.borderRadius = "15px"
//       sidebar.style.right = "0"
//       sidebar.style.justifyContent = "center"
//       sidebar.style.alignItems = "center"
        
//       sidebar.style.height = "98vh";
//       sidebar.style.backgroundColor = "white";
//       sidebar.style.boxSizing = "border-box";
//       sidebar.style.padding = "20px";
//       sidebar.style.overflowY = "auto";
//       sidebar.innerHTML = `
//       <ul>
//         <li>hi</li>
//         <li>hi</li>
//         <li>hi</li>
//       </ul>
//       `
//       ;

//     columns.appendChild(sidebar);
     
//     }
//     const observer = new MutationObserver(() => {
//         injectSidebar();
//     });

//     observer.observe(document.body, { childList: true, subtree: true });

//     // Also run immediately in case it's ready
//     injectSidebar();
//   })();



//   (function () {
//     const injectButton = () => {
//         const button = document.createElement("button");
//         button.addEventListener("click", function() {
//             const child = button.children[0];
//             var quote = child.innerText;
//             if(quote){
//                 chrome.runtime.sendMessage({message: {value: true, quote}});
//             }
//         })
     
//     }

//     const observer = new MutationObserver(() => {
//         injectButton();
//     });

//     observer.observe(document.body, { childList: true, subtree: true });

//     // Also run immediately in case it's ready
//     injectSidebar();
//   })();


const observedVideos = new WeakSet();

// const isPauseed = () => document.querySelector('video')?.paused

const observer = new MutationObserver(() => {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      if (!observedVideos.has(video)) {
        video.addEventListener('pause', () => {
          console.log('Media was paused!');
        });
        observedVideos.add(video);
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

// const observer = new MutationObserver(()=> {
//     const media = document.querySelector('video');
//     if (media) {
//         media?.addEventListener('pause', () => {
//         console.log('Media was paused!');
//         });
//     } 


// })
  
// observer.observe(document.body, {
//     childList : true,
//     subtree: true
// })