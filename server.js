require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const CONTACT_FILE = path.join(DATA_DIR, "contacts.json");
const NEWSLETTER_FILE = path.join(DATA_DIR, "newsletter.json");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Simple helpers
function appendToJsonFile(filePath, record) {
    let existing = [];
    if (fs.existsSync(filePath)) {
        try {
            existing = JSON.parse(fs.readFileSync(filePath, "utf8")) || [];
        } catch {
            existing = [];
        }
    }
    existing.push(record);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf8");
}

// API routes
app.post("/api/contact", (req, res) => {
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Name, email, and message are required.",
        });
    }

    const record = {
        name,
        email,
        phone: phone || "",
        message,
        receivedAt: new Date().toISOString(),
        source: req.headers.referer || "unknown",
    };

    try {
        appendToJsonFile(CONTACT_FILE, record);
        console.log("New contact submission:", record);
        // Here you could also send an email using nodemailer / SES, etc.
        return res.json({
            success: true,
            message: "Thank you for contacting us. We will follow up as soon as possible.",
        });
    } catch (err) {
        console.error("Error saving contact submission:", err);
        return res.status(500).json({
            success: false,
            message: "We could not save your message. Please try again later.",
        });
    }
});

app.post("/api/newsletter", (req, res) => {
    const { email } = req.body || {};
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required.",
        });
    }

    const record = {
        email,
        subscribedAt: new Date().toISOString(),
    };

    try {
        appendToJsonFile(NEWSLETTER_FILE, record);
        console.log("New newsletter subscription:", record);
        return res.json({
            success: true,
            message: "Thanks for subscribing to our newsletter.",
        });
    } catch (err) {
        console.error("Error saving newsletter subscription:", err);
        return res.status(500).json({
            success: false,
            message: "We could not save your subscription. Please try again later.",
        });
    }
});

// Fallback 404 for API
app.use("/api", (req, res) => {
    res.status(404).json({ success: false, message: "Not found" });
});

// Fallback route for client-side navigation (if needed)
app.get("*", (req, res) => {
    // send index.html for unknown routes that don't start with /api
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`YourCPA site running at http://localhost:${PORT}`);
});
