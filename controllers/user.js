import bcrypt from 'bcryptjs';
import express from 'express';
import { User } from '../model/user.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import Cloudinary from 'cloudinary'
import { uploader } from '../middleware/cloudinaryUpload.js';
import userRouter from '../routes/user.js';
import { Notification } from '../model/notification.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: '1d' });
}

export const register = async (req, res) => {
try {
    const { email, password } = req.body;
    console.log(email, password);

    if(!email || !password){
        res.status(400).json("please add all field");
    };

    const userExist = await User.findOne({ email });

    if(userExist){
        res.status(400).json('User already exist');
        return;
    }

    // send email verification
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        logger: true,
        debug: true,
        auth: {
          user: "fredenoch1@gmail.com",
          pass: process.env.GOOGLEAPPPASS,
        },
        tls: {
          rejectUnauthorized: true,
        },
      });
      
    // continue and hash password

    const salt = 10;
    const genSalt = bcrypt.genSaltSync(salt);
    const hashPassword = await bcrypt.hash(password, genSalt)

    const newuser = await User.create({
        email, password: hashPassword
    })


      console.log(newuser);
      const token = generateToken(newuser._id);
      const user = { email: newuser.email, token, _id: newuser._id };

      const link = `http://localhost:3000/verify/email/${user._id}`;
      const mailOptions = {
        from: "fredenoch1@gmail.com",
        to: email,
        subject: "Email Confirmation",
        html: `<h2>Thank You for Joining K-WAY </h2>
            <h3>You Are Almost There! </h3>
            <h3>Let's confirm your email address.</h3>
            <p>By clicking on the link provided, to confirm your email address  ${link} </p>
            <p>Or By clicking on the button below, you have confirm your email address </p>
             <button style="background-color: black; text: white" > Verify Email </button>
     
            <div
            style="margin-left: 40%, padding-top: 15px"
            >
              
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style="width: 20px; height: 20px"
                  viewBox="0 0 192.756 192.756"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="#fff"
                    fill-opacity="0"
                    d="M0 0h192.756v192.756H0V0z"
                  />
                  <path
                    d="M131.693 20.827c3.225-5.343 10.898-.719 7.676 4.626l-39.883 66.11 16.076 26.843c3.205 5.355-4.471 9.943-7.676 4.592L90.669 94.247c-.306-.512-.566-1.547-.587-2.661-.019-.983.148-2.029.632-2.83l40.979-67.929zm14.911 0c3.223-5.343 10.898-.719 7.676 4.626l-39.883 66.11 16.074 26.843c3.207 5.355-4.469 9.943-7.674 4.592L105.58 94.247c-.307-.512-.566-1.547-.588-2.661-.018-.983.148-2.029.633-2.83l40.979-67.929zm14.91 0c3.223-5.343 10.898-.719 7.674 4.626l-39.883 66.11 16.076 26.843c3.205 5.355-4.469 9.943-7.674 4.592L120.49 94.247c-.307-.512-.566-1.547-.588-2.661-.02-.983.148-2.029.631-2.83l40.981-67.929zm14.91 0c3.223-5.343 10.898-.719 7.674 4.626l-39.883 66.11 16.076 26.843c3.205 5.355-4.471 9.943-7.676 4.592l-17.217-28.751c-.305-.512-.566-1.547-.586-2.661-.02-.983.146-2.029.631-2.83l40.981-67.929z"
                    fill="#cc2229"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="#33348e"
                    d="M65.556 122.496l61.229-102.72H75.873l-61.229 102.72h50.912zM14.575 138.02c0-3.023 2.056-4.562 4.898-4.562s4.898 1.539 4.898 4.562v8.102l8.51-9.447c2.079-2.34 3.379-2.664 4.938-2.664 2.339 0 5.098 1.936 5.098 4.729 0 1.561-.975 3.055-2.08 4.225l-8.401 8.541 9.425 10.814c1.326 1.432 2.387 2.547 2.387 4.137 0 2.758-2.548 5.383-4.935 5.383-2.28 0-4.003-1.451-5.382-2.99l-9.561-11.363v9.812c0 3.021-2.056 4.561-4.898 4.561s-4.898-1.539-4.898-4.561V138.02h.001zM94.608 133.457c-2.811 0-4.74 1.697-5.218 3.82l-3.912 17.066h-.106l-5.044-16.484c-1.061-3.287-2.927-4.402-5.208-4.402l-.179.316v-.316c-2.281 0-4.147 1.115-5.208 4.402l-5.043 16.484h-.106l-3.911-17.066c-.478-2.123-2.407-3.82-5.218-3.82-2.599 0-4.805 1.91-4.805 4.191 0 1.432.583 3.287.848 4.402l5.729 23.389c1.007 4.139 2.623 6.418 6.759 6.418 3.288 0 5.422-1.645 6.43-4.721l4.473-13.24h.106l-.002-.609.182.609 4.473 13.24c1.007 3.076 3.141 4.721 6.429 4.721 4.138 0 5.752-2.279 6.759-6.418l5.729-23.389c.266-1.115.85-2.971.85-4.402-.001-2.281-2.208-4.191-4.807-4.191zM135.031 154.428s-10.49-14.631-10.49-16.381c0-2.281 2.354-4.59 4.898-4.59 2.334 0 3.639 1.645 4.541 2.918l6.174 7.951 5.77-7.477c.9-1.271 2.609-3.393 4.943-3.393 2.547 0 6.121 2.197 5.074 5.188-.58 1.652-10.982 15.783-10.982 15.783v12.869c0 3.021-2.312 4.561-4.805 4.561-2.494 0-5.123-1.539-5.123-4.561v-12.868zM129.234 163.053l-8.465-21.629c-1.512-4.119-3.438-7.666-7.582-7.785v-.012c-.037 0-.07.004-.107.006-.035-.002-.07-.006-.105-.006l-.002.012c-4.143.119-6.07 3.666-7.582 7.785l-8.464 21.629c-1.113 3.023-1.272 4.031-1.272 5.305 0 3.033 3.271 3.5 5.711 3.5 2.811 0 3.713-1.803 4.51-4.189l1.061-2.703.227-.752H119l.229.752 1.061 2.703c.795 2.387 1.697 4.189 4.508 4.189 2.439 0 5.713-.467 5.713-3.5-.003-1.274-.163-2.282-1.277-5.305zM113.08 146.92l3.338 8.77h-6.676l3.338-8.77z"
                  />
                  <path
                    d="M45.718 159.006a5.92 5.92 0 0 0 5.92-5.922 5.92 5.92 0 0 0-5.92-5.92 5.921 5.921 0 0 0 0 11.842zM157.871 139.721a5.83 5.83 0 0 1 5.846-5.846 5.852 5.852 0 0 1 5.846 5.846 5.853 5.853 0 0 1-5.846 5.846 5.833 5.833 0 0 1-5.846-5.846zm10.149 0c0-2.607-1.805-4.459-4.303-4.459-2.547 0-4.305 1.852-4.305 4.459 0 2.605 1.758 4.457 4.305 4.457 2.498 0 4.303-1.852 4.303-4.457zm-1.405 3.177h-1.527l-1.402-2.67h-1.049v2.67h-1.326v-6.311h3.053c1.65 0 2.453.449 2.453 1.93 0 1.172-.617 1.635-1.729 1.711l1.527 2.67-2.236-3.609c.709.016 1.203-.154 1.203-.941 0-.85-.91-.787-1.512-.787h-1.434v1.729h1.742l2.237 3.608z"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="#33348e"
                  />
                </svg>
            </div>
            `,
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
        console.log(info.response)
        }
      });
      res.status(201).json(user);

    
} catch (error) {
    res.status(500).json({ message: error })
    console.log(error)
}
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await User.findOne({ email });
        console.log(userExist)
        if(!userExist){
           res.status(404).json('User does not exist');
           return
        };

        const verifyPassword = await bcrypt.compare(password, userExist.password);

        if(!verifyPassword){
            res.status(400).send('Incorrect Password');
            return
        }

        const token = generateToken(userExist._id);

        res.status(200).json({
            ...userExist,
            token
        })


    } catch (error) {
        res.status(500).json({ message: error })
        console.log(error)
    }
}

