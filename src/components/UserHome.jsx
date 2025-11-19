import React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import { clearQuiz } from '../utils/sessionHelpers';

export default function UserHome() {
  clearQuiz();

  if (!sessionStorage.getItem('token')) {
    return (
      toast.error('Please login to access this page.'),
      window.location.href = '/login'
    );
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}