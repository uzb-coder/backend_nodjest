const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

// MongoDB ulanish
mongoose.connect("mongodb+srv://yoshxaker004_db_user:1920@cluster0.njbql0f.mongodb.net/mydb")
  .then(() => console.log("✅ MongoDB Atlas ulandi"))
  .catch((err) => console.error("❌ Xato:", err));

  const crypto = require("crypto");

  // Schema va Model
  const UserSchema = new mongoose.Schema({
    userId: {
      type: String,
      unique: true
    },
    ism: String,
    yosh: Number,
  });
  
  // userId avtomatik berish
  UserSchema.pre("save", function (next) {
    if (!this.userId) {
      this.userId = crypto.randomBytes(12).toString("hex"); 
    }
    next();
  });
  
  
const User = mongoose.model("User", UserSchema);

// CREATE
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({
      javob: {
        xabar: "User yaratildi ✅",
        user
      }
    });
  } catch (err) {
    res.status(500).json({ xato: err.message });
  }
});

// READ
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      javob: {
        xabar: "Barcha userlar ro‘yxati ✅",
        users
      }
    });
  } catch (err) {
    res.status(500).json({ xato: err.message });
  }
});

// UPDATE (userId bo‘yicha)
app.put("/users/:userId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    if (!user) return res.status(404).json({ xato: "User topilmadi" });

    res.json({
      javob: {
        xabar: "User yangilandi ✅",
        user
      }
    });
  } catch (err) {
    res.status(500).json({ xato: err.message });
  }
});

// DELETE (userId bo‘yicha)
app.delete("/users/:userId", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ userId: req.params.userId });
    if (!user) return res.status(404).json({ xato: "User topilmadi" });

    res.json({
      javob: {
        xabar: "User o‘chirildi ✅",
        user
      }
    });
  } catch (err) {
    res.status(500).json({ xato: err.message });
  }
});

// Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT}`));
