import { uploader, videoUploader } from "../middleware/cloudinaryUpload.js";
import { Story } from "../model/story.js";
import { User } from "../model/user.js";

export const addStory = async(req, res) => {
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
                const story = await Story.create({
                content,
                photos: imgurls.length > 0 ? imgurls : [],
                video: videourls.length > 0 ? videourls && videourls[0] : {},
                owner: req.user._id,
            })
            
            const user = await User.findById(req.user._id);
            user.stories.push(story._id);
            await user.save();
            res.status(201).json(story);
         }
            
        }else{
            const story = await Story.create({
                content,
                owner: req.user._id,
            })
          
            const user = await User.findById(req.user._id);
            user.stories.push(story._id);
            await user.save();
            res.status(201).json(story);

        }
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
};

export const getAvailableStories = async(req, res) => {
    try {
        const user = await User.find({}).populate('stories');
        const storiesAvailable = user.filter((s) => s.stories.length > 0);
       res.status(200).json(storiesAvailable);
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}

export const getAllStoriesForAUser = async(req, res) => {
    try {
        const story = await Story.find({
            owner: req.params.userId,
        }).select('photos owner').populate('owner');
        const owner = await User.findById(req.params.userId);
        const arr = [];
        story.forEach((s) => {
            arr.push(s.photos)
        })
        story.forEach((s) => {
            arr.push(s.video)
        })
        const photos = arr.flat();
        const photoUrls = [];
        
        photos.forEach((u) => {
            photoUrls.push(u.url);
        });
        console.log('own by ', owner)

        res.status(200).json({photoUrls, owner});
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error)
    }
}
