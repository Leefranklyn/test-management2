import Institution from "../../models/institution/institution.model.js";
import Test from "../../models/test/test.model.js";
import schoolInfo from "../../models/schoolinfo/schoolinfo.model.js";
import { formatZodError } from "../../utils/errorMessage.js";
import {
  registrationValidator,
  updateInstitutionValidator,
} from "../../validators/institution/institution.validator.js";
import { createHash } from "node:crypto";
import { adminAndInstitutionRegistrationSuccess } from "../../utils/mailing.js";

export const institutionAndAdminRegistration = async (req, res) => {
  try {
    const registrationValidatorResult = registrationValidator.safeParse(
      req.body
    );
    if (!registrationValidatorResult.success) {
      return res
        .status(400)
        .json(formatZodError(registrationValidatorResult.error.issues));
    }
    const {
      schoolName,
      schoolOwner,
      schoolShortName,
      schoolType,
      schoolMotto,
      schoolAddress,
      country,
      stateOrProvince,
      website,
      schoolUrl,
      schoolContactEmail,
      schoolContactPhone,
      technicalContactEmail,
      technicalContactPhone,
      adminFirstName,
      adminLastName,
      adminEmail,
      adminPhone,
      adminPassword,
      adminGender,
      adminDateOfBirth,
    } = req.body;

    const uppercaseCountry = country.toUpperCase();
    const uppercaseAdminGender = adminGender.toUpperCase();

    // const institutionUrls = [];
    // const institutionfiles = req.files;
    // console.log(institutionfiles);
    // for (const field in institutionfiles) {
    //   const files = institutionfiles[field];
    //   for (const file of files) {
    //     const { path, fieldname } = file;
    //     institutionUrls.push({ [fieldname]: path });
    //   }
    // }
    // console.log("urls", institutionUrls);
    const randomNumber = Math.floor(Math.random() * 10000) + 1;

    const combinedInfo = `${schoolName}${schoolShortName}${randomNumber}`;
    const encryptedPassword = createHash("sha256")
      .update(adminPassword)
      .digest("base64");
    const newInstitution = new Institution({
      schoolName,
      schoolOwner,
      schoolShortName,
      schoolType,
      schoolMotto,
      schoolAddress,
      country: uppercaseCountry,
      stateOrProvince,
      website,
      schoolUrl,
      schoolContactEmail,
      schoolContactPhone,
      technicalContactEmail,
      technicalContactPhone,
      adminFirstName,
      adminLastName,
      adminEmail,
      adminPhone,
      adminPassword: encryptedPassword,
      adminGender: uppercaseAdminGender,
      adminDateOfBirth,
    });

    await newInstitution.save();
    await adminAndInstitutionRegistrationSuccess(
      newInstitution.adminFirstName,
      newInstitution.adminLastName,
      newInstitution.adminEmail,
      newInstitution.schoolName,
      newInstitution.schoolUrl
    );

    const generateQuestion = (
      questionTopic,
      questionText,
      questionImage,
      options
    ) => ({
      questionTopic,
      questionText,
      questionImage,
      options: options.map((text, index) => ({ text, isCorrect: index === 0 })),
    });

    const defaultTestData = {
      institution: newInstitution._id,
      testName: "Default Test",
      questions: Array(15).fill(
        generateQuestion(
          "Geography Quiz",
          "What is the capital of France?",
          "https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
          ["Paris", "London", "Berlin", "Madrid"]
        )
      ),
    };

    const defaultTest = new Test(defaultTestData);
    await defaultTest.save();

    console.log(`Institution`, newInstitution);
    res.status(200).json({
      success: true,
      message: "Institution and Test Added Successfully",
      data: newInstitution,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Institution Registeration Failed, Failed In Adding Test",
    });
  }
};

export const getAdminInstitutionToCompleteRegistration = async (req, res) => {
  const id = req.params.institutionId;
  const institution = await Institution.findById(id);
  console.log(`institution`, institution);

  if (!institution) {
    return res.status(404).json({ message: "Institution Not Found" });
  }

  return res.status(200).json({
    success: true,
    data: institution,
  });
};

export const completeInstitutionRegistrationSchoolLogo = async (req, res) => {
  try {
    const id = req.params.institutionId;
    console.log(id);

    const schoolLogo = req.file;

    const schoolLogoUrl = schoolLogo.path;

    res.status(200).json({
      success: true,
      message: "school logo uploaded successfully",
      schoolLogoUrl: schoolLogoUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "upload Failed",
    });
  }
};

