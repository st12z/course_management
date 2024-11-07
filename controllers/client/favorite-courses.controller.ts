import { Request, Response } from "express";
import FavoriteCourse from "../../models/favorite-course.model";
import Course from "../../models/course.model";
import User from "../../models/user.model";
export const index = async (req: Request, res: Response) => {
  const user=res.locals.user;
  console.log(user);
  const favoriteCourses = await FavoriteCourse.find({
    deleted: false,
    status: "active",
    userId:user.id
  });
  let courses = [];
  let courseSuggest=await Course.find({deleted:false,status:"active"});
  for (const favoriteCourse of favoriteCourses) {
    const id = favoriteCourse["courseId"];
    const course = await Course.findOne({
      _id: id,
      deleted: false,
      status: "active",
    });
    course["price_special"] = course["price"] * (1 - course["discount"] / 100);
    courses.push(course);
  }
  console.log(favoriteCourses);
  res.render("client/pages/favorite-courses/index", {
    pageTitle: "Danh sách khóa học yêu thích",
    courses: courses,
    courseSuggest:courseSuggest
  });
};
