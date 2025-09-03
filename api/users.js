import mongoose from "mongoose";
import crypto from "crypto";

// 🔹 MongoDB ulanish (caching bilan)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
}

// 🔹 Schema va Model
const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  ism: String,
  yosh: Number,
});

UserSchema.pre("save", function (next) {
  if (!this.userId) {
    this.userId = crypto.randomBytes(12).toString("hex");
  }
  next();
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

// 🔹 Handler (CRUD API)
export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET": {
      const users = await User.find();
      return res.status(200).json({
        javob: { xabar: "Barcha userlar ro‘yxati ✅", users },
      });
    }

    case "POST": {
      try {
        const user = new User(req.body);
        await user.save();
        return res
          .status(201)
          .json({ javob: { xabar: "User yaratildi ✅", user } });
      } catch (err) {
        return res.status(500).json({ xato: err.message });
      }
    }

    case "PUT": {
      try {
        const { userId } = req.query;
        const user = await User.findOneAndUpdate({ userId }, req.body, {
          new: true,
        });
        if (!user) return res.status(404).json({ xato: "User topilmadi" });
        return res.json({ javob: { xabar: "User yangilandi ✅", user } });
      } catch (err) {
        return res.status(500).json({ xato: err.message });
      }
    }

    case "DELETE": {
      try {
        const { userId } = req.query;
        const user = await User.findOneAndDelete({ userId });
        if (!user) return res.status(404).json({ xato: "User topilmadi" });
        return res.json({ javob: { xabar: "User o‘chirildi ✅", user } });
      } catch (err) {
        return res.status(500).json({ xato: err.message });
      }
    }

    default:
      return res.status(405).json({ xato: "Method ruxsat etilmagan" });
  }
}
