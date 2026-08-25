import mongoose from "mongoose";

const DestinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Destination name is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["india", "international"],
      default: "india",
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Destination =
  mongoose.models.Destination ||
  mongoose.model("Destination", DestinationSchema);

export default Destination;
