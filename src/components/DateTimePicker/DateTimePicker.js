import React, { useState, useEffect } from "react";
import styles from "./DateTimePicker.module.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DateTimePicker = (props) => {

// const [outputDate, setOutputDate] = useState('')
const emptyTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
// console.log('DATES IN PICKER', disabledDates)
useEffect(()=> {
  // props.loadDates()
    workWithDates(props.selectedDate)
    if (!props.selectedDate){
      workWithDates(props.selectedDate)
    } 
  }, [])
const workWithDates = (date) => {
  //date.setDate(date.getDate() + 1);
  let myOurs = [] 
  console.log('DATE', date)
  console.log('CHECK', new Date(date).toISOString().split('T')[0])
  for (const disabledDate of props.disabledDates) {
    if (disabledDate.lesson_time) {
      let regularDate = disabledDate.lesson_time
      let currentDateType = new Date(regularDate).toISOString().split('T')[0]
      let currentTimeType = new Date(regularDate).toISOString().split('T')[1].split('.')[0]
      // console.log('busytime', currentDateType) 
      if (currentDateType == new Date(props.selectedDate).toISOString().split('T')[0]){
        console.log('time', currentTimeType.toString().substring(0,2))
        // setBusyHours([...busyHours, currentTimeType.toString().substring(0,2)+':00']);
        console.log('busyHours', props.busyHours )
        myOurs = myOurs.concat(currentTimeType.toString().substring(0,2)+':00')
        if (Number(currentTimeType.toString().substring(3,5)) > 0){
          myOurs = myOurs.concat((Number(currentTimeType.toString().substring(0,2))+1).toString()+':00')
        }
      props.setBusyHours(myOurs);
      if (!myOurs){props.setBusyHours(myOurs);}
      } 
      //setOutputDate(new Date(date).toISOString().split('T')[0]+'T'+selectedBlock+':00.000Z')
    }
  }
}
// useEffect(() => {
//   props.setSelectedDate
//   debugger
// }, [props.setSelectedDate])
useEffect(() => {
  workWithDates(props.selectedDate)
}, [props.selectedDate])
return (

  <div className={styles.calendarBlock}>
    <Calendar 
      value={props.selectedDate} 
      // minDate={new Date(2023, 0, 4)}
      onChange={(date) => {
        props.setBusyHours('00:00')
        props.setSelectedBlock('00:00') 
        props.setSelectedDate(new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + 24*60*60*1000));
        }
      }
      className={styles.calendar}
    />
    <div className={styles.times}>
      {emptyTimes.map(block => (
        <div style={block == props.selectedBlock?{display:'flex', maxWidth: '90px', padding: '2px', border: '3px solid #007AFF', borderRadius: '8px', marginRight: '20px', marginBottom: '5px', marginTop: '5px'}:{display:'flex', maxWidth: '90px', padding: '2px', border: '3px solid white', borderRadius: '8px', marginRight: '20px', marginBottom: '5px', marginTop: '5px'}}>
          <div 
            className={props.busyHours.includes(block)?styles.timeBlockUnselected:styles.timeBlockSelected}
            onClick={() => {
              if (!busyHours.includes(block)){
                props.setSelectedBlock(block)
                props.setOutputDate(new Date(props.selectedDate).toISOString().split('T')[0]+'T'+props.selectedBlock+':00.000Z')
                console.log('OUTPUT_DATE', props.outputDate)
              }
            }}
          >
            {block}
          </div>
        </div>
      ))}
    </div>
  </div>
);}; 

export default DateTimePicker