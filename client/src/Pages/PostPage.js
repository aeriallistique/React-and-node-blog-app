import {format} from "date-fns";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";


 export default function PostPage(){
   const [postInfo, setPostInfo] = useState(null); 
   const {userInfo} = useContext(UserContext)
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
      <h1>{postInfo.title}</h1>
      <time>{format(new Date(postInfo.createdAt), 'MMM d yyyy')}</time>
      <div className="author">by {postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
            Edit this post
            </Link>
        </div>
      )}
      <div className="postImage">
        <img src={`http://localhost:4000/${postInfo.coverImage}`}  />
      </div>
      <div dangerouslySetInnerHTML={{__html: postInfo.content}} />
    </div>
  )
};