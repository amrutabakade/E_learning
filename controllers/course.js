import TryCatch from "../middlewares/TryCatch.js";
import {Courses} from '../models/Courses.js';
import {Lecture} from '../models/Lecture.js'
import {User} from '../models/User.js'

export const getAllCourses = TryCatch(async(req,res)=>{
    const courses = await Courses.find();
    res.json({
        courses,
    });
});

export const getSingleCourse = TryCatch(async(req,res)=>{
    const course = await Courses.findById(req.params.id)

    res.json({
        course,
    })
});

//fetch all lec
export const fetchLectures = TryCatch(async(req,res)=>
{
    const lectures = await Lecture.find({course: req.params.id});

    const user = await User.findById(req.user._id)

    //if user is admin he will get accesss to lectures
    if(user.role === "admin")
    {
        return res.json({lectures});
    }

    // if user is not admin he has to subscribe
    if(!User.subscription.includes(req.params.id)) 
    return res.status(400).json(
    {
        message : "you have not subscribed to this corse",
    });

    res.json({lectures});
});

//fetch single lec
export const fetchLecture = TryCatch(async(req,res)=>
    {
        const lecture = await Lecture.findById(req.params.id);
    
        const user = await User.findById(req.user._id)
    
        //if user is admin he will get accesss to lectures
        if(user.role === "admin")
        {
            return res.json({lecture});
        }
    
        // if user is not admin he has to subscribe
        if(!User.subscription.includes(req.params.id)) 
        return res.status(400).json(
        {
            message : "you have not subscribed to this corse",
        });
    
        res.json({lecture});
    })