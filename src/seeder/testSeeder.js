import dotenv from "dotenv";
dotenv.config({path: '../../.env'})
import { disconnect } from "mongoose";
import Test from "../models/test/test.model.js";
import { connectDB } from "../config/db.js";

connectDB(process.env.MONGO_URL);

const generateQuestion = (institution, questionTopic, questionText, questionImage, options) => ({
  institution,
  questionTopic,
  questionText,
  questionImage,
  options: options.map((text, index) => ({ text, isCorrect: index === 0 })),
});

const defaultTestData = {
  institution: "651b2cc95f3d35d395576943",
  testName: 'Default Test',
  timer: 15,
  questions: Array(15).fill(
    generateQuestion("null", "General Knowledge", "What is the capital of France?", "https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", ['Paris', 'London', 'Berlin', 'Madrid'])
  ),
};

const createDefaultTest = async () => {
  try {
    const defaultTest = new Test(defaultTestData);

    await defaultTest.save();

    console.log('Default test created successfully.');
  } catch (error) {
    console.error('Error creating default test:', error);
  } finally {
    disconnect();
  }
};

createDefaultTest();