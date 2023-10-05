import dotenv from "dotenv";
dotenv.config({path: '../../.env'})
import { disconnect } from "mongoose";
import Test from "../models/test/test.model.js";
import { connectDB } from "../config/db.js";

connectDB(process.env.MONGO_URL);

const generateQuestion = (institution, questionText, questionImage, options) => ({
  institution,
  questionText,
  questionImage,
  options: options.map((text, index) => ({ text, isCorrect: index === 0 })),
});

const defaultTestData = {
  institution: "6502fcd57d2bdae1c66c6a01",
  testName: 'Default Test',
  questions: Array(15).fill(
    generateQuestion("null", 'What is the capital of France?', "https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", ['Paris', 'London', 'Berlin', 'Madrid'])
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