import { Schema, model } from "mongoose";

const userResponseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  test: {
    type: Schema.Types.ObjectId,
    ref: 'Test', // Reference to the Test model
    required: true,
  },
  responses: [
    {
      question: {
        type: Schema.Types.ObjectId,
        ref: 'Test.questions', // Reference to the question within the Test
        // required: true,
      },
      selectedOption: {
        type: Schema.Types.ObjectId,
        ref: 'Test.questions.options', // Reference to the selected option
        // required: true,
      },
    },
  ],
  score: {
    type: String,
  },
});

export default model("UserResponse", userResponseSchema);
