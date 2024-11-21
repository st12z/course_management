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
      } else {
        const alert = document.querySelector("[show-alert]");
        alert.classList.remove("hidden");
        alert.innerHTML = `${data.messages}`;
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
// button-like
const buttonLike = document.querySelector("[button-like]");
let slugCourse = "";
if (buttonLike) {
  slugCourse = buttonLike.getAttribute("button-like");
  buttonLike.addEventListener("click", () => {
    buttonLike.classList.toggle("active");
    let api = "";
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

// checked-star
const updateStar = (value, stars) => {
  stars.forEach((star) => {
    const starValue = parseInt(star.getAttribute("data-value"));
    if (starValue <= value) {
      star.classList.add("checked");
    } else {
      star.classList.remove("checked");
    }
  });
};
// end checked-star

// rating star course
const ratingStar = document.querySelector("#rating");
if (ratingStar) {
  const feedStars = document.querySelectorAll("[feed-star]");
  const rating = ratingStar.getAttribute("rating");
  updateStar(parseInt(rating), feedStars);
}
// rating star course

//rating star oneperson
const reviewedStar = () => {
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
};
reviewedStar();
//rating star oneperson

// reviewing-star
const inputRating = document.querySelector("input[rating]");
const reviewStars = document.querySelectorAll("[reviewing-star]");
if (reviewStars) {
  reviewStars.forEach((star) => {
    star.addEventListener("click", () => {
      const value = star.getAttribute("data-value");
      inputRating.value = value;
      updateStar(value, reviewStars);
    });
  });
}
// end reviewing-star

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
        console.log(data);
        if (data.code == 200) {
          e.target.reset();
          const div = document.createElement("div");
          console.log(data);
          const nodeFirst = allFeedBack.querySelector(".person-review");
          div.classList.add("person-review");
          div.setAttribute("person-review", data.id);
          div.innerHTML = `
          <div class="inner-info">
            <div class="inner-avatar">
              <img review-avatar src="${data.avatar}" width="50px"/>
            </div>
            <div class="inner-name">
              <p>${data.infoUser.fullName}</p>
              <p>${data.elapsedTime}</p>
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
            <p reviewed-content>${data.review}</p>
          </div>
          <div class="inner-action" feedback="${data.id}">
            <i class="fa-regular fa-thumbs-up mr-2" review-like="${data.id}"></i>
            <i class="fa-solid fa-pen-to-square mr-2" review-edit="${data.id}"></i>
            <i class="fa-regular fa-trash-can" review-delete="${data.id}"></i>
          </div>
          <div class="inner-edit" inner-edit="${data.id}">
            <form form-edit-review>
              <div class="inner-review">
                <div class="inner-rating.form-group">
                  <p> 
                    <b>1.Đánh giá của bạn về khóa học</b>
                  </p>
                  <span edit-star  class="fa fa-star" data-value="1" ></span>
                  <span edit-star  class="fa fa-star" data-value="2" ></span>
                  <span edit-star  class="fa fa-star" data-value="3" ></span>
                  <span edit-star  class="fa fa-star" data-value="4" ></span>
                  <span edit-star  class="fa fa-star" data-value="5" ></span> 
                  <input
                    name="rating"
                    hidden
                    edit-rating
                  />
                </div>
                <div class="inner-content.form-group">
                  <p> <b>2.Cảm nhận của ban về khóa học</b></p>
                  <textarea
                    class="form-control"
                    name="description"
                  >${data.review}</textarea>
                </div>
                <button class="btn btn-primary mb-3" type="submit"> Cập nhật</div>
              </div>  
            </form>
          </div>
        `;
          allFeedBack.insertBefore(div, nodeFirst);
          const divRating = document.querySelector("#rating");
          divRating.setAttribute("rating", data.ratingAverage);
          const feedStars = divRating.querySelectorAll("[feed-star]");
          const spanReview = divRating.querySelector("span");
          const reviewingStars =
            formReview.querySelectorAll("[reviewing-star]");
          spanReview.innerHTML = `${data.ratingAverage}.0`;
          updateStar(data.ratingAverage, feedStars);
          updateStar(0, reviewingStars);
          reviewedStar();
          actionReview();
        } else {
          const alert = document.querySelector("[show-alert]");
          alert.classList.remove("hidden");
          alert.innerHTML = `${data.messages}`;
        }
      });
  });
}
// end form-rating andinsert feed back
// actionReview
const actionReview = () => {
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
        if (data.code == 200) {
          const innerAction = document.querySelector(
            `[feedback="${data.feedBackId}"]`
          );
          console.log(innerAction);
          if (type == "like") {
            let spanLike = innerAction.querySelector("[span-review-like]");
            if (!spanLike) {
              spanLike = document.createElement("span");
              spanLike.classList.add("mr-2");
              spanLike.setAttribute("span-review-like", "");
              spanLike.innerHTML = `${data.like} lượt thích`;
              innerAction.insertBefore(spanLike, reviewLike);
            } else {
              spanLike.innerHTML = `${data.like} lượt thích`;
            }
          } else {
            const spanLike = innerAction.querySelector("[span-review-like]");
            if (data.like == 0) {
              innerAction.removeChild(spanLike);
            } else {
              spanLike.innerHTML = `${data.like} lượt thích`;
            }
          }
        } else {
          const alert = document.querySelector("[show-alert]");
          alert.classList.remove("hidden");
          alert.innerHTML = `${data.messages}`;
        }
      });
  };
  const reviewLikes = document.querySelectorAll("[review-like]");
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
        fetchApiReviewLike(api, feedBackId, reviewLike, type);
      });
    });
  }
  // end review-like

  // review-delete
  const reviewDeletes = document.querySelectorAll("[review-delete]");
  if (reviewDeletes) {
    reviewDeletes.forEach((reviewDelete) => {
      reviewDelete.addEventListener("click", () => {
        const feedBackId = reviewDelete.getAttribute("review-delete");
        fetch(`http://localhost:3000/courses/feedback/delete/${feedBackId}`, {
          method: "delete",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code == 200) {
              const personReview = document.querySelector(
                `[person-review="${feedBackId}"]`
              );

              allFeedBack.removeChild(personReview);
              const divRating = document.querySelector("#rating");
              divRating.setAttribute("rating", data.ratingAverage);
              const feedStars = divRating.querySelectorAll("[feed-star]");
              const spanReview = divRating.querySelector("span");
              spanReview.innerHTML = `${data.ratingAverage}.0`;
              updateStar(data.ratingAverage, feedStars);
            }
          });
      });
    });
  }

  // end review-delete

  // edit-review
  const reviewEdits = document.querySelectorAll("[review-edit]");
  if (reviewEdits) {
    reviewEdits.forEach((reviewEdit) => {
      reviewEdit.addEventListener("click", () => {
        const feedBackId = reviewEdit.getAttribute("review-edit");
        const personReview = document.querySelector(
          `[person-review="${feedBackId}"]`
        );
        const innerEdit = personReview.querySelector(
          `[inner-edit="${feedBackId}"]`
        );
        const editStars = innerEdit.querySelectorAll("[edit-star]");
        const reviewedRating = personReview.querySelector("[reviewed-rating]");
        const rating = reviewedRating.getAttribute("reviewed-rating");
        innerEdit.classList.toggle("active");
        editStars.forEach((editStar) => {
          const data = editStar.getAttribute("data-value");
          if (data <= rating) {
            editStar.classList.add("checked");
          }
        });
        const inputRating = innerEdit.querySelector("[edit-rating]");
        const formEditReview = personReview.querySelector("[form-edit-review]");
        console.log(formEditReview);
        inputRating.value = rating;
        const updateEditStar = (value) => {
          editStars.forEach((editStar) => {
            const data = editStar.getAttribute("data-value");
            if (data <= value) editStar.classList.add("checked");
            else editStar.classList.remove("checked");
          });
        };
        editStars.forEach((editStar) => {
          editStar.addEventListener("click", () => {
            const data = editStar.getAttribute("data-value");
            updateEditStar(data);
            inputRating.value = data;
          });
        });
        if (formEditReview) {
          formEditReview.addEventListener("submit", (e) => {
            e.preventDefault();
            const rating = e.target.elements[0].value;
            const review = e.target.elements[1].value;
            fetch(`http://localhost:3000/courses/feedback/edit/${feedBackId}`, {
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
                console.log(data);
                if (data.code == 200) {
                  const reviewedRating =
                    personReview.querySelector("[reviewed-rating]");
                  const reviewedContent =
                    personReview.querySelector("[reviewed-content]");
                  reviewedRating.setAttribute("reviewed-rating", data.rating);
                  reviewedContent.innerHTML = review;
                  const divRating = document.querySelector("#rating");
                  const feedStars = divRating.querySelectorAll("[feed-star]");
                  const spanReview = divRating.querySelector("span");
                  spanReview.innerHTML = `${data.ratingAverage}.0`;
                  updateStar(data.ratingAverage, feedStars);
                  reviewedStar();
                  e.target.reset();
                  innerEdit.classList.remove("active");
                }
              });
          });
        }
      });
    });
  }

  // end edit-review
};
// end actionReview

