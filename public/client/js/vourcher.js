const spanQuantityCart = document.querySelector("[quantity-cart]");
//  show quantityCart
const showQuantityCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  if (cart && cart.length > 0) {
    const quantityCart = cart.reduce((sum, item) => (sum += item.quantity), 0);
    if (spanQuantityCart) {
      spanQuantityCart.innerHTML = `(${quantityCart})`;
    }
  }
  else{
    spanQuantityCart.innerHTML = `0`;
  }
};
showQuantityCart();
// ResetAlert
const alerts = document.querySelectorAll(".alert");
const hiddenAlert = () => {
  alerts.forEach((alert) => {
    alert.classList.add("hidden");
  });
};

// EndResetAlert
// button-save-vourcher
const buttonVourcher = document.querySelectorAll("[button-vourcher]");
if (buttonVourcher) {
  buttonVourcher.forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.classList.contains("btn-danger")) {
        hiddenAlert();
        const vourcherId = button.getAttribute("button-vourcher");
        console.log(vourcherId);
        const option = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            vourcherId: vourcherId,
          }),
        };
        const result = await fetch(
          "http://localhost:3000/vourchers/save",
          option
        );
        const data = await result.json();
        const alertError = document.querySelector("[show-alert-error]");
        const alertSuccess = document.querySelector("[show-alert-success]");
        if (data.code == 400) {
          setTimeout(() => {
            alertError.classList.add("hidden");
          }, 5000);
          alertError.classList.remove("hidden");
          alertError.innerHTML = data.messages;
        } else {
          button.classList.remove("btn-danger");
          button.classList.add("btn-secondary");
          button.classList.add("disabled");
          setTimeout(() => {
            alertSuccess.classList.add("hidden");
          }, 5000);
          alertSuccess.classList.remove("hidden");
          alertSuccess.innerHTML = data.messages;
        }
      }
    });
  });
}

// end button-save-vourcher

// button-delete-vourcher
const allVourcher = document.querySelector("[all-vourcher]");
const buttonDeletes = document.querySelectorAll("[button-delete-vourcher]");
if (buttonDeletes) {
  buttonDeletes.forEach((button) => {
    button.addEventListener("click", async() => {
      const vourcherId = button.getAttribute("button-delete-vourcher");
      const colVourcher = document.querySelector(
        `[col-vourcher="${vourcherId}"]`
      );
      console.log(colVourcher);
      const option = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          vourcherId: vourcherId,
        }),
      };
      const result = await fetch(
        "http://localhost:3000/vourchers/delete",
        option
      );
      const data = await result.json();
      const alertError = document.querySelector("[show-alert-error]");
      const alertSuccess = document.querySelector("[show-alert-success]");
      if (data.code == 400) {
        setTimeout(() => {
          alertError.classList.add("hidden");
        }, 5000);
        alertError.classList.remove("hidden");
        alertError.innerHTML = data.messages;
      } else {
        allVourcher.removeChild(colVourcher);
        setTimeout(() => {
          alertSuccess.classList.add("hidden");
        }, 5000);
        alertSuccess.classList.remove("hidden");
        alertSuccess.innerHTML = data.messages;
      }
    });
  });
}
// end button-delete-vourcher
