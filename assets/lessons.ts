import { date } from "zod";
import { Lesson } from "./types/lesson";

export const LESSONS: Lesson[] = [
  {
    id: 2,
    userId: 21,
    teacherId: 1,
    category: "programming",
    price: 39.9,
    date: "31dec",
    status: "ongoing",
  },
  {
    id: 4,
    userId: 11,
    teacherId: 2,
    category: "cooking",
    price: 39.9,
    date: "31dec",
    status: "planed",
  },
  {
    id: 3,
    userId: 43,
    teacherId: 3,
    category: "math",
    price: 39.9,
    date: "31dec",
    status: "planed",
  },
  {
    id: 1,
    userId: 2,
    teacherId: 4,
    category: "english",
    price: 39.9,
    date: "31dec",
    status: "planed",
  },
];
