// fetch api chat
const searchData = {};
const fetchApiChat = async (keyword) => {
  console.log(searchData);
  if (searchData[keyword]) {
    renderData(searchData[keyword]);
    return;
  }
  try {
    const result = await fetch(
      `http://localhost:3000/chats/friend/suggest?keyword=${keyword}`
    );
    if (!result.ok) {
      throw new Error(`HTTP error! Status: ${result.status}`);
    }
    const data = await result.json();
    searchData[keyword] = data;
    renderData(data);
  } catch (error) {
    console.error("Lỗi : ", error);
  }
};
const renderData = (data) => {
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
};
const debounce = (callback, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args, delay);
    }, delay);
  };
};
// Nhận vào 2 tham số là 1 hàm func,delay
// trả về 1 hàm
const inputSearchFriend = document.querySelector("[search-friend]");
if (inputSearchFriend) {
  if (inputSearchFriend) {
    const handleSearch = debounce(async (e) => {
      const keyword = e.target.value.trim();

      fetchApiChat(keyword);
    }, 300);

    inputSearchFriend.addEventListener("keyup", handleSearch);
  }
}
