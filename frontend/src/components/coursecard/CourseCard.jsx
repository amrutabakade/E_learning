import React from 'react'
import "./coursecard.css"
import { server } from '../../main'
import { useNavigate } from 'react-router-dom'
import { UserData } from '../../context/UserContext'
const CourseCard = ({course}) => {
  const navigate = useNavigate();
  const {user , isAuth} = UserData();
  return (
    <div className="course-card">
        <img src={`${server}/${course.image}`} alt='' className='course-image'></img>
        <h3>{course.title}</h3>
        <p>Instructor - {course.createdBy}</p>
        <p>Duration - {course.duration} weeks</p>
        <p>price - ${course.price}</p>
        {
          isAuth? 
          <>
              {/* if user is admit give him access , if not make him subscribe */}
              {user && user.role !== "admin" ? 
              <>
                {
                  user.subscription.includes(course._id)?
                  (
                    <button onClick={()=>navigate(`/course/study/${course._id}`)} 
                     className='common-btn'> Study</button>
                  )
                 :
                  (
                    <button onClick={()=>navigate(`/course/${course._id}`)} 
                    className='common-btn'> Get Started</button>
                  )
                }
              </> :
                (
                  <button onClick={()=>navigate(`/course/study/${course._id}`)} 
                  className='common-btn'> Study</button>
                )
              }
             
          </>
          : (<button onClick={()=>navigate("/login")}className='common-btn'> Get Started</button>)
        }
        <br/>
        {
          user && user.role === "admin" && (<button onClick={()=>navigate("/login")}
          className='common-btn' style={{background: "red"}}> Delete </button>)
        }
    </div>
  )
}

export default CourseCard
