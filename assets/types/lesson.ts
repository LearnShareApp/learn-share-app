export type Lesson = {
  id: number;
  userId: number;
  teacherId: number;
  price: number;
  date: string;
  category: string;
  status: "finished" | "ongoing" | "canceled" | "planed" | "verification";
};
