import connectDb from '../../../database/conn';
import Post from '../../../model/postModel';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectDb();
        const { id } = req.query;
        
        const post = await Post.findById(id).populate('userid');
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 