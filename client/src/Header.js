import { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom"
import { UserContext } from "./UserContext";

export default function Header(){
  
  const {setUserInfo, userInfo} = useContext(UserContext);
  useEffect(()=>{
    fetch('http://localhost:4000/profile',  {
      credentials: 'include'
    }).then(response =>{
      response.json().then(userInfo =>{
        setUserInfo(userInfo);
      })
    })
  }, [])

  function logout(){
    fetch('http://localhost:3000/logout', {
      credentials: 'include'
    });
    setUserInfo('');
  
  
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">My blog</Link>
      <nav>
        {username && (
          <>
            <div>{username}</div>
            <Link to="/create">Create New Post</Link>
            <a className="logout" onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          </>
        )}
        
      </nav>
    </header>
  )
}