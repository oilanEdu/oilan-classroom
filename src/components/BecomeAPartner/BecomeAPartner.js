import React, { useState } from "react";
import styles from './BecomeAPartner.module.css'
import globals from "../../globals";
const axios = require('axios').default;


export function BecomeAPartner(props) {
    const [companyName, setCompanyName] = useState("");
    const [contactName, setContactName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage]= useState("");
    const [check, setCheck] = useState(false);

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        const data = {
            company_name: companyName,
            fullname: contactName,
            phone: phone,
            email: email
        };

        const result = await axios.post(`${globals.productionServerDomain}/partnershipRequests`, data);

        console.log(result.data);

        setMessage("Заявка успешно отправлена!");
    }
    return (
        <form onSubmit={handleSubmit} className={styles.formBody} style={{padding: '0 30px 30px 30px', boxSizing: 'border-box', marginTop: '-5px'}}>
            <span className={styles.title}>Хотите стать партнером?</span>
            <span className={styles.subtitle}>Заполните поля ниже, и ожидайте <br/> ответа от наших операторов</span>
            <br/>
            <label className={styles.inputContainer}>
                Ваша компания
                <input
                    type="text"
                    value={companyName}
                    placeholder={'Наименование вашей компании'}
                    required
                    onChange={e => setCompanyName(e.target.value)}
                    className={styles.partnerFormInput}
                />
            </label>
            <label className={styles.inputContainer}>
                Ваш телефон
                <input
                    type="text"
                    className={styles.partnerFormInput}
                    onKeyDown={e => {
                        if(e.keyCode === 8){
                            setPhone(phone.slice(0,-1));
                        }
                    }}
                    onChange={e => globals.checkPhoneMask(e.target.value, setPhone)}
                    placeholder='Номер телефона'
                    value={phone}
                />
            </label>
            <label className={styles.inputContainer}>
                Ваш E-mail
                <input
                    type="email"
                    value={email}
                    required
                    placeholder={'Адрес электронной почты'}
                    onChange={e => setEmail(e.target.value)}
                    className={styles.partnerFormInput}
                />
            </label>
            <label className={styles.inputContainer}>
                Контактное лицо
                <input
                    type="text"
                    value={contactName}
                    placeholder={'Контактное лицо'}
                    onChange={e => setContactName(e.target.value)}
                    className={styles.partnerFormInput}
                    minLength={2}
                    required
                />
            </label>
            <p className={styles.message}>{message}</p>

            <input type="submit" value="Оставить заявку" className={styles.formSubmit}/>
            <span 
                className={check ? styles.check_on : styles.check_off}
                onClick={() => setCheck(!check)}
            >
                Я принимаю условия публичной оферты
            </span>
        </form>
    );
}