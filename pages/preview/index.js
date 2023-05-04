import React, { useState, useMemo, useEffect } from 'react';
import styles from './index.module.css'
import logo from '../../src/resources/logo.png';

const Index = () => {

  return <>
    <div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.header__image}>
            <img src="https://realibi.kz/file/636315.svg" alt="" />
          </div>
          <div className={styles.header_nav}>
            <a href="#persons" className={styles.header_nav__links}>Кому подойдёт</a>
            <a href="#about" className={styles.header_nav__links}>Наши преимущества</a>
            <a href="#reviews" className={styles.header_nav__links}>Отзывы</a>
          </div>
          <div className={styles.header__contacts}>
            <a href="tel:+77715066666">+7 (771) 506-66-66</a>
            {/* <!-- <a href="" class="header__contacts_btn">Попробовать бесплатно</a> --> */}
          </div>
        </div>
        <div className={styles.mainscreen}>
          <div className={styles.mainscreen__text}>
            <h1>Онлайн-платформа для <span className={styles.highlight_text}>ведения и контроля</span> образовательного
              процесса</h1>
            <p>Соберите весь образовательный процесс в одном месте и экономьте время на обучение</p>
            <div className={styles.button_wrapper}>
              <a target="_blank" className={styles.primary_btn} href="https://www.oilan-classroom.com/auth">Попробовать
                бесплатно</a>
              <span>Бесплатный период 7 дней</span>
            </div>
          </div>
          <div className={styles.mainscreen__image}>
            <img src="https://realibi.kz/file/285945.jpg" alt="" />
          </div>
        </div>
        <div className={styles.persons} id="persons">
          <div>
            <h2>Кому подойдёт платформа?</h2>
          </div>
          <div className={styles.wrapper_person}>
            <div className={styles.person}>
              <img src="https://realibi.kz/file/469950.svg" alt="" />
              <h3>Репетиторам</h3>
              <p>желающим автоматизировать онлайн обучение в школах</p>
            </div>
            <div className={styles.person}>
              <img src="https://realibi.kz/file/843536.svg" alt="" />
              <h3>Образовательным центрам</h3>
              <p>желающим автоматизировать онлайн обучение в школах</p>
            </div>
            <div className={styles.person}>
              <img src="https://realibi.kz/file/932435.svg" alt="" />
              <h3>Онлайн-школам</h3>
              <p>в поиске удобной платформы для проведения занятий</p>
            </div>
            <div className={styles.person}>
              <img src="https://realibi.kz/file/383726.svg" alt="" />
              <h3>Экспертам</h3>
              <p>которые хотят держать образовательные процессы под контролем</p>
            </div>
          </div>
        </div>
        <div className={styles.about} id="about">
          <h2>Экономим ваше время, помогая <span className={styles.highlight_text}>зарабатывать больше</span></h2>
          <div className={styles.about_items_wrapper}>
            <div className={styles.about_item}>
              <div className={styles.about_item__image}>
                <img src="https://realibi.kz/file/838224.png" alt="" />
                <img className={styles.krug_kroshka} src="https://realibi.kz/file/71595.svg" alt="" />
              </div>
              <div className={styles.about_item__text}>
                <p>Отслеживайте количество уроков</p>
                <span>Создавайте, дополняйте и будьте в курсе, когда и с кем у вас ближайший урок</span>
              </div>
            </div>
            <div className={styles.about_item}>
              <div className={styles.about_item__text}>
                <p>Соберите базу учеников в пару кликов</p>
                <span>Вы больше никогда не забудете об ученике или запланированном занятии, потому что всё
                  находится на одной платформе</span>
              </div>
              <div className={styles.about_item__image}>
                <img src="https://realibi.kz/file/217066.png" alt="" />
                <img className={styles.krug_zel_kroshka} src="https://realibi.kz/file/363001.svg" alt="" />
              </div>
            </div>
            <div className={styles.about_item}>
              <div className={styles.about_item__image}>
                <img src="https://realibi.kz/file/402283.png" alt="" />
              </div>
              <div className={styles.about_item__text}>
                <p>Проверяйте домашние задания
                  и давайте обратную связь в 2 раза быстрее</p>
                <span>Наша система позволяет проверить домашнее задание в пару кликов, а так-же вести общение с
                  учеником в рамках домашнего задания</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.integration}>
        <h2>Начните обучать на нашей платформе</h2>
        <a target="_blank" href="https://www.oilan-classroom.com/auth">Попробовать бесплатно</a>
        <img className={styles.white_circle_krosh} src="https://realibi.kz/file/539965.png" alt="" />
        <img className={styles.volna_circle_krosh} src="https://realibi.kz/file/583033.svg" alt="" />
      </div>
      <div className={styles.container}>
        <div className={styles.translation}>
          <img className={styles.volna_trans} src="https://realibi.kz/file/840673.svg" alt="" />
          <h2><span className={styles.highlight_text}>Индивидуальная</span> видео-трансляция для каждого урока </h2>
          <div className={styles.translation_item}>
            <div className={styles.translation_item__text}>
              <p>Ведите все уроки в режиме онлайн трансляции</p>
              <span>Мы разработали уникальную онлайн-трансляцию для каждого урока, чтобы вам не приходилось
                использовать сторонние ресурсы для проведения встреч</span>
              <a target="_blank" className={styles.primary_btn} href="https://www.oilan-classroom.com/auth">Попробовать
                бесплатно</a>
            </div>
            <div className={styles.translation_item__image_wrapper}>
              <img className={styles.translation_item__image} src="https://realibi.kz/file/948444.png" alt="" />
              <img className={styles.krug_trans_kroshka} src="https://realibi.kz/file/738585.svg" alt="" />
            </div>
          </div>
        </div>
        <div className={styles.price}>
          <h2>Проводите занятия качественно по самым <span className={styles.highlight_text}>выгодным ценам</span></h2>
          <div className={styles.price_wrapper}>
            <div className={styles.price_item}>
              <p className={styles.price_item__headline}>1 месяц</p>
              <li>Неограниченное количество учеников</li>
              <li>Неограниченное количество уроков</li>
              <li>Неограниченное время трансляции</li>
              <li>Бесплатный личный кабинет преподавателя</li>
              <p className={styles.price_item__price}>10.000 ₸</p>
            </div>
            <div className={styles.price_item}>
              <p className={styles.price_item__headline}>3 месяца</p>
              <li>Неограниченное количество учеников</li>
              <li>Неограниченное количество уроков</li>
              <li>Неограниченное время трансляции</li>
              <li>Бесплатный личный кабинет преподавателя</li>
              <p className={styles.price_item__price}>27.000 ₸</p>
              <div className={styles.discount}>
                <span>10%</span>
              </div>
            </div>
            <div className={styles.price_item}>
              <p className={styles.price_item__headline}>6 месяцев</p>
              <li>Неограниченное количество учеников</li>
              <li>Неограниченное количество уроков</li>
              <li>Неограниченное время трансляции</li>
              <li>Бесплатный личный кабинет преподавателя</li>
              <p className={styles.price_item__price}>50.000 ₸</p>
              <div className={styles.discount}>
                <span>17%</span>
              </div>
            </div>
          </div>
          <a target="_blank" className={styles.primary_btn} href="https://www.oilan-classroom.com/auth">Попробовать бесплатно</a>
          <img src="https://realibi.kz/file/387402.svg" alt="" className={styles.lenta_kroshka} />
        </div>
        <div className={styles.dashboard}>
          <h2>Вся ваша <span className={styles.highlight_text}>аналитика</span> в одном месте </h2>
          <div className={styles.dashboard_item}>
            <div className={styles.dashboard_item__image_wrapper}>
              <img className={styles.dashboard_item__image} src="https://realibi.kz/file/1955.png" alt="" />
            </div>
            <div className={styles.dashboard_item__text}>
              <p>Имейте на руках всю аналитику по вашему обучению</p>
              <span>Количество учеников; проходимость уроков; общая выручка; средняя оценка ученика и многое
                другое</span>
              <a target="_blank" className={styles.primary_btn} href="https://www.oilan-classroom.com/auth">Попробовать
                бесплатно</a>
            </div>
          </div>
        </div>
        <div className={styles.steps}>
          <h2>Начать обучать с нашей <br />платформой - <span className={styles.highlight_text}>легко</span></h2>
          <div className={styles.content_wrapper}>
            <p className={styles.content_headline}>Достаточно всего лишь 4-х шагов</p>
            <div className={styles.steps_wrapper}>
              <div className={styles.steps__item}>
                <p>Регистрация</p>
                <span>Введите все необходимые данные и первый шаг пройден</span>
                <span className={styles.steps__item_number}>01</span>
              </div>
              <div className={styles.steps__item}>
                <p>Заполнение</p>
                <span>Заполните информацию по вашему обучению</span>
                <span className={styles.steps__item_number}>02</span>
              </div>
              <div className={styles.steps__item}>
                <p>Добавление</p>
                <span>Добавьте учеников, которые будут обучаться на платформе</span>
                <span className={styles.steps__item_number}>03</span>
              </div>
              <div className={styles.steps__item}>
                <p>Контроль</p>
                <span>Контролируйте процесс и качество обучения ваших учеников</span>
                <span className={styles.steps__item_number}>04</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.reviews} id="reviews">
          <h2>Отзывы наших <span className={styles.highlight_text}>любимых клиентов</span></h2>
          <div className={styles.reviews_wrapper}>
            <div className={styles.reviews_item}>
              <div className={styles.reviews_item__head}>
                <div>
                  <img src="https://realibi.kz/file/335631.jpeg" alt="" />
                </div>
                <div className={styles.reviews_item__info}>
                  <p>Зауре Уразкенова</p>
                  <span>Репетитор</span>
                </div>
              </div>
              <p className={styles.reviews_item__text}>
                Я опытный преподаватель. Мой стаж более 20 лет и конечно за это время экспериментировала на
                разных платформах. Остановила свой выбор на Oilan Classroom. Мой любимый формат обучения
                групповой и тут его реализовали максимально удобно. У меня достаточно много учеников, поэтому
                создав один раз программу обучения я одним кликом назначаю всем кому это необходимо. Все создано
                для экономии времени преподавателя, а для
                меня это очень ценно.
              </p>
            </div>
            <div className={styles.reviews_item}>
              <div className={styles.reviews_item__head}>
                <div>
                  <img src="https://realibi.kz/file/759756.jpeg" alt="" />
                </div>
                <div className={styles.reviews_item__info}>
                  <p>Игилик Амандык</p>
                  <span>Репетитор</span>
                </div>
              </div>
              <p className={styles.reviews_item__text}>
                Мне все нравится, но больше всего мой личный кабинет. Никогда не пропущу урок, так как там уже
                все расписано и указано. Также еще вижу свою загрузку, что позволяет равномерно распределять
                уроки и давать время себе на отдых. Так что платформа помогла мне с тайм-менеджментом. Ученикам
                тоже нравится их кабинет, так как там все оценки, все домашки, комментарии к ним, методический
                материал. Мои ученикам нет необходимости искать в чатах какие-либо материалы. Такой
                клиентоориентированный подход мне позволяет привлекать новых учеников.
              </p>
            </div>
            <div className={styles.reviews_item}>
              <div className={styles.reviews_item__head}>
                <div>
                  <img src="https://realibi.kz/file/445348.jpeg" alt="" />
                </div>
                <div className={styles.reviews_item__info}>
                  <p>Александр Барабанов</p>
                  <span>Репетитор</span>
                </div>
              </div>
              <p className={styles.reviews_item__text}>
                Привлекло, что на Oilan Classroom все интуитивно понятно. В пару кликов сделала кабинет ученика.
                Все в одном месте тут и уроки провести, домашнее задание проверить, расписание выставить. Не
                нужно что-то докупать дополнительно. А ученики могут заходить на платформу с браузера. У многих
                не хватает памяти в гаджете, чтобы скачивать дополнительное приложение. И стоит отметить, что у
                меня часто занимаются клиенты 60+, им с текущими современными приложениями непросто, а на
                платформе моим ученикам легко заниматься.
              </p>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.footer__logo_messengers}>
            <div className={styles.logo}>
              <img src="https://realibi.kz/file/956680.svg" alt="" />
            </div>
            <div className={styles.messengers}>
              <a href="t.me/Azali10"><img src="https://realibi.kz/file/363748.svg" alt="" /></a>
              <a href="wa.me/+77715066666"><img src="https://realibi.kz/file/99189.svg" alt="" /></a>
              <a href="https://www.instagram.com/oilan.io/"><img src="https://realibi.kz/file/100080.svg" alt="" /></a>
            </div>
          </div>
          <div className={styles.footer__project}>
            <h3>Проект</h3>
            <p><a href="https://www.oilan-classroom.com/privacy-policy">Политика конфиденциальности</a></p>
            <p><a href="https://www.oilan-classroom.com/offer">Публичная оферта</a></p>
          </div>
          <div className={styles.footer__questions}>
            <h3>Остались вопросы?</h3>
            <p><a href="tel:+77715066666">+7 (771) 506-66-66</a></p>
            <span>ежедневно с 9:00 до 18:00</span>
          </div>
          <a target="_blank" className={styles.primary_btn} href="https://www.oilan-classroom.com/auth">Попробовать бесплатно</a>
        </div>
      </div>
    </div>
  </>

}

export default Index;