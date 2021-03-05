import react,{useState,useEffect} from 'react'
import React from "react";
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import firebase from 'firebase'
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Divider from "@material-ui/core/Divider";
import { db } from './firebase';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";

function Post({user,postId,username,caption,img}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState([]);
    useEffect(()=>{
        let unsubscribe;
        if(postId){
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot)=>{
                setComments((snapshot.docs.map((doc)=>doc.data())))
            });
        }
        return()=>{
            unsubscribe();
        }
    },[postId])
    const postComment = (e)=>{
        e.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text:comment,
            username:user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('');
    }
    const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
          width: "100%",
          maxWidth: "36ch",
          backgroundColor: theme.palette.background.paper
        },
        inline: {
          display: "inline"
        },
        
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
      },
      })
    );
    
      const classes = useStyles();
    
    return (
        <div className='Post'>
            <div className="post__header">
                <Avatar className='Post__Avarat' alt={username} src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>
            <img alt="" className='Post__image' src={img}></img>
        
            <h4 className='Post__text'><strong> {username} : </strong> {caption}</h4>

            <div className="post__comments">
                {comments.length>0 &&
                    (<h2>Commentaire : </h2>)}
                {
                    comments.map((comment)=>(
                        <p>
                            <List className={classes.root}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                    <Avatar className={classes.purple} alt={comment.username} src="/static/images/avatar/1.jpg" />
                                    </ListItemAvatar>
                                    <ListItemText
                                    secondary={
                                        <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.inline}
                                            color="textPrimary"
                                        >
                                            {comment.username} : 
                                            <br/>
                                        </Typography>
                                        {comment.text}
                                        </React.Fragment>
                                    }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </List>
                        </p>
                        
                    ))
                }
            </div>
            {user &&(
                <form className="post__commentBox">
                        <input 
                        className="post__input"
                        type="text"
                        placeholder="add a Comment ..."
                        value={comment}
                        onChange={(e)=>setComment(e.target.value)}
                        />
                        <button
                            disabled={!comment}
                            className="post__button"
                            type="submit"
                            onClick={postComment}
                        >
                            Post
                        </button>
                    </form>
            )}
            
        
        </div>
    )
}
export default Post
