const TagDetail = require("../Models/TagDetails");
const createLeaderboardModel = require("../Models/Leaderboard");

// Create tag detail
exports.createTagDetail = async (req, res) => {
  try {
    const { tagName, tagPoint, username, password } = req.body;

    // Admin authentication
    if (username !== "admin1234" || password !== "1234Admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid credentials for Admin Access" });
    }

    // Check if tag already exists
    const existingTag = await TagDetail.findOne({ tagName });
    if (existingTag)
      return res.status(400).json({ error: "Tag already exists" });

    // Create the tag
    const newTag = new TagDetail({ tagName, tagPoint });
    await newTag.save();

    res
      .status(201)
      .json({
        message: "Tag created successfully",
        tag: newTag,
      });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllTagDetails = async (req, res) => {
  try {
    const tags = await TagDetail.find({}, "tagName"); // Only fetch tagName field
    const tagNames = tags.map((tag) => tag.tagName); // Extract tagName into an array

    res.json(tagNames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getProfileTags = async (req, res) => {
  try {
    const tags = await TagDetail.find({ tagName: { $ne: "General Query" } }, "tagName"); 
    const tagNames = tags.map((tag) => tag.tagName); // Extract tagName into an array

    res.json(tagNames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTagDetailById = async (req, res) => {
  try {
    const tagDetail = await TagDetail.findById(req.params.id);
    tagDetail
      ? res.json(tagDetail)
      : res.status(404).json({ error: "TagDetail not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTagDetail = async (req, res) => {
  try {
    res.json(
      await TagDetail.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTagDetail = async (req, res) => {
  try {
    await TagDetail.findByIdAndDelete(req.params.id);
    res.json({ message: "TagDetail deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
