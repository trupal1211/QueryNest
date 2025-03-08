const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema(
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
UserDetailSchema.virtual("noOfFollowers").get(function () {
  return this.followers.length;
});

UserDetailSchema.virtual("noOfFollowing").get(function () {
  return this.following.length;
});

module.exports = mongoose.model("UserDetail", UserDetailSchema);
