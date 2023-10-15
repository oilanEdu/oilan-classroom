import { useEffect, useState } from "react"
import styles from "./index.module.css"
import axios from "axios";
import globals from "../../globals";

function StudentGoingLesson({lesson}) {
    const [links, setLinks] = useState()    
    const [materials, setMaterials] = useState()

    const fetch = async () => {
        const response = await axios.post(`${globals.productionServerDomain}/getLessonMaterialsOC`, { lessonId: lesson?.lesson_id });
        const links = response['data']['data'].filter(obj => obj.is_lesson_link === true);
        const materials = response['data']['data'].filter(obj => obj.is_lesson_link === false);
        setLinks(links)
        setMaterials(materials)   
    }    
    useEffect(() => { 
        fetch()
    }, [])

    const handleDownloadMaterialsClick = async (materials, archiveName) => {
        const filteredMaterials = materials.filter(
          (material) => material.link.startsWith('https://realibi.kz/file/')
        );
    
        try {
          const response = await axios({
            method: 'post',
            url: `${globals.productionServerDomain}/downloadArchive`,
            data: {
              links: filteredMaterials.map((material) => material.link),
              archiveName,
            },
            responseType: 'blob',
          });
    
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${archiveName}.zip`);
          document.body.appendChild(link);
          link.click();
        } catch (error) {
          console.error('Ошибка при получении архива с материалами:', error);
        }
      };

    return (
        <div className={styles.wrapperAll}>
            <div className={styles.lesson}>
                <div>
                    <div className={styles.lesson_content}>
                        <div className={styles.lesson_order_wrapper}>
                            <span className={styles.lesson_order}>Урок:
                                <span> {lesson?.title}</span> 
                            </span>
                        </div>
                        <div className={styles.lesson_tesis}>
                            <span>{lesson?.tesis}</span>
                        </div>
                        <div className={styles.lesson_tesis}
                        >
                             <div className={styles.lesson_complete_wrapper}>                                       
                                        <h3 style={{margin: '0px'}} className={styles.lesson_date}>
                                            {lesson?.personal_time ? new Date(lesson?.personal_time).toLocaleDateString() : new Date(lesson?.start_time).toLocaleDateString()}
                                        </h3>
                                        <p>{new Date(lesson?.personal_time ? lesson?.personal_time : lesson?.start_time).getHours().toString().padStart(2, "0")}:{new Date(lesson?.personal_time ? lesson?.personal_time : lesson?.start_time).getMinutes().toString().padStart(2, "0")} </p>

                                    </div>
                        </div>
                    </div>
                    <p className={styles.lesson_tesis}
                    >

                        <>
                            <button
                                style={{marginRight: '20px'}}
                                className={styles.answer_btn}
                                onClick={() => handleDownloadMaterialsClick(materials.filter(material => material.link.startsWith('https://realibi.kz/file/')), `lesson${lesson?.lesson_order}Materials`)}
                            >
                                Скачать материалы
                            </button>
                            <button
                                className={styles.answer_btn}
                                onClick={() => window.open(links[links.length - 1].link, "_blank")}
                            >
                                Перейти в видеоконференцию
                            </button>
                            <div className={styles.input_container}>
                                <p className={styles.answer_text}>
                                    Описание задания:
                                </p>
                                <input value={lesson?.tesis}/>
                            </div>


                        </>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default StudentGoingLesson