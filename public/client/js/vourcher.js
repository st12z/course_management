// ResetAlert
const alerts = document.querySelectorAll(".alert");
const hiddenAlert = () => {
  alerts.forEach((alert) => {
    alert.classList.add("hidden");
  });
};

// EndResetAlert
// button-vourcher

const buttonVourcher = document.querySelectorAll("[button-vourcher]");
if (buttonVourcher) {
  buttonVourcher.forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.classList.contains("btn-danger")) {
        hiddenAlert();
        const vourcherId = button.getAttribute("button-vourcher");
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

// end button-vourcher
