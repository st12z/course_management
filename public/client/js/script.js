

const amountLike = document.querySelector("[amount-like]");
const amountTym = document.querySelector("[amount-tym]");
const fetchApiPOST = (slug, api, type) => {
  fetch(api, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(slug),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      if (data.code == 200) {
        if (type == "thích")
          amountLike.innerHTML = `${data.like.toLocaleString()} ${type}`;
        else if (type == "yêu thích") {
          amountTym.innerHTML = `${data.tym.toLocaleString()} ${type}`;
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
// button-like
const buttonLike = document.querySelector("[button-like]");

console.log(buttonLike);
if (buttonLike) {
  buttonLike.addEventListener("click", () => {
    buttonLike.classList.toggle("active");
    let api = "";
    const slug = buttonLike.getAttribute("button-like");
    if (buttonLike.classList.contains("active")) {
      api = `http://localhost:3000/courses/like/${slug}/`;
    } else {
      api = `http://localhost:3000/courses/unlike/${slug}/`;
    }
    fetchApiPOST(slug, api, "thích");
  });
}

// end button-like

// button-tym
const buttonTym = document.querySelector("[button-tym]");

console.log(buttonTym);
if (buttonTym) {
  buttonTym.addEventListener("click", () => {
    buttonTym.classList.toggle("active");
    let api = "";
    const slug = buttonTym.getAttribute("button-tym");
    if (buttonTym.classList.contains("active")) {
      api = `http://localhost:3000/courses/tym/${slug}/`;
    } else {
      api = `http://localhost:3000/courses/untym/${slug}/`;
    }
    fetchApiPOST(slug, api, "yêu thích");
  });
}
// end button-tym


//buton-cart
let cart = localStorage.getItem("cart");
if (!cart) {
  cart = JSON.stringify([]);
}
localStorage.setItem("cart", cart);
// show quantityCart
const spanQuantityCart=document.querySelector("[quantity-cart]");
const showQuantityCart=(cart)=>{
  const quantityCart=cart.reduce((sum,item)=>sum+=item.quantity,0);
  if(spanQuantityCart){
    spanQuantityCart.innerHTML=`(${quantityCart})`;
  }
}
showQuantityCart(JSON.parse(cart));
// end show quantityCart
const buttonCart = document.querySelector("[button-cart]");
const alertCart=document.querySelector("[alert-cart]");
console.log(alertCart);
if (buttonCart) {
  buttonCart.addEventListener("click", () => {
    const courseId = buttonCart.getAttribute("button-cart");
    const cart = JSON.parse(localStorage.getItem("cart"));
    const existCart = cart.find((item) => item.courseId == courseId);
    if (existCart) {
      existCart.quantity += 1;
    } else {
      cart.push({
        courseId: courseId,
        quantity: 1,
      });
    }
    showQuantityCart(cart);
    localStorage.setItem("cart",JSON.stringify(cart));
    alertCart.classList.remove("hidden");
    setTimeout(()=>{
      alertCart.classList.add("hidden");
    },3000);
  });
}
//end button-cart

// fetchApiCart
const fetchApiCart=(api)=>{
  fetch(api,{
    method:"GET",
  })
}
// end fetchApiCart