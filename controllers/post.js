import { uploader, videoUploader } from "../middleware/cloudinaryUpload.js";
import { Comment, Post } from "../model/post.js";
import express from 'express';
import { User } from "../model/user.js";

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
                owner: req.user._id,
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
        const posts = await Post.find({})
        .populate('owner')
        .populate({
            path: 'reShare',
            populate: [
                { path: 'user', model: 'User' }, 
                { path: 'post', model: 'Post' }  
            ]
        });
        console.log('all the post ', posts)
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const getAPost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('owner reShare.user reShare.post');
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const deleteAPost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.owner.toString() !== req.user._id.toString()){
            return res.status(400).json({message: 'User not authorized to delete this post'});
        };
        const postdeleted = await Post.findByIdAndDelete(req.params.id);
        res.status(200).json(postdeleted);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const likePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('owner');
        const userId = await User.findById(req.params.userId);
        if(!post){
            return res.status(404).json({ message: 'post not found'});
        };

        if(!userId){
            return res.status(404).json({ message: 'user not found'});
        };
        console.log('compare the two', post.likes, req.params.id)
        if(post.likes.length > 0 && post.likes.includes(userId).toString()){
            const index = post.likes.findIndex((p) => p.toString() === userId.toString());
            post.likes.splice(index, 1);
            await post.save();
            res.status(200).json(post);
        }else{
            post.likes.push(userId);
            await post.save();
            console.log(post);
            res.status(200).json(post);
        }
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const bookmarkPost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('owner');
        const userId = await User.findById(req.params.userId);
        if(!post){
            return res.status(404).json({ message: 'post not found'});
        };

        if(!userId){
            return res.status(404).json({ message: 'user not found'});
        };

        if(post.bookmark.length > 0 && post.bookmark.includes(userId).toString()){
            const index = post.bookmark.findIndex((p) => p.toString() === userId.toString());
            post.bookmark.splice(index, 1);
            await post.save();
            res.status(200).json(post);
        }else{
            post.bookmark.push(userId);
            await post.save();
            console.log(post);
            res.status(200).json(post);
        }
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const rePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const userId = await User.findById(req.params.userId);
        if(!post){
            return res.status(404).json({ message: 'post not found'})
        };

        if(!userId){
            return res.status(404).json({ message: 'user not found'})
        };
        if(post.allReshare.includes(userId)){
            return res.status(400).json({ message: 'already reshared'})
        }

        const newPost = new Post({
            content: post.content,
            photos: post.photos,
            video: post.video,
            owner: post.owner,
            likes: post.likes,
            bookmark: post.bookmark,
            comments: post.comments,
            reShared: true,
            reShare: [{
                user: userId._id,
                post: post._id
            }],
            
        });
        newPost.allReshare.push(userId._id);
        const repost = await newPost.save().then((post) => {
          return  post.populate('reShare.user reShare.post owner')
        });

        res.status(200).json(repost)
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
};

export const commentPost = async (req, res) => {
    try {
        console.log(req.body);
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.params.userId);

        if(!post){
            return res.status(404).json({ message: 'post not found'})
        };

        if(!user){
            return res.status(404).json({ message: 'user not found'})
        };
        
        const comment = await Comment.create({
            content: req.body.comment,
            owner: req.user._id,
            post: post._id
        });

        post.comments.push(comment._id);
        await post.save();
        const getComment = await Comment.findById(comment._id).populate('owner');
        console.log('postcomment ', getComment);
        res.status(201).json(getComment);
    
        

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const editCommentPost = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId).populate('owner');
       
        if(!comment){
            return res.status(404).json({ message: 'comment not found'})
        };
        
        comment.content = req.body.comment;
        await comment.save();
        res.status(200).json(comment);

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const deleteCommentPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ message: 'post not found'});
        };
        const parentComment = await Comment.findByIdAndDelete(req.params.commentId);

        res.status(201).json({message: 'comment deleted'});

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}


export const replyCommentPost = async (req, res) => {
    try {
        console.log('req body content ', req.body);
        const parentComment = await Comment.findById(req.params.commentId);

        if(!parentComment){
            return res.status(404).json({ message: 'parentComment not found'})
        };
        
        const reply = await Comment.create({
            content: req.body.content,
            owner: req.user._id,
        }).then(async(r) => {
            r.populate('owner replies');
             parentComment.replies.push(r);
             await parentComment.save();
             console.log('replycomment ', r)
             res.status(201).json(r);
        });

       

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const likeAComment = async (req, res) => {
    try {
        const parentComment = await Comment.findById(req.params.commentId).populate('owner');

        if(!parentComment){
            return res.status(404).json({ message: 'parentComment not found'})
        };

        
        if(parentComment.likes.length > 0 && parentComment.likes.includes(req.user._id.toString())){
            console.log('parentcomment ', parentComment.likes[0].toString(), req.user._id.toString())
            const index = parentComment.likes.findIndex((p) => p.toString() === req.user._id.toString());
            parentComment.likes.splice(index, 1);
            await parentComment.save()
            // console.log(parentComment)
            res.status(200).json(parentComment);
        }else{
            parentComment.likes.push(req.user._id);
            await parentComment.save();
            // console.log(parentComment)
            res.status(200).json(parentComment);
            
        }
       

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const allRepliesForAComment = async (req, res) => {
    try {
        console.log(req.params.commentId)
        const comment = await Comment.findById(req.params.commentId).populate({
            path: 'replies',
            populate: {
                path: 'owner',
                model: 'User'
            }
        });

        if(!comment){
            return res.status(404).json({ message: 'comment not found'});
        };

        console.log('all comment replies ', comment.replies);
        res.status(201).json(comment.replies);

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const allPostComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate({
            path: 'comments',
            populate: {
                path: 'owner',
                model: 'User'
            }
        });
        if(!post){
            return res.status(404).json({ message: 'post not found'});
        };

        console.log('this are all the post comments ', post, post.comments)

        res.status(201).json(post.comments);

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}
