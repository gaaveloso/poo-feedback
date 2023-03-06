import { Request, Response } from "express";
import { VideoBusiness } from "../business/VideoBusiness";
import { VideoDatabase } from "../database/VideoDatabase";
import { BaseError } from "../errors/BaseError";
import { Video } from "../models/Video";
import { TVideoDB } from "../types";

export class VideoController {
  public getVideos = async (req: Request, res: Response) => {
    try {
      const q = req.query.q as string | undefined;

      const videoBusiness = new VideoBusiness()
      const output = await videoBusiness.getVideos(q)

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (req.statusCode === 200) {
        res.status(500);
      }

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.send("Erro inesperado");
      }
    }
  };

  public createVideos = async (req: Request, res: Response) => {
    try {
      const { id, title, duration } = req.body;
      const input = { id, title, duration }

      const videoBusiness = new VideoBusiness()
      const output = await videoBusiness.createVideos(input)

      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (req.statusCode === 200) {
        res.status(500);
      }

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
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

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
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

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.send("Erro inesperado");
      }
    }
  };
}
