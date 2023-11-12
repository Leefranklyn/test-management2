import { Schema, model } from "mongoose";

const testSchema = new Schema({
  institution: {
    type: Schema.Types.ObjectId,
    ref: "Institution",
  },
  testName: {
    type: String,
    required: true,
  },
  timer: {
    type: Number,
    required: true,
    default: 0,
  },
  schoolShortName: {
    type: String,
    required: true
  },
  questions: [
    {
      questionTopic: {
        type: String,
        required: true
      },
      questionText: {
        type: String,
        required: true,
      },
      questionImage: {
        type: String,
        required: true,
        default: "https://t4.ftcdn.net/jpg/04/70/29/87/360_F_470298738_1eHqTZ0B5AvB3emaESPpvQ93227y7P0l.jpg"
      },
      options: [
        {
          text: {
            type: String,
            required: true,
          },
          isCorrect: {
            type: Boolean,
            required: true,
          },
        },
      ],
    },
  ],
}, {
  timestamps: true
});


export default model("Test", testSchema)
