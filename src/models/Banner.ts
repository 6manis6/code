import mongoose, { Schema, model, models } from "mongoose";

// One document in this collection holds all slides + playback settings.

const SlideSchema = new Schema(
  {
    imageUrl: { type: String, default: "" },
    badgeText: { type: String, default: "" },
    title: { type: String, default: "" },
    titleHighlight: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    buttonText: { type: String, default: "" },
    buttonLink: { type: String, default: "#" },
  },
  { _id: false },
);

const BannerSchema = new Schema(
  {
    slides: { type: [SlideSchema], default: [] },
    intervalMs: { type: Number, default: 5000 },
  },
  {
    timestamps: true,
    // Allows reading/writing legacy single-banner fields without Mongoose errors
    strict: false,
  },
);

// Always delete the cached model so that schema changes take effect
// immediately without requiring a full server restart.
if (models.Banner) {
  delete (models as Record<string, mongoose.Model<unknown>>).Banner;
}

export default model("Banner", BannerSchema);
