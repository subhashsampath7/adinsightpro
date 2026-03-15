const express = require('express');
require('dotenv').config();
const axios = require('axios');
const Tesseract = require('tesseract.js');
const cors = require('cors');
const http = require('http');

// Extract URL logic
function extractUrl(text) {
    const matches = text.match(/\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-z]{2,}(\/[^\s]*)?/gi);
    return matches ? matches[0] : '';
}

// OCR logic (Images process wena main function eka)
async function processImage(image) {
    if (!image || image.trim() === '') return '';
    
    try {
        let imageInput;  
        
        if (image.startsWith('http://') || image.startsWith('https://')) {
            // Thappara 10ka timeout ekak add kala image eka load wenne naththam hang wena eka nawaththanna
            const res = await axios.get(image, { 
                responseType: 'arraybuffer',
                timeout: 10000 
            });
            imageInput = Buffer.from(res.data, 'binary');
        } else if (image.startsWith('data:image/')) {
            imageInput = image;
        } else {
            return '';
        }
        
        const result = await Tesseract.recognize(imageInput, 'eng');
        return extractUrl(result.data.text);
        
    } catch (err) {
        console.error('OCR error:', err.message);
        // Error eka mokakda kiyala apita front-end ekenma balaganna meka return karamu
        return ''; 
    }
}

// Express app + OCR router
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const router = express.Router();

router.post('/', async (req, res) => {
    const { images } = req.body;
    
    if (!Array.isArray(images)) {
        return res.status(400).json({ error: 'images[] array is required' });
    }
    
    // Promise.all wenuwata sequentially run wena for...of loop eka 👇
    const results = [];
    for (const img of images) {
        const result = await processImage(img);
        results.push(result);
    }
    
    res.json(results);
});

app.use('/ocr', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is working on port:`, PORT);
});