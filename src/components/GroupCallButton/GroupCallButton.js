import React from 'react';
import styles from './GroupCallButton.module.css';

const GroupCallButton = ({ onClickHandler, label }) => {
  return (
    <button onClick={onClickHandler} className='group_call_button background_main_color'>
      { label }
    </button>
  );
};

export default GroupCallButton;
