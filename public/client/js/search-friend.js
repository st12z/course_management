// fetch api chat
const fetchApiChat = async (keyword) => {
  try {
    const result = await fetch(
      `http://localhost:3000/chats/friend/suggest?keyword=${keyword}`
    );
    if (!result.ok) {
      throw new Error(`HTTP error! Status: ${result.status}`);
    }
    const data = await result.json();
    console.log(data);
    const user = data.user;
    const innerRoomChat = document.querySelector(".inner-room-chat");
    const latestMessages = data.latestMessages;
    const html = latestMessages.map((latestMessage) => {
      return `
        <a href=/chats/rooms/${latestMessage.message.roomChatId}>
        <div class="inner-room">
          <div class="inner-avatar">
            <img src=${latestMessage.infoFriend.avatar} />
          </div>
          <div class="inner-message">
            <p>${latestMessage.infoFriend.lastName}</p>
            <!-- Kiểm tra nếu user là người gửi tin nhắn -->
            <p class="new-message">
              ${latestMessage.message.userId == user.id ? "Bạn: " : ""}${
        latestMessage.message.content
      }
            </p>
          </div>
        </div>
      </a>
      `;
    });
    innerRoomChat.innerHTML = html.join("");
  } catch (error) {
    console.error("Lỗi : ", error);
  }
};

const inputSearchFriend = document.querySelector("[search-friend]");
if (inputSearchFriend) {
  inputSearchFriend.addEventListener("keyup", async (e) => {
    const keyword = e.target.value;

    fetchApiChat(keyword);
  });
}
