import mongoose, { Schema, model, models } from "mongoose";

const AnimeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    score: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    mal: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default models.Anime || model("Anime", AnimeSchema);
