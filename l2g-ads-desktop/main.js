const { app } = require('electron');
const express = require('express');
const axios = require('axios');
const Tesseract = require('tesseract.js');
const cors = require('cors');

const serverPort = 3000;

// 🔍 Extract first URL from OCR result
function extractUrl(text) {
    const matches = text.match(/\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-z]{2,}(\/[^\s]*)?/gi);
    return matches ? matches[0] : null;
}

// 🚀 Launch Express OCR API server
function startServer() {
    const appServer = express();
    appServer.use(cors());
    appServer.use(express.json({ limit: '10mb' }));

    appServer.post('/ocr', async (req, res) => {
        const { images } = req.body;
        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ error: 'images[] array is required' });
        }

        const results = await Promise.all(images.map(async (image) => {
            try {
                let imageInput;

                if (image.startsWith('http://') || image.startsWith('https://')) {
                    const response = await axios.get(image, { responseType: 'arraybuffer' });
                    imageInput = Buffer.from(response.data, 'binary');
                } else if (image.startsWith('data:image/')) {
                    imageInput = image;
                } else {
                    return null;
                }

                const result = await Tesseract.recognize(imageInput, 'eng');
                return extractUrl(result.data.text);
            } catch (err) {
                console.error('OCR failed:', err.message);
                return null;
            }
        }));

        res.json(results);
    });

    appServer.listen(serverPort, () => {
        console.log(`🧠 OCR API server running at http://localhost:${serverPort}`);
    });
}

// 🖥️ Start Electron app in background (no window)
app.whenReady().then(() => {
    app.setLoginItemSettings({
        openAtLogin: true,
        path: app.getPath('exe')
    });

    startServer(); // Start the API server
});

// 🧹 Optional: quit when all windows are closed (but we have none)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
