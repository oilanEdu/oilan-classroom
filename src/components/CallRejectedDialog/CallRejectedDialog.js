import React, { useEffect } from 'react';

// import styles from './CallRejectedDialog.module.css';

const CallRejectedDialog = ({ reason, hideCallRejectedDialog }) => {
  useEffect(() => {
    setTimeout(() => {
      hideCallRejectedDialog({
        rejected: false,
        reason: ''
      });
    }, [4000]);
    // eslint-disable-next-line
  }, []);

  return (
    <div className='call_rejected_dialog background_secondary_color'>
      <span>
        {reason}
      </span>
    </div>
  );
};

export default CallRejectedDialog;
