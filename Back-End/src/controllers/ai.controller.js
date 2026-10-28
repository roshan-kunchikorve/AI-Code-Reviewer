const aiService = require("../services/ai.service");

module.exports = async (req, res) => {
  try {
    const { code } = req.body || {};

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        error: "Code is required",
      });
    }

    const response = await aiService(code);

    return res.status(200).json({
      success: true,
      review: response,
    });
  } catch (error) {
    console.error("AI review error:", error.message);

    if (error.statusCode === 429) {
      return res.status(429).json({
        error: "Gemini API quota exceeded. Check your model limits.",
      });
    }

    return res.status(500).json({
      error: "Failed to review the code.",
    });
  }
};
