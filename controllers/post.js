import { uploader, videoUploader } from "../middleware/cloudinaryUpload.js";
import { Post } from "../model/post.js";
import express from 'express';

export const createPost = async(req, res) => {
    try {
        const { content, privacy } = req.body;
        

        if(Object.keys(req.files).length > 0){
            let uploaded = false;
            
            let files = req.files.image || req.files.video;
            console.log(files)
            let imgurls = [];
            let videourls = [];
            
            for(let file of files){
                const { path } = file;
               if(file && file.fieldname && file.fieldname === 'image'){
                 const filepath = await uploader(path);
                 imgurls.push(filepath);
                 uploaded = true;
               }

               if(file && file.fieldname && file.fieldname === 'video'){
                 const filepath = await videoUploader(path);
                 videourls.push(filepath);
                 uploaded = true;
               }  
            }

            console.log('req file  ', imgurls, videourls,  content, uploaded, imgurls.length, videourls.length);
            if(uploaded){
                console.log('loo')
                const post = await Post.create({
                content,
                privacy,
                photos: imgurls.length > 0 ? imgurls : [],
                video: videourls.length > 0 ? videourls && videourls[0] : {},
                owner: req.user,
            }).then((r) => {
                console.log('opooo', r)
                res.status(201).json(r.populate('owner'));
            })
            
            }
            
        }else{
            const post = await Post.create({
                content,
                privacy,
                owner: req.user._id,
            }).then((r) => {
                console.log('opooo', r)
                res.status(201).json(r.populate('owner'));
            });
            
        }
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const updatePost = async(req, res) => {
    try {
        
        if(Object.keys(req.files).length > 0){
            let uploaded = false;
            
            let files = req.files.image || req.files.video;
            console.log(files)
            let imgurls = [];
            let videourls = [];
            
            for(let file of files){
                const { path } = file;
               if(file && file.fieldname && file.fieldname === 'image'){
                 const filepath = await uploader(path);
                 imgurls.push(filepath);
                 uploaded = true;
               }

               if(file && file.fieldname && file.fieldname === 'video'){
                 const filepath = await videoUploader(path);
                 videourls.push(filepath);
                 uploaded = true;
               }  
            }

                if(uploaded){
                const postExist = await Post.findById(req.params.id);
                if(!postExist){
                    return res.status(400).json({ message: "the post was not found"});
                };
                const postUpdate = await Post.findByIdAndUpdate(req.params.id, {
                    content: req.body.content ? req.body.content : postExist.content,
                    privacy: req.body.privacy ? req.body.privacy : postExist.privacy,
                    photos: videourls.length > 0 ? [] : imgurls,
                    video: imgurls.length > 0 ? [] : videourls[0],
                    owner: req.user._id,
                }, { new: true }).populate('owner');
                console.log('successful')
                res.status(200).json(postUpdate);
        }
           
        }else{
            const postExist = await Post.findById(req.params.id);
            if(!postExist){
                return res.status(400).json({ message: "the post was not found"});
            };
console.log('loo ', postExist)
            const postUpdate = await Post.findByIdAndUpdate(req.params.id, {
                content: req.body.content ? req.body.content : postExist.content,
                privacy: req.body.privacy ? req.body.privacy : postExist.privacy,
                owner: req.user._id,
            }, { new: true }).populate('owner');
            console.log('successful')
            res.status(200).json(postUpdate);
        }
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const getAllPosts = async(req, res) => {
    try {
        const posts = await Post.find().populate('owner');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const deleteAPost = async(req, res) => {
    try {
        const posts = await Post.findByIdAndDelete(req.params.id)
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}