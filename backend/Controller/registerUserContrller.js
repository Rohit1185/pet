const PDFDocument = require('pdfkit');
const registerUserModel = require('../Model/registerUserModel');
const petListModel = require('../Model/petListModel')
const Adoption = require('../Model/adoptionreqModel');
const EvenetParticipation = require('../Model/eventPaticipationModel');
const eventModel = require('../Model/EventModel')
const Donation = require('../Model/donationModel');
const eventPaticipationModel = require('../Model/eventPaticipationModel');
const Feedback = require('../Model/feedbackModel');
const Report = require("../Model/Report");
const mongoose = require('mongoose');
const { v4: uuidv4 } = require("uuid"); // UUID for generating petId

exports.insertUser = async (data) =>{
    try{
        const user = new registerUserModel({
            userFname:data.userFname,
            userEmail:data.userEmail,
            userContact:data.userContact,
            password:data.password,
            isShelter:data.isShelter,
            shelterName:data.shelterName,
            status:"Enabled"
        });
        const savedUser = await user.save();
        return "User Saved SucessFully ",savedUser;
    }
    catch(e){
        console.log("Error While Save the data",e)
    }
}
exports.checkLogin = async (email, pass) => {
  try {
      console.log(email, pass);
      
      // Find the user by email
      const user = await registerUserModel.find({ userEmail: email });
      console.log(user[0].password);
      console.log(user[0].status);

      // Check if user exists
      if (!user) {
          return { success: false, message: "Username is incorrect", type: "invalid_credentials" };
      }
      else if (user[0].password !== pass) {
          return { success: false, message: "Password is incorrect", type: "invalid_credentials" };
      }
      else if (user[0].status === "Disabled") {
          return { success: false, message: "Your account is disabled by admin. Please contact support.", type: "account_disabled", status: 403 };
      }
      return { success: true, message: "Login successful", userdata: user };
  } catch (error) {
      console.error("Error in checkLogin:", error);
      return { success: false, message: "An error occurred during login", type: "server_error" };
  }
};


exports.updatePass = async (userId, newPassword) => {
    try {
      // Define the condition to find the user by ID
      let condition = { _id: userId };
  
      // Define the update operation with the new password
      let update = { $set: { password: newPassword } };
  
      // Update the user's password
      const result = await registerUserModel.updateOne(condition, update);
  
      // Check if the update was successful
      if (result.modifiedCount === 0) {
        throw new Error("Password update failed. User not found or no changes applied.");
      }
  
      return { success: true, message: "Password updated successfully." };
    } catch (error) {
      // Handle errors
      console.error("Error updating password:", error);
      return { success: false, message: error.message };
    }
  };
exports.updateDetails = async (u, imgPath) => {
    const condition = { _id: u.userId };
    const newdata = {
      userFname: u.userFname,
      userLname: u.userLname,
      userEmail: u.userEmail,
      userContact: u.userContact,
      shelterName: u.shelterName,
      shelterContact: u.shelterContact,
      shelterAddress: u.shelterAddress,
      shelterId:u.shelterId
    };
  
    if (imgPath) {
      newdata.userImg = imgPath;
    }
  
    try {
      await registerUserModel.updateOne(condition, { $set: newdata });
      console.log("Data of Controller",newdata,condition);
      const updatedUser = await registerUserModel.find(condition);
      console.log(updatedUser)
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, message: "Profile update failed" };
    }
  };
exports.addPet = async (req, res) => {
    try {
      const { userId,shelterId, petName, petBreed, petAge, petReason, behaviour, vaccines } = req.body;
      const petPhoto = req.file ? req.file.filename : null; // Get uploaded image filename
  
      // ✅ Validate required fields
      if (!userId || !petName || !petBreed || !petAge || !petReason || !behaviour) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }
  
      // ✅ Parse vaccines if provided
      const parsedVaccines = vaccines ? JSON.parse(vaccines) : [];
  
      // ✅ Generate a unique petId
      const petId = uuidv4();
  
      // ✅ Assign shelterId only if the user is a shelter
      // const shelterId = req.body.shelterId || null;
  
      // ✅ Create new pet entry
      const newPet = new petListModel({
        petId,
        userId,
        shelterId,
        petName,
        petBreed,
        petAge,
        petPhoto,
        petReason,
        behaviour,
        vaccines: parsedVaccines,
      });
  
      // ✅ Save to database
      await newPet.save();
  
      res.status(201).json({ success: true, message: "Pet Listed Successfully!", pet: newPet });
    } catch (error) {
      console.error("Error listing pet:", error);
      res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
  };
  
