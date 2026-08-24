import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    countryCode: {
      type: String,
      required: [true, "Country code is required"],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    dateOfTravel: {
      type: Date,
      required: [true, "Date of travel is required"],
    },
    numberOfPeople: {
      type: Number,
      required: [true, "Number of people is required"],
      min: [1, "At least 1 person is required"],
    },
    hotelCategory: {
      type: String,
      required: [true, "Hotel category is required"],
      enum: {
        values: ["Standard", "Deluxe", "Luxury"],
        message: "Hotel category must be Standard, Deluxe, or Luxury",
      },
    },
    numberOfChildren: {
      type: Number,
      default: 0,
      min: [0, "Number of children cannot be negative"],
    },
    destination: {
      type: String,
      default: "",
      trim: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);

export default Enquiry;
