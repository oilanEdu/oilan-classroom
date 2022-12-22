import axios from "axios";
import { useEffect, useState } from "react";
import styles from './Comments.module.css'

function Comments(props) {

  return (
    <div className={styles.wrapper}>
        <h1 className={styles.title}>Отзывы учеников</h1>
    <div className={styles.commentsWrapper}> 

        <div className={styles.comment}>
            <div className={styles.wrapper1}>
                <img src="https://realibi.kz/file/744866.png" className={styles.avatar}/>
                <div className={styles.wrapper2}>
                    <div className={styles.wrapper3}>
                        <p className={styles.name}>Анна Крюкова</p>
                        <p className={styles.date}>21.12.2022</p>
                    </div>
                    <div className={styles.wrapper4}>
                        <p className={styles.subAbout}>О курсе</p>
                        <p className={styles.about}> «Английский для начинающих»</p>
                    </div>
                    <div className={styles.wrapper5}>
                        <p className={styles.rating}>Оценка - 5,0</p>
                        <div className={styles.stars}>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                        </div>
                    </div>
                    <p className={styles.text}>
                    Хотелось бы оставить положительный отзыв о занятиях по английскому языку с преподавателем Дмитрием. Его мне рекомендовал менеджер ЧК «Oilan.io Ltd»   (https://www.oilan-classroom.com), на этой платформе я заполняю домашнее задание и повторяю пройденный материал. Я выбрала обучение онлайн, чтобы заниматься на работе в обеденный перерыв. Необходимость в знании языка связана с желанием разговаривать с англоязычными людьми, когда я нахожусь за
                    </p>
                </div>
            </div>
        </div>

        <div className={styles.comment}>
            <div className={styles.wrapper1}>
                <img style={{borderRadius: "50%"}} src="https://realibi.kz/file/231871.jfif" className={styles.avatar}/>
                <div className={styles.wrapper2}>
                    <div className={styles.wrapper3}>
                        <p className={styles.name}>Гаухар Алиаскар</p>
                        <p className={styles.date}>21.12.2022</p>
                    </div>
                    <div className={styles.wrapper4}>
                        <p className={styles.subAbout}>О курсе</p>
                        <p className={styles.about}> «Английский для начинающих»</p>
                    </div>
                    <div className={styles.wrapper5}>
                        <p className={styles.rating}>Оценка - 5,0</p>
                        <div className={styles.stars}>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                            <img src="https://realibi.kz/file/601212.png" className={styles.star}/>
                        </div>
                    </div>
                    <p className={styles.text}>
                    Спасибо большое Oilan👏🏻<br></br>
                    Очень удобная платформа!                                                                        
                    </p>
                </div>
            </div>
        </div>

    </div>
    </div>
  );
}

export default Comments;
