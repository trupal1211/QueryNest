const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetails",
    required: true,
  },
  tags: [
    {
      tag: { type: mongoose.Schema.Types.ObjectId, ref: "TagDetail" },
      tagPoints: { type: Number, default: 0 },
    },
  ],
  profilePoint: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
  noOfQuestions: { type: Number, default: 0 },
  noOfAnswers: { type: Number, default: 0 },
  achievements: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserProfile", UserProfileSchema);
