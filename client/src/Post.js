import {formatISO9075} from "date-fns";

export default function Post({title, summary, content, coverImage, createdAt}){
  return (
    <div className="post">
        <div className="image">
          <img src="https://techcrunch.com/wp-content/uploads/2022/12/lawnmower-Large.jpeg?w=1390&crop=1"></img>
        </div>
        <div className="text">
          <h2>{title}</h2>
          <p className="info">
            <a className="author">Andrei TAZ</a>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          <p className="summary">{summary}</p>
        </div>
      </div>
  )
};