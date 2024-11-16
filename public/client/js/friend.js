// button-request-friend
const buttonRequest = document.querySelectorAll("[button-request]");

if (buttonRequest) {
  console.log(buttonRequest);
  buttonRequest.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("btn-primary")) {
        const userBId = button.getAttribute("button-request");
        button.innerHTML = "Hủy";
        button.classList.remove("btn-primary");
        button.classList.add("btn-secondary");
        button.removeAttribute("button-request");
        button.setAttribute("button-cancel", userBId);
        button.setAttribute("button-request", userBId);
        socket.emit("CLIENT_SEND_REQUEST", userBId);
      } else if (button.classList.contains("btn-secondary")) {
        const userBId = button.getAttribute("button-cancel");
        button.innerHTML = "Kết bạn";
        button.classList.remove("btn-secondary");
        button.classList.add("btn-primary");
        button.removeAttribute("button-cancel");
        button.setAttribute("button-request", userBId);
        socket.emit("CLIENT_SEND_CANCEL", userBId);
      }
    });
  });
}

// end button-request-friend

//
const buttonCancel = document.querySelectorAll("[button-cancel]");

if (buttonCancel) {
  console.log(buttonCancel);
  buttonCancel.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("btn-primary")) {
        const userBId = button.getAttribute("button-request");
        button.innerHTML = "Hủy";
        button.classList.remove("btn-primary");
        button.classList.add("btn-secondary");
        button.removeAttribute("button-request");
        button.setAttribute("button-cancel", userBId);
        socket.emit("CLIENT_SEND_REQUEST", userBId);
      } else if (button.classList.contains("btn-secondary")) {
        const userBId = button.getAttribute("button-cancel");
        button.innerHTML = "Kết bạn";
        button.classList.remove("btn-secondary");
        button.classList.add("btn-primary");
        button.removeAttribute("button-cancel");
        button.setAttribute("button-request", userBId);
        socket.emit("CLIENT_SEND_CANCEL", userBId);
      }
    });
  });
}
//

// server return after button-request

socket.on("SERVER_RETURN_AMOUNT_REQUEST_FRIENDS", (data) => {
  const spanAmountRequest = document.querySelector("[amount-request]");
  console.log(spanAmountRequest);
  spanAmountRequest.innerHTML = `${data}`;
});
socket.on("SERVER_RETURN_AMOUNT_ACCEPT_FRIENDS", (data) => {
  const spanAmountAccept = document.querySelector("[amount-accept]");
  const userBId = spanAmountAccept.getAttribute("amount-accept");
  if (userBId == data.userBId)
    spanAmountAccept.innerHTML = `${data.lengthAccept}`;
});
// button-accept-request
const acceptFriend = () => {
  const buttonAccept = document.querySelectorAll("[button-accept]");
  console.log(buttonAccept);
  if (buttonAccept) {
    buttonAccept.forEach((button) => {
      button.addEventListener("click", () => {
        const userBId = button.getAttribute("button-accept");
        button.classList.add("hidden");
        const buttonRefuse = document.querySelector(
          `[button-refuse="${userBId}"]`
        );
        buttonRefuse.classList.add("hidden");
        const buttonAccepted = document.querySelector(
          `[button-accepted="${userBId}"]`
        );
        buttonAccepted.classList.remove("hidden");
        socket.emit("CLIENT_SEND_ACCEPT", userBId);
      });
    });
  }
};
acceptFriend();
// end button-accept-request
socket.on("SERVER_RETURN_INFOR_REQUEST", (data) => {
  console.log(data);
  // Thêm person vào lời mời kết bạn
  const userBId = data.userBId;
  const infoUser = data.infoUser;
  const userAId = infoUser._id;
  const innerAcceptFriends = document.querySelector("[inner-accept-friends]");
  if (innerAcceptFriends) {
    const userIdAccept = innerAcceptFriends.getAttribute(
      "inner-accept-friends"
    );
    if (userIdAccept == userBId) {
      const div = document.createElement("div");
      div.classList.add("col-4");
      div.setAttribute("friend", userAId);
      div.innerHTML = `
      <div class="inner-friend">
          <div class="inner-friend-avatar">
            <img src=${infoUser.avatar} alt="avatar"/>
          </div>
          <div class="inner-friend-content">
            <p> ${infoUser.fullName}</p>
            <div class="inner-friend-button">
              <button class="btn btn-primary btn-sm" button-accept=${infoUser._id} width="80px"> Chấp nhận</button>
              <button class="btn btn-primary btn-sm" button-refuse=${infoUser._id} width="80px"> Từ chối</button>
              <button class="btn btn-secondary btn-sm hidden" disabled button-accepted=${infoUser._id} width="80px">Đã chấp nhận</button>
              <button class="btn btn-secondary btn-sm hidden" disabled button-refused=${infoUser._id} width="80px">Đã từ chối</button>
            </div>
          </div>
      </div>
      `;
      innerAcceptFriends.appendChild(div);
    }
  }

  // Xóa person khỏi người mà bạn có thể biết
  const innerNotFriends = document.querySelector("[inner-not-friends]");
  if (innerNotFriends) {
    const userIdNotFriend = innerNotFriends.getAttribute("inner-not-friends");
    if (userIdNotFriend == userBId) {
      const divNotFriend = document.querySelector(`[friend="${userAId}"]`);
      innerNotFriends.removeChild(divNotFriend);
    }
  }
  acceptFriend();
  refuseFriend();
});
// end server return after button-request

