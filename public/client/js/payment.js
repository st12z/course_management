const totalPayment = document.querySelector("[total-payment]");
const spanQuantityCart = document.querySelector("[quantity-cart]");
const showQuantityCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  if (cart && cart.length > 0) {
    const quantityCart = cart.reduce((sum, item) => (sum += item.quantity), 0);
    if (spanQuantityCart) {
      spanQuantityCart.innerHTML = `(${quantityCart})`;
    }
  }
};
showQuantityCart();
// button-vourcher

// - button-use
const buttonUses = document.querySelectorAll("[button-use]");


const alertError = document.querySelector("[show-alert-error]");
const alertSuccess = document.querySelector("[show-alert-success]");
const promotion=document.querySelector("[promotion]");
const totalNewPayment=document.querySelector("[total-payment-new]");
if (buttonUses) {
  buttonUses.forEach((button) => {
    button.addEventListener("click", async () => {
      const totalPayment=document.querySelector("[total-payment]");
      const totalCurrent=parseInt(totalPayment.getAttribute("total-payment"));
      const discount=button.getAttribute("discount");
      if (button.classList.contains("btn-danger")) {
        hiddenAlert();
        const vourcherId = button.getAttribute("button-use");
        inputCodeVourcher.value = vourcherId;
        button.classList.remove("btn-danger");
        button.classList.add("btn-secondary");
        button.innerHTML = "Hủy";
        button.removeAttribute("button-use");
        button.setAttribute("button-cancel", vourcherId);
        buttonBans();
        setTimeout(() => {
          alertSuccess.classList.add("hidden");
        }, 3000);
        const promotionPrice=totalCurrent*1.0*discount/100;
        promotion.innerHTML=`Giảm giá : ${promotionPrice.toLocaleString()} đ`;
        const totalNew=totalCurrent-promotionPrice;
        totalNewPayment.innerHTML=`Tổng tiền thanh toán : ${totalNew.toLocaleString()} đ`;
        totalNewPayment.setAttribute("total-payment-new",totalNew);
        alertSuccess.classList.remove("hidden");
        alertSuccess.innerHTML = "Bạn đã áp dụng mã thành công!";
      } else if (button.hasAttribute("button-cancel")) {
        // Xử lý khi hủy mã
        promotion.innerHTML=`Giảm giá : 0 đ`;
        totalNewPayment.innerHTML=`Tổng tiền thanh toán : ${totalCurrent.toLocaleString()} đ`;
        const vourcherId = button.getAttribute("button-cancel");
        inputCodeVourcher.value = "";
        button.classList.remove("btn-secondary");
        button.classList.add("btn-danger");
        button.innerHTML = "Dùng";
        button.removeAttribute("button-cancel");
        button.setAttribute("button-use", vourcherId);
        buttonunBans();
      }
    });
  });
}
// -end button-use

// button-cancel

// end button-cancel
const buttonCancel = document.querySelector("[button-cancel]");
if (buttonCancel) {
  buttonCancel.addEventListener("click", () => {
    hiddenAlert();
    inputCodeVourcher.value = "";
    button.removeAttribute("button-cancel");
    button.setAttribute("button-use", vourcherId);
    buttonunBans();
  });
}
// end button-vourcher

// ResetAlert
const alerts = document.querySelectorAll(".alert");
const hiddenAlert = () => {
  alerts.forEach((alert) => {
    alert.classList.add("hidden");
  });
};

// EndResetAlert

// code-vourcher
const inputCodeVourcher = document.querySelector("[vourcher-code]");
// end code-vourcher

// buttonUsed

const buttonBans = () => {
  const buttonUsed = document.querySelectorAll("[button-use]");
  console.log(buttonUsed);
  if (buttonUsed) {
    buttonUsed.forEach((button) => {
      button.classList.remove("btn-danger");
      button.classList.add("btn-secondary");
      button.classList.add("disabled");
    });
  }
};

// end buttonBans

// buttonUnban
const buttonunBans = () => {
  const buttonUsed = document.querySelectorAll("[button-use]");
  console.log(buttonUsed);
  if (buttonUsed) {
    buttonUsed.forEach((button) => {
      button.classList.remove("btn-secondary");
      button.classList.add("btn-danger");
      button.classList.remove("disabled");
    });
  }
};

// buttonUnban

const formPayment = document.querySelector("[form-payment]");
if (formPayment) {
  formPayment.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          fullName: e.target.elements[0].value,
          phone: e.target.elements[1].value,
          province: e.target.elements[2].value,
          district: e.target.elements[3].value,
          ward: e.target.elements[4].value,
          detailAddress: e.target.elements[5].value,
          carts: localStorage.getItem("cart"),
          vourcherId:inputCodeVourcher.value,
          amount:parseInt(totalNewPayment.getAttribute("total-payment-new"))
        }),
      };
      console.log(options["body"]);
      const result = await fetch(
        "http://localhost:3000/payment/processing",
        options
      );
      const data = await result.json();
      console.log(data);
      if (data.code == 200) {
        localStorage.removeItem("cart");
        window.location.href = data.orderUrl;
      } else {
        console.log("Thanh toán không thành công");
      }
    } catch (error) {
      console.error("Lỗi trong quá trình thanh toán", error);
    }
  });
}

