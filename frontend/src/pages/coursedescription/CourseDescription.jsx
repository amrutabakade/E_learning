import React, { useEffect } from 'react'
import "./courseDescription.css"
import { useNavigate, useParams } from 'react-router-dom'
import { server } from '../../main'
import { CourseData } from '../../context/CourseContext'
const CourseDescription = ({user}) => {
    const params = useParams(); // parameters in url like id
    const {fetchCourse , course} = CourseData();
    const navigate = useNavigate();
    useEffect(()=>{
        fetchCourse(params.id);
    },[]);
  return (
        <>
        {
            course &&  (<div className="course-description">
                <div className="course-header">
                    <img src={`${server}/${course.image}`} alt="" className="course-image" />
                <div className="course-info">
                    <h2>{course.title}</h2>
                    <p>Instructor: {course.createdBy}</p>
                    <p>Duration: {course.duration}</p>
                </div>
                </div>
                <p>Let's get this course at price at ${course.price}</p>
                {
                    user && user.subscription.includes(course._id)? 
                    (<button onClick={()=> navigate(`/course/study/${course._id}`)} 
                    className='common-btn'>Study</button>) :
                    (<button className='common-btn'>Buy Now</button>)
                }
            </div>
            )}
        </>
  )
}

export default CourseDescription
