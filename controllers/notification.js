import { Notification } from "../model/notification.js";
import { User } from "../model/user.js";

export const getNotificationsOfAUser = async(req, res) => {
    try {
        // receiver id
        const userId = req.params.userId;

        const notifications = await Notification.find({
            receiver: userId,
        })
        .sort({ createdAt: -1 })
        .populate('sender')
        .populate('receiver')
        .populate('post')
        .populate('comment')
        .exec();

        const count = await Notification.countDocuments({
            receiver: userId,
            isviewed: false
        });
        const toWho = userId

        res.status(200).json({notifications, count, toWho});
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error); 
    }
}

 export const markNotificationsAsViewed = async (req, res) => {
    try {
        const userId = req.params.userId;

       const notifications = await Notification.updateMany(
            { receiver: userId, isviewed: false },
            { $set: { isviewed: true } }
        );
        
        const count = await Notification.countDocuments({
            receiver: userId,
            isviewed: false
        })

        res.status(200).json(count);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};


export const getANotification = async(req, res) => {
    try {
        const notification = await Notification.findById(req.params.id).populate('sender receiver post');
        notification.isviewed = true;
        await notification.save()
        console.log(notification);
        res.status(200).json(notification);
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error); 
    }
}