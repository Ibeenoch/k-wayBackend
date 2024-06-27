import { Notification } from "../model/notification.js";

export const getNotifications = async(req, res) => {
    try {
        const notifications = await Notification.find().populate('sender receiver post');

        console.log(notifications);
        res.status(200).json(notifications);
        
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