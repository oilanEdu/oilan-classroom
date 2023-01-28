import React, {useState} from "react";
import styles from "./ContactButton.module.css";
import ModalWindow from "../Modal/ModalWindow";
import Link from "next/link";
import {ContactForm} from "../ContactForm/ContactForm";



export default function ContactButton() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div className={styles.contactButtonBody}>
            <ModalWindow show={show} handleClose={handleClose} contactForm={'contactForm'} heading={'Заказать бесплатную консультацию'} body={<ContactForm handleClose={handleClose}/>}/>
            <div className={styles.Button} onClick={handleShow}>
                <img src="/phone.png" alt="" className={styles.phoneImg}/>
            </div>

        </div>
    );
}