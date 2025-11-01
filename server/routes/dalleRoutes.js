import express from 'express';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
    if (!process.env.CLIPDROP_API_KEY) {
      console.error('CLIPDROP_API_KEY not set in environment');
      return res.status(500).json({ error: 'Server misconfigured: CLIPDROP_API_KEY missing' });
    }
    console.log('Sending prompt to Clipdrop:', prompt);
    
    // Create form data
    const formData = new FormData();
    formData.append('prompt', prompt);

    const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLIPDROP_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Clipdrop API error status:', response.status);
      console.error('Clipdrop API error:', errorText);
      throw new Error(`Image generation failed: ${response.status} ${response.statusText}`);
    }

    console.log('Response headers:', response.headers.get('content-type'));
    
    const buffer = await response.arrayBuffer();
    console.log('Received buffer size:', buffer.byteLength);
    
    const base64Image = Buffer.from(buffer).toString('base64');
    console.log('Base64 image length:', base64Image.length);
    
    // Send the image with proper data URL prefix
    res.status(200).json({ 
      photo: `data:image/png;base64,${base64Image}`,
      success: true 
    });

    res.status(200).json({ photo: base64Image });
  } catch (error) {
    console.error('Error in /dalle:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate image. Please try again.',
      details: error.message 
    });
  }
});

export default router;
