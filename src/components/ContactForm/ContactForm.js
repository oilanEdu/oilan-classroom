import React, { useState } from "react";
import styles from './ContactForm.module.css'
const axios = require('axios').default;

export function ContactForm(props) {
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [subMessage, setSubMessage] = useState("");

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        let devDomain = "https://oilan-backend.herokuapp.com";
        await axios.post(`${devDomain}/callRequest/`, {phone: phone});
        setMessage("Ваш номер отправлен!");
        setSubMessage("С вами свяжутся в ближайшее время!");
    }
    return (
        <div className={styles.contactFormBody}>
            <div className={styles.contactFormTitleBlock} style={{padding: '15px 15px 0 15px', textAlign: 'center'}}>
                <span className={styles.contactFormTitle}>Бесплатно подберём вам курс!</span> <br/>
                <span className={styles.contactFormDesc}>Позвоним и расскажем обо всем подробнее!</span>
            </div>

            <form className={styles.contactFormPhoneInputBody} onSubmit={handleSubmit}>
                <div className={styles.contactFormInputsAreaBlock}>
                    <div className={styles.contactFormPhoneInputBody}>
                        <input onChange={e => setPhone(e.target.value)} type="tel" className={styles.contactFormPhoneInput} placeholder={"Номер телефона"}/>
                        <input type="submit" value="Жду звонка" className={styles.contactFormButton}/>
                    </div>
                    {/*<span className={styles.contactFormTitle} style={{fontSize: 18}}>Укажите номер вашего телефона для связи:</span>*/}
                    {/*<br/>*/}
                    {/*<div style={{width: '100%', height: '15px'}}></div>*/}
                    {/*<span className={styles.contactFormTitle} style={{fontSize: 18,}}>Оставьте краткое сообщение или вопрос:</span>*/}
                    {/*<br/>*/}
                    {/*<textarea className={styles.contactFromTextArea} name="" id="" placeholder='Ваше сообщение' rows="3" maxLength={255}></textarea>*/}
                    {/*<br/> <br/>*/}
                </div>

            </form>

            <div className={styles.contactFormSubtitleBody} style={{padding: '0 15px'}}>
                {message} <br/>
                {subMessage}
            </div>

            <div className={styles.contactFormFooter}>
                <span className={styles.contactFormTitle} style={{fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 'bold', color: 'white'}}>Или кликните на номер, чтобы позвонить</span>
                <div className={styles.contactFormFooterFlex}>
                    <div><img src="/phone-call.png" alt="" className={styles.contactFormIcon}/> <a href="tel:87088007177" className={styles.contactFormLink}>+7 (708) 800-71-77</a></div>
                    {/*<div><img src="/phone-call.png" alt="" className={styles.contactFormIcon}/><a href="tel:87086157439" className={styles.contactFormLink}>+7 (708) 800-71-77</a></div>*/}
                    <div><img src="/mail.png" alt="" className={styles.contactFormIcon}/><a href="mailto:oilanedu@gmail.com" className={styles.contactFormLink}>oilanedu@gmail.com</a></div>
                </div>
            </div>
        </div>
    );
}
