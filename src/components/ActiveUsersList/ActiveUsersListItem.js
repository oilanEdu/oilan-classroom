import React from 'react';
import userAvatar from '../../../src/resources/userAvatar.png';
import { callToOtherUser } from '../../../src/utils/webRTC/webRTCHandler';
import { callStates } from '../../../src/store/actions/callActions';

const ActiveUsersListItem = (props) => {
  const { activeUser, callState } = props;

  const handleListItemPressed = () => {
    if (callState === callStates.CALL_AVAILABLE) {
      callToOtherUser(activeUser);
    }
  };

  return (
    <div className='active_user_list_item' onClick={handleListItemPressed}>
      <div className='active_user_list_image_container'>
        <img className='active_user_list_image' src={userAvatar} alt='userimage'/>
      </div>
      <span className='active_user_list_text'>{activeUser.username}</span>
    </div>
  );
};

export default ActiveUsersListItem;