export const verifyEmail = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select('-password');
        if(!user){
            res.status(400).json('User does not exist')
        }

        user.isVerified = true;
        await user.save();
        console.log(user);
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error })
        console.log(error)
    }
}

export const editProfile = async(req, res) => {
    try {
          const { fullname, dateOfBirth, handle, address, profession, bio } = req.body;
          console.log('requser  ', req.user);
            
            if(!req.user){
                res.status(404).json('user not found')
            }

          req.user.fullname = fullname;
          req.user.dateOfBirth = dateOfBirth;
          req.user.handle = handle;
          req.user.address = address;
          req.user.profession = profession;
          req.user.bio = bio;
          const token = generateToken(req.user._id);

            if(req.file){
           const filePath = await uploader(req.file.path);           
           req.user.profilePhoto.url = filePath.url;
           req.user.profilePhoto.public_id = filePath.public_id;
           await req.user.save();
           res.status(200).json({ ...req.user, token });

          }else{
            await req.user.save();
            res.status(200).json({ ...req.user, token });
          }
      
    } catch (error) {
        res.status(500).json({ message: error })
        console.log(error)
    }
}

export const recoveryEmailLink = async (req, res) => {
  try {
    const { email } = req.body;
    
    if(!email){
      res.status(400).json('please provide a valid email address');
      return;
    }
    
    const user = await User.findOne({ email });

    if(!user){
      res.status(404).json('User not found');
      return;
    }

    const id = user._id;
      // send email verification
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        logger: true,
        debug: true,
        auth: {
          user: "fredenoch1@gmail.com",
          pass: process.env.GOOGLEAPPPASS,
        },
        tls: {
          rejectUnauthorized: true,
        },
      });

      const link = `http://localhost:3000/password/reset/${id}`;
      const mailOptions = {
        from: "fredenoch1@gmail.com",
        to: email,
        subject: "Reset Your Password",
        html: `<h2>You Can't Remember Your Password </h2>
            <h3>You forgot your password ? don't worry we can help you reset them </h3>
            <h3></h3>
            <p> Click on this link to reset your password ${link} </p>
            <p>Or Click on the button below,to reset your password</p>
             <a href="${link}" >
            <button style="background-color: black; color: white; padding: 5px;" > Reset Password </button>
            </a>
            `,
      };

      transporter.sendMail(mailOptions, async (error, info) => {
        if (!error) {
        // console.log(info.response)
        }
      });
      console.log('email send ', user)
      res.status(200).json({ message: 'Password Recovery Sent' });


  } catch (error) {
    res.status(500).json({ message: error })
    console.log(error)
  }
}

