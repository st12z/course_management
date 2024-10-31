import { Request, Response } from "express";
import FavoriteCourse from "../../models/favorite-course.model";
import Course from "../../models/course.model";
export const index = async (req: Request, res: Response) => {
  const favoriteCourses = await FavoriteCourse.find({
    deleted: false,
    status: "active",
  });
  let courses = [];
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
  res.render("client/pages/favorite-courses/index", {
    pageTitle: "Danh sách khóa học yêu thích",
    courses: courses,
  });
};
