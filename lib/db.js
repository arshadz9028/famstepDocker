import connectDb from "../database/conn";
import User from "../model/userModel";

export async function getUserById(userId) {
  try {
    await connectDb();
    const user = await User.findById(userId);
    return user;
    
  } catch (error) {
    console.error("Error updating getUserById:", error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    await connectDb();
    const user = await User.findOne({email});
    return user;
    
  } catch (error) {
    console.error("Error updating getUserByEmail:", error);
    throw error;
  }
  }


  export async function findIsNewUserByEmail(email) {
    try {
      await connectDb();
  
      // Update the user's isNewUser field based on email
      const user = await User.findOne({email});

  
      if (!user) {
        console.log("db User not found");
        return true;
      }
      return user.isNewUser;
    } catch (error) {
      console.error("Error updating isNewUser:", error);
      throw error;
    }
  }
