import mongoose, { Schema, Document } from "mongoose";

export interface IFunction extends Document {
  username: string;
  image: string;
}

const FunctionSchema: Schema<IFunction> = new Schema({
  username: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

FunctionSchema.index({ username: 1, image: 1 }, { unique: true });

const Function = mongoose.model<IFunction>("Function", FunctionSchema);
export default Function;
