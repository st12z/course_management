const amountLike=document.querySelector("[amount-like]");
const amountTym=document.querySelector("[amount-tym]");
const fetchApiPOST = (slug,api,type) => {
  fetch(api, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(slug)
  })
    .then(res=>{
      return res.json();
    })
    .then(data=>{
      console.log(data);
      if(data.code==200){
        if(type=="thích")
          amountLike.innerHTML=`${data.like.toLocaleString()} ${type}`;
        else if(type=="yêu thích"){
          amountTym.innerHTML=`${data.tym.toLocaleString()} ${type}`;
        }
      }
      
    })
    .catch(error=>{
      console.error(error);
    })

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
    fetchApiPOST(slug,api,"thích");
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
    fetchApiPOST(slug,api,"yêu thích");
  });
}
// end button-tym
