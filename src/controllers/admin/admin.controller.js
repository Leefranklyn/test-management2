import Test from "../../models/test/test.model.js";
import Institution from "../../models/institution/institution.model.js";
import Otp from "../../models/otp/otp.model.js";
import { createHash } from "node:crypto";
import jwt from "jsonwebtoken";
import { loginValidator } from "../../validators/admin/admin.validator.js";
import { updateInstitutionValidator } from "../../validators/institution/institution.validator.js";
import { formatZodError } from "../../utils/errorMessage.js";

import { forgotPassword } from "../../utils/mailing.js";


const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 900);
};

export const requestAdminPasswordResetOTP = async (req, res) => {
  try {
    const { adminEmail } = req.body;

    const admin = await Institution.findOne({ adminEmail: adminEmail });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const otp = generateOTP();
    // req.session.otp = { otp: otp, timestamp: Date.now() };
    // console.log(req.session.otp)

    const otpDoc = new Otp({
      email: adminEmail,
      otp: otp,
      timestamp: new Date(),
    });
    await otpDoc.save();
    // req.session.adminEmail = adminEmail;
    console.log(otpDoc);

    await forgotPassword(
      admin.adminFirstName,
      admin.adminLastName,
      admin.adminEmail,
      otp
    );

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please check your inbox.",
      otp: otpDoc,
      data: admin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

export const verifyAdminPasswordResetOTP = async (req, res) => {
  try {
    const id = req.params.adminId;
    const admin = await Institution.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "admin not found",
      });
    }
    const adminEmail = admin.adminEmail;
    const { otp } = req.body;

    const otpDoc = await Otp.findOne({
      email: adminEmail,
    }).sort({ timestamp: -1 }); // Get the latest OTP

    if (!otpDoc) {
      return res.status(400).json({ message: "OTP unavailable" });
    }
    const currentTime = new Date();
    const otpTimestamp = otpDoc.timestamp;
    const otpExpirationTime = 15 * 60 * 1000; // 15 minutes in milliseconds

    if (currentTime - otpTimestamp >= otpExpirationTime) {
      // OTP has expired
      return res.status(400).json({ message: "OTP is invalid or expired" });
    }

    if (otp !== otpDoc.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Delete OTP document from MongoDB after successful verification
    await otpDoc.deleteOne({ email: adminEmail });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const id = req.params.adminId;
    const admin = await Institution.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "admin not found",
      });
    }
    const adminEmail = admin.adminEmail;

    const { adminPassword } = req.body;

    const encryptedPassword = createHash("sha256")
      .update(adminPassword)
      .digest("base64");

    await Institution.updateOne(
      { adminEmail },
      { adminPassword: encryptedPassword }
    );

    res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const loginValidatorResult = loginValidator.safeParse(req.body);
    if (!loginValidatorResult.success) {
      return res
        .status(400)
        .json(formatZodError(loginValidatorResult.error.issues));
    }
    const { adminEmail, adminPassword } = req.body;
    const admin = await Institution.findOne({ adminEmail: adminEmail });
    console.log(`admin`, admin);

    if (!admin)
      return res.status(404).json({
        success: false,
        message: "email not found!!",
      });

    const encrypted = createHash("sha256")
      .update(adminPassword)
      .digest("base64");

    if (admin.adminPassword !== encrypted)
      return res.status(400).json({
        success: false,
        message: "Wrong email or password",
      });

    const token = jwt.sign(
      {
        id: Institution._id,
        useType: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    const adminInfo = {
      id: admin._id,
      firstName: admin.adminFirstName,
      lastName: admin.adminLastName,
      profilePhoto: admin.adminProfilePhoto,
      emailAddress: admin.adminEmail,
      phoneNumber: admin.adminPhone,
      password: admin.adminPassword,
      gender: admin.adminGender,
    };

    res.status(200).json({
      success: true,
      data: adminInfo,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Admin Login Failed",
    });
  }
};

export const getAdminInstitution = async (req, res) => {
  const id = req.params.adminId;
  const institution = await Institution.findById(id).select("-adminPassword");
  console.log(`institution`, institution);

  if (!institution) {
    return res.status(404).json({ message: "Institution Not Found" });
  }

  return res.status(200).json({
    success: true,
    data: institution,
  });
};

