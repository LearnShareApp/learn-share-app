export type Lesson = {
  id: number;
  userId: number;
  teacherId: number;
  price: number;
  date: Date;
  skill: string;
  status: "finished" | "ongoing" | "canceled" | "planed" | "verification";
};