export const completeInstitutionRegistrationProprietorSignature = async (
  req,
  res
) => {
  try {
    const id = req.params.institutionId;
    console.log(id);

    const proprietorSignature = req.file;

    const proprietorSignatureUrl = proprietorSignature.path;

    res.status(200).json({
      success: true,
      message: "proprietor signature uploaded successfully",
      proprietorSignatureUrl: proprietorSignatureUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "upload Failed",
    });
  }
};

export const completeInstitutionRegistration = async (req, res) => {
  try {
    const id = req.params.institutionId;
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
      schoolOwner,
      schoolShortName,
      schoolType,
      schoolMotto,
      schoolAddress,
      country,
      stateOrProvince,
      website,
      schoolLogo,
      schoolContactEmail,
      schoolContactPhone,
      technicalContactEmail,
      technicalContactPhone,
      proprietorSignature,
    } = req.body;

    const uppercaseCountry = country.toUpperCase();

    // const urls = [];
    // const adminFile = req.files;
    // if(adminFile) {
    //   console.log(adminFile);
    //   for (const field in adminFile) {
    //     const files = adminFile[field];
    //     for (const file of files) {
    //       const { path, fieldname } = file;
    //       urls.push({ [fieldname]: path });
    //     }
    //   };
    // };

    // console.log("urls", urls);
    const fieldsToUpdate = {
      schoolName: schoolName,
      schoolOwner: schoolOwner,
      schoolShortName: schoolShortName,
      schoolType: schoolType,
      schoolMotto: schoolMotto,
      schoolAddress: schoolAddress,
      country: uppercaseCountry,
      stateOrProvince: stateOrProvince,
      website: website,
      schoolLogo: schoolLogo,
      schoolContactEmail: schoolContactEmail,
      schoolContactPhone: schoolContactPhone,
      technicalContactEmail: technicalContactEmail,
      technicalContactPhone: technicalContactPhone,
      proprietorSignature: proprietorSignature,
    };

    const updatedInstitution = await Institution.findByIdAndUpdate(
      id,
      { $set: fieldsToUpdate },
      { new: true }
    );

    if (!updatedInstitution) {
      return res.status(404).json({
        success: false,
        message: "Institution not found",
      });
    }

    console.log(updatedInstitution);
    res.json({
      success: true,
      message: "Admin And Institution Updated Successfully",
      data: updatedInstitution,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Admin And Institution Update Failed",
    });
  }
};

export const postSchoolInfo = async (req, res) => {
  try {
    const newSchoolInfo = new schoolInfo({
      schoolUrl: req.body.schoolUrl,
      schoolId: req.body.schoolId,
    });

    await newSchoolInfo.save();
    res.status(200).json({
      success: true,
      message: "School Info Saved Successfully",
      data: newSchoolInfo,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Failed To Post School Info",
    });
  }
};

export const getSchoolInfo = async (req, res) => {
  try {
    const getSchoolInfo = await schoolInfo.findOne({
      schoolUrl: req.params.schoolUrl
    });

    if(!getSchoolInfo) {
      return res.status(404).json({
        success: false,
        message: "School Info Not Found"
      })
    }

    res.status(200).json({
      success: true,
      message: "School Info Found",
      data: getSchoolInfo,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Failed To Fetch School Info",
    });
  }
};

export const getInstitutionBySubRouteId = async (req, res) => {
  try {
    const institutionId = req.params.id;
    console.log("id", institutionId);
    const institution = await Institution.findById(institutionId);
    console.log("Found institutions", institution);
    if (!institution) {
      return res
        .status(404)
        .json({ success: false, message: "Institution Not Found" });
    }
    return res.status(200).json({
      success: true,
      institution: institution,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Failed To Fetch Institution Data",
    });
  }
};

export const getInstitutionBySubRoute = async (req, res) => {
  try {
    const subRoute = req.params.subRoute;
    // console.log("id", subRoute)
    const institution = await Institution.findOne({ schoolUrl: req.params.schoolUrl});
    // console.log("Found institutions", institution);
    if (!institution) {
      return res
        .status(404)
        .json({ success: false, message: "Institution Not Found" });
    }
    return res.status(200).json({
      success: true,
      institution: institution,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Failed To Fetch Institution Data",
    });
  }
};
