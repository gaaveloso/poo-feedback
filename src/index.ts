import express, { Request, Response } from "express";
import cors from "cors";
import { Video } from "./models/Video";
import { TVideoDB } from "./types";
import { VideoDatabase } from "./database/VideoDatabase";
import { VideoController } from "./controller/VideoController";
import { CourseController } from "./controller/CourseController";
import { courseRouter } from "./router/courseRouter";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

const videoController = new VideoController()
const courseController = new CourseController()

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.use("/courses", courseRouter)

app.get("/videos", videoController.getVideos);

app.post("/videos", videoController.createVideos);

app.put("/videos/:id", videoController.updateVideo);

app.delete("/videos/:id", videoController.deleteVideo);

app.put("/courses/:id", courseController.editCourse)
