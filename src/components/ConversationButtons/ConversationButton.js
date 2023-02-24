import React from 'react';
import styles from './ConversationButtons.module.css';

const ConversationButton = (props) => {
  const { onClickHandler } = props;
  return (
    <button className={styles.button} onClick={onClickHandler}>
      {props.children}
    </button>
  );
};

export default ConversationButton;
