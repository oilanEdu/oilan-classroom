import React from 'react';
import styles from './GroupCallButton.module.css';

const GroupCallButton = ({ onClickHandler, label }) => {
  return (
  	<button
        className={styles.leaveRoomButton}
        onClick={onClickHandler}
    >
        <span
            style={{
                background: "url(https://realibi.kz/file/359001.png) no-repeat",
                backgroundPosition: "center",
                width: "22.67px",
                height: "22.67px",
                paddingRight: "30px",
                marginRight: "12px"
            }}
        >
        </span>
    </button>
  );
};

export default GroupCallButton;
