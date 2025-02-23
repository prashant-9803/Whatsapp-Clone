import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../slices/authSlice'

const Logout = () => {

  const {user} = useSelector((state) => state.auth)
  const {socket} = useContext(SocketContext)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    socket.current.emit("signout", user?._id)
    dispatch(setUser(undefined))
    localStorage.clear("user")
    navigate("/login")
  },[socket])

  return (
    <div className='bg-conversation-panel-background '>
      
    </div>
  )
}

export default Logout