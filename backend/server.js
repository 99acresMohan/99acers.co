const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// --- 1. MIDDLEWARE (Handles Base64 Images & Cross-Origin) ---
// --- 1. MIDDLEWARE (Updated for Atlas & Large Photos) ---
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: '10mb' })); // Increased from 10mb to 50mb
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// --- 2. DATABASE SCHEMAS ---

const PropertySchema = new mongoose.Schema({
    propertyId: { type: String },
    title: { type: String, required: true },
    price: { type: String, required: true },
    location: { type: String, required: true },
    bhk: { type: String, default: "" },
    propertyType: { type: String, default: "Flat" },
    area: { type: String, default: "" },
    areaUnit: { type: String, default: "sq.ft." },
    floor: { type: String, default: "" },
    road: { type: String, default: "" },
    facing: { type: String, default: "North" },
    isCorner: { type: String, default: "No" },
    description: { type: String, default: "" },
    postedBy: { type: String, default: "Owner" },
    imageUrl: { type: String, default: "" }, // Stores Base64 string
    sellerName: { type: String, required: true },
    sellerPhone: { type: String, required: true },
    postedAt: { type: Date, default: Date.now }
});

const Property = mongoose.model('Property', PropertySchema);

const VisitorSchema = new mongoose.Schema({
    mobile: { type: String, required: true },
    propertyId: { type: String },
    propertyTitle: { type: String },
    visitedAt: { type: Date, default: Date.now }
});

const Visitor = mongoose.model('Visitor', VisitorSchema);

// --- 3. API ROUTES ---

app.get('/', (req, res) => {
    res.status(200).send("JMD Properties API is LIVE");
});

// GET: Fetch All Properties
app.get('/api/properties', async (req, res) => {
    try {
        const properties = await Property.find().sort({ postedAt: -1 });
        res.status(200).json(properties);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch properties" });
    }
});

// POST: Add New Property (Updated for Atlas validation)
app.post('/api/properties', async (req, res) => {
    try {
        const newProperty = new Property(req.body);
        const savedProperty = await newProperty.save();
        res.status(201).json({ success: true, data: savedProperty });
    } catch (err) {
        console.error("Post Error:", err.message);
        res.status(400).json({ success: false, error: err.message });
    }
});

// POST: Register Visitor
app.post('/api/register-visitor', async (req, res) => {
    try {
        const { mobile, propertyId } = req.body;
        // Search by the MongoDB _id first
        const property = await Property.findById(propertyId);

        const newLog = new Visitor({
            mobile,
            propertyId: property ? property.propertyId : "N/A",
            propertyTitle: property ? property.title : "Inquiry"
        });
        await newLog.save();

        res.status(200).json({
            success: true,
            sellerName: property ? property.sellerName : "Admin",
            sellerPhone: property ? property.sellerPhone : "9891992544"
        });
    } catch (err) {
        res.status(500).json({ success: false, error: "Log failed" });
    }
});

// GET: Visitor Logs
app.get('/api/visitor-logs', async (req, res) => {
    try {
        const logs = await Visitor.find().sort({ visitedAt: -1 });
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ error: "Fetch logs failed" });
    }
});

// DELETE: Property
app.delete('/api/properties/:id', async (req, res) => {
    try {
        await Property.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

// --- 4. ATLAS CONNECTION & SERVER START ---

const PORT = process.env.PORT || 3000;

// Encoded password for 'Mohan@93777'
const encodedPassword = "Mohan%4093777";
const atlasUri = `mongodb+srv://9891992544:${encodedPassword}@cluster0.zkxiqer.mongodb.net/realestate?retryWrites=true&w=majority&appName=Cluster0`;

// Prioritize Atlas connection
const MONGO_URI = atlasUri || process.env.MONGODB_URI;

console.log("🚀 Attempting to connect to Cloud MongoDB Atlas...");

mongoose.connect(MONGO_URI)
    .then(() => {
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`✅ SUCCESS: Connected to Atlas Cloud`);
            console.log(`🚀 API active on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ CONNECTION FAILED:");
        console.error(err.message);
        console.log("👉 Double-check MongoDB Atlas > Network Access > Allow Access from Anywhere (0.0.0.0/0)");
    });
