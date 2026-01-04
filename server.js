require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Database Connection
mongoose.connect(process.env.MONGO_URI);

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { folder: 'whatsapp_clone', allowed_formats: ['jpg', 'png', 'mp3'] }
});
const upload = multer({ storage });

// Models
const User = mongoose.model('User', new mongoose.Schema({
    phone: { type: String, unique: true },
    password: String,
    profileIcon: { type: String, default: 'https://via.placeholder.com/150' },
    isAdmin: { type: Boolean, default: false }
}));

const Status = mongoose.model('Status', new mongoose.Schema({
    phone: String, imageUrl: String, createdAt: { type: Date, expires: 86400, default: Date.now }
}));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(express.static('public'));

// Routes: Auth
app.post('/login', async (req, res) => {
    const { phone, password } = req.body;
    let user = await User.findOne({ phone });
    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ phone, password: hashedPassword });
        await user.save();
    } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.send("Password imekosewa!");
    }
    req.session.userId = user._id;
    req.session.phone = user.phone;
    res.redirect('/chat.html');
});

// Routes: Status & Profile
app.post('/upload-status', upload.single('statusImage'), async (req, res) => {
    await new Status({ phone: req.session.phone, imageUrl: req.file.path }).save();
    res.redirect('/chat.html');
});

app.get('/get-status', async (req, res) => res.json(await Status.find()));
app.get('/current-user', async (req, res) => res.json(await User.findById(req.session.userId)));

// Socket.io: Real-time Chat
io.on('connection', (socket) => {
    socket.join("GeneralGroup");
    socket.on('group message', (data) => io.to("GeneralGroup").emit('group message', data));
    socket.on('typing', (data) => socket.to("GeneralGroup").emit('typing', data));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server ipo hewani: ${PORT}`));
