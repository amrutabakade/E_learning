import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import {rm} from "fs"; // to delete videos,files uploaded on {upload folder}
import { promisify } from "util";
import fs from 'fs'
import { User } from "../models/User.js";


export const createCourse = TryCatch(async (req, res) => {
    const { title, description, category, createdBy, duration, price } = req.body;
  
    const image = req.file;
  
    await Courses.create({
      title,
      description,
      category,
      createdBy,
      image: image?.path,
      duration,
      price,
    });
  
    res.status(201).json({
      message: "Course Created Successfully",
    });
  });

  export const addLectures = TryCatch(async(req,res)=>
  {
    const course = await Courses.findById(req.params.id)

    if(!course) return res.status(404).json(
      {
        message: "No course with this id",
      }
    );

    const {title, description} = req.body

    const file = req.file;

    const lecture = await Lecture.create({
      title,
      description,
      video: file?.path,
      course: course._id,
    });

    res.status(201).json({
      message: "lecture added",
      lecture,
    })
  });


  //only admin can delete lectures

  export const deleteLecture = TryCatch(async(req, res)=>
  {
    const lecture = await Lecture.findById(req.params.id);

    rm(lecture.video,()=>
    {
      console.log("vido deleted");
    })

    await lecture.deleteOne();
    res.json({ message: "Lecture Deleted"});
  });

  const unlikeAsync = promisify(fs.unlink);

  export const deleteCourse = TryCatch(async(req, res)=>
    {
      //find course into Courses db
      const course = await Courses.findById(req.params.id);
      
      // find all lectures of that course to delete
      const  lectures = await Lecture.find({course: course._id});
      
      //first remove all videos of lecture
      await Promise.all(
        lectures.map(async(lecture)=>{
          await unlikeAsync(lecture.video);
          console.log("video deleted");
        })
      );
      // them delete course image
      rm(course.image, ()=>{
        console.log("image deleted");
      })

      // then delete all lectures
      await Lecture.find({course: req.params.id}).deleteMany();

      //then delete course
      await course.deleteOne();

      //remove the course from users subscription
      await User.updateMany({},{$pull:{subscription : req.params.id}});

      res.json(
        {
          message: "Course Deleted",
        }
      )
    });

  