export const getAdmin = async (req, res) => {
  try {
    const id = req.params.adminId;

    const admin = await Institution.findById(id);
    if (!admin) {
      return res.status(400).json({
        message: "Admin Not Found",
      });
    }
    const adminInfo = {
      adminFirstName: admin.adminFirstName,
      adminLastName: admin.adminLastName,
      adminProfilePhoto: admin.adminProfilePhoto,
      adminEmail: admin.adminEmail,
      adminPhone: admin.adminPhone,
      adminGender: admin.adminGender,
    };
    res.status(200).json({
      success: true,
      data: adminInfo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed In Retrieving Admin",
    });
  }
};

export const getInstitutionTest = async (req, res) => {
  try {
    const id = req.params.adminId;
    console.log(id);
    const institution = await Institution.findById(id);
    if (!institution) {
      return res.status(400).json({
        message: "Institution Not Found",
      });
    }
    const test = await Test.findOne({ institution: institution._id });

    if (!test) {
      return res.status(400).json({
        message: "Test Not Found",
      });
    }
    res.status(200).json({
      success: true,
      data: test,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed To Fetch Test",
    });
  }
};

export const updateInstitutionAdminProfilePhoto = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const adminProfilePhoto = req.file;
    const adminProfilePhotoUrl = adminProfilePhoto.path;
  
    // const institution = await Institution.findById(adminId);
  
    // if(!institution) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Institution not found",
    //   });
    // };
    // institution.adminProfilePhoto = adminProfilePhotoUrl;
  
    // await institution.save();
  
    res.status(200).json({
      success: true,
      message: "Admin Photo Updated Successfully",
      adminProfilePhotoUrl: adminProfilePhotoUrl,
      // institution
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:"An Error Occurred While Updating Admin Photo"
    })
  };
};

export const updateInstitutionSchoolLogo = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const schoolLogo = req.file;
    const schoolLogoUrl = schoolLogo.path;
  
    // const institution = await Institution.findById(adminId);
  
    // if(!institution) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Institution not found",
    //   });
    // };
    // institution.schoolLogo = schoolLogoUrl;
  
    // await institution.save();
  
    res.status(200).json({
      success: true,
      message: "School Logo Updated Successfully",
      schoolLogoUrl: schoolLogoUrl
      // schoolLogo: institution.schoolLogo,
      // institution
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:"An Error Occurred While Updating School Logo"
    })
  }
};

export const updateInstitutionProprietorSignature = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const proprietorSignature = req.file;
    const proprietorSignatureUrl = proprietorSignature.path;
    
    // const institution = await Institution.findById(adminId);
    
    // if(!institution) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Institution not found",
    //   });
    // };
    // institution.proprietorSignature = proprietorSignatureUrl;
    
    // await institution.save();
    
    res.status(200).json({
      success: true,
      message: "Admin Photo Updated Successfully",
      proprietorSignatureUrl: proprietorSignatureUrl,
      // institution
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:"An Error Occurred While Updating Proprietor Signature"
    })
  }
};

export const updateInstitutionAndAdmin = async (req, res) => {
  try {
    const id = req.params.adminId;
    console.log(id);

    const updateValidatorResult = updateInstitutionValidator.safeParse(
      req.body
    );
    if (!updateValidatorResult.success) {
      return res
        .status(400)
        .json(formatZodError(updateValidatorResult.error.issues));
    }
    // const updateAdminData = req.body;

    const {
      schoolName,
      // schoolOwner,
      // schoolShortName,
      // schoolType,
      // schoolMotto,
      schoolAddress,
      // country,
      // stateOrProvince,
      website,
      schoolLogo,
      schoolContactEmail,
      schoolContactPhone,
      // technicalContactEmail,
      // technicalContactPhone,
      proprietorSignature,
      adminFirstName,
      adminLastName,
      adminEmail,
      adminPhone, 
      adminGender,
      adminProfilePhoto,
      adminDateOfBirth
    } = req.body;

    // const uppercaseCountry = country.toUpperCase();

    const fieldsToUpdate = {
      schoolName: schoolName,
      // schoolOwner: schoolOwner,
      // schoolShortName: schoolShortName,
      // schoolType: schoolType,
      // schoolMotto: schoolMotto,
      schoolAddress: schoolAddress,
      // country: uppercaseCountry,
      // stateOrProvince: stateOrProvince,
      website: website,
      schoolLogo: schoolLogo,
      schoolContactEmail: schoolContactEmail,
      schoolContactPhone: schoolContactPhone,
      proprietorSignature: proprietorSignature,
      // technicalContactEmail: technicalContactEmail,
      // technicalContactPhone: technicalContactPhone,
      adminFirstName: adminFirstName,
      adminLastName: adminLastName,
      adminEmail: adminEmail,
      adminPhone: adminPhone,
      adminProfilePhoto: adminProfilePhoto,
      adminGender: adminGender,
      adminDateOfBirth: adminDateOfBirth
    };

    const updatedAdmin = await Institution.findByIdAndUpdate(
      id,
      { $set: fieldsToUpdate },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Institution not found",
      });
    }
    res.json({
      success: true,
      message: "Admin And Institution Updated Successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Admin And Institution Update Failed",
    });
  }
};

export const uploadTestQuestionImage = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const { questionId } = req.body;
    const questionImage = req.file;
  
    const questionImageUrl = questionImage.path
  
    const test = await Test.findOne({institution: adminId})
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    };

    test.questions.forEach((question) => {
      if (question._id.toString() === questionId) {
        // Update the question's questionImage field
        question.questionImage = questionImageUrl;
      }
    });

    // Save the updated test
    await test.save();

    const uploadedQuestionImage = {
      questionId: questionId,
      questionImageUrl: questionImageUrl
    };
  
    res.status(200).json({
      success: true,
      message: "Uploaded Images Successfully",
      uploadedQuestionImage,
      test
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Uploading Image"
    });
  };
};

export const updateTestQuestionImage = async (req, res) => {
  try{
      const adminId = req.params.adminId;
      const { questionId, questionImage } = req.body;
  
      const test = await Test.findOne({institution: adminId})
      if (!test) {
        return res.status(404).json({
          success: false,
          message: "Test not found",
        });
      };
  
        test.questions.forEach((question) => {
        if (question._id.toString() === questionId) {
          // Update the question's questionImage field
          question.questionImage = questionImage;
        }
      });
  
      // Save the updated test
      await test.save();
  
        res.status(200).json({
        success: true,
        message: "Updated Question Image Successfully",
        test
      });
  }catch(error) {
        console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Updating questionImage"
    });
  };
};

export const updateTest = async (req, res) => {
  try {
    const id = req.params.adminId;

    const existingTest = await Test.findOne({ institution: id });
    
    if (!existingTest) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    };

    existingTest.testName = req.body.testName;
    existingTest.timer = req.body.timer;


    // Iterate through the questions in the request body and update the corresponding questions in the test
req.body.questions.forEach((updatedQuestion) => {
  const questionToUpdate = existingTest.questions.find((question) => question._id.toString() === updatedQuestion._id.toString());
  if (questionToUpdate) {
    if (updatedQuestion.questionText) {
      questionToUpdate.questionText = updatedQuestion.questionText;
    }
    if (updatedQuestion.questionTopic) {
      questionToUpdate.questionTopic = updatedQuestion.questionTopic;
    }
    if (updatedQuestion.options && updatedQuestion.options.length > 0) {
      updatedQuestion.options.forEach((updatedOption) => {
        const optionToUpdate = questionToUpdate.options.find((option) => option._id.toString() === updatedOption._id.toString());
        if (optionToUpdate) {
          // Update the option fields
          optionToUpdate.text = updatedOption.text;
          optionToUpdate.isCorrect = updatedOption.isCorrect;
        }
      });
    }
  }
});


    // Save the updated test document
    const updatedTest = await existingTest.save();

    res
      .status(200)
      .json({ success: true, message: "Test updated successfully", updatedTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating test" });
  };
};
