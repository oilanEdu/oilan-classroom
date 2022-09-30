import React, {useState} from "react";
import styles from './CourseSearchForm'
const axios = require('axios').default;
import globals from "../../globals";
import PhoneInput from "react-phone-number-input/input";
import 'react-phone-number-input/style.css'
import kz from 'react-phone-number-input/locale/ru.json'

export function CourseSearchForm(props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [cityId, setCityId] = useState(null);
  const [isOnline, setIsOnline] = useState(null);
  const [age, setAge] = useState(null);
  const [directionId, setDirectionId] = useState(null);
  const [messageForUser, setMessageForUser] = useState(null);
  const [subMessageForUser, setSubMessageForUser] = useState(null);
  const [submitButtonPressed, setSubmitButtonPressed] = useState(false);
  const [successfulApplication, setSuccessfulApplication] = useState(false);

  const [ofertaCheck, setOfertaCheck] = useState(false);

  return (
    <div className={styles.contactFormBody}>
      <div className={styles.techSupportHeader}>
        <span className={styles.contactFormTitle}>
          Какие курсы вы ищете?
        </span>
        <span className={styles.contactFormDesc}>
          Заполните заявку, и центры свяжутся с вами!
        </span>
      </div>
      <div className={styles.techSupportInputsWrapper}>
        <select
          className={styles.selectBlock}
          onChange={e => setDirectionId(e.target.value)}
        >
          <option value="0">Направление</option>
          {
            props.directions !== undefined
            ? (props.directions.map(filterOption => (
              filterOption.name !== "test"
              ? (<option value={filterOption.id}>{filterOption.name}</option>)
              : null
            )))
            : null
          }
        </select>
        <select
          className={styles.selectBlock}
          onChange={e => setIsOnline(e.target.value)}
        >
          <option value={false}>Формат занятий</option>
          <option value={true}>Онлайн</option>
          <option value={false}>Офлайн</option>
        </select>
        <input 
          type="text" 
          placeholder={'Ваше имя'} 
          onChange={(e)=>{
            setName(e.target.value)
          }} 
          className={styles.techSupportInput}
        />
        <PhoneInput
          placeholder={'Ваш номер телефона'}
          className={styles.techSupportInput}
          labels={kz}
          international={false}
          defaultCountry="KZ"
          value={phone}
          onChange={setPhone}
        />
        <input 
          type="text" 
          placeholder={'Ваш email'} 
          onChange={(e)=>{
            setEmail(e.target.value)
          }} 
          className={styles.techSupportInput}
        />
        <textarea
          placeholder={`Описание курса - возраст учащегося, 
желаемое время и так далее. 
Чем подробнее описание, тем лучше будет поиск.`
          }
          rows={4}
          onChange={(e)=>{
            setComment(e.target.value)
          }}
          className={styles.techSupportTextArea}
        ></textarea>
        <label 
          style={{
            fontFamily: 'sans-serif', 
            fontWeight: 'bold', 
            color: 'white', 
            marginTop: '10px'
          }}
        >
          <input
            type="checkbox"
            onClick={() => {
              setOfertaCheck(!ofertaCheck)
            }}
          /> 
          Я принимаю условия <a href="/offer/student" style={{color: 'white', textDecoration: 'underline'}}>публичной оферты.</a>
        </label>
      </div>
      <div 
        className={styles.contactFormDesc} 
        style={{
          paddingTop: '3%',
          paddingBottom: '3%',
          textAlign: 'center',
          color: successfulApplication ? 'green' : 'red',
          width: '100%',
        }}
      >
        {messageForUser}
        <br/>
        {subMessageForUser}
      </div>
      <div 
        style={{
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          margin: '10px 0'
        }}
      >
        <span
          className={submitButtonPressed 
            ? styles.techSupportSubmitPressed 
            : styles.techSupportSubmitNotPressed
          }
          onClick={() => {
            if (directionId === '0' || directionId === null) {
              setMessageForUser("Заполните все поля!");
              setSubMessageForUser("Выберите направление!");
            } else if (name === '') {
              setMessageForUser("Заполните все поля!");
              setSubMessageForUser("Введите имя!");
            } else if (phone === '') {
              setMessageForUser("Заполните все поля!");
              setSubMessageForUser("Введите телефон!");
            } else if (email === '') {
              setMessageForUser("Заполните все поля!");
              setSubMessageForUser("Введите почту!");
            } else if (comment === '') {
              setMessageForUser("Заполните все поля!");
              setSubMessageForUser("Введите описание!");
            } else if (ofertaCheck === false) {
              setMessageForUser("Заявка не была отправлена!");
              setSubMessageForUser("Прочтите публичную оферту и дайте свое согласие!");
            } else {
              axios({
                method: 'post',
                url: `${globals.productionServerDomain}/createCourseSearchTicket`,
                data: {
                  city_id: cityId,
                  direction_id: directionId,
                  name: name,
                  phone: phone,
                  email: email,
                  message: comment,
                  age: age,
                  isOnline: isOnline
                }
              }).then(res => {
                setSuccessfulApplication(true);
                setMessageForUser('Ваша заявка сохранена!');
                setSubMessageForUser('Проверьте электронную почту!');
                setSubmitButtonPressed(true);
              });
            }
          }}
        >
          {submitButtonPressed 
            ? ('Заявка отправлена!') 
            : ('Отправить заявку')
          }
        </span>
      </div>
      <div className={styles.contactFormFooter}>
        <div className={styles.contactFormFooterFlex}>
          <div>
            <img 
              src="/phone-call.png" 
              alt="" 
              className={styles.contactFormIcon}
            />
            <a 
              href="tel:87088007177" 
              className={styles.contactFormLink}
            >
              +7 (708) 800-71-77
            </a>
          </div>
          <div>
            <img 
              src="/mail.png" 
              alt="" 
              className={styles.contactFormIcon}
            />
            <a 
              href="mailto:oilanedu@gmail.com" 
              className={styles.contactFormLink}
            >
              oilanedu@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};