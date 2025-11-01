import express from 'express';
import * as dotenv from 'dotenv';
import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Fetching posts failed' });
  }
});

// CREATE a post
router.post('/', async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    if (!name || !prompt || !photo)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const newPost = await Post.create({ name, prompt, photo });
    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to create post' });
  }
});

export default router;