// cache data
const formSearch = document.querySelector("[form-search]");
const innerSuggest = formSearch.querySelector(".inner-suggest");
const inputSearch = formSearch.querySelector("input");
const searchData = {};
const fetchApiCourse = async (keyword) => {
  if (searchData[keyword]) {
    renderData(searchData[keyword]);
    return;
  }
  try {
    const result = await fetch(
      `http://localhost:3000/search/suggest?keyword=${keyword}`
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
  const courseSuggest = data.courseSuggest;
  if (data.courseSuggest.length > 0) {
    innerSuggest.classList.add("active");
    const HTML = courseSuggest.map((item) => {
      return `
              <a href="/courses/detail/${item.slug}">
                <div class="inner-item"> 
                  <div class="inner-thumbnail">
                    <img src="${item.thumbnail}"/>
                  </div>
                  <div class="inner-name">
                    <p>${item.title}</p>
                  </div>
                </div>
              </a>
          `;
    });
    innerSuggest.innerHTML = HTML.join("");
  } else {
    innerSuggest.innerHTML = "";
    innerSuggest.classList.remove("active");
  }
};
// end cache data

const debounce = (callback, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args, delay);
    }, delay);
  };
};
// form-search

if (formSearch) {
  const handleSearch = debounce(async (e) => {
    const keyword = e.target.value.trim();
    if (keyword && keyword != "") {
      fetchApiCourse(keyword);
    } else {
      innerSuggest.innerHTML = "";
      innerSuggest.classList.remove("active");
    }
  }, 300);
  inputSearch.addEventListener("keyup", handleSearch);
}

// end form-search
actionReview();