// server return cancel
socket.on("SERVER_RETURN_INFOR_CANCEL", (data) => {
  // Xóa person khỏi lời mời kết bạn
  console.log(data);
  const userBId = data.userBId;
  const infoUser = data.infoUser;
  const userAId = infoUser._id;
  const innerAcceptFriends = document.querySelector("[inner-accept-friends]");
  if (innerAcceptFriends) {
    const userIdInner = innerAcceptFriends.getAttribute("inner-accept-friends");
    if (userIdInner == userBId) {
      const divFriend = document.querySelector(`[friend="${userAId}"]`);
      console.log(divFriend);
      innerAcceptFriends.removeChild(divFriend);
    }
  }

  // Thêm person vào người mà bạn có thể biết
  const innerNotFriends = document.querySelector("[inner-not-friends]");
  if (innerNotFriends) {
    const userIdNotFriend = innerNotFriends.getAttribute("inner-not-friends");
    console.log(userIdNotFriend, userBId);
    if (userIdNotFriend == userBId) {
      const divNotFriend = document.createElement("div");
      divNotFriend.classList.add("col-4");
      divNotFriend.setAttribute("friend", userAId);
      divNotFriend.innerHTML = `
      <div class="inner-friend">
          <div class="inner-friend-avatar">
            <img src=${infoUser.avatar} alt="avatar"/>
          </div>
          <div class="inner-friend-content">
            <p> ${infoUser.fullName}</p>
            <div class="inner-friend-button">
              <button class="btn btn-primary btn-sm" button-request=${infoUser.id} width="80px">Kết bạn</button>
            </div>
          </div>
      </div>
      `;
      innerNotFriends.appendChild(divNotFriend);
    }
  }
});
// end server return cancel

// server return after accepted
socket.on("SERVER_RETURN_AMOUNT_ACCEPT_FRIENDS_AFTER_ACCEPTED", (data) => {
  const lengthAcceptFriends = data.lengthAcceptFriends;
  const spanAmountAccept = document.querySelector(`[amount-accept]`);
  spanAmountAccept.innerHTML = `${lengthAcceptFriends}`;
});
socket.on("SERVER_RETURN_AMOUNT_REQUEST_FRIENDS_AFTER_ACCEPTED", (data) => {
  console.log(data);
  const userBId = data.userBId;
  const userAId = data.userAId;
  const spanAmountRequest = document.querySelector("[amount-request]");
  console.log(spanAmountRequest);
  const userIdSpanAmountRequest =
    spanAmountRequest.getAttribute("amount-request");
  if (userIdSpanAmountRequest == userBId) {
    spanAmountRequest.innerHTML = `${data.lengthRequest}`;
    // cập nhật đã chấp nhận bên userAId
    const buttonCancel = document.querySelector(`[button-cancel="${userAId}"]`);
    if (buttonCancel) buttonCancel.classList.add("hidden");
    const buttonAccepted = document.querySelector(
      `[button-accepted="${userAId}"]`
    );
    if (buttonAccepted) buttonAccepted.classList.remove("hidden");
  }
});
socket.on("SERVER_RETURN_ISFRIEND", (data) => {
  const infoUser = data.infoUser;
  const userBId = data.userBId;
  const userAId = data.userAId;
  const lengthIsFriendsOfA = data.lengthIsFriendsOfA;
  const lengthIsFriendsOfB = data.lengthIsFriendsOfB;
  const innerListFriends = document.querySelector("[inner-list-friends]");
  if (innerListFriends) {
    const userIdInner = innerListFriends.getAttribute("inner-list-friends");
    if (userIdInner == userBId) {
      console.log(data);
      console.log(innerListFriends);
      const divFriend = document.createElement("div");
      divFriend.classList.add("col-4");
      divFriend.setAttribute("friend", infoUser._id);
      divFriend.innerHTML = `
      <div class="inner-friend">
          <div class="inner-friend-avatar">
            <img src=${infoUser.avatar} alt="avatar"/>
          </div>
          <div class="inner-friend-content">
            <p> ${infoUser.fullName}</p>
            <div class="inner-friend-button">
              <button class="btn btn-primary btn-sm" button-chat=${infoUser._id} width="80px">Nhắn tin</button>
              <button class="btn btn-primary btn-sm" button-delete=${infoUser._id} width="80px">Xóa bạn bè</button>
              <button class="btn btn-secondary btn-sm hidden" button-deleted=${infoUser._id} width="80px">Đã xóa</button>
            </div>
          </div>
      </div>
    `;

      innerListFriends.appendChild(divFriend);
      deleteFriend();
    }
  }
  const spanAmountFriends = document.querySelector("[amount-friends]");
  const userIdSpanAmountFriends =
    spanAmountFriends.getAttribute("amounts-friends");
  if (userAId == userIdSpanAmountFriends) {
    spanAmountFriends.innerHTML = `${lengthIsFriendsOfA}`;
  } else if (userBId == userIdSpanAmountFriends) {
    spanAmountFriends.innerHTML = `${lengthIsFriendsOfB}`;
  }
});
// end server return after accepted

