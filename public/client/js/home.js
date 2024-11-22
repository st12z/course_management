const showSpinner=()=>{
  const overLay=document.querySelector(".overlay");
  if(overLay){
    overLay.classList.add("active");
  }
}
const hiddenSpinner=()=>{
  const overLay=document.querySelector(".overlay");
  if(overLay){
    overLay.classList.remove("active");
  }
}
// // fetch api course
const fetchApiCourse = async (filters) => {
  try {
    showSpinner();
    const api = "http://localhost:3000/courses";
    const searchParams = new URLSearchParams(filters);
    const params = `?${searchParams.toString()}`;
    const result = await fetch(api + params);
    const data = await result.json();
    const courses = data.courses;
    const innerAllCourse = document.querySelector(".inner-all-course");
    console.log(courses);
    if (data.code == 200) {
      if (courses && courses.length > 0 && innerAllCourse) {
        const html = courses.map((course) => {
          return `
                <div class="col-4 mb-3">
                  <a href="/courses/detail/${course.slug}">
                    <div class="inner-course">
                      <div class="card" style="width: 16rem;" detail-card>
                        <div class="inner-image">
                          <img src=${course.thumbnail} alt="Course Thumbnail">
                          <span class="badge badge-danger" discount>Giảm ${
                            course.discount
                          }</span>
                        </div>
                        <div class="inner-content">
                          <div class="card-body">
                            <h5 class="card-title">${course.title}</h5>
                            <p class="card-text" priceOld>${course.price.toLocaleString()} đ</p>
                            <p class="card-text" priceNew>${course.price_special.toLocaleString()}đ</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              `;
        });
        innerAllCourse.innerHTML = html.join("");
      } else {
        innerAllCourse.innerHTML = "";
      }
    }
  } catch (error) {
    console.error("Lỗi gọi API:", error);
  } finally{
    hiddenSpinner();
  }
};
const handdleClearButton = (clearButton, inputType) => {
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      inputType.forEach((input) => {
        input.checked = false;
      });
      fetchApiCourse({});
      clearButton.classList.add("hidden");
    });
  }
};
const inputPrice = document.querySelectorAll("input[name='option-price']");
const clearButtonPrice = document.querySelector("[clear-price]");
const filters = {};
if (inputPrice) {
  inputPrice.forEach((input) => {
    input.addEventListener("click", async (e) => {
      const value = e.target.value;
      clearButtonPrice.classList.remove("hidden");
      filters.price = value;
      fetchApiCourse(filters);
    });
  });
}

// // end fetch api course

// filter topicId
const inputTopic = document.querySelectorAll("input[name='option-topic']");
const clearButtonTopic = document.querySelector("[clear-topic]");
if (inputTopic) {
  inputTopic.forEach((input) => {
    input.addEventListener("click", async (e) => {
      const value = e.target.value;
      filters.topicId = value;
      clearButtonTopic.classList.remove("hidden");
      fetchApiCourse(filters);
    });
  });
}

// end filter topicId
handdleClearButton(clearButtonTopic, inputTopic);
handdleClearButton(clearButtonPrice, inputPrice);
