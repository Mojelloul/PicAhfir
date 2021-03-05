import { Button } from '@material-ui/core';
import React,{useState} from 'react';
import {storage, db} from './firebase';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import firebase from 'firebase';
import './ImageUpload.css';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

function ImageUpload({username}) {
    const [caption,setCaption] = useState('')
    const [progress,setProgress] = useState('')
    const [image,setImage] = useState('')
    const handleChange =(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }
    const handleUpload =()=>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setProgress(progress);
            },
            (err)=>{
                console.log(err);
                alert(err.message)
            },
            ()=>{
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    console.log(username)
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageUrl:url,
                        username:username
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null)
                })
            }
        )
    }
    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"/>
            <FormControl className="image_input" variant="outlined">
                <InputLabel htmlFor="component-outlined">Caption</InputLabel>
                <OutlinedInput id="component-outlined" onChange={event => setCaption(event.target.value)} placeholder="Enter a caption ..." label="Name" />
            </FormControl>
            <input type="file" onChange={handleChange}></input>
            <Button className="image__btn" variant="outlined" color="primary" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
