import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from "date-fns";
import React, { Fragment, useEffect, useState } from "react";
import { ru } from 'date-fns/locale';
import styles from "./styles.module.css";
import LessonOfTheDay from "../LessonOfTheDay/LessonOfTheDay";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Calendar2 = React.memo((props) => {
  useEffect(() => {
    console.log("days", days)
  }, [])
  useEffect(() => {
    console.log("CALENDAR PROPS", props)
  }, [props])
  // let test = props.lessons
  // let test2 = test.map(el => el.start_time == days)
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  // let selectedDayMeetings = meetings.filter((meeting) =>
  //   isSameDay(parseISO(meeting.startDatetime), selectedDay)
  // );
  let selectedDayMeetings2 = props?.lessons?.filter((lesson) =>
    isSameDay(parseISO(lesson.personal_time ? lesson.personal_time : lesson.start_time), today)
  ).length;
  // let selectedDayMeetings3 = props?.lessons?.filter((lesson) =>
  //   isSameDay(parseISO(lesson.start_time), days.map(day => {

  //   }))
  // );
  // let selectedDayMeetings4 = days?.filter((day) =>
  //     props.lessons.map(lesson => {

  //   }))

  useEffect(() => {
    console.log("selectedDayMeetings2", selectedDayMeetings2)
  }, [selectedDayMeetings2])

  // const lessonOfTheDay = (day, lesson2) => {
  //   useEffect(() => {
  //     if (lesson2.student_id != undefined) {
  //       async function test() {
  //         let student_id = lesson2.student_id
  //         let data = {
  //           student_id
  //         }
  //         let test1 = await axios.post(`${globals.productionServerDomain}/getStudentById`, data);
  //         debugger
  //         // let student_id = errorOfDateOfGoingLessonLesson.student_id
  //         // let data = {
  //         //   student_id
  //         // }
  //         // let getStudent = await axios({
  //         //   method: "post",
  //         //   url: `${globals.productionServerDomain}/getStudentById`,
  //         //   data: data,
  //         // }) 
  //         //   .then(function (res) {
  //         //     if (res.data[0]){
  //         //       setStudentOfError(res.data[0])
  //         //         // console.log('EXE', res.data[0].status)
  //         //         // exercise.answer_status = res.data[0].status
  //         //         // exercise.teacher_comment = res.data[0].comment 
  //         //     }else{
  //         //         console.log('ответов нет')
  //         //         // setStudent()
  //         //     }
  //         //   })
  //         //   .catch((err) => {
  //         //     alert("Произошла ошибка");   
  //         //   });
  //       }
  //       test()
  //     }
  //   }, [])
  //   return (
  //     <div>
  //       TEST
  //     </div>
  //   )
  // }
  const LessonsOfTheDay = ({day, lessons}) => {
    useEffect(() => {
      console.log('HIIIIIII')
    }, )
    return (
      <div
      style={{display: isEqual(day, selectedDay) && lessons.some((lesson) =>
        isSameDay(parseISO(lesson.personal_time ? lesson.personal_time : lesson.start_time), day))  
        ? 
        "flex" : "none"}}
        className={styles.lessonsOfTheDay}
      >
         {/* {lessons.filter((lesson2) =>
              isSameDay(parseISO(lesson2.personal_time ? lesson2.personal_time : lesson2.start_time), day)).length} */}
          {lessons.map((lesson2) => <div 
          style={{display: isSameDay(parseISO(lesson2.personal_time ? lesson2.personal_time : lesson2.start_time), day) ? "flex" : "none"}}
          // className={styles.lessonsOfTheDay}
          >
            {isSameDay(parseISO(lesson2.personal_time ? lesson2.personal_time : lesson2.start_time), day) 
        ? <div className={styles.LessonOfTheDay}>
          <LessonOfTheDay day={day} lesson2={lesson2} />
          </div> : ''}
            
          </div>
          )}
      </div>
    )
  }
  return (
    <div className={styles.calendar_wrapper}>
      <div className={styles.wrapper1}>
        <div className={styles.wrapper2}>
          <button
            type="button"
            onClick={previousMonth}
            className={styles.wrapper4}
          >
            <span className={styles.wrapper5}>Previous month</span>
            {/* <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" /> */}
          </button>
          <h2 className={styles.wrapper3}>
            {format(firstDayCurrentMonth, "LLLL yyyy", { locale: ru })}
          </h2>

          <button
            onClick={nextMonth}
            type="button"
            className={styles.wrapper4_2}
          >
            <span className={styles.wrapper5}>Next month</span>
            {/* <ChevronRightIcon className="w-5 h-5" aria-hidden="true" /> */}
          </button>
        </div>
        <div className={styles.wrapper2_subTitle}>
          {/* Занятий на день - {selectedDayMeetings2} */}
        </div>
        <div className={styles.wrapper6}>
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
        <div className={styles.wrapper7}>
          {days.map((day, dayIdx) => (
            <div
              onClick={() => {setSelectedDay(day)}}
              key={day.toString()}
              className={classNames(
                dayIdx === 0 && colStartClasses[getDay(day)],
                "py-1-5",
                isEqual(day, selectedDay) && "selectedDay", //selected day
                !isEqual(day, selectedDay) && isToday(day) && "today", //today
                !isEqual(day, selectedDay) &&
                !isToday(day) &&
                isSameMonth(day, firstDayCurrentMonth) &&
                "text-gray-900", //everything that is not today
                !isEqual(day, selectedDay) &&
                !isToday(day) &&
                !isSameMonth(day, firstDayCurrentMonth) &&
                "text-gray-400",
                isEqual(day, selectedDay) && isToday(day) && "bg-red-500", //if selected day is today
                isEqual(day, selectedDay) && !isToday(day) && "bg-gray-900",
                !isEqual(day, selectedDay) && "hover:bg-gray-200",
                (isEqual(day, selectedDay) || isToday(day)) &&
                "font-semibold", //today
                "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
              )}
            >
              <div>
                {props?.lessons?.some((lesson) =>
                  isSameDay(parseISO(lesson.personal_time ? lesson.personal_time : lesson.start_time), day)
                ) && <div className={styles.countOfLessons}>
                    {props?.lessons?.filter((lesson2) =>
                      isSameDay(parseISO(lesson2.personal_time ? lesson2.personal_time : lesson2.start_time), day)).length}
                  </div>}
              </div>
              <button
                type="button"

                className={classNames(
                  isEqual(day, selectedDay) && "selectedDayNumber", //selected day
                  !isEqual(day, selectedDay) && isToday(day) && "todayNumber", //today
                  !isEqual(day, selectedDay) &&
                  !isToday(day) &&
                  isSameMonth(day, firstDayCurrentMonth) &&
                  "text-gray-900", //everything that is not today
                  !isEqual(day, selectedDay) &&
                  !isToday(day) &&
                  !isSameMonth(day, firstDayCurrentMonth) &&
                  "text-gray-400",
                  isEqual(day, selectedDay) && isToday(day) && "bg-red-500", //if selected day is today
                  isEqual(day, selectedDay) && !isToday(day) && "bg-gray-900",
                  !isEqual(day, selectedDay) && "hover:bg-gray-200",
                  (isEqual(day, selectedDay) || isToday(day)) &&
                  "font-semibold", //today
                  styles.calendarDay
                )}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </button>
              {/* 
              <div className="w-1 h-1 mx-auto mt-1">
                {meetings.some((meeting) =>
                  isSameDay(parseISO(meeting.startDatetime), day)
                ) && <div className="w-1 h-1 rounded-full bg-sky-500"></div>}
              </div> */}
              
              {/* <div
              style={{display: isEqual(day, selectedDay) && props?.lessons?.some((lesson) =>
                isSameDay(parseISO(lesson.personal_time ? lesson.personal_time : lesson.start_time), day))  
                ? 
                "block" : "none"}}
              >
                {isEqual(day, selectedDay) && props?.lessons?.some((lesson) =>
                isSameDay(parseISO(lesson.personal_time ? lesson.personal_time : lesson.start_time), day))  
                ?  
                <LessonsOfTheDay day={day} lessons={props?.lessons} /> : ''}
                
                 {/* {props?.lessons?.filter((lesson2) =>
                      isSameDay(parseISO(lesson2.personal_time ? lesson2.personal_time : lesson2.start_time), day)).length}
                  {props?.lessons?.map((lesson2) => <div 
                  style={{display: isSameDay(parseISO(lesson2.personal_time ? lesson2.personal_time : lesson2.start_time), day) ? "block" : "none"}}
                  >
                    test
                  </div>
                  )} */}
              {/* </div>  */}

              {isEqual(day, selectedDay) && props?.lessons?.some((lesson) =>
                isSameDay(parseISO(lesson.personal_time ? lesson.personal_time : lesson.start_time), day))  
                ?  
                <LessonsOfTheDay day={day} lessons={props?.lessons} /> : ''}
                {/* <LessonsOfTheDay day={day} lessons={props?.lessons} /> */}
              {/* <div>{lessonsOfTheDay(day, props?.lessons)}</div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
})

// function Meeting({ meeting }) {
//   let startDateTime = parseISO(meeting.startDatetime);
//   let endDateTime = parseISO(meeting.endDatetime);

//   return (
//     <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
//       <img
//         src={meeting.imageUrl}
//         alt=""
//         className="flex-none w-10 h-10 rounded-full"
//       />
//       <div className="flex-auto">
//         <p className="text-gray-900">{meeting.name}</p>
//         <p className="mt-0.5">
//           <time dateTime={meeting.startDatetime}>
//             {format(startDateTime, "h:mm a")}
//           </time>{" "}
//           -{" "}
//           <time dateTime={meeting.endDatetime}>
//             {format(endDateTime, "h:mm a")}
//           </time>
//         </p>
//       </div>
//     </li>
//   );
// }

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export default Calendar2