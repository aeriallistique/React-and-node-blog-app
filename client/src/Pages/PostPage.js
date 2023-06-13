import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


 export default function PostPage(){
   const [postInfo, setPostInfo] = useState(null);
  const {id} = useParams();
  useEffect(()=>{
    fetch(`http://localhost:4000/post/${id}`)
    .then(response =>{
      response.json().then(postinfo =>{
        setPostInfo(postinfo);
      })
    })
  }, [])
  if(!postInfo)return '';

  return (
    <div className="post-page">
      <div className="postImage">
        <img src={`http://localhost:4000/${postInfo.coverImage}`}  />
      </div>
      <h1>{postInfo.title}</h1>
      <div dangerouslySetInnerHTML={{__html: postInfo.content}} />
    </div>
  )
};