const mongoose = require("mongoose");

function generateRandomColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

// Function to generate the avatar URL
function generateImageUrl(name) {
  if (!name) return "";
  const words = name.split(" ");
  const initials =
    words.length >= 2
      ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
      : words[0][0].toUpperCase();

  const randomColor = generateRandomColor();
  return `https://ui-avatars.com/api/?name=${initials}&background=${randomColor}&color=fff`;
}
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    clgemail: { type: String, required: true, unique: true },
    backupemail: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    isProfileCompleted: { type: Boolean, default: false },

    imageUrl: { type: String,default: function () {
      return this.useGithubAvatar && this.githubAvatarUrl
        ? this.githubAvatarUrl
        : generateImageUrl(this.name);
    }, }, // Updated from UserProfile
  },
  { timestamps: true }
);

// Middleware to sync updates from UserProfile → User
UserSchema.pre("save", async function (next) {
  if (
    !this.isModified("name") &&
    !this.isModified("username") &&
    !this.isModified("clgemail") &&
    !this.isModified("backupemail") &&
    !this.isModified("imageUrl")
  ) {
    return next();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the corresponding UserProfile
    const userProfile = await mongoose.model("UserProfile").findOne({ userid: this._id });

    if (!userProfile) {
      console.log(`No UserProfile found for User ID: ${this._id}`);
      return next(); // Continue saving the User even if the profile does not exist
    }

    console.log(` Updating User fields from UserProfile for User ID: ${this._id}`);

    //  Update User fields based on UserProfile
    this.name = userProfile.name;
    this.username = userProfile.username;
    this.clgemail = userProfile.clgemail;
    this.backupemail = userProfile.backupemail;
    this.imageUrl = userProfile.imageUrl;

    await session.commitTransaction();
    session.endSession();

    console.log(` User fields successfully updated from UserProfile for User ID: ${this._id}`);

    next();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(` Error updating User fields: ${error.message}`);
    next(error);
  }
});

module.exports = mongoose.model("User", UserSchema);
