import { TCourseDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";
import { VideoDatabase } from "./VideoDatabase";

export class CourseDatabase extends BaseDatabase {
  public static TABLE_COURSES = "courses";

  public async findCourses(q: string | undefined) {
    let coursesDB;

    if (q) {
      const result: TCourseDB[] = await BaseDatabase.connection(
        CourseDatabase.TABLE_COURSES
      ).where("name", "LIKE", `%${q}%`);
      coursesDB = result;
    } else {
      const result: TCourseDB[] = await BaseDatabase.connection(
        CourseDatabase.TABLE_COURSES
      );
      coursesDB = result;
    }

    return coursesDB;
  }

  public async findCourseById(id: string) {
    const [courseDB]: TCourseDB[] | undefined[] = await BaseDatabase.connection(
      CourseDatabase.TABLE_COURSES
    ).where({ id });
    return courseDB;
  }

  public async insertCourse(newCourseDB: TCourseDB) {
    await BaseDatabase.connection(CourseDatabase.TABLE_COURSES).insert(
      newCourseDB
    );
  }

  public async updateCourseById(id: string, newCourse: any) {
    await BaseDatabase.connection(CourseDatabase.TABLE_COURSES)
    .update( newCourse )
    .where({ id })
  }
}
