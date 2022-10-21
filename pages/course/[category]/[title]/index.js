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

function Title(props) {
    const [course, setCourse] = useState()
    const [courseTargets, setCourseTargets] = useState()
    const [courseInfoBlocks, setCourseInfoBlocks] = useState()
    const [courseSkills, setCourseSkills] = useState()
    const [courseStages, setCourseStages] = useState()
    const [programs, setPrograms] = useState()
    const [teacherByCourse, setTeacherByCourse] = useState()
    const router = useRouter()

    useEffect(() => {
        console.log(router)
        console.log('PROPS', props)
        loadQueries()
    }, [])
    
    const loadQueries = async () => {
        let data = props.title
        let getCourseOC = await axios.post(`${globals.productionServerDomain}/getCourseOC/` + data)
        const courseIdLocal = getCourseOC['data'][0]?.id
        const teacherIdLocal = getCourseOC['data'][0]?.teacher_id
        console.log("getCourseOC", getCourseOC['data'])
        console.log("getCourseOC ID", getCourseOC['data'][0]?.id)
        let getCourseTargets = await axios.post(`${globals.productionServerDomain}/getCourseTargets/` + courseIdLocal)
        // let captcha2 = await axios.post(`${globals.productionServerDomain}/getCaptchaWithId/` + data)
        let getCourseInfoBlocks = await axios.post(`${globals.productionServerDomain}/getCourseInfoBlocks/` + courseIdLocal)
        let getCourseSkills = await axios.post(`${globals.productionServerDomain}/getCourseSkills/` + courseIdLocal)
        let getCourseStages = await axios.post(`${globals.productionServerDomain}/getCourseStages/` + courseIdLocal)
        let getPrograms = await axios.post(`${globals.productionServerDomain}/getPrograms/` + courseIdLocal)
        let getTeacherByCourse = await axios.post(`${globals.productionServerDomain}/getTeacherByCourse/` + teacherIdLocal)
        console.log("getCourseInfoBlocks['data']", getCourseInfoBlocks['data'])
        //hooks
        setCourse(getCourseOC['data'][0])
        setCourseTargets(getCourseTargets['data'])
        setCourseInfoBlocks(getCourseInfoBlocks['data'])
        setCourseSkills(getCourseSkills['data'])
        setCourseStages(getCourseStages['data'])
        setPrograms(getPrograms['data'])
        setTeacherByCourse(getTeacherByCourse['data'][0])
        
      }

    return (
        <>
            <div style={{backgroundColor: "#f1faff"}}>
              <Header white={true}/>
              <AboutCourse courseInfoBlocks={courseInfoBlocks} teacherByCourse={teacherByCourse} course={course} courseTargets={courseTargets}/>
              <AboutTeacher teacherByCourse={teacherByCourse} courseSkills={courseSkills} course={course}/>
              <Program program={course?.program} courseStages={courseStages}/>
              <CoursePrice course={course}/>
              <ApplicationBlock course={course} teacherByCourse={teacherByCourse}/>
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
