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
const dotenv = require('dotenv');

dotenv.config({path: '../config.env'});

const salt = 10;
const secret = process.env.SECRET;

app.use(cors({credentials:true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname +'/uploads'));

mongoose.connect(process.env.MONGODB_URI);

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

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async(err, info)=>{
    if(err) throw err;
    const {title, summary, content} = req.body;
    const postDocument = await Post.create({
      title,
      summary,
      content, 
      coverImage: newPath,
      author: info.id
    });
    res.json(postDocument);
  })
})

app.put('/post',uploadMiddleware.single('file'), async(req, res)=>{
  let newPath = '';
  
  if(req.file){
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const extensionName = parts[parts.length -1];
    newPath = path +'.'+extensionName;
    fs.renameSync(path, newPath);
  
  }
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async(err, info)=>{
    if(err) throw err;    
    const {id,title, summary, content} = req.body;
    const postDocument = await Post.findById(id)
    const isAuthor = JSON.stringify(postDocument.author) === JSON.stringify(info.id);
    if(!isAuthor) return res.status(400).json('you are not the author of this post.')

    await postDocument.updateOne({
      title,
      summary,
      content,
      coverImage: newPath ? newPath : postDocument.coverImage
    })
    res.json(postDocument)
  })

  
})

app.get('/post', async(req , res)=>{
  const posts = await Post.find()
                          .populate('author', ['username'])
                          .sort({createdAt: -1})
                          .limit(20 );
  res.json(posts);
})

app.get('/post/:id', async (req, res)=>{
  const {id} = req.params;
  const docInfo = await Post.findById(id).populate('author', ['username']);
  res.json(docInfo)
})

app.listen(4000);


