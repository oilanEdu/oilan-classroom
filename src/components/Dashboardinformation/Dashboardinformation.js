import React from 'react';

import styles from './Dashboardinformation.module.css';

const DashboardInformation = ({ username }) => {
  return (
    <div className='dashboard_info_text_container'>
      <span className='dashboard_info_text_title'>
        Hello {username}!
      </span>
    </div>
  );
};

export default DashboardInformation;
