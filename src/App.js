import './App.css';
import Post from './Post'
import react,{useState,useEffect} from 'react'
import {db,auth} from './firebase'
import Modal from '@material-ui/core/Modal';
import {makeStyles} from '@material-ui/core/styles';
import {Button,Input} from '@material-ui/core';
import ImageUpload from './ImageUpload'
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle(){
  const top = 50 ;
  const left = 50 ;
  return{
    top:`${top}%`,
    left:`${left}%`,
    transform : `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles((theme)=>({
  paper: {
    position : 'absolute',
    width:290,
    background: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2,4,3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle]= useState(getModalStyle);
  const [posts,setPost] = useState([])
  const [open,setOpen] = useState(false)
  const [openSignIn,setOpenSignIn] = useState(false)
  const [username,setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [user,setUser] = useState(null)

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        setUser(authUser)
        if(authUser.displayName){

        }else{

          return authUser.updateProfile({
            displayName:username
          })
        }

      }else{
        setUser(null)
      }
    })
    return () =>{
      unsubscribe();
    }
  },[user,username])

  useEffect(()=>{
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
      setPost(snapshot.docs.map(doc=>({id:doc.id,post:doc.data()})))
    })
  },[]);
  const signUp =(e)=>{
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch(err=>alert(err.message))
    setOpen(false)
  }
  const signIn =(e)=>{
    e.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    // .then(setUsername(user.displayName))
    .catch(err=>alert(err.message))
    setOpenSignIn(false)
  }
  
  return (
    <div className="App">
     
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <h3>FaceBahfir</h3>
            </center>
              <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            >
            </Input>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            >
            </Input>
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            >
            </Input>
        <Button type="submit" onClick={signUp}>Login</Button>
      </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <h3>FaceBahfir</h3>
            </center>
              
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            >
            </Input>
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            >
            </Input>
        <Button type="submit" onClick={signIn}>Sign up</Button>
      </form>
        </div>
      </Modal>
      <div className="app__header">
          <img className="app__Photo" src="https://logomakr.com/media/upload/87/870J9m.png" alt=""/>
          {/* <h2>{user +' '+ username}</h2> */}
      {
              user?(
                <Button variant="contained" color="secondary"  onClick={()=> auth.signOut()}>Logout</Button>  
              ):(
                <div className="app__LoginContainer">
                <Button variant="outlined" color="primary" onClick={()=> setOpenSignIn(true)}>Sign In</Button>
                <Button onClick={()=> setOpen(true)}>Sign Up</Button>

                </div>
              )
            }
      </div>
      <div className="app__posts">
        <div className="app_postsLeft">
          {posts.map(({id,post})=>(
          <Post key={id} postId={id} user={user} username={post.username} 
              caption={post.caption} 
              img={post.imageUrl} />)
        )}</div>
        <div className="app_postsright">
          <InstagramEmbed
          url='https://www.instagram.com/p/CAsso13gDYd/'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        /></div>
        
      </div>  
      

       {
       user?(
          <ImageUpload username={username}/>
        ):(
          <h3>Sorry you need to login to upload</h3>
        )
      }
      
    </div>
  );
}

export default App;
