const express = require('express')
const router = express.Router();
const registerUserController = require("../Controller/registerUserContrller");
const adoptionReqModel = require('../Model/adoptionreqModel')
const upload = require('../formulter');
const registerUsers = require('../Model/registerUserModel')

//POST METHOD
router.post("/register",async(req,res)=>{
    const data = req.body;
    const result =await registerUserController.insertUser(data);

    if(result)
    {
        res.send("User Inserted Sucessfully")
    }
    else{ 
        res.send("User Not Inserted");
    }
})
router.post("/login", async (req, res) => {
  try {
      const { email, pass } = req.body;
      const result = await registerUserController.checkLogin(email, pass);

      if (!result.success) {
          return res.json(result); 
      }

      res.json(result);
  } catch (error) {
      console.error("Error in /login route:", error);
      res.status(500).json({ success: false, message: "An unexpected error occurred", type: "server_error" });
  }
});


router.post("/shelter-list-page", upload.single("petPhoto"), async (req, res) => {
  try {
    console.log("Pet Details:", req.body);
    console.log("Uploaded Pet Photo:", req.file ? req.file.filename : "No file uploaded");

    const imgPath = req.file ? req.file.filename : null;
    
    const result = await registerUserController.addPet(req, res); // Directly calling the controller

    
  } catch (error) {
    console.error("Error in /shelter-list-page:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
});
router.post('/submit-adoption-form', registerUserController.createAdoptionApplication);
router.post('/shelter-add-events', upload.single('img'),registerUserController.insertEvent);
router.post("/add-donation", registerUserController.addDonation);
router.post('/participate', registerUserController.participateInEvent);
// router.get("/feedback/:receiverId", feedbackController.getFeedbackByReceiver);
router.post("/submit-feedback", registerUserController.submitFeedback);
router.post("/report-shelter", registerUserController.submitReport);

//PUT METHOD
router.put("/update-pass", async (req, res) => {
  const { userId, newPassword } = req.body;
  console.log("Data in Router ",req.body);
  
    if (!userId || !newPassword) {
      return res.status(400).json({ success: false, message: "User ID and new password are required." });
    }
    
    const response =await registerUserController.updatePass(userId,newPassword);
    console.log(response)
    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(500).json(response);
    }
  });
  router.put("/update-profile", upload.single("userImg"), async (req, res) => {
    console.log('Data of router',req.file)
    const imgPath = req.file ? req.file.filename : null;
    let m = await registerUserController.updateDetails(req.body, imgPath);
    res.send(m);  
  });

// Route to update adoption status
router.put("/submit-adoption-application/:id", registerUserController.updateAdoptionStatus);
router.put('/registerusers/:userId',registerUserController.updateUser)
router.put('/shelter-list-page/:petId',registerUserController.updatePet)
router.put('/submit-adoption-application/:id',registerUserController.updateRequest)
router.put("/shelter-add-events/:id", registerUserController.updateEvent);
router.put("/resolve-report/:reportId",registerUserController.resolveReport);


router.get("/report-shelter/:shelterId", registerUserController.getShelterReports);

// 📌 Resolve a report
//GET METHOD
router.get("/shelter-list-page", async (req, res) => {
  try {
    // Fetch all pets
    let petData = await registerUserController.getPet();
    const petIds = petData.map((pet) => pet.petId);
    const shelterIds = [...new Set(petData.map((pet) => pet.shelterId))]; // Unique shelter IDs

    // Fetch all adoption requests related to these pets
    const adoptionRequests = await adoptionReqModel
      .find({ petId: { $in: petIds } })
      .sort({ createdAt: -1 }); // Sort by latest request

    // Fetch shelter details using the correct field: shelterId
    const shelters = await registerUsers.find(
      { shelterId: { $in: shelterIds } }, // Use shelterId instead of userId
      "shelterId shelterName"
    );

    console.log("Shelter Data:", shelters);

    // Create a map of shelterId -> shelterName
    const shelterMap = {};
    shelters.forEach((shelter) => {
      shelterMap[shelter.shelterId] = shelter.shelterName; // Use correct key
    });

    // Map to store the latest adoption status for each pet
    const petStatusMap = {};
    adoptionRequests.forEach((adoption) => {
      if (!petStatusMap[adoption.petId]) {
        petStatusMap[adoption.petId] = adoption.status; // Store latest status
      }
    });

    // Attach adoption status and replace shelterId with shelterName
    const petsWithStatus = petData.map((pet) => ({
      ...pet.toObject(), // Convert Mongoose document to plain object
      adoptionStatus: petStatusMap[pet.petId] || "Available", // Default to Available
      shelterName: shelterMap[pet.shelterId] || "Unknown Shelter", // Replace shelterId with name
    }));

    res.send(petsWithStatus); // Send pets with their status and shelter name
  } catch (error) {
    console.error("Error fetching shelter pets:", error);
    res.status(500).send({ message: "Server error" });
  }
});




router.get('/shelter-list-page/:petId',registerUserController.getPetById)
router.get("/my-reports/:userId", registerUserController.getUserReports);

router.get('/register',async(req,res)=>{
  const userId = req.query.userId;
  
  if(!userId){
    res.send("UserId not Found");
  }
  let ProfileData = await registerUserController.getProfile();
  if(!ProfileData){
    res.send("User Not Found")
  }
  res.send(ProfileData)
});
router.get('/registerusers/:shelterId',registerUserController.getShelterProfile);  
router.get('/shelter-add-events',async(req,res)=>{
  let EventData = await registerUserController.getEvetns();
  res.send(EventData);
})
router.get('/vieweventdetails/:shelterId', registerUserController.getEventById);
router.get('/my-pets/:userId', registerUserController.getPetsByUserId);
router.get('/add-donation/:mobile', registerUserController.handleDonationRequest);
router.get("/events-by-user/:userId", registerUserController.getEventsByUserId);
router.get("/view-application/:petId", registerUserController.viewApplicationByPetId);
router.get("/feedback", registerUserController.getAdminFeedback);
router.get("/reports", registerUserController.getReports); // Get all reports with search, filter & pagination
router.get("/shelter-pets/:shelterId", registerUserController.getPetsByShelter);
router.get("/shelter-events/:shelterId", registerUserController.getEventsByShelter);
router.get("/adoption-requests/:shelterId", registerUserController.getAdoptionRequestsByShelter);
router.get("/user-adoptions/:userId", registerUserController.getUserAdoptionRequests);
router.get('/user-events/:userId',registerUserController.getTotalEventParticipation)
//problem in this routes
router.get("/submit-adoption-application/:shelterId", registerUserController.getAdoptionsByShelter);
router.get("/submit-adoption-form/:userId", registerUserController.getAdoptionRequestsByUser);
router.get("/event-participators/:eventId", registerUserController.getEventParticipators);

router.get("/shelter-add-events/:shelterId", registerUserController.getLatestEvents);
router.get("/latest-adoption/:shelterId", registerUserController.getLatestAdoptions); // ✅ Pass shelterId as a route param

router.get('/submit-adoption-form',registerUserController.getAllRequests)
router.get("/submit-feedback/:shelterId", registerUserController.getShelterFeedback);
router.get("/feedbacks/:userIds", registerUserController.getUsersFeedback);

// ✅ Get feedback for a specific user (Admin can only view)
//admin methods 

router.get('/registerusers',registerUserController.getAllUsers)
router.get('/shelter-add-events',registerUserController.getAllEvents);
router.get("/add-donation", registerUserController.getAllDonations);
router.get('/shelter-list-page',registerUserController.getAllPets)
router.get("/myeventparticipations/:userId", registerUserController.getUserEventParticipations);
router.get("/user-report", registerUserController.getUsersReport);


// DELETE METHOD
router.delete("/delete-pet/:petId", registerUserController.deletePet);
router.delete("/delete-event/:id", registerUserController.deleteEvent);
router.delete('/registerusers/:userId',registerUserController.deleteUser);
router.delete('/shelter-list-page/:petId',registerUserController.deletePet)
router.delete('/submit-adoption-form/:id',registerUserController.deleteRequest);
router.delete("/shelter-add-events/:id", registerUserController.deleteEvent);
router.put("/add-donation/:id", registerUserController.updateDonation);
router.delete("/add-donation/:id", registerUserController.deleteDonation);
router.get("/search-pets", registerUserController.searchPets);
router.get("/user-donations/:userId", registerUserController.getTotalDonationsByUser);
router.get("/shelter-unique-donors/:shelterName", registerUserController.getUniqueDonorsForShelter);
router.post('/forgot-password', registerUserController.sendResetCode);
router.post('/verify-code', registerUserController.verifyResetCode);
router.post('/reset-password', registerUserController.resetPassword);

module.exports = router;