export const changePassword = async (req, res) => {
  try {
    const { newpassword1 } = req.body;
    console.log("newpassword1  ", newpassword1, req.params.id)
    
    if(!newpassword1){
      res.status(400).json('please provide a password');
      return;
    }
    
    const user = await User.findOne({ _id: req.params.id });

    if(!user){
      res.status(404).json('User not found');
      return;
    }

     const gensalt = bcrypt.genSaltSync(10);
     const hashPassword = await bcrypt.hash(newpassword1, gensalt);
     user.password = hashPassword;
     await user.save();

      res.status(200).json({message: 'Your Password Has Been Successfully Reset, Please Login To Continue'});

  } catch (error) {
    res.status(500).json({ message: error })
    console.log(error)
  }
}

// export const followAndUnfollow = async (req, res) => {
//   try {
//     console.log(req.params);
//     // others id 
//     const user = await User.findById(req.params.userId);
//     // mine
//     const me = await User.findById(req.user._id);
//     const io = req.app.get('io');
//     if(!user){
//       res.status(404).json('User not found');
//       return;
//     }

//     if(me._id === user._id){
//       console.log('same users ', me._id, ' and ', user._id);
//       res.status(400).json('the same users');
//       return;
//     }
//     // req.user._id is the id of the person that wants to follow me

