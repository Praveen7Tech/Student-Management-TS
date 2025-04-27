import { Request,Response,NextFunction } from "express";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import { promises } from "dns";


const securePassword = async (password:string) => {
    try {
        const passHash = await bcrypt.hash(password,10)
        return passHash
    } catch (error) {
        console.log(error);
        
    }
}
const loadLogin = async (req:Request,res:Response) => {
    try {
        return res.render('adminLogin')

    } catch (error) {
        console.log(error);
        
    }
}

const login = async (req: Request, res: Response):Promise<void> => {
    try {
        const { email, password } = req.body;
        
        const userData = await userModel.findOne({ email: email });
        
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                if (userData.isAdmin === false) {
                     res.status(403).json({ success: false, message: "Access denied. Only admins can access this page." });
                } else {
                    req.session.user = userData._id;
                     res.status(200).json({ success: true });
                }
            } else {
                 res.status(400).json({ success: false, message: "Credentials are incorrect." });
            }
        } else {
             res.status(400).json({ success: false, message: "Credentials are incorrect." });
        }
    } catch (error) {
        console.log(error);
         res.status(500).json({ success: false, message: "Server error" });
    }
};


const loadDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const admin = req.session.user; // assuming admin is stored in session
  
      if (!admin) {
        res.redirect('/admin/login'); // if not logged in, redirect
        return;
      }

      const adminData = await userModel.find({isAdmin:true}) 
      //console.log(adminData) 
      const users = await userModel.find({ isAdmin: false }); 
      console.log(users)
  
      res.render('dashboard', { admin:adminData[0] , users });
  
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong while loading dashboard!");
    }
  };

  const blockUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;  

      console.log("User ID to block/unblock:", userId);

      const user = await userModel.findById(userId);
  
      if (!user) {
        console.log('User not found');
        res.redirect('/admin');
        return;
      }
  
      // Toggle the isBlocked status
      user.isBlocked = !user.isBlocked;
      await user.save();
  
      console.log(`User ${userId} is now ${user.isBlocked ? 'Blocked' : 'Unblocked'}`);
      res.redirect('/admin');
    } catch (error) {
      console.error(error);
      res.redirect('/admin');
    }
  };

  const logout = async (req: Request, res: Response): Promise<void> => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.redirect('/admin'); 
        }
        res.clearCookie('connect.sid'); 
        res.redirect('/admin/login'); 
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.redirect('/admin');
    }
  };

  const getEditUser = async (req:Request,res:Response) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);
    
        if (!user) {
          return res.redirect('/admin');
        }
    
        res.render('adminEdit', { user,successMessage: ""  });
      } catch (error) {
        console.error(error);
        res.redirect('/admin');
      }
  }
  
  const postEditUser = async (req:Request,res:Response) => {
    try {
        const userId = req.params.id;
        const { name, email, phone } = req.body;
    
        await userModel.findByIdAndUpdate(userId, { name, email, phone });
    
        const updatedUser = await userModel.findById(userId);
    
        res.render('adminEdit', { 
          user: updatedUser, 
          successMessage: "User updated successfully!" 
        });
    
      } catch (error) {
        console.error(error);
        res.redirect('/admin');
      }
  }
  

export default {
    loadLogin,
    loadDashboard,
    login,
    blockUser,
    logout,
    getEditUser,
    postEditUser
}