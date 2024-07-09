import { uploader, videoUploader } from "../middleware/cloudinaryUpload.js";
import { Comment, Post } from "../model/post.js";
import express from 'express';
import { User } from "../model/user.js";
import { Notification } from "../model/notification.js";

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
            }).then(async(r) => {
                const user = await User.findById(req.user._id);
                user.posts.push(r._id);
                await user.save();
                console.log('opooo', r)
                res.status(201).json(r.populate('owner'));
            })
            
            }
            
        }else{
            const post = await Post.create({
                content,
                privacy,
                owner: req.user._id,
            }).then(async(r) => {
                const user = await User.findById(req.user._id);
                user.posts.push(r._id);
                await user.save();
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

                res.status(200).json(postUpdate);
        }
           
        }else{
            const postExist = await Post.findById(req.params.id);
            if(!postExist){
                return res.status(400).json({ message: "the post was not found"});
            };

            const postUpdate = await Post.findByIdAndUpdate(req.params.id, {
                content: req.body.content ? req.body.content : postExist.content,
                privacy: req.body.privacy ? req.body.privacy : postExist.privacy,
                owner: req.user._id,
            }, { new: true }).populate('owner');

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
        .sort({ createdAt: -1 })
        .populate('owner')
        .populate({
            path: 'reShare',
            populate: [
                { path: 'user', model: 'User' }, 
                { path: 'post', model: 'Post' }  
            ]
        });
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

        const user = await User.findById(req.user._id);
        const index = user.posts.findIndex( (r ) => r._id.toString() === post._id.toString());
        user.posts.splice(index, 1);
        await user.save();
        await Post.findByIdAndDelete(req.params.id);
        console.log('deleted ', post._id)
        res.status(200).json(post._id);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const aUserPostImages = async(req, res) => {
    try {

        const post = await Post.find({
            owner: req.params.userId
        }).sort({ createdAt: -1 })
        .populate('owner');

        let arr = [];
       if(post){
        const images = post.forEach((res) => {
            arr.push(res.photos);
        })
       }
    const postImage = arr.flat();

    res.status(200).json(postImage);       
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}

export const likePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('owner');
        const userId = await User.findById(req.params.userId);
        const io = req.app.get('io');
        if(!post){
            return res.status(404).json({ message: 'post not found'});
        };

        if(!userId){
            return res.status(404).json({ message: 'user not found'});
        };
        //req.params.id
        console.log('compare the two', post.likes,  req.params.userId)
        if(post.likes.includes(req.params.userId.toString())){
            const index = post.likes.findIndex((p) => p.toString() === req.params.userId.toString());
            post.likes.splice(index, 1);
            console.log('user like ', index,  post.likes.length);
            await post.save();
            res.status(200).json(post);
        }else{
            post.likes.push(req.params.userId);
            await post.save();
            const findReceiver = await User.findById(post.owner._id);
            const newNofication = await Notification.create({
                message: `${userId.fullname} liked your post`,
                post: post._id,
                sender: req.params.userId,
                receiver: post.owner._id,
            });
            findReceiver.notification.push(newNofication._id);
            await findReceiver.save();

            const notify = {
                message: `${userId.fullname} liked your post`,
                post: post._id,
                sender: req.params.userId,
                receiver: post.owner._id,
            };
            io.emit('postLiked', notify);
            res.status(200).json(post);
        }
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }
}


export const bookmarkPost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('owner');
        const userId = await User.findById(req.params.userId);
        const io = req.app.get('io');
        if(!post){
            return res.status(404).json({ message: 'post not found'});
        };

        if(!userId){
            return res.status(404).json({ message: 'user not found'});
        };

        if(post.bookmark.includes(userId._id.toString())){
            const index = post.bookmark.findIndex((p) => p.toString() === userId._id.toString());
            post.bookmark.splice(index, 1);
            await post.save();
            res.status(200).json(post);
        }else{
            post.bookmark.push(userId._id);
            await post.save();
            const findReceiver = await User.findById(post.owner._id);
            const newNofication = await Notification.create({
                message: `${userId.fullname} bookmark your post`,
                post: post._id,
                sender: req.params.userId,
                receiver: post.owner._id,
            });
            findReceiver.notification.push(newNofication._id);
            await findReceiver.save();

            const notify = {
                message: `${userId.fullname} bookmarked your post`,
                post: post._id,
                sender: req.params.userId,
                receiver: post.owner._id,
            };
            io.emit('postBookmarked', notify);
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
        const io = req.app.get('io');
        if(!post){
            return res.status(404).json({ message: 'post not found'})
        };

        const allReshared = post.allReshare;
        const hasShared = allReshared.includes(userId._id.toString());
        const hasShared2 = allReshared.includes(userId._id);
        console.log('who shared ', hasShared, hasShared2, ' the arr ', userId._id, ' = ', allReshared );
        if(hasShared || hasShared2){
            res.status(400).json({ message: 'post already reshared'})
            return;
        };

        if(!userId){
            return res.status(404).json({ message: 'user not found'})
        };
        if(post.allReshare.includes(userId._id)){
            return res.status(400).json({ message: 'already reshared'})
        }

        const newPost =  Post.create({
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
        post.allReshare.push(userId._id);
        await post.save();
        const findReceiver = await User.findById(post.owner._id);
        
        const newNofication = await Notification.create({
            message: `${userId.fullname} reshared your post`,
            post: post._id,
            sender: req.params.userId,
            receiver: post.owner._id,
        });
        findReceiver.notification.push(newNofication._id);
        await findReceiver.save();
        const notify = {
            message: `${userId.fullname} reshared your post`,
            post: post._id,
            sender: req.params.userId,
            receiver: post.owner._id,
        };
        io.emit('postReshared', notify);

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
        const post = await Post.findById(req.params.id);
        const user = await User.findById(req.params.userId);
        const io = req.app.get('io');
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
        
        const findReceiver = await User.findById(post.owner._id);

        if(post.owner._id.toString() === req.user._id.toString() ){
            console.log('the owner');
        const newNofication = await Notification.create({
            message: `${user.fullname} commented on your post`,
            post: post._id,
            sender: req.params.userId,
            receiver: post.owner._id,
        });
        findReceiver.notification.push(newNofication._id);
        await findReceiver.save();

        const notify = {
            message: `${user.fullname} commented on your post`,
            post: post._id,
            sender: req.params.userId,
            receiver: post.owner._id,
        };
        io.emit('postComment', notify);
        };

        const getComment = await Comment.findById(comment._id).populate('owner');
        res.status(201).json(getComment);
    
        

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const allPostsForAUser = async (req, res) => {
    try {
        const post = await Post.find({
            owner: req.params.userId
        }).sort({ createdAt: -1 })
        .populate('owner')
        .populate({
            path: 'reShare',
            populate: [
                { path: 'user', model: 'User' }, 
                { path: 'post', model: 'Post' }  
            ]
        });
        console.log('all post for a user ', post);

        res.status(200).json(post)

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
};

export const getTopTrendingPost = async (req, res) => {
    try {
      const post = await Post.aggregate([
        {
            $project: {
                words: {
                    $split: ["$content", " "]
                }
            }
        },{
            $unwind: "$words"
        },
        {
            $group: {
                _id: "$words",
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                count: -1
            }
        },
        {
            $limit: 8
        }
      ]);

      console.log(post, post.length)
        res.status(200).json(post)

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
};

export const searchPost = async (req, res) => {
    try {
        const { searchWord } = req.query;

        if(searchWord.length === 0){
            return;
        };
        const regex = new RegExp(searchWord, 'i'); // i makes it case in sensistive
        const foundPost = await Post.find({
            content: { $regex: regex }
        }).sort({ createdAt: -1 })
        .populate('owner')
        .populate({
            path: 'reShare',
            populate: [
                { path: 'user', model: 'User' }, 
                { path: 'post', model: 'Post' }  
            ]
        });


        res.status(200).json(foundPost)

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
        const parentComment = await Comment.findById(req.params.commentId);
        const io = req.app.get('io');

        if(!parentComment){
            return res.status(404).json({ message: 'parentComment not found'})
        };
        
        const reply = await Comment.create({
            content: req.body.content,
            owner: req.user._id,
        })
        
        parentComment.replies.push(reply._id);

         await parentComment.save();

         
        const newNofication = await Notification.create({
            message: `${req.user.fullname} replied your comment`,
            comment: parentComment._id,
            sender: req.params.userId,
            receiver: parentComment.owner._id,
        });
        const findReceiver = await User.findById(parentComment.owner._id);
        findReceiver.notification.push(newNofication._id);
        await findReceiver.save();

        const notify = {
            message: `${req.user.fullname} replied your comment`,
            comment: parentComment._id,
            sender: req.params.userId,
            receiver: parentComment.owner._id,
        };
        io.emit('commentReplied', notify);
        
         const getReply = await Comment.findById(reply._id).populate('owner replies');
         res.status(201).json(getReply);      

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const likeAComment = async (req, res) => {
    try {
        // find the comment
        const parentComment = await Comment.findById(req.params.commentId).populate('owner');
        const io = req.app.get('io');
        if(!parentComment){
            return res.status(404).json({ message: 'parentComment not found'})
        };

        
        if(parentComment.likes.length > 0 && parentComment.likes.includes(req.user._id.toString())){
            console.log('parentcomment ', parentComment.likes[0].toString(), req.user._id.toString())
            const index = parentComment.likes.findIndex((p) => p.toString() === req.user._id.toString());
            parentComment.likes.splice(index, 1);
            await parentComment.save()
            res.status(200).json(parentComment);
        }else{
            parentComment.likes.push(req.user._id);
            await parentComment.save();

            const newNofication = await Notification.create({
                message: `${req.user.fullname} liked your comment`,
                comment: parentComment._id,
                sender: req.params.userId,
                receiver: parentComment.owner._id,
            });
            const findReceiver = await User.findById(parentComment.owner._id);
            findReceiver.notification.push(newNofication._id);
            await findReceiver.save();
    
            const notify = {
                message: `${req.user.fullname} liked your comment`,
                comment: parentComment._id,
                sender: req.params.userId,
                receiver: parentComment.owner._id,
            };
            io.emit('commentLiked', notify);
            
            res.status(200).json(parentComment);
            
        }
       

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const allRepliesForAComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId).sort({ createdAt: -1 }).populate({
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
        res.status(200).json(comment.replies);

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const deleteRepliedComment = async (req, res) => {
    try {
        console.log('reply id to delete= ', req.params.repliedId, ' parent comment= ',  req.params.commentId)
        const parentComment = await Comment.findById(req.params.commentId);
        const replies = parentComment.replies;
       const index = replies.findIndex((r) => r._id.toString() === req.params.repliedId );
       replies.splice(index, 1);
       await parentComment.save();
       console.log('result ', parentComment);

       const comment = await Comment.findById(req.params.commentId).populate({
            path: 'replies',
            populate: {
                path: 'owner',
                model: 'User'
            }
        });

       console.log('deleted ', req.params.repliedId);
       res.status(200).json(req.params.repliedId);


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


        res.status(201).json(post.comments);

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const getLikes = async( req, res) => {
    try {
        console.log(req.params);
        //get post from the req params;
        const post = await Post.findById(req.params.postId).populate('likes');
        if(!post){
            res.status(400).json('post not found');
        }
        res.status(200).json(post.likes);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const getBookmark = async( req, res) => {
    try {
        console.log(req.params);
        //get post from the req params;
        const post = await Post.findById(req.params.postId).populate('bookmark');
        console.log('post ', post);
        if(!post){
            res.status(400).json('post not found');
        }
        console.log(post.bookmark);
        res.status(200).json(post.bookmark);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const getReshare = async( req, res) => {
    try {
        console.log(req.params);
        //get post from the req params;
        const post = await Post.findById(req.params.postId).populate('allReshare');
        if(!post){
            res.status(400).json('post not found');
        }
        res.status(200).json(post.allReshare);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}