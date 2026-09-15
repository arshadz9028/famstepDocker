import connectDb from "../../../../database/conn";
import User from "../../../../model/userModel";
import { getSession } from "next-auth/react";
const handler = async (req, res) => {
    try {
        await connectDb();
        if (req.method === 'PUT') {
            const session = await getSession({ req });
    
            const { id: userId } = session.user;
            const isbackgroundChange = req.body.isbackgroundChange;
    
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    isBackgroundChanged: isbackgroundChange
                },
                { new: true } // To return the updated document
            );
    
            res.status(200).json({ success: true, data: updatedUser }); // Respond with updated user data
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
    
    
    
    
    
    
}

export default handler;