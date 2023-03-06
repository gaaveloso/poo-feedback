import { VideoDatabase } from "../database/VideoDatabase";
import { Video } from "../models/Video";
import { TVideoDB } from "../types";

export class VideoBusiness {
    public async getVideos(q: string | undefined) {
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

        return videos
    }

    public async createVideos(input: any){
        const {id, title, duration} = input

        if (typeof id !== "string") {
            throw new Error("'id' deve ser string");
          }
    
          if (typeof title !== "string") {
            throw new Error("'title' deve ser string");
          }
    
          if (typeof duration !== "number") {
            throw new Error("'duration' deve ser number");
          }
    
          const videoDatabase = new VideoDatabase();
          const videoDBExists = await videoDatabase.findVideoById(id);
    
          if (videoDBExists) {
            throw new Error("'id' já existe");
          }
    
          const newVideo = new Video(id, title, duration, new Date().toISOString());
    
          const newVideoDB: TVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            upload_at: newVideo.getUploadAt(),
          };
        
          const response = {
            message: "Video criado com sucesso",
            newVideo,
          };

          await videoDatabase.insertVideo(newVideoDB);
          return response
    }
}