import { useState } from "react";
import styles from "./Program.module.css";
import classnames from 'classnames';

const Program = (props) => {
  const [startShow, setStartShow] = useState(true);
  const [educationShow, setEducationShow] = useState(false);
  const [feedbackShow, setFeedbackShow] = useState(false);
  const [testShow, setTestShow] = useState(false);
  const [educationShowOrder, setEducationShowOrder] = useState("0")

  return <div className={styles.container} id="program">
    <div className={styles.program_block_container}>
      <div className={styles.program_block}>
        <div className={styles.program_title}>
          <img src="https://realibi.kz/file/453815.png"/>
          <h2>Программа курса</h2>
          <img src="https://realibi.kz/file/730116.png"/>
        </div>
        <span>{props?.program}</span>
      </div>
    </div>
   
    <div className={styles.stage_block_container}>
      <h2>Этапы обучения на курсе</h2>
      <div className={styles.stages}>
        {props.courseStages?.map(el => <>
          <div className={styles.stage}>
            <span
              onMouseEnter={() => setEducationShowOrder(el.stage_order)} 
              onMouseLeave={() => setEducationShowOrder('0')}
            >
              {el.stage_order}
            </span>
            <div 
              style={{display: educationShowOrder == el.stage_order ? "flex" : "none"}} 
              className={classnames(styles.stage_info, styles.education)}
            >
              <h3>{el.title}</h3>
              <p>{el.text}</p>
            </div>
          </div>
        </>)}
        {/* <div className={classnames(styles.stage, styles.start_block)}>
          <span 
            onMouseEnter={() => setStartShow(true)} 
            onMouseLeave={() => setStartShow(false)}
          >
            1
          </span>
          <div 
            style={{display: startShow ? "flex" : "none"}} 
            className={classnames(styles.stage_info, styles.start)}
          >
            <h3>Старт</h3>
            <p>Вы знакомитесь с преподавателем и составляете программу обучения</p>
          </div>
        </div>
        <div className={styles.stage}>
          <span
            onMouseEnter={() => setEducationShow(true)} 
            onMouseLeave={() => setEducationShow(false)}
          >
            2
          </span>
          <div 
            style={{display: educationShow ? "flex" : "none"}} 
            className={classnames(styles.stage_info, styles.education)}
          >
            <h3>Обучение</h3>
            <p>Обучение. Вы присутствуете на онлайн лекциях, изучаете материал и выполняете индивидуальные задания</p>
          </div>
        </div>
        <div className={styles.stage}>
          <span
            onMouseEnter={() => setFeedbackShow(true)} 
            onMouseLeave={() => setFeedbackShow(false)}
          >
            3
          </span>
          <div 
            style={{display: feedbackShow ? "flex" : "none"}} 
            className={classnames(styles.stage_info, styles.feedback)}
          >
            <h3>Обратная связь</h3>
            <p>Выполняете задания и получаете обратную связь по ним</p>
          </div>
        </div>
        <div className={styles.stage}>
          <span
            onMouseEnter={() => setTestShow(true)} 
            onMouseLeave={() => setTestShow(false)}
          > 
            4
          </span>
          <div 
            style={{display: testShow ? "flex" : "none"}}
            className={classnames(styles.stage_info, styles.test)}
          >
            <h3>Тестирование и оценка</h3>
            <p>По результатам месяца проводится итоговый тест на основе которого замеряется прогресс обучающегося во время всего курса.</p>
          </div>
        </div> */}
      </div>
    </div>
  </div>
};

export default Program;