import { Request, Response } from "express";
import Course from "../../models/course.model";
import Topic from "../../models/topic.model";
import Lecture from "../../models/lecture.model";
import FavoriteCourse from "../../models/favorite-course.model";
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
  const learningPaths = course["resources"]["learningPath"];
  let lectures = [];
  for (const learningPath of learningPaths) {
    const lectureId = learningPath;
    const lecture = await Lecture.findOne({ _id: lectureId });
    lectures.push(lecture);
  }
  course["price_special"] = course["price"] * (1 - course["discount"] / 100);
  res.render("client/pages/courses/detail", {
    pageTitle: "Trang chi tiết khóa học",
    course: course,
    lectures: lectures,
  });
};

export const like = async (req: Request, res: Response) => {
  const slugCourse = req.params.slugCourse;
  const course = await Course.findOne({
    slug: slugCourse,
    deleted: false,
    status: "active",
  });
  await Course.updateOne({ slug: slugCourse }, { like:course.like+1 });
  res.json({
    code:200,
    messages:"Cập nhật thành công",
    like:course["like"]+1
  });
};
export const unlike = async (req: Request, res: Response) => {
  const slugCourse = req.params.slugCourse;
  const course = await Course.findOne({
    slug: slugCourse,
    deleted: false,
    status: "active",
  });
  await Course.updateOne({ slug: slugCourse }, { like:course.like-1 });
  res.json({
    code:200,
    messages:"Cập nhật thành công",
    like:course["like"]+-1
  });
};
export const tym = async (req: Request, res: Response) => {
  const slugCourse = req.params.slugCourse;
  const course = await Course.findOne({
    slug: slugCourse,
    deleted: false,
    status: "active",
  });
  await Course.updateOne({ slug: slugCourse }, { tym:course.tym+1 });
  const dataFavorite={
    courseId:course["id"]
  }
  const favoriteSong=new FavoriteCourse(dataFavorite);
  favoriteSong.save();
  res.json({
    code:200,
    messages:"Cập nhật thành công",
    tym:course["tym"]+1
  });
};
export const untym = async (req: Request, res: Response) => {
  const slugCourse = req.params.slugCourse;
  const course = await Course.findOne({
    slug: slugCourse,
    deleted: false,
    status: "active",
  });
  await Course.updateOne({ slug: slugCourse }, { tym:course.tym-1 });
  res.json({
    code:200,
    messages:"Cập nhật thành công",
    tym:course["tym"]-1
  });
};
