import { FileUploadWithPreview } from "https://unpkg.com/file-upload-with-preview/dist/index.js";
const upload = new FileUploadWithPreview("my-unique-id", {
  multiple: true,
  maxFileCount: 3,
});
// button-send-message
const sendMessage = document.querySelector("[send-message]");
const inputSendText = document.querySelector("[send-content]");
if (sendMessage) {
  sendMessage.addEventListener("click", async () => {
    const roomChatId = sendMessage.getAttribute("send-message");
    const content = inputSendText.value;
    if (content != "" || upload.cachedFileArray.length != 0) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        roomChatId: roomChatId,
        content: content,
        images: upload.cachedFileArray,
      });
      inputSendText.value = "";
      upload.resetPreviewPanel();
    }
  });
}
// server return message
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const { userId, content, fullName, avatar, images } = data;
  console.log(data);
  const innerChatRoom = document.querySelector(".inner-chat-room");

  const myId = innerChatRoom.getAttribute("userId");

  const htmlImages = images
    .map((item) => {
      return `
      <img src=${item} >
    `;
    })
    .join("");
  if (myId == userId) {
    const divOutgoing = document.createElement("div");
    divOutgoing.classList.add("inner-outgoing");
    let htmlContent="";
    if (content && content != "") {
      htmlContent = `
      <div class="inner-info"> 
        <div class="inner-content">
          <p>${content}</p>
        </div>        
      </div>
    `;
    } 
    divOutgoing.innerHTML=`
      ${htmlContent}
      <div class="inner-images">
        ${htmlImages}
      </div>
    `
    innerChatRoom.appendChild(divOutgoing);
  } else {
    const divInComing = document.createElement("div");

    divInComing.classList.add("inner-incoming");
    let htmlContent="";
    if (content != "") {
      htmlContent = `
      
      <div class="inner-content">
        <img src=${avatar} />
        <p>${content}</p>
      </div>   
      
    `;
    } 
    divInComing.innerHTML=`
      <div class="inner-info"> 
        <p>${fullName}</p>
      </div>
      ${htmlContent}
      <div class="inner-images">
        ${htmlImages}
      </div>
    `
    console.log(divInComing);
    innerChatRoom.appendChild(divInComing);
  }
  innerChatRoom.scrollTop = innerChatRoom.scrollHeight;
});
// end server return message
// end button-send-message

// button-icon
const emoji = document.querySelector("emoji-picker");
const buttonIcon = document.querySelector("[button-icon]");
buttonIcon.addEventListener("click", () => {
  const uploadImages=document.querySelector("[data-upload-id]");
  if(!uploadImages.classList.contains("hidden")){
    uploadImages.classList.add("hidden");
  }
  emoji.classList.toggle("hidden");
  if (!emoji.classList.contains("hidden")) {
    emoji.addEventListener("emoji-click", (e) => {
      inputSendText.value += e.detail.unicode;
    });
  }
});

// button-icon

// buton-send-messages
const sendImages=document.querySelector("[send-images]");
const uploadImages=document.querySelector("[data-upload-id]");

if(sendImages){
  sendImages.addEventListener("click",()=>{
    if(!emoji.classList.contains("hidden")){
      emoji.classList.add("hidden");
    }
    uploadImages.classList.toggle("hidden");
  })
}
const clearButton=document.querySelector(".clear-button");
if(clearButton){
  clearButton.addEventListener("click",()=>{
    uploadImages.classList.toggle("hidden");
    console.log(uploadImages);
  })
}
// end button-send-messages

