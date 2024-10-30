import { Request, Response } from "express";
import Course from "../../models/course.model";
import Topic from "../../models/topic.model";
export const index = async (req: Request, res: Response) => {
  const slugTopic = req.params.slugTopic;
  const topic = await Topic.findOne({
    slug: slugTopic,
    deleted: false,
    status: "active",
  });
  const courses = await Course.find({
    topicId: topic.id,
    deleted: false,
    status: "active",
  });
  for (const course of courses) {
    course["price_special"] = course["price"] * (1 - course["discount"] / 100);
  }
  res.render("client/pages/courses/index", {
    pageTitle: "Trang danh sách khóa học",
    courses: courses,
  });
};
export const detail = async (req: Request, res: Response) => {
  const slugCourse = req.params.slugCourse;
  const course = await Course.findOne({
    slug: slugCourse,
    deleted: false,
    status: "active",
  });

  course["price_special"] = course["price"] * (1 - course["discount"] / 100);
  console.log(course);
  res.render("client/pages/courses/detail", {
    pageTitle: "Trang chi tiết khóa học",
    course: course,
  });
};
