import { Notification } from "../model/notification.js";
import { User } from "../model/user.js";

export const getNotificationsOfAUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('notification');

        console.log(user.notification);
        res.status(200).json(user.notification);
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error); 
    }
}

export const getANotification = async(req, res) => {
    try {
        const notification = await Notification.findById(req.params.id).populate('sender receiver post');

        console.log(notification);
        res.status(200).json(notification);
        
    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error); 
    }
}