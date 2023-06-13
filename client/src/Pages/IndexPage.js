import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage(){
  const [post, setPost] = useState([]);

  useEffect(()=>{
    fetch('http://localhost:4000/post').then(response =>{
      response.json().then(posts =>{
        setPost(posts);
      })
    })
  },[] )

  return(
    <>
      {post.length > 0 && post.map(post => (
          <Post {...post} />
      ))}
      
    </>
  );
}