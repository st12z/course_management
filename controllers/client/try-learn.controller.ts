import { Request, Response } from "express";
import Course from "../../models/course.model";
import Lecture from "../../models/lecture.model";

export const index = async (req: Request, res: Response) => {
  const slug = req.params.slugCourse;
  const course = await Course.findOne({
    slug: slug,
    deleted: false,
    status: "active",
  });
  const learningPaths = course["resources"]["learningPath"];
  let lectures = [];
  for (const learningPath of learningPaths) {
    const lectureId = learningPath;
    const lecture = await Lecture.findOne({ _id: lectureId });
    lectures.push(lecture);
  };
  course["price_special"] = course["price"] * (1 - course["discount"] / 100);
  res.render("client/pages/try-learn/index", {
    pageTitle: "Trang học thử",
    course: course,
    lectures:lectures
  });

};
