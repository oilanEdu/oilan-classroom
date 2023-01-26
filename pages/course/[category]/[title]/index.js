import { useRouter } from "next/router";
import React, {useEffect, useState} from "react";
import AboutCourse from "../../../../src/components/AboutCourse/AboutCourse";
import AboutTeacher from "../../../../src/components/AboutTeacher/AboutTeacher";
import ApplicationBlock from "../../../../src/components/ApplicationBlock/ApplicationBlock";
import CoursePrice from "../../../../src/components/CoursePrice/CoursePrice";
import Program from "../../../../src/components/Program/Program";
import globals from "../../../../src/globals";
import axios from "axios";
import Footer from "../../../../src/components/Footer/Footer";
import Header from "../../../../src/components/Header/Header";
import CourseComments from "../../../../src/components/CourseComments/CourseComments";

function Title(props) {
    const [course, setCourse] = useState()
    const [dates, setDates] = useState()
    useEffect(() => {
        console.log(course, "course");
    }, [course])
    const [courseTargets, setCourseTargets] = useState()
    const [courseInfoBlocks, setCourseInfoBlocks] = useState()
    const [courseSkills, setCourseSkills] = useState()
    const [courseStages, setCourseStages] = useState()
    const [programs, setPrograms] = useState()
    const [teacherByCourse, setTeacherByCourse] = useState()
    const [sertificates, setSertificates] = useState()
    const [teacherId, setTeacherId] = useState()
    const router = useRouter()

    useEffect(() => {
        loadQueries()
    }, [])
    
    const loadQueries = async () => {
        let data = props.title
        let getCourseOC = await axios.post(`${globals.productionServerDomain}/getCourseOC/` + data)
        const courseIdLocal = getCourseOC['data'][0]?.id
        const teacherIdLocal = getCourseOC['data'][0]?.teacher_id

        let getCourseTargets = await axios.post(`${globals.productionServerDomain}/getCourseTargets/` + courseIdLocal)
        let getDatesForApplication = await axios.post(`${globals.productionServerDomain}/getDatesForApplication/` + courseIdLocal)
        let getCourseInfoBlocks = await axios.post(`${globals.productionServerDomain}/getCourseInfoBlocks/` + courseIdLocal)
        let getCourseSkills = await axios.post(`${globals.productionServerDomain}/getCourseSkills/` + courseIdLocal)
        let getCourseStages = await axios.post(`${globals.productionServerDomain}/getCourseStages/` + courseIdLocal)
        let getPrograms = await axios.post(`${globals.productionServerDomain}/getPrograms/` + courseIdLocal)
        let getTeacherByCourse = await axios.post(`${globals.productionServerDomain}/getTeacherByCourse/` + teacherIdLocal)
        let getSertificateByTeacherId = await axios.post(`${globals.productionServerDomain}/getSertificateByTeacherId/` + teacherIdLocal)
        setCourse(getCourseOC['data'][0])
        setCourseTargets(getCourseTargets['data']) 
        setCourseInfoBlocks(getCourseInfoBlocks['data'])
        setCourseSkills(getCourseSkills['data'])
        setCourseStages(getCourseStages['data'])
        setPrograms(getPrograms['data'])
        setTeacherByCourse(getTeacherByCourse['data'][0])
        setSertificates(getSertificateByTeacherId['data'])
        setDates(getDatesForApplication['data'])
        setTeacherId(teacherIdLocal)
      }

    return (
        <>
            <div style={{backgroundColor: "#f1faff",
                        overflowX: "auto"}}>
                <Header white={true}/>
                {course != undefined ? <AboutCourse 
                    courseInfoBlocks={courseInfoBlocks} 
                    teacherByCourse={teacherByCourse}  
                    course={course} 
                    courseTargets={courseTargets}
                    teacherId={teacherId}
                /> : ''}
                {course != undefined ? <AboutTeacher 
                    teacherByCourse={teacherByCourse} 
                    courseSkills={courseSkills} 
                    course={course} 
                    teacherId={teacherId}
                    sertificates={sertificates}
                /> : ''}
                <Program 
                    program={course?.program} 
                    courseStages={courseStages}
                />
                {/* {course?.url === "EnglishForBeginner" ? <Comments /> : ''} */}
                <CourseComments course={course}/>
                <CoursePrice course={course}/>
                {course != undefined ? <ApplicationBlock 
                    course={course} 
                    dates={dates}
                    teacherByCourse={teacherByCourse}
                    teacherId={teacherId}
                /> : ''}

                <Footer />
            </div>
        </>
    )
}

Title.getInitialProps = async (ctx) => {
    if(ctx.query.title !== undefined) {
        return {
            title: ctx.query.title,
            category: ctx.query.category
        }
    }else{
        return {};
    }
}

export default Title
