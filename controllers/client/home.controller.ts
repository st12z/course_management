import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Course from "../../models/course.model";
export const index = async (req: Request, res: Response) => {
  const courseSuggest = await Course.find({
    deleted: false,
    status: "active",
  });
  for (const course of courseSuggest) {
    course["price_special"] = course["price"] * (1 - course["discount"] / 100);
  }
  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    courseSuggest: courseSuggest,
  });
};
