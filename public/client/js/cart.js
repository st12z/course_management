const tableCart = document.querySelector("[table-cart]");
const bodyTable = tableCart.querySelector("tbody");
const totalPayment = document.querySelector("[total-payment]");
const spanQuantityCart = document.querySelector("[quantity-cart]");
//  show quantityCart
const showQuantityCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const quantityCart = cart.reduce((sum, item) => (sum += item.quantity), 0);
  if (spanQuantityCart) {
    spanQuantityCart.innerHTML = `(${quantityCart})`;
  }
};
showQuantityCart();
// end show quantityCart
//input-quantity
const changeQuantity = () => {
  const inputQuantity = document.querySelectorAll("[input-quantity]");
  if (inputQuantity) {
    inputQuantity.forEach((input) => {
      input.addEventListener("change", (e) => {
        const courseId = input.getAttribute("input-quantity");
        const cart = JSON.parse(localStorage.getItem("cart"));
        const quantityCurrent = parseInt(e.target.value);
        const existcart = cart.find((item) => item.courseId == courseId);
        existcart.quantity = quantityCurrent;
        localStorage.setItem("cart", JSON.stringify(cart));
        fetchApiCart();
      });
    });
  }
};
//input-quantity

// delete
const deleteItem = () => {
  const buttonDelete = document.querySelectorAll("[button-delete]");
  if (buttonDelete) {
    buttonDelete.forEach((button) => {
      button.addEventListener("click", () => {
        const courseId = button.getAttribute("button-delete");
        const cart = JSON.parse(localStorage.getItem("cart"));
        const existcart = cart.filter((item) => item.courseId != courseId);
        console.log(existcart);
        localStorage.setItem("cart", JSON.stringify(existcart));
        fetchApiCart();
      });
    });
  }
};
// delete

const fetchApiCart = () => {
  const cart = localStorage.getItem("cart");
  fetch("http://localhost:3000/cart", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: cart,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.code == 200) {
        console.log(data);
        const courses = data.courses;
        const html = courses.map((item, index) => {
          return `
          <tr>
            <td>${index + 1}</td>
            <td>${item.infoCourse.title}</td>
            <td><img src=${
              item.infoCourse.thumbnail
            } width="200px" alt="Logo"/></td>
            <td>${item.infoCourse.price.toLocaleString()} đ</td>
            <td>${item.infoCourse.discount}%</td>
            <td>${item.infoCourse.price_special.toLocaleString()} đ</td>
            <td>
              <input 
                type="number"
                value="${item.quantity}"
                style="width:60px"
                input-quantity=${item.infoCourse._id}
                min="1"
              />
            </td>
            <td><span total-price>${item.totalPrice.toLocaleString()} đ</span></td>
            <td>
              <button class="btn btn-secondary" button-delete=${
                item.infoCourse._id
              }>Xóa</button>
            </td>
          </tr>
          
        `;
        });
        bodyTable.innerHTML = html.join("");
        totalPayment.innerHTML = `Tổng tiền thanh toán : ${data.totalPayment.toLocaleString()} đ`;
        changeQuantity();
        deleteItem();
        showQuantityCart();
      }
    });
};
fetchApiCart();
// end fetchApiCart

// fetch address
const provinceSelect = document.querySelector("[province]");
if (provinceSelect) {
  provinceSelect.addEventListener("change", (e) => {
    const provinceId = e.target.value;
    fetch(`http://localhost:3000/address/province/${provinceId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          const districts = data.districts;
          const districtSelect = document.querySelector("[districts]");
          console.log(districtSelect);
          const html = districts.map((item) => {
            return `<option value=${item.Id}>${item.Name}</option>`;
          });
          districtSelect.innerHTML = `<option value="">-- Chọn Quận/Huyện --</option>` + html.join("");
          districtSelect.addEventListener("change", (e) => {
            const districtId = e.target.value;
            fetch(`http://localhost:3000/address/district/${districtId}`)
              .then((res) => res.json())
              .then((data) => {
                if (data.code == 200) {
                  const wards = data.wards;
                  const wardSelect = document.querySelector("[wards]");
                  const html = wards.map((item) => {
                    return `<option value=${item.Id}>${item.Name}</option>`;
                  });
                  wardSelect.innerHTML = `<option value="">-- Chọn Phường/Xã --</option>` + html.join("");
                }
              });
          });
        }
      });
  });
}
// end fetch address


// form-order
const formOrder=document.querySelector("[form-order]");
if(formOrder){
  formOrder.addEventListener("submit",(e)=>{
    const inputCart=document.querySelector("input[cart]");
    inputCart.value=localStorage.getItem("cart");
  })
}
// end form-order