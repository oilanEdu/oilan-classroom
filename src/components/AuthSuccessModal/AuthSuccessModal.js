import React, { useState, useEffect } from 'react';
import axios from 'axios';
import globals from "../../globals";
import { useRouter } from 'next/router';
import styles from './AuthSuccessModal.module.css';
import { Link } from 'react-router-dom';

const AuthSuccessModal = (props) => {
	const {
		loginHandler,
		role,
		login,
		password
	} = props

	return (
		<div className={styles.modalWrapper}>
			<p className={styles.title}>Поздравляем!</p>
			<p className={styles.content}>Вы успешно зарегистрированы на платформе Oilan-classroom! Сообщение с регистрационными данными отправлено Вам на электронную почту. Сейчас Вы будете перенаправлены в свой Личный Кабинет. Начинайте пользоваться нашими услугами уже сейчас!</p>
			<button 
				className={styles.button}
				onClick={() => {
				loginHandler(role, login, password)
			}}>Хорошо!</button>
		</div>
	)
}

export default AuthSuccessModal;