const refuseFriend = () => {
  const buttonRefuse = document.querySelectorAll("[button-refuse]");

  if (buttonRefuse) {
    buttonRefuse.forEach((button) => {
      button.addEventListener("click", () => {
        const userBId = button.getAttribute("button-refuse");
        const buttonAccept = document.querySelector(
          `[button-accept="${userBId}"]`
        );
        const buttonRefuse = document.querySelector(
          `[button-refuse="${userBId}"]`
        );
        if (buttonAccept) buttonAccept.classList.add("hidden");
        if (buttonRefuse) buttonRefuse.classList.add("hidden");
        const buttonRefused = document.querySelector("[button-refused]");
        if (buttonRefused) buttonRefused.classList.remove("hidden");
        socket.emit("CLIENT_SEND_REFUSE", userBId);
      });
    });
  }
};
refuseFriend();
// server return after refused
socket.on("SERVER_RETURN_AMOUNT_ACCEPT_FRIENDS_AFTER_REFUSED", (data) => {
  console.log(data);
  const spanAmountAccept = document.querySelector("[amount-accept]");
  spanAmountAccept.innerHTML = `${data.lengthAcceptFriends}`;
});
socket.on("SERVER_RETURN_AMOUNT_REQUEST_FRIENDS_AFTER_REFUSED", (data) => {
  console.log(data);
  const userBId = data.userBId;
  const userAId = data.userAId;
  const spanAmountRequest = document.querySelector("[amount-request]");
  const userIdSpanAmountRequest =
    spanAmountRequest.getAttribute("amount-request");
  spanAmountRequest.innerHTML = `${data.lengthRequestFriends}`;
  if (userIdSpanAmountRequest == userBId) {
    // cập nhật đã từ chối bên userAId
    const buttonCancel = document.querySelector(`[button-cancel="${userAId}"]`);
    if (buttonCancel) {
      buttonCancel.innerHTML = `Đã từ chối`;
      buttonCancel.classList.add("hidden");
    }

    const buttonRefused = document.querySelector(
      `[button-refused="${userAId}"]`
    );
    if (buttonRefused) buttonRefused.classList.remove("hidden");
  }
});
// end server return after refused

// button-delete friend
const deleteFriend = () => {
  const buttonDelete = document.querySelectorAll("[button-delete]");
  buttonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const userBId = button.getAttribute("button-delete");
      console.log(userBId);
      button.classList.add("hidden");
      const buttonChat = document.querySelector(`[button-chat="${userBId}"]`);
      const buttonDeleted = document.querySelector(
        `[button-deleted="${userBId}"]`
      );
      if (buttonChat) buttonChat.classList.add("hidden");
      if (buttonDeleted) buttonDeleted.classList.remove("hidden");
      socket.emit("CLIENT_SEND_DELETE", userBId);
    });
  });
};
deleteFriend();
// end button-delete friend

// server return delete
socket.on("SERVER_RETURN_DELETE", (data) => {
  console.log(data);
  const lengthIsFriendsOfA = data.lengthIsFriendsOfA;
  const lengthIsFriendsOfB = data.lengthIsFriendsOfB;
  const userAId = data.userAId;
  const userBId = data.userBId;
  const spanAmountFriends = document.querySelector("[amount-friends]");
  const userIdSpanAmountRequest =
    spanAmountFriends.getAttribute("amount-friends");
  if (userAId == userIdSpanAmountRequest) {
    spanAmountFriends.innerHTML = `${lengthIsFriendsOfA}`;
  } else if (userBId == userIdSpanAmountRequest) {
    spanAmountFriends.innerHTML = `${lengthIsFriendsOfB}`;
    const buttonDelete = document.querySelector(`[button-delete="${userAId}"]`);
    const buttonChat = document.querySelector(`[button-chat="${userAId}"]`);
    const buttonDeleted = document.querySelector(
      `[button-deleted="${userAId}"]`
    );
    if (buttonDelete) buttonDelete.classList.add("hidden");
    if (buttonChat) buttonChat.classList.add("hidden");
    if (buttonDeleted) buttonDeleted.classList.remove("hidden");
  }
  // Xử lý buttonc của userA bên userB
});

// end server return delete