//     if(user.followers.includes(req.user._id)){
//       console.log('this id exist alreay as ', req.user._id);
//       const index = user.followers.findIndex((f) => f.toString() === req.user._id.toString());
//       console.log('found other index ', index);
//       user.followers.splice(index, 1);
//       await user.save();

//       if(me.following.includes(user._id)){
//         console.log('i exist')
//       const indexMe = me.following.findIndex((f) => f.toString() === user._id.toString());
//       console.log('found mine index ', indexMe);
//       me.following.splice(indexMe, 1);
//       await me.save();
//       console.log(me.following, user.followers);
//       const token = generateToken(me._id);
//       console.log('user followed ', me.followers.length, ' user following ', me.following.length);
//      return res.status(200).json({
//       ...me, token
//       });
//     }
//     }else{
//       user.followers.push(req.user._id);
//       me.following.push(user._id);
//       await user.save();
//       await me.save();
//       const token = generateToken(me._id);
//       // console.log('user followed ', me);
//       console.log('user push followed ', me.followers.length, ' user push following ', me.following.length);
      
//       // semd to the user that u followed him
//       const newNofication = await Notification.create({
//           message: `${me.fullname} followed you`,
//           sender: me._id,
//           receiver: user._id,
//       });
//       me.notification.push(newNofication._id);
//       await me.save();

//       const notify = {
//         message: `${me.fullname} followed you`,
//         sender: me._id,
//         receiver: user._id,
//       };
//       io.emit('followed', notify);
      
//       res.status(200).json({
//         ...me, token
//       });
//     }

//   } catch (error) {
//     res.status(500).json({ message: error })
//     console.log(error)
//   }
// }

export const followAndUnfollow = async (req, res) => {
  try {
    console.log(req.params);
    // the req params should be the other person id you want to follow, not yours
    const user = await User.findById(req.params.userId);
    // Mine
    const me = await User.findById(req.user._id);
    const io = req.app.get('io');
    
    if (!user) {
      res.status(404).json('User not found');
      return;
    }

    if (me._id.equals(user._id)) {
      console.log('Same users', me._id, 'and', user._id);
      res.status(400).json('the same users');
      return;
    }
    
    // Check if already following
    if (user.followers.includes(req.user._id)) {
      console.log('This id exists already as', req.user._id);
      user.followers = user.followers.filter(f => !f.equals(req.user._id));
      me.following = me.following.filter(f => !f.equals(user._id));
      
      await user.save();
      await me.save();

      console.log(me.following, user.followers);
      const token = generateToken(me._id);
      console.log('User unfollowed', me.followers.length, 'user following', me.following.length);

      return res.status(200).json({
        ...me, token
      });

    } else {
      user.followers.push(req.user._id);
      me.following.push(user._id);

      await user.save();
      await me.save();

      const token = generateToken(me._id);
      console.log('User push followed', me.followers.length, 'user push following', me.following.length);
      
      // Send notification
      const newNotification = await Notification.create({
        message: `${me.fullname} followed you`,
        sender: me._id,
        receiver: user._id,
      });

      user.notification.push(newNotification._id);
      await user.save();

      const notify = {
        message: `${me.fullname} followed you`,
        sender: me._id,
        receiver: user._id,
      };

      io.emit('followed', notify);
      
      res.status(200).json({
        ...me, token
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
}


export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('following');
   
   res.status(200).json({
       following: user.following
   });

  } catch (error) {
    res.status(500).json({ message: error })
    console.log(error)
  }
}

export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('followers');

    res.status(200).json({ followers: user.followers });

  } catch (error) {
    res.status(500).json({ message: error })
    console.log(error);
  }
}

export const getAUser = async (req, res) => {
  try {
    console.log(req.params);
    const user = await User.findById(req.params.userId).populate('posts following followers');
    const token = generateToken(user._id);
    res.status(200).json({
      ...user, token
    });

  } catch (error) {
    res.status(500).json({ message: error })
    console.log(error);
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('posts following followers');
    const token = generateToken(users._id);
    res.status(200).json({
      users
    });

  } catch (error) {
    res.status(500).json({ message: error })
    console.log(error);
  }
}