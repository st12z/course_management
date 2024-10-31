import { Request, Response } from "express";
import Course from "../../models/course.model";
import Topic from "../../models/topic.model";
import Lecture from "../../models/lecture.model";
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
  const learningPaths=course["resources"]["learningPath"];
  let lectures=[];
  for(const learningPath of learningPaths){
    const lectureId=learningPath;
    const lecture=await Lecture.findOne({_id:lectureId});
    lectures.push(lecture);
  }
  course["price_special"] = course["price"] * (1 - course["discount"] / 100);
  res.render("client/pages/courses/detail", {
    pageTitle: "Trang chi tiết khóa học",
    course: course,
    lectures:lectures
  });
};
