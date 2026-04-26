import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 499,
  },
});

const Counter = mongoose.model("Counter", counterSchema);
export default Counter;
