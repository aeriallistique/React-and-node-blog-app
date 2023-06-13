const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express();
const User = require('./models/User');
const Post = require('./models/Post');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');
require('dotenv').config();

const salt = 10;
const secret = proces.env.SECRET;

app.use(cors({credentials:true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.DATABASE_ADDRESS);

app.post('/register', async(req, res)=>{
  const {username, password} = req.body;

  try {
    const userDoc = await User.create({
    username, 
    password: bcrypt.hashSync(password, salt)
    })

    res.json(userDoc);
  } catch (err) {
    res.status(400).json(err)
  }
  
})

app.post('/login', async (req, res)=>{
  const {username, password} = req.body;
  const userDoc = await User.findOne({username});
  const passOK = bcrypt.compareSync(password, userDoc.password);

  if(passOK){
    // logged in 
    jwt.sign({username, id: userDoc._id}, secret, {}, (err, token)=>{
      if(err) throw err;
      res.cookie('token', token).json({
        id: userDoc._id,
        username,
      });
    })
  }else{
    res.status(400).json('Wrong credentials.')
  }

})

app.get('/profile', (req, res)=>{
  
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err, info)=>{
    if(err) throw err;
      res.json(info);

  })


})

app.post('/logout', (req, res)=>{
  res.cookie('token', '').json('ok');
})

app.post('/post', uploadMiddleware.single('file') , async (req, res)=>{
  const {originalname, path} = req.file;
  const parts = originalname.split('.');
  const extensionName = parts[parts.length -1];
  const newPath = path +'.'+extensionName;
  fs.renameSync(path, newPath);
  
  const {title, summary, content} = req.body;
  const postDocument = await Post.create({
    title,
    summary,
    content,
    coverImage: newPath,
  });

  res.json(postDocument);
})

app.get('/post', async(req , res)=>{
  const posts = await Post.find();
  res.json(posts);
})

app.listen(4000);


