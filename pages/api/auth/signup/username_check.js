import connectDb from "../../../../database/conn"
import User from "../../../../model/userModel"


export default async function handler(req, res) {

    connectDb().catch(error => res.json({ error: 'connection failed...!' }))

    if (req.method === 'POST') {
        const  username  = req.body.username1;
        if (!username.trim()){
            return res.status(402).json({ error: 'Please enter a valid username.' });

        }
        if(username.length > 30 || username.length < 3){
            return res.status(402).json({ error: "Username must be between 3 and 30 characters long."  })
        }
        if ( !/^(?!.*\.$)(?!.*\.{2})(?=.*[a-zA-Z])[a-zA-Z0-9_][a-zA-Z0-9_.]{1,28}[a-zA-Z0-9_]$/i.test(username)) {
            return res.status(402).json({ error: 'Username must contain at least one letter and can include numbers, underscores, and a single period in the middle' });
        }
        try {
            const user = await User.findOne({ username });

            if (user) {
                return res.status(400).json({ error: 'Already existed' });
            }

            return res.status(200).json({ success: 'success' });
        } catch (error) {
            console.error(error);
            return res.status(505).json({ error: 'Server error' });
        }
    } else {
        return res.status(400).json({ error: 'This method is not allowed' });
    }
}