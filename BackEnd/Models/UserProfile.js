const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    bio: { type: String },
    tags: [{ type: String }],
    noOfQuestions: { type: Number, default: 0 },
    noOfAnswers: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    answerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    achievements: [{ type: String }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Virtuals for follower and following count
UserProfileSchema.virtual("noOfFollowers").get(function () {
  return this.followers.length;
});

UserProfileSchema.virtual("noOfFollowing").get(function () {
  return this.following.length;
});

module.exports = mongoose.model("UserDetail", UserProfileSchema);
