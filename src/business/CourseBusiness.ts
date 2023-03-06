import { CourseDatabase } from "../database/CourseDatabase";
import { VideoDatabase } from "../database/VideoDatabase";
import { Course } from "../models/Course";
import { TCourseDB } from "../types";

export class CourseBusiness {
    public async getCourse(q: string | undefined) {
        const courseDatabase = new CourseDatabase()
        const courseDB = await courseDatabase.findCourses(q)

        const courses: Course[] = courseDB.map(
            (courseDB) =>
            new Course(
                courseDB.id,
                courseDB.name,
                courseDB.lessons,
            )
        )

        return courses
    }

    public async createCourses(input: any){
        const {id, name, lessons} = input

        if (typeof id !== "string") {
            throw new Error("'id' deve ser string");
          }
    
          if (typeof name !== "string") {
            throw new Error("'name' deve ser string");
          }
    
          if (typeof lessons !== "number") {
            throw new Error("'lessons' deve ser number");
          }

          const courseDatabase = new CourseDatabase()
          const courseDBExist = await courseDatabase.findCourseById(id)

          if (courseDBExist) {
            throw new Error("'id' já existe")
          }

          const newCourse = new Course(id, name, lessons)

          const newCourseDB: TCourseDB = {
            id: newCourse.getId(),
            name: newCourse.getName(),
            lessons: newCourse.getLessons()
          }

          const response = {
            message: "Curso criado com sucesso",
            newCourse,
          };

          await courseDatabase.insertCourse(newCourseDB)
          return response
    }

    public editCourseBalance = async (input: any) => {
        const { id, name, lessons } = input

        if (typeof lessons !== "number") {
            throw new Error("'lessons' deve ser number")
        }

        const courseDatabase = new CourseDatabase()
        const courseDB = await courseDatabase.findCourseById(id)

        if (!courseDB) {
            throw new Error("'id' não encontrado")
        }

        const course = new Course(
            courseDB.id,
            courseDB.name,
            courseDB.lessons
        )

        await courseDatabase.updateCourseById(id, course)

        const output = {
            message: "Curso atualizado com sucesso",
            course
        }

        return output
    }
}