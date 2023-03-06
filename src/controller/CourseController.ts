import { Request, Response } from "express";
import { CourseBusiness } from "../business/CourseBusiness";
import { BaseError } from "../errors/BaseError";

export class CourseController {
  public getCourses = async (req: Request, res: Response) => {
    try {
      const q = req.query.q as string | undefined;

      const courseBusiness = new CourseBusiness();
      const output = await courseBusiness.getCourse(q);

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

  public createCourses = async (req: Request, res:Response) => {
    try {
        const { id, name, lessons } = req.body
        const input = { id, name, lessons }

        const courseBusiness = new CourseBusiness()
        const output = await courseBusiness.createCourses(input)

        res.status(201).send(output)
    }catch (error) {
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
  }

  public editCourse = async (req: Request, res:Response) => {
    try {
        const input = {
            id: req.params.id,
            name: req.body.name,
            lessons: req.body.lessons
        }

        const courseBusiness = new CourseBusiness()
        const output = await courseBusiness.editCourseBalance(input)

        res.status(200).send(output)
    } catch (error) {
        console.log(error)
    
        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
  }
}
