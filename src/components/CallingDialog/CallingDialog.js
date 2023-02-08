import React from 'react';
import styles2 from './CallingDialog.module.css';
import { hangUp } from '../../../src/utils/webRTC/webRTCHandler';
// import { MdCallEnd } from 'react-icons/md';

const styles = {
  buttonContainer: {
    marginTop: '10px',
    width: '40px',
    height: '40px',
    borderRadius: '40px',
    border: '2px solid #e6e5e8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

const CallingDialog = () => {
  const handleHangUpButtonPressed = () => {
    hangUp();
  };

  return (
    <div className='direct_calling_dialog background_secondary_color'>
      <span>Calling</span>
      <div style={styles.buttonContainer} onClick={handleHangUpButtonPressed}>
        <button style={{ width: '20px', height: '20px', fill: '#e6e5e8' }}>MdCallEnd</button>
      </div>
    </div>
  );
};

export default CallingDialog;
