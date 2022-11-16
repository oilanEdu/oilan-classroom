import React from "react";

// import Calendar from "color-calendar";
// import "color-calendar/dist/css/theme-glass.css";
import "./styles.module.css"

class CalendarComponent extends React.Component {
  componentDidMount() {
    new Calendar({
      id: "#myCal",
      theme: "glass",
      headerColor: "#007AFF",
      headerBackgroundColor: "#FFFFFF",
      primaryColor: "#007AFF",
      // weekdaysColor: "rgba(143, 143, 143, 1)",  
      dropShadow: "007AFF",
      borderRadius: "16px",
      customWeekdayValues: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      // LayoutModifier: ['month-top'],
      weekdayType: "long-upper",
      monthDisplayType: "long",
      calendarSize: "large",
      layoutModifiers: ["month-right-align"],
      eventsData: [
        {
          id: 1,
          name: "Lesson with Masha",
          start: "2022-10-25T06:00:00",
          end: "2022-10-25T06:00:00",
          lessonsCount: 6
        },
        {
          id: 2,
          name: "Blockchain 101",
          start: "2020-08-20T10:00:00",
          end: "2020-08-20T11:30:00",
          lessonsCount: 2
        }
      ],
      dateChanged: (currentDate, events) => {
        console.log("date change", currentDate, events);
      },
      monthChanged: (currentDate, events) => {
        console.log("month change", currentDate, events);
      }
    });
  }

  render() {
    return <div id="myCal"></div>;
  }
}

export default CalendarComponent;