exports.getPet = async ()=>{

  let petData = await petListModel.find();
  console.log("Pet data on controller",petData);
  return petData;
}
exports.getPetById = async (req, res) => {
  try {
    const { petId } = req.params; // ✅ Extract petId correctly
    if (!petId) {
      return { error: "Pet ID is required" };
    }
    const pet = await petListModel.findOne({ petId }); // ✅ Fix query
    if (!pet) {
      return res.status(404).json({ error: "Pet not found" }); // ✅ Send error response properly
    }
    res.send(pet); // ✅ Return pet data
  } catch (error) {
    console.error("Error fetching pet by ID:", error);
    res.send({ error: "Server error while fetching pet details" }); // ✅ Ensure response is always sent
  }
};
exports.createAdoptionApplication = async (req, res) => {
  try {
      const { petId, userId } = req.body; // Destructure petId and userId from the request body

      // Ensure petId and userId are present in the request body
      if (!petId || !userId) {
          return res.status(400).json({ message: 'Pet ID and User ID are required.' });
      }

      // Log the values after destructuring
      console.log("Pet ID and User ID:", petId, userId);

      const adoptionData = { ...req.body, petId, userId };
      const newAdoption = new Adoption(adoptionData);

      await newAdoption.save();
      res.status(201).json({ message: 'Adoption Application Submitted Successfully!', adoption: newAdoption });
  } catch (error) {
      console.error('Error creating adoption application:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.insertEvent = async (req, res) => {
  console.log(req.body)
  try {
    const { eventname, place, date, time, maxlimit, category, shelterName, shelterContact,userId, shelterId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "Event image is required" });
    }

    const imgurl = req.file.filename; // Get filename from multer

    const event = new eventModel({
      eventname,
      place,
      date,
      time,
      maxlimit,
      category,
      imgpath: imgurl, // Save image filename
      shelterName,
      shelterContact,
      userId:String(userId),
      ShelterId:String(shelterId),
    });
    console.log(event)
    await event.save();
    const data = await eventModel.find();

    res.status(201).json({
      message: "event added",
      eventdata: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error adding event",
      error: err.message,
    });
  }
};
exports.getProfile = async (userId)=>{
  const condition = { _id: userId};
  let ProfileData = registerUserModel.findOne(condition)
  return ProfileData;
}
exports.getEvetns = async (req,res) =>{
  let Events = await eventModel.find();
  return Events;
}
exports.getEventById = async (req, res) => {
  try {
    const { shelterId } = req.params; // Extract shelterId from request params
    console.log("ID in Controller",shelterId)
    console.log("Request body of Event PArticiation",req.body)
    // If shelterId is missing, return 400 Bad Request
    if (!shelterId) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    // Ensure shelterId is cast to ObjectId if it's a string
    const eventDetails = await eventModel.findOne({ _id: shelterId });
    console.log(eventDetails)
    // If event is not found, return 404 Not Found
    if (!eventDetails) {
      return res.status(404).json({ error: "Event not found" });
    }

    // If event found, send it back in the response
    res.status(200).json(eventDetails);

  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res.status(500).json({ error: "Server error while fetching event details" });
  }
};
exports.getPetsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching pets for userId:", userId);

    // Fetch pets where userId matches
    const pets = await petListModel.find({ userId: userId });

    // If no pets are found for this user
    if (!pets || pets.length === 0) {
      return res.status(404).json({ success: false, pets: [] });  // Always return an array
    }

    res.status(200).json({ success: true, pets });  // Send pets as an array
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ success: false, pets: [] });
  }


};
exports.handleDonationRequest = async (req, res) => {
  try {
    const { mobile } = req.params;

    // Fetch all donations for this mobile number
    const donations = await Donation.find({ mobile });

    if (!donations.length) {
      return res.status(404).json({ message: "No donation record found for this mobile number." });
    }

    // If the request has 'download', generate PDF instead of JSON
    if (req.query.download) {
      console.log("Generating PDF receipt for:", mobile);

      const donation = donations[0]; // Assuming latest donation

      // Handle undefined values gracefully
      const shelterContact = donation.shelterContact ? donation.shelterContact : "Not Available";

      // Create PDF Document
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="receipt_${mobile}.pdf"`);

      doc.pipe(res);

      // PDF Header
      doc.fontSize(22).text("Donation Receipt", { align: "center" });
      doc.moveDown();

      // Donation Details
      doc.fontSize(16).text(`Donor Name: ${donation.name}`);
      doc.text(`Mobile Number: ${donation.mobile}`);
      doc.text(`Amount Donated: ₹${donation.amount}`);
      doc.text(`Shelter Name: ${donation.shelterName}`);
      doc.text(`Shelter Contact: ${shelterContact}`);
      doc.text(`Donation Date: ${new Date(donation.date).toLocaleDateString("en-GB")}`);

      // End and send PDF
      doc.end();
    } else {
      res.status(200).json(donations);
    }
  } catch (error) {
    console.error("Error processing donation request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.addDonation = async (req, res) => {
  try {
    console.log("Received Data:", req.body); // Debugging Line

    const {  mobile, name, email, shelterName, shelterContact, amount } = req.body;

    // Check for missing fields
    if ( !mobile || !name || !email || !shelterName || !shelterContact || !amount) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newDonation = new Donation({  mobile, name, email, shelterName, shelterContact, amount });
    console.log("Saving to DB:", newDonation);

    await newDonation.save();
    res.status(201).json({ message: "Donation added successfully!", donation: newDonation });
  } catch (error) {
    console.error("Error adding donation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.deletePet = async (req, res) => {
  try {
    const { petId } = req.params;
    const deletedPet = await petListModel.findByIdAndDelete(petId);

    if (!deletedPet) {
      return res.status(404).json({ message: "Pet not found." });
    }

    res.status(200).json({ message: "Pet deleted successfully!" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.participateInEvent = async (req, res) => {
  try {
    console.log("Participation Body",req.body)
      const { name, email, phone, eventId, userId,shelterId } = req.body;

      if (!name || !email || !phone || !eventId) {
          return res.status(400).json({ success: false, message: "All fields are required." });
      }

      const newParticipation = new EvenetParticipation({
          name,
          email,
          phone,
          eventId,
          userId,
          shelterId
      });

      await newParticipation.save();

      res.status(201).json({ success: true, message: "Participation recorded successfully." });
  } catch (error) {
      console.error("Error saving participation:", error);
      res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};
// Fetch events by shelterId
exports.getEventsByUserId = async (req, res) => {
  try {
      const { userId } = req.params;  // Extract userId from URL
      console.log("Fetching events for userId:", userId);

      const events = await eventModel.find({ userId: userId }); // Filter events by userId

      if (events.length === 0) {
          return res.status(404).json({ message: "No events found for this user." });
      }

      res.status(200).json(events);
  } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events.", error: error.message });
  }
};
exports.deleteEvent = async (req, res) => {
  try {
      const { id } = req.params;
      await eventModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event", error: error.message });
  }
};
// Fetch adoption requests for a specific shelter
exports.getAdoptionsByShelter = async (req, res) => {
    try {
        const { shelterId } = req.params;
        const adoptions = await Adoption.find({ shelterId });
        res.status(200).json(adoptions);
    } catch (error) {
        console.error("Error fetching adoption requests:", error);
        res.status(500).json({ message: "Failed to fetch adoption requests." });
    }
};

// Update adoption request status
exports.updateAdoptionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedAdoption = await Adoption.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedAdoption) {
            return res.status(404).json({ message: "Adoption request not found." });
        }

        res.status(200).json({ success: true, updatedAdoption });
    } catch (error) {
        console.error("Error updating adoption status:", error);
        res.status(500).json({ message: "Failed to update adoption status." });
    }
};

// Fetch participators for a specific event
exports.getEventParticipators = async (req, res) => {
    try {
        const { eventId } = req.params;
        const participators = await EvenetParticipation.find({ eventId });
        res.status(200).json(participators);
    } catch (error) {
        console.error("Error fetching participators:", error);
        res.status(500).json({ message: "Failed to fetch participators." });
    }
};


// Fetch dashboard statistics
exports.getShelterStats = async (req, res) => {
    try {
        const { shelterId } = req.params;

        const totalEvents = await eventModel.countDocuments({ shelterId });
        const totalParticipators = await EvenetParticipation.countDocuments({ shelterId });
        const totalAdoptions = await Adoption.countDocuments({ shelterId, status: "Accepted" });

        res.status(200).json({ totalEvents, totalParticipators, totalAdoptions });
    } catch (error) {
        console.error("Error fetching shelter stats:", error);
        res.status(500).json({ message: "Failed to fetch shelter stats." });
    }
};

// Fetch latest events
exports.getLatestEvents = async (req, res) => {
  try {
    const { shelterId } = req.params;
    console.log('Shelter id',shelterId)

      // Check both lowercase and uppercase field names
      const events = await eventModel.find({ShelterId:shelterId}).sort({ date: -1 }).limit(5);
    console.log("Total Event is",events);
      res.send(events )
  } catch (error) {
      console.error("Error fetching latest events:", error);
      res.status(500).json({ message: "Failed to fetch latest events." });
  }
};
// Fetch latest adoption requests
exports.getLatestAdoptions = async (req, res) => {
    try {
      console.log("Body of user",req.body)
        const { shelterId } = req.params;
        console.log("Fetching latest adoptions for Shelter ID:", shelterId);

        const adoptions = await Adoption.find({ shelterId })
            .sort({ createdAt: -1 })
            .limit(5);

        if (!adoptions.length) {
            return res.status(404).json({ message: "No adoption requests found." });
        }

        res.status(200).json({ success: true, adoptions });
    } catch (error) {
        console.error("Error fetching latest adoptions:", error);
        res.status(500).json({ message: "Failed to fetch latest adoptions." });
    }
};

exports.getAdoptionRequestsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("user id of controller",userId);
        console.log("Fetching adoptions for user:", userId); // Debugging Log

        const adoptions = await Adoption.find({ userId });
        console.log(adoptions)
        if (adoptions.length === 0) {
            console.log("No adoption requests found for this user.");
        }

        res.status(200).json(adoptions);
    } catch (error) {
        console.error("Error fetching adoption requests:", error);
        res.status(500).json({ message: "Failed to fetch adoption requests." });
    }
};


// ✅ Get All Users (Excluding Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await registerUserModel.find({ userEmail: { $ne: "admin@gmail.com" } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Total Users and Shelters Count
exports.getTotalUsersAndShelters = async (req, res) => {
  try {
    const totalUsers = await registerUserModel.countDocuments({ userEmail: { $ne: "admin@gmail.com" } });
    const totalShelters = await registerUserModel.countDocuments({ isShelter: "YES" });

    res.json({ totalUsers, totalShelters });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Total Events Count
exports.getTotalEvents = async (req, res) => {
  try {
    const totalEvents = await eventModel.countDocuments();
    res.json({ totalEvents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Total Donation Amount



// ✅ Get All Pets
exports.getAllPets = async (req, res) => {
  try {
    const pets = await petListModel.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Total Available Pets
exports.getTotalAvailablePets = async (req, res) => {
  try {
    const totalPets = await petListModel.countDocuments({ isAvailable: true });
    res.json({ totalPets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Adoption Requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Adoption.find().populate("userId petId");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// ✅ Get Total Pending Adoption Requests
exports.getPendingRequestsCount = async (req, res) => {
  try {
    const pendingRequests = await Adoption.countDocuments({ status: "Pending" });
    res.json({ pendingRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    
    const { userId } = req.params;
    console.log(userId)
    // Find and delete the user
    const deletedUser = await registerUserModel.findOneAndDelete({ userId });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User deleted successfully!", deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
// ✅ Update User Details
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await registerUserModel.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User updated successfully!", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// ✅ Update Pet Details
exports.updatePet = async (req, res) => {
  try {
    const { petId } = req.params;
    const updatedPet = await petListModel.findOneAndUpdate(
      { petId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedPet) {
      return res.status(404).json({ message: "Pet not found!" });
    }

    res.json({ message: "Pet updated successfully!", updatedPet });
  } catch (error) {
    res.status(500).json({ message: "Error updating pet", error: error.message });
  }
};

// ✅ Delete a Pet
exports.deletePet = async (req, res) => {
  try {
    const { petId } = req.params;
    const deletedPet = await petListModel.findOneAndDelete({ petId });

    if (!deletedPet) {
      return res.status(404).json({ message: "Pet not found!" });
    }

    res.json({ message: "Pet deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pet", error: error.message });
  }
};
// ✅ Update Adoption Request Status
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params; // Using ObjectId
    console.log(id)
    const updatedRequest = await Adoption.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedRequest) return res.status(404).json({ message: "Request not found!" });

    res.json({ message: "Request updated successfully!", updatedRequest });
  } catch (error) {
    res.status(500).json({ message: "Error updating request", error: error.message });
  }
};

// ✅ Delete Adoption Request
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params; // Using ObjectId
    const deletedRequest = await Adoption.findByIdAndDelete(id);

    if (!deletedRequest) return res.status(404).json({ message: "Request not found!" });

    res.json({ message: "Request deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting request", error: error.message });
  }
};


// ✅ Update Event Details
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Updating Event ID:", id);
    console.log("Received Data:", req.body);

    // Ensure event exists
    const eventExists = await eventModel.findById(id);
    if (!eventExists) return res.status(404).json({ message: "Event not found!" });

    // ✅ Update event in the database
    const updatedEvent = await eventModel.findByIdAndUpdate(id, { $set: req.body }, { new: true });

    res.json({ message: "Event updated successfully!", updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
};


// ✅ Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await eventModel.findByIdAndDelete(id);
    res.json({ message: "Event deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};


// ✅ Update Donation
exports.updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const updatedDonation = await Donation.findByIdAndUpdate(id, { $set: req.body }, { new: true });

    if (!updatedDonation) return res.status(404).json({ message: "Donation not found!" });

    res.json({ message: "Donation updated successfully!", updatedDonation });
  } catch (error) {
    res.status(500).json({ message: "Error updating donation", error: error.message });
  }
};

// ✅ Delete Donation
exports.deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    await Donation.findByIdAndDelete(id);
    res.json({ message: "Donation deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting donation", error: error.message });
  }
};
// ✅ Get Total Donations Given by a User
exports.getTotalDonationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const totalDonations = await Donation.countDocuments({ userID: userId }); // Match DB field `userID`
    res.json({ userId, totalDonations });
  } catch (error) {
    res.status(500).json({ message: "Error fetching total donations by user", error: error.message });
  }
};


// Function to get unique donors for a shelter
exports.getUniqueDonorsForShelter = async (req, res) => {
  try {
    const { shelterName } = req.params;

    // Aggregation to get unique donors
    const donors = await Donation.aggregate([
      { $match: { shelterName: shelterName } }, // Match shelter
      { $group: { _id: "$shelterName", uniqueDonors: { $addToSet: "$userID" } } }, // Collect unique userIDs
      { $project: { shelterName: "$_id", uniqueDonorCount: { $size: "$uniqueDonors" }, _id: 0 } } // Count unique userIDs
    ]);

    res.json(donors.length > 0 ? donors[0] : { shelterName, uniqueDonorCount: 0 });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unique donors", error: error.message });
  }
};

// ✅ Fetch events where the logged-in user has participated
exports.getUserEventParticipations = async (req, res) => {
  try {
      const { userId } = req.params;
      console.log("Fetching participations for userId:", userId);

      if (!userId) {
          return res.status(400).json({ success: false, message: "User ID is required." });
      }

      // ✅ Find all participations where userId matches
      const participations = await eventPaticipationModel.find({ userId });

      if (!participations.length) {
          return res.status(404).json({ success: false, message: "No participations found." });
      }

      // ✅ Extract all eventIds from participations
      const eventIds = participations.map(p => p.eventId);

      // ✅ Find all events where eventId matches
      const events = await eventModel.find({ _id: { $in: eventIds } });

      if (!events.length) {
          return res.status(404).json({ success: false, message: "No events found for this user." });
      }

      res.status(200).json({ success: true, events });
  } catch (error) {
      console.error("Error fetching user event participations:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// ✅ Search Pets Controller
exports.searchPets = async (req, res) => {
  try {
      const { petType, breed, location, age } = req.query;
      
      // 🔍 Create a filter object dynamically
      let filter = {};
      if (petType) filter.petBreed = { $regex: new RegExp(petType, "i") };
      if (breed) filter.petBreed = { $regex: new RegExp(breed, "i") };
      if (location) filter.shelterId = location; // Assuming location refers to a shelter ID
      if (age) filter.petAge = parseInt(age);

      // Fetch pets that match the filter
      const pets = await petListModel.find(filter);

      if (pets.length === 0) {
          return res.status(404).json({ success: false, message: "No pets found." });
      }

      res.status(200).json({ success: true, pets });
  } catch (error) {
      console.error("Error searching pets:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.submitFeedback = async (req, res) => {
  try {
    const { giverId, receiverId,giverRole, rating, message } = req.body;

    // Validate required fields
    if (!giverId || !receiverId || !giverRole || !rating || !message.trim()) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const newFeedback = new Feedback({
      giverId,
      receiverId,
      giverRole,
      rating,
      message,
    });

    await newFeedback.save();
    res.status(201).json({ success: true, message: "Feedback submitted successfully!" });

  } catch (error) {
    console.error("Error submitting feedback:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        success: false, 
        message: Object.values(error.errors).map(err => err.message).join(", ")
      });
    }

    // Handle MongoDB connection errors
    if (error.name === "MongoNetworkError") {
      return res.status(500).json({ success: false, message: "Database connection error. Please try again later." });
    }

    // Handle duplicate key errors (e.g., unique constraints)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate entry detected. Feedback already exists." });
    }

    // Generic server error
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
};

exports.submitReport = async (req, res) => {
    try {
        const { userId,userRole, reason, details } = req.body;

        if (!userId || !userRole || !reason || !details) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // ✅ Find the shelter ID based on the user's adoption request
        const adoption = await Adoption.findOne({ userId });

        if (!adoption) {
            return res.status(404).json({ success: false, message: "No shelter found for this user." });
        }

        const shelterId = adoption.shelterId; // ✅ Get Shelter ID

        // ✅ Save the report with default "Pending" status
        const newReport = new Report({
            userId,
            userRole,
            shelterId,
            reason,
            details,
            status: "Pending",
        });

        await newReport.save();

        res.status(201).json({ success: true, message: "Report submitted successfully!" });
    } catch (error) {
        console.error("Error submitting report:", error);
        res.status(500).json({ success: false, message: "Failed to submit report." });
    }
};

// ✅ Get Shelter Profile by ID
exports.getShelterProfile = async (req, res) => {
    try {
        const { shelterId } = req.params;
        console.log("Fetching Shelter Profile for ID:", shelterId);

        const shelter = await registerUserModel.find({shelterId});

        if (!shelter) {
            return res.status(404).json({ success: false, message: "Shelter not found." });
        }

        res.status(200).json({ success: true, shelter });
    } catch (error) {
        console.error("Error fetching shelter profile:", error);
        res.status(500).json({ success: false, message: "Failed to fetch shelter profile." });
    }
};



exports.getShelterFeedback = async (req, res) => {
    try {
        const { shelterId } = req.params;
        console.log(shelterId)
        if (!shelterId) {
            return res.status(400).json({ success: false, message: "Shelter ID is required." });
        }

        // ✅ Fetch all feedback for this shelter
        const feedbacks = await Feedback.find({ receiverId:shelterId });

        if (!feedbacks.length) {
            return res.status(404).json({ success: false, message: "No feedback found for this shelter." });
        }

        // ✅ Calculate average rating
        const totalRatings = feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
        const averageRating = (totalRatings / feedbacks.length).toFixed(1);

        res.status(200).json({ success: true, averageRating, feedbacks });
    } catch (error) {
        console.error("Error fetching shelter feedback:", error);
        res.status(500).json({ success: false, message: "Failed to fetch feedback." });
    }
};



// ✅ Submit Report (Find Shelter ID using User ID)
exports.resolveReport = async (req, res) => {
  try {
      const { reportId } = req.params;
      const { solution } = req.body;

      if (!solution) {
          return res.status(400).json({ success: false, message: "Solution is required." });
      }

      const report = await Report.findById(reportId);
      if (!report) {
          return res.status(404).json({ success: false, message: "Report not found." });
      }

      // ✅ Update report status and solution
      report.status = "Resolved";
      report.solution = solution;
      await report.save();

      res.status(200).json({ success: true, message: "Report resolved successfully!", report });
  } catch (error) {
      console.error("Error resolving report:", error);
      res.status(500).json({ success: false, message: "Failed to resolve report." });
  }
};


// controllers/shelterReportController.js
const ShelterReport = require("../Model/Report");

// 📌 Fetch reports for a specific shelter
exports.getShelterReports = async (req, res) => {
    try {
        const { shelterId } = req.params;
        console.log("Shelter id Into Controller",shelterId)
        const reports = await ShelterReport.find({ shelterId })
        console.log("Reports",reports)
        if (!reports.length) {
            return res.status(404).json({ success: false, message: "No reports found for this shelter." });
        }

        res.status(200).json({ success: true, reports });
    } catch (error) {
        console.error("Error fetching shelter reports:", error);
        res.status(500).json({ success: false, message: "Failed to fetch reports." });
    }
};



exports.getUserReports = async (req, res) => {
  try {
      const { userId } = req.params;

      if (!userId) {
          return res.status(400).json({ success: false, message: "User ID is required." });
      }

      // ✅ Fetch all reports made by this user
      const reports = await Report.find({ userId });

      if (!reports.length) {
          return res.status(404).json({ success: false, message: "No reports found for this user." });
      }

      res.status(200).json({ success: true, reports });
  } catch (error) {
      console.error("Error fetching user reports:", error);
      res.status(500).json({ success: false, message: "Failed to fetch reports." });
  }
};

const nodemailer = require('nodemailer');
const crypto = require('crypto');
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "petadoptionplatform.amd@gmail.com  ", // Replace with your email
    pass: "bbxd lsys jfsd uftd", // Use App Password, NOT your email password
  },
});

exports.sendResetCode = async (req, res) => {
  const { email } = req.body;
  console.log("Email is", email);

  try {
    // Check if user exists
    const user = await registerUserModel.findOne({ userEmail: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a 6-digit reset token using crypto
    const token = crypto.randomInt(100000, 999999).toString();
    console.log("Generated Token:", token);

    // Store the token and expiration time in the database
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Expires in 1 hour
    await user.save({validateBeforeSave: false });

    console.log("User Email:", user.userEmail);
    console.log("Token Saved:", user.resetPasswordToken);

    // Configure email options
    const mailOptions = {
      from: "petadoptionplatform.amd@gmail.com",
      to: user.userEmail,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${token}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email Error:", error);
        return res.status(500).json({ message: "Error sending email" });
      }
      res.status(200).json({ message: "Code sent to your email" });
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    console.log("Verifying Reset Code...");
    console.log("Email:", email);
    console.log("Received Code:", code);

    // Find user by email
    const user = await registerUserModel.findOne({ userEmail: email });

    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User Found:", user);

    // Ensure resetPasswordToken and resetPasswordExpires exist
    if (!user.resetPasswordToken || !user.resetPasswordExpires) {
      console.log("Reset token or expiration is missing.");
      return res.status(400).json({ message: "Reset token not found. Please request a new code." });
    }

    console.log("Stored Token:", user.resetPasswordToken);
    console.log("Stored Expiry Time:", new Date(user.resetPasswordExpires));
    console.log("Current Time:", new Date());

    // Validate reset code
    if (user.resetPasswordToken !== code) {
      console.log("Invalid reset code.");
      return res.status(400).json({ message: "Invalid reset code." });
    }

    // Check if the token has expired
    if (user.resetPasswordExpires < Date.now()) {
      console.log("Reset code has expired.");
      return res.status(400).json({ message: "Reset code has expired. Please request a new one." });
    }

    console.log("Code verified successfully.");
    return res.status(200).json({ message: "Code verified" });

  } catch (error) {
    console.error("Error verifying reset code:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.resetPassword = async (req, res) => {
  console.log("🔹 Reset Password Endpoint Hit!");
  console.log("🔹 Request Body:", req.body);

  const { email, code, newPassword } = req.body;
  console.log("🔹 Extracted Data:", email, code, newPassword);

  if (!email || !code || !newPassword) {
    console.log("❌ Missing fields in request body");
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    console.log("🔹 Searching user in database...");
    const user = await registerUserModel.findOne({
      userEmail: email,
      resetPasswordToken: code,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("❌ Invalid or expired reset code");
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    console.log("✅ User found. Updating password...");
    user.password = newPassword; // ❗ Hash this before saving in production
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({validateBeforeSave: false});

    console.log("✅ Password updated successfully");
    res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("❌ Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.viewApplicationByPetId = async (req, res) => {
    try {
        const { petId } = req.params;

        if (!petId) {
            return res.status(400).json({ success: false, message: "Pet ID is required." });
        }

        const applicationDetails = await Adoption.findOne({ petId });

        if (!applicationDetails) {
            return res.status(404).json({ success: false, message: "No application found for this Pet ID." });
        }

        res.status(200).json({ success: true, data: applicationDetails });
    } catch (error) {
        console.error("Error fetching application details:", error);
        res.status(500).json({ success: false, message: "Failed to fetch application details." });
    }
};


// Get feedback for multiple users and return their average ratings
exports.getUsersFeedback = async (req, res) => {
    try {
      console.log(req.params)
        const userIds = req.params.userIds?.split(","); // Get user IDs from query parameters

        if (!userIds || userIds.length === 0) {
            return res.status(400).json({ message: "No user IDs provided." });
        }

        // Fetch all feedback where userId is in the given userIds array
        const feedbacks = await Feedback.find({ userId: { $in: userIds } });
        console.log("Feedback of User",feedbacks)
        // Calculate average ratings per user
        const feedbackData = {};
        userIds.forEach((userId) => {
            const userFeedbacks = feedbacks.filter(fb => fb.userId.toString() === userId);
            if (userFeedbacks.length > 0) {
                const totalRatings = userFeedbacks.reduce((sum, fb) => sum + fb.rating, 0);
                feedbackData[userId] = (totalRatings / userFeedbacks.length).toFixed(1);
            }
        });

        res.json(feedbackData);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ message: "Failed to fetch feedbacks." });
    }
};
exports.getAdminFeedback = async (req, res) => {
  try {
    // Fetch all feedback records
    const feedbacks = await Feedback.find();

    // Extract unique giver & receiver IDs
    const userIds = [...new Set(feedbacks.map((f) => f.giverId.toString()))];
    const receiverIds = [...new Set(feedbacks.map((f) => f.receiverId.toString()))];

    // Fetch user & shelter details using giverId and receiverId
    const usersAndShelters = await registerUserModel.find({
      $or: [{ userId: { $in: [...userIds, ...receiverIds] } }, { shelterId: { $in: [...userIds, ...receiverIds] } }],
    });

    // Convert fetched data into an object for quick lookup
    const userMap = {};
    usersAndShelters.forEach((user) => {
      userMap[user.userId.toString()] = user;
      if (user.shelterId) {
        userMap[user.shelterId.toString()] = user; // For shelter lookup
      }
    });

    // Process feedbacks with full giver & receiver details
    const formattedFeedbacks = feedbacks.map((feedback) => {
      const giver = userMap[feedback.giverId.toString()];
      const receiver = userMap[feedback.receiverId.toString()];

      const giverDetails =
        giver && feedback.giverRole === "SHELTER"
          ? {
              id: giver.shelterId,
              name: giver.shelterName,
              email: giver.userEmail,
              contact: giver.shelterContact,
              address: giver.shelterAddress,
            }
          : giver
          ? {
              id: giver.userId,
              name: `${giver.userFname} ${giver.userLname}`,
              email: giver.userEmail,
              contact: giver.userContact,
            }
          : null;

      const receiverDetails =
        receiver && receiver.isShelter === "YES"
          ? {
              id: receiver.shelterId,
              name: receiver.shelterName,
              email: receiver.userEmail,
              contact: receiver.shelterContact,
              address: receiver.shelterAddress,
            }
          : receiver
          ? {
              id: receiver.userId,
              name: `${receiver.userFname} ${receiver.userLname}`,
              email: receiver.userEmail,
              contact: receiver.userContact,
            }
          : null;

      return {
        feedbackId: feedback._id,
        rating: feedback.rating,
        message:feedback.message,
        createdAt: feedback.createdAt,
        giverRole: feedback.giverRole,
        giver: giverDetails,
        receiver: receiverDetails,
      };
    });

    res.status(200).json({ feedbacks: formattedFeedbacks });
  } catch (error) {
    console.error("Error fetching admin feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getReports = async (req, res) => {
  try {
    const { search = "", status = "", page = 1, limit = 5 } = req.query;

    const query = {};
    if (search) query.title = { $regex: search, $options: "i" }; // Case-insensitive search
    if (status) query.status = status; // Filter by status

    const reports = await Report.find(query)
      .sort({ createdAt: -1 }) // Sort by latest first
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean(); // Convert Mongoose documents to plain objects for easier manipulation

    // Fetch user and shelter details for each report
    const userIds = reports.map((report) => report.userId).filter(Boolean);
    const shelterIds = reports.map((report) => report.shelterId).filter(Boolean);

    const users = await registerUserModel.find({ userId: { $in: userIds } }, "userFname userEmail userContact");
    const shelters = await registerUserModel.find({ shelterId: { $in: shelterIds } }, "shelterName");
    console.log(users)
    // Convert users and shelters into lookup objects for easy mapping
    const userMap = users.reduce((acc, user) => {
      acc[user.userId] = user;
      return acc;
    }, {});

    const shelterMap = shelters.reduce((acc, shelter) => {
      acc[shelter._id] = shelter;
      return acc;
    }, {});

    // Attach user and shelter details to reports
    const enrichedReports = reports.map((report) => ({
      ...report,
      reportedBy: userMap[report.userId] || null,
      shelterName: shelterMap[report.shelterId]?.name || "Unknown Shelter",
    }));
    console.log("Reports into Controllee",enrichedReports)
    const totalReports = await Report.countDocuments(query);

    res.status(200).json({
      users,
      shelters,
      reports: enrichedReports,
      totalPages: Math.ceil(totalReports / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getPetsByShelter = async (req, res) => {
  try {
    const { shelterId } = req.params;
    const pets = await petListModel.find({ shelterId });

    if (!pets || pets.length === 0) {
      return res.status(404).json({ message: "No pets found for this shelter", pets: [] });
    }

    const petList = pets.map(pet => ({
      name: pet.petName,
      type: pet.petBreed,
      age: pet.petAge,
    }));

    return res.status(200).json({ pets: petList, count: petList.length });
  } catch (error) {
    console.error("Error fetching pets:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// ✅ Fetch Events by Shelter (Counts & Details for UI & PDF)
exports.getEventsByShelter = async (req, res) => {
  try {
    const { shelterId } = req.params;
    
    // Fetch events from the database
    const events = await eventModel.find({ ShelterId:shelterId });
    console.log(events)
    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found for this shelter", events: [], count: 0 });
    }

    // Format event details for UI & PDF
    const eventList = events.map(event => ({
      name: event.eventname,
      date: event.date,
      location: event.place,
    }));

    return res.status(200).json({ events: eventList, count: eventList.length });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.getAdoptionRequestsByShelter = async (req, res) => {
  try {
    const { shelterId } = req.params;
    // Fetch all adoption requests for the given shelter
    const requests = await Adoption.find({ shelterId });

    // Prepare response
    const response = {
      totalRequests: requests.length,
      adoptionRequests: requests,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching adoption requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getUserAdoptionRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("User ID:", userId);

    // Fetch user details from RegisterUser model
    const user = await registerUserModel.findOne({ userId }, "userFname userLname userEmail");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Count total adoption requests by user
    const totalRequests = await Adoption.countDocuments({ userId });

    // Get all adoption request details for the user
    const adoptionRequests = await Adoption.find({ userId });

    if (!adoptionRequests.length) {
      return res.status(200).json({ totalRequests: 0, requests: [], userName: user.userFname, userEmail: user.userEmail });
    }

    // Extract unique shelterIds
    const shelterIds = [...new Set(adoptionRequests.map(req => req.shelterId))];

    // Fetch shelter details
    const shelters = await registerUserModel.find(
      { shelterId: { $in: shelterIds } },
      "shelterId shelterName"
    );

    // Map shelterId to shelterName
    const shelterMap = shelters.reduce((acc, shelter) => {
      acc[shelter.shelterId.toString()] = shelter.shelterName;
      return acc;
    }, {});

    // Format requests
    const formattedRequests = adoptionRequests.map(req => ({
      petId: req.petId,
      adopterName: req.name,
      email: req.email,
      mobile: req.number,
      requestDate: req.createdAt,
      status: req.status,
      shelterName: shelterMap[req.shelterId.toString()] || "Unknown Shelter",
    }));

    console.log("Formatted Requests:", formattedRequests);

    res.status(200).json({
      user,
      totalRequests,
      requests: formattedRequests,
      userName: `${user.userFname} ${user.userLname}`,
      userEmail: user.userEmail,
    });

  } catch (error) {
    console.error("Error fetching adoption requests:", error.message || error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getTotalEventParticipation = async (req, res) => {
  try {
      const { userId } = req.params;

      // Find all event participations for the user
      const participations = await EvenetParticipation.find({ userId });

      // Count total event participations
      const totalEvents = participations.length;

      // Fetch event details by eventId
      const eventDetails = await Promise.all(
          participations.map(async (participation) => {
              return await eventModel.findById(participation.eventId).select("eventname date place time maxlimit");
          })
      );
      console.log("Event Details ",eventDetails);
      return res.status(200).json({
          totalEvents,
          events: eventDetails,
      });

  } catch (error) {
      console.error("Error fetching event participation:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getUsersReport = async (req, res) => {
  try {
    const users = await registerUserModel.find({ isShelter: "NO" });

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};