import User from "../../models/user/user.model.js";
import UserResponse from "../../models/user/userResponse.model.js";
import { Types } from "mongoose";
import Test from "../../models/test/test.model.js";
import Institution from "../../models/institution/institution.model.js";
import { userRegistrationSuccess } from "../../utils/mailing.js";
import { createHash } from "node:crypto";
import jwt from "jsonwebtoken";
import { formatZodError } from "../../utils/errorMessage.js";
import {
  registrationValidator,
  loginValidator,
} from "../../validators/user/user.validator.js";


export const uploadUserProfilePhoto = async (req, res) => {
  try {
    const id = req.params.institutionId;
    console.log(id);
  
    const profilePhoto = req.file;
  
    const profilePhotoUrl = profilePhoto.path;
  
    res.status(200).json({
      success: true,
      message: "user profile photo uploaded successfully",
      profilePhoto: profilePhotoUrl
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "upload Failed",
    });
  }
};

export const userRegiistration = async (req, res) => {
  try {
    const id = req.params.adminId;
    const registrationValidatorResult = registrationValidator.safeParse(
      req.body
    );
    if (!registrationValidatorResult.success) {
      return res
        .status(400)
        .json(formatZodError(registrationValidatorResult.error.issues));
    }

    const { firstName, lastName, userName, email, password, profilePhoto } = req.body;
    const institution = await Institution.findById(id);

    if (!institution) {
      return res.status(404).json({
        message: "Institution Not Found",
      });
    }

    // const userUrls = [];
    // const userFiles = req.files;
    // for (const field in userFiles) {
    //   const files = userFiles[field];
    //   for (const file of files) {
    //     const { path, fieldname } = file;
    //     userUrls.push({ [fieldname]: path });
    //   }
    // }

    // console.log("urls", userUrls);

    const encryptedPassword = createHash("sha256")
      .update(password)
      .digest("base64");

    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      password: encryptedPassword,
      profilePhoto: profilePhoto,
      institution: institution._id,
    });
    await newUser.save();
    await userRegistrationSuccess(
      newUser.firstName,
      newUser.lastName,
      newUser.userName,
      newUser.email,
      password,
      institution.schoolName,
      institution.schoolUrl
    );
    res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      data: newUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "User Registeration Failed",
    });
  }
};

export const userLoginAndStartTest = async (req, res) => {
  try {
    const loginValidatorResult = loginValidator.safeParse(req.body);
    if (!loginValidatorResult.success) {
      return res
        .status(400)
        .json(formatZodError(loginValidatorResult.error.issues));
    }

    const user = await User.findOne({ userName: req.body.userName });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "UserName not found!!",
      });
    const test = await Test.findOne({ institution: user.institution });

    if (!test) {
      return res.status(404).json({
        message: "User Login Failed, Test Not Found",
      });
    }
    const encrypted = createHash("sha256")
      .update(req.body.password)
      .digest("base64");

    if (user.password !== encrypted) {
      return res.status(400).json({
        success: false,
        message: "Wrong UserName Or Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        useType: "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const userInfo = {
      id: user._id,
      name: user.firstName,
      email: user.lastName,
      profilePhoto: user.profilePhoto,
    };

    // req.session.userId = user._id;
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: userInfo,
      token: token,
      test: test,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "User Login Failed",
    });
  }
};

export const getTestForUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);
    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found"
      });
    };
    const test = await Test.findOne({ institution: user.institution})
    if(!test) {
      return res.status(404).json({
        success: false,
        message: "Test Not Found"
      });
    };
    res.status(200).json({
      success: true,
      data: test
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "An Error Occured Getting Test",
    });
  };
};

const calculateScore = (test, userResponses) => {
  let score = 0;

  for (const userResponse of userResponses) {
    const question = test.questions.id(userResponse.question);

    // Add error handling to check if question exists
    if (!question) {
      console.error(`Question not found for user response: ${userResponse.question}`);
      continue; // Skip this response and move to the next one
    }

    const selectedOption = question.options.id(userResponse.selectedOption);

    if (selectedOption && selectedOption.isCorrect) {
      score += 2; // Award 2 marks for each correct answer
    }
  }


  return score;
};



export const submitUserResponse = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { responses } = req.body;

    // Calculate the user's score
    const user = await User.findById(userId);
    if (!user)
    return res.status(400).json({
      success: false,
      message: "user not found!!, Cannot Submit Test",
    });
    const test = await Test.findOne({ institution: user.institution });

    if (!test) {
      return res.status(404).json({
        message: "Cannot Submit Test, Test Not Found",
      });
    }
    const score = calculateScore(test, responses);

    // Create a new user response object
    const userResponse = new UserResponse({
      user: user._id,
      test: test._id,
      responses,
      score: `${score}/30`
    });

    await userResponse.save();

    res.status(200).json({ success: true, score: userResponse.score });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error submitting responses" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const id = req.params.adminId;
    // Find all users associated with the admin's institution
    const users = await User.find({ institution: id });
    const test = await Test.findOne({ institution: id });

    // Use .countDocuments() to count all users
    const totalUsers = await User.countDocuments({ institution: id });

    if (totalUsers === 0) {
      return res
        .status(200)
        .json({
          success: true,
          message: "No users found for this institution",
          totalUsers
        });
    }

    // Find user responses for the specified test and multiple users
    const userResponses = await UserResponse.find({
      user: { $in: users.map((user) => user._id) },
      test: test._id,
    });

    const userInfo = users.map((user) => {
      const userResponse = userResponses.find((response) =>
        response.user.equals(user._id)
      );
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePhoto: user.profilePhoto,
        score: userResponse ? userResponse.score : null,
      };
    });

    res.status(200).json({
      success: true,
      message: "User Results Fetched Successfully",
      totalUsers,
      userInfo,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching test results" });
  }
};

export const getUsersWithResults = async (req, res) => {
  try {
    const id = req.params.adminId;

    // Find all users associated with the admin's institution
    const users = await User.find({ institution: id });
    const test = await Test.findOne({ institution: id });

    // Use .countDocuments() to count users who have taken the test
    const totalUsersWithResults = await UserResponse.countDocuments({
      user: { $in: users.map((user) => user._id) },
      test: test._id,
    });

    if (totalUsersWithResults === 0) {
      return res.status(200).json({
        success: true,
        message: "Test results not found for any user",
        totalUsersWithResults,
        userInfo: [], // Initialize an empty array for userInfo
      });
    }

    // Find user responses for the specified test and multiple users
    const userResponses = await UserResponse.find({
      user: { $in: users.map((user) => user._id) },
      test: test._id,
    });

    const userInfo = users
      .filter((user) =>
        userResponses.some((response) => response.user.equals(user._id))
      )
      .map((user) => {
        const userResponse = userResponses.find((response) =>
          response.user.equals(user._id)
        );
        return {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePhoto: user.profilePhoto,
          score: userResponse ? userResponse.score : null,
        };
      });

    res.status(200).json({
      success: true,
      message: "User Results Fetched Successfully",
      totalUsersWithResults,
      userInfo,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching test results" });
  }
};
