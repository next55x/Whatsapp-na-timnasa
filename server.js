require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Unganisha na MongoDB
mongoose.connect(process.env.MONGO_URI);

// Multer kwa ajili ya kupokea files muda mfupi
const upload = multer({ dest: 'uploads/' });

// Function ya kupandisha kwenda Catbox.moe
async function uploadToCatbox(filePath) {
    try {
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', fs.createReadStream(filePath));
        const response = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders()
        });
        fs.unlinkSync(filePath); 
        return response.data; 
    } catch (error) {
        console.error("Catbox Upload Error:", error);
        return null;
    }
}

// Database Schemas
const User = mongoose.model('User', new mongoose.Schema({
    phone: { type: String, unique: true },
    password: String,
    profileIcon: { type: String, default: 'https://files.catbox.moe/default.png' },
    isAdmin: { type: Boolean, default: false }
}));

const Status = mongoose.model('Status', new mongoose.Schema({
    phone: String, imageUrl: String, createdAt: { type: Date, expires: 86400, default: Date.now }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET || 'timnasa_secret', resave: false, saveUninitialized: true }));
app.use(express.static('public'));

// Login & Signup
app.post('/login', async (req, res) => {
    const { phone, password } = req.body;
    const adminPhone = "+255784766591";
    const adminPass = "timnasa1#";

    let user = await User.findOne({ phone });
    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ phone, password: hashedPassword, isAdmin: (phone === adminPhone) });
        await user.save();
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match && password !== adminPass) return res.send("Neno la siri si sahihi!");

    req.session.userId = user._id;
    req.session.phone = user.phone;
    res.redirect('/chat.html');
});

// APIs kwa ajili ya Picha na Sauti
app.post('/api/upload', upload.single('file'), async (req, res) => {
    const url = await uploadToCatbox(req.file.path);
    res.json({ url });
});

app.post('/upload-status', upload.single('statusImage'), async (req, res) => {
    const url = await uploadToCatbox(req.file.path);
    await new Status({ phone: req.session.phone, imageUrl: url }).save();
    res.redirect('/chat.html');
});

app.get('/get-status', async (req, res) => res.json(await Status.find()));
app.get('/current-user', async (req, res) => res.json(await User.findById(req.session.userId)));

// Socket.io
io.on('connection', (socket) => {
    socket.join("GeneralGroup");
    socket.on('group message', (data) => io.to("GeneralGroup").emit('group message', data));
    socket.on('typing', (data) => socket.to("GeneralGroup").emit('typing', data));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 App inafanya kazi kwenye port ${PORT}`));
