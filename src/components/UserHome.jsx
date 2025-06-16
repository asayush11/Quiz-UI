import React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Outlet } from 'react-router-dom';

export default function UserHome() {
  
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