const amountLike = document.querySelector("[amount-like]");
const amountTym = document.querySelector("[amount-tym]");
const fetchApiPOST = (slug, api, type) => {
  fetch(api, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      slug: slug,
    }),
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
const slugCourse = buttonLike.getAttribute("button-like");
if (buttonLike) {
  buttonLike.addEventListener("click", () => {
    buttonLike.classList.toggle("active");
    let api = "";
    const slugCourse = buttonLike.getAttribute("button-like");
    if (buttonLike.classList.contains("active")) {
      api = `http://localhost:3000/courses/like/${slugCourse}`;
    } else {
      api = `http://localhost:3000/courses/unlike/${slugCourse}`;
    }
    fetchApiPOST(slugCourse, api, "thích");
  });
}

// end button-like

// button-tym
const buttonTym = document.querySelector("[button-tym]");

if (buttonTym) {
  buttonTym.addEventListener("click", () => {
    buttonTym.classList.toggle("active");
    let api = "";
    const slugCourse = buttonTym.getAttribute("button-tym");
    if (buttonTym.classList.contains("active")) {
      api = `http://localhost:3000/courses/tym/${slugCourse}/`;
    } else {
      api = `http://localhost:3000/courses/untym/${slugCourse}/`;
    }
    fetchApiPOST(slugCourse, api, "yêu thích");
  });
}
// end button-tym

//buton-cart
let cart = localStorage.getItem("cart");
if (!cart) {
  localStorage.setItem("cart", JSON.stringify([]));
}

// show quantityCart
const spanQuantityCart = document.querySelector("[quantity-cart]");
const showQuantityCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  const quantityCart = cart.reduce((sum, item) => (sum += item.quantity), 0);
  if (spanQuantityCart) {
    spanQuantityCart.innerHTML = `(${quantityCart})`;
  }
};
showQuantityCart();
// end show quantityCart
const buttonCart = document.querySelector("[button-cart]");
const alertCart = document.querySelector("[alert-cart]");

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
    localStorage.setItem("cart", JSON.stringify(cart));
    showQuantityCart();
    alertCart.classList.remove("hidden");
    setTimeout(() => {
      alertCart.classList.add("hidden");
    }, 3000);
  });
}
//end button-cart

// review star event

const feedStars = document.querySelectorAll("[feed-star]");
const updatefeedStars = (value) => {
  feedStars.forEach((star) => {
    const starValue = parseInt(star.getAttribute("data-value"));
    if (starValue <= value) {
      star.classList.add("checked");
    } else {
      star.classList.remove("checked");
    }
  });
};

// rating star course
const ratingStar = document.querySelector("#rating");
console.log(ratingStar);
if (ratingStar) {
  const rating = ratingStar.getAttribute("rating");
  updatefeedStars(parseInt(rating));
}
// rating star course

//rating star oneperson
const reviewedRatings = document.querySelectorAll("[reviewed-rating]");
if (reviewedRatings) {
  reviewedRatings.forEach((reviewedRating) => {
    const rating = reviewedRating.getAttribute("reviewed-rating");
    const reviewedStars = reviewedRating.querySelectorAll("[reviewed-star]");
    reviewedStars.forEach((reviewedStar) => {
      const data = reviewedStar.getAttribute("data-value");
      if (data <= rating) {
        reviewedStar.classList.add("checked");
      } else {
        reviewedStar.classList.remove("checked");
      }
    });
  });
}
//rating star oneperson
// review-star
const reviewStars = document.querySelectorAll("[reviewing-star]");
const updateReviewStars = (value) => {
  reviewStars.forEach((star) => {
    const starValue = parseInt(star.getAttribute("data-value"));
    if (starValue <= value) {
      star.classList.add("checked");
    } else {
      star.classList.remove("checked");
    }
  });
};
const inputRating = document.querySelector("input[rating]");
if (reviewStars) {
  reviewStars.forEach((star) => {
    star.addEventListener("click", () => {
      const value = star.getAttribute("data-value");
      inputRating.value = value;
      updateReviewStars(value);
    });
  });
}
// end review-star

