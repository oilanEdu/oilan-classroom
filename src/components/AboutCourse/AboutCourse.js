import styles from "./AboutCourse.module.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import globals from "../../globals";
import { default as axios } from "axios";
import { Image } from "react-bootstrap";
import classnames from 'classnames';

export default function AboutCourse(props) {
  

  return (
    <div className={styles.container}>
      <div className={styles.mainInfo}>
        <div className={styles.leftMainInfo}>
          <div className={styles.flud}>
            <p>Oilan.classroom</p>
            <div className={styles.imgBoom}></div>
          </div>
          <div className={styles.courseTitle}>
            <h1>Математика простыми словами</h1>
          </div>
          <div className={styles.courseDescription}>
            <p>
              Курс предназначен для учащихся школ. На нем проходятся основные темы из общего курса математики в школе. Благодаря ему вы значительно повысите свои знания по предмету и сможете легко и быстро решать задачи из тестов для поступления в НИШ и сдачи ЕНТ.
            </p>
          </div>
          <div className={styles.buttonBlock}>
            <button className={styles.courseButton}>Записаться на курс</button>
          </div>
        </div>
        <div className={styles.rightMainInfo}>
          <Image src={'https://realibi.kz/file/596699.png'} className={styles.imgArrow}/>
          <Image src={'https://realibi.kz/file/978476.png'} className={styles.imgGlobe}/>
          <Image src={'https://realibi.kz/file/548803.png'} className={styles.imgGirls}/>
        </div>
      </div>
      <div className={styles.targetPersons}>
        <h1>КОМУ ПОДОЙДЕТ КУРС</h1>
        <div className={styles.items}>
          <div className={styles.item}>
            <Image src={'https://realibi.kz/file/243934.png'} className={styles.imgEvaluation}/>
            <p className={styles.targetTitle}>Школьникам с низкой успеваемостью</p>
            <p className={styles.targetDescr}>За 2 месяца занятий гарантируем заметный рост в успеваемости по предмету</p>
          </div>
          <div className={styles.item}>
            <Image src={'https://realibi.kz/file/410726.png'} className={styles.imgMedal}/>
            <p className={styles.targetTitle}>Поступающим в НИШ</p>
            <p className={styles.targetDescr}>Готовим ребенка к поступлению в НИШ</p>
          </div>
          <div className={styles.item}>
            <Image src={'https://realibi.kz/file/915691.png'} className={styles.imgDiploma}/>
            <p className={styles.targetTitle}>Сдающим ЕНТ</p>
            <p className={styles.targetDescr}>Готовим ребенка к сдаче ЕНТ</p>
          </div>
        </div>
      </div>
      <div className={styles.courseSquares}>
        <h1>О КУРСЕ</h1>
        <div className={styles.squares}>
          <div className={styles.leftSquare}>
            <p className={styles.squareTitle}>
              Онлайн Обучение 😎
            </p>
            <p className={styles.squareText}>
              Обучение проходит онлайн в удобное для вас время 
            </p>
          </div>
          <div className={styles.rightSquare}>
            <p className={styles.squareTitle}>
              Индивидуальная программа 😄
            </p>
            <p className={styles.squareText}>
              Программа формируется на основе первого общения с учеником. <br/>Также индивидуально выстраивается расписание занятий 
            </p>
          </div>
          <div className={styles.leftSquare}>
            <p className={styles.squareTitle}>
              40 000 тенге 👌  
            </p>
            <p className={styles.squareText}>
              В стоимость входит 4 недели индивидуальной работы с учеником по 2 занятия в неделю 
            </p>
          </div>
          <div className={styles.rightSquare}>
            <p className={styles.squareTitle}>
              Бонусная система обучения 🔥
            </p>
            <p className={styles.squareText}>
              При положительных оценках вы получаете грант на следующую покупку:<br/>
                от 80 до 100 баллов - грант 10%<br/>
                от 60 до 80 баллов - грант 7%<br/>
                от 40 до 60 баллов - грант 5%  
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
