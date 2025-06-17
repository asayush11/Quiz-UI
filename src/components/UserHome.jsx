import React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

export default function UserHome() {
  sessionStorage.removeItem('timePerQuestion');

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