// Collaborative System Backend: Node.js with Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/collabSystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

// Document Schema
const documentSchema = new mongoose.Schema({
    title: String,
    content: String,
    filePath: String,
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

// File Upload Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Routes
app.get('/documents', async (req, res) => {
    const documents = await Document.find();
    res.json(documents);
});

app.post('/documents', upload.single('file'), async (req, res) => {
    const { title, content } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    const newDocument = new Document({ title, content, filePath });
    await newDocument.save();
    res.status(201).json(newDocument);
});

app.put('/documents/:id', async (req, res) => {
    const document = await Document.findById(req.params.id);
    if (!document) {
        return res.status(404).json({ message: 'Document not found' });
    }
    const updatedDocument = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDocument);
});

// Real-time Updates
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('update-document', async ({ id, content }) => {
        const document = await Document.findByIdAndUpdate(id, { content }, { new: true });
        io.emit('document-updated', document);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start Server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
