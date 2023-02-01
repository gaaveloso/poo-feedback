import { Request, Response } from "express";
import { VideoDatabase } from "../database/VideoDatabase";
import { Video } from "../models/Video";
import { TVideoDB } from "../types";

export class VideoController {
  public getVideos = async (req: Request, res: Response) => {
    try {
      const q = req.query.q as string | undefined;

      const videoDatabase = new VideoDatabase();
      const videosDB = await videoDatabase.findVideos(q);

      const videos: Video[] = videosDB.map(
        (videoDB) =>
          new Video(
            videoDB.id,
            videoDB.title,
            videoDB.duration,
            videoDB.upload_at
          )
      );

      res.status(200).send(videos);
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
  };

  public createVideos = async (req: Request, res: Response) => {
    try {
      const { id, title, duration } = req.body;

      if (typeof id !== "string") {
        res.status(400);
        throw new Error("'id' deve ser string");
      }

      if (typeof title !== "string") {
        res.status(400);
        throw new Error("'title' deve ser string");
      }

      if (typeof duration !== "number") {
        res.status(400);
        throw new Error("'duration' deve ser number");
      }

      const videoDatabase = new VideoDatabase();
      const videoDBExists = await videoDatabase.findVideoById(id);

      if (videoDBExists) {
        res.status(400);
        throw new Error("'id' já existe");
      }

      const newVideo = new Video(id, title, duration, new Date().toISOString());

      const newVideoDB: TVideoDB = {
        id: newVideo.getId(),
        title: newVideo.getTitle(),
        duration: newVideo.getDuration(),
        upload_at: newVideo.getUploadAt(),
      };

      // await db("videos").insert(newVideoDB);
      await videoDatabase.insertVideo(newVideoDB);

      const response = {
        message: "Video criado com sucesso",
        newVideo,
      };

      res.status(201).send(response);
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
  };

  public updateVideo = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { title, duration } = req.body;

      const videoDatabase = new VideoDatabase();
      const videoDB = await videoDatabase.findVideoById(id);

      if (!videoDB) {
        res.status(404);
        throw new Error("Video não encontrado com esse ID");
      }

      if (typeof title !== "string") {
        res.status(400);
        throw new Error("'title' deve ser string");
      }

      if (typeof duration !== "number") {
        res.status(400);
        throw new Error("'duration' deve ser number");
      }

      const video = new Video(
        videoDB.id,
        title || videoDB.title,
        duration || videoDB.duration,
        videoDB.upload_at
      );

      const updateVideoDB: TVideoDB = {
        id: video.getId(),
        title: video.getTitle(),
        duration: video.getDuration(),
        upload_at: video.getUploadAt(),
      };

      await videoDatabase.updateVideo(id, updateVideoDB);

      res.status(200).send(video);
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
  };

  public deleteVideo = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;

      const videoDatabase = new VideoDatabase();
      const videoDB = await videoDatabase.findVideoById(id);

      if (!videoDB) {
        res.status(404);
        throw new Error("Video não encontrado com essa ID");
      }

      await videoDatabase.deleteVideo(id);

      res.status(200).send({
        message: "Video deletado com sucesso",
      });
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
  };
}