// form-rating and insert feed back
const formReview = document.querySelector("[form-review]");
const allFeedBack = document.querySelector(".inner-feed");
if (formReview) {
  formReview.addEventListener("submit", (e) => {
    e.preventDefault();
    const rating = e.target.elements[0].value;
    const review = e.target.elements[1].value;
    fetch(`http://localhost:3000/courses/feedback/${slugCourse}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        rating: rating,
        review: review,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        e.target.reset();
        const div = document.createElement("div");
        console.log(data);
        const nodeFirst = allFeedBack.querySelector(".person-review");
        div.classList.add("person-review");
        for (let i = 1; i <= data.rating; i++) {}
        div.innerHTML = `
          <div class="inner-info">
            <div class="inner-avatar">
              <img review-avatar src="/client/images/avatar.jpg" width="50px"/>
            </div>
            <div class="inner-name">
              <p>Thực</p>
              <p>6 ngày trước</p>
            </div>
          </div>
          <div class="inner-rating" reviewed-rating="${data.rating}">
            <span reviewed-star class="fa fa-star" data-value="1" ></span>
            <span reviewed-star class="fa fa-star" data-value="2" ></span>
            <span reviewed-star class="fa fa-star" data-value="3" ></span>
            <span reviewed-star class="fa fa-star" data-value="4" ></span>
            <span reviewed-star class="fa fa-star" data-value="5" ></span> 
          </div>
          <div class="inner-content">
            <p>${data.review}</p>
          </div>
          <div class="inner-action">
            <i class="fa-regular fa-thumbs-up mr-2" review-like="${data.id}"></i>
            <i class="fa-solid fa-pen-to-square mr-2" review-edit="${data.id}"></i>
            <i class="fa-solid fa-reply mr-2" review-reply="${data.id}"></i>
            <i class="fa-regular fa-trash-can" review-delete="${data.id}"></i>
          </div>
        `;
        const reviewedStars = div.querySelectorAll("[reviewed-star]");
        reviewedStars.forEach((reviewedStar) => {
          const data = reviewedStar.getAttribute("data-value");
          if (data <= rating) {
            reviewedStar.classList.add("checked");
          } else {
            reviewedStar.classList.remove("checked");
          }
        });
        allFeedBack.insertBefore(div, nodeFirst);
      });
  });
}
// end form-rating andinsert feed back

// review-like

const fetchApiReviewLike = (api, id, reviewLike, type) => {
  fetch(api, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const innerAction = document.querySelector(
        `[feedback="${data.feedBackId}"]`
      );
      console.log(data);
      if ((type == "like")) {
        let spanLike=innerAction.querySelector("[span-review-like]");
        if (!spanLike) {
          spanLike = document.createElement("span");
          spanLike.classList.add("mr-2");
          spanLike.setAttribute("span-review-like","")
          spanLike.innerHTML = `${data.like} lượt thích`;
          innerAction.insertBefore(spanLike, reviewLike);
          
        }
        else{
          spanLike.innerHTML=`${data.like} lượt thích`;
        }
      }
      else{
        const spanLike=innerAction.querySelector("[span-review-like]");
        if(data.like==0){
          innerAction.removeChild(spanLike);
        }
        else{
          spanLike.innerHTML=`${data.like} lượt thích`;
        }
      }
    });
};
const reviewLikes = document.querySelectorAll("[review-like]");
console.log(reviewLikes);
if (reviewLikes) {
  reviewLikes.forEach((reviewLike) => {
    reviewLike.addEventListener("click", () => {
      const feedBackId = reviewLike.getAttribute("review-like");
      reviewLike.classList.toggle("active-like");
      let api = "";
      let type = "";
      if (reviewLike.classList.contains("active-like")) {
        api = `http://localhost:3000/courses/feedback/like/${feedBackId}`;
        type = "like";
      } else {
        api = `http://localhost:3000/courses/feedback/unlike/${feedBackId}`;
        type = "unlike";
      }
      fetchApiReviewLike(api, feedBackId, reviewLike,type);
    });
  });
}
// end review-like


// review-delete


// end review-delete
