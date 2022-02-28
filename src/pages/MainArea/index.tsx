import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Props } from '../../types';
import TopBar from './TopBar';
import { myProfileCalled } from 'redux/slices/myProfileSlice';
import { Routes } from 'components/AppRoutes';

const MainArea: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showMyProfile = () => {
    const myId = 76;//TODO retrieve from app context
    dispatch(myProfileCalled(myId));
    navigate(Routes.VOLUNTEER_PROFILE);
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <TopBar />
        <a href="#" onClick={showMyProfile}>Volunteer profile</a>
      </Box>
    </div>
  )
};

export default React.memo(MainArea);