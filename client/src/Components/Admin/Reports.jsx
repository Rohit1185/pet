import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";
export default function ManageReports() {
  const [selectedReport, setSelectedReport] = useState("user"); // Toggle option
  const [users, setUsers] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userReports, setUserReports] = useState({});
  const [shelterReports, setShelterReports] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [eventData,setEventData] = useState({})
  // eslint-disable-next-line no-unused-vars
  const [adoptionRequests, setAdoptionRequests] = useState({});


  useEffect(() => {
    fetchUsers();
    fetchShelters();
    fetchUserReport();
    fetchEventsByShelter();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Fetch Users & Their Donation Reports
  const fetchUsers = async () => {
    try {
        const response = await axios.get("http://localhost:8080/registerusers");
        const normalUsers = response.data.filter(user => user.isShelter === "NO");
        console.log("Normal Users:", normalUsers);
        setUsers(normalUsers);

        const reports = await Promise.all(
            normalUsers.map(async (user) => {
                const adoptionData = await getTotalAdoptionRequests(user.userId);
                const eventData = await getTotalEventParticipation(user.userId);

                return { 
                    userId: user.userId, 
                    userName: user.userFname ? `${user.userFname} ${user.userLname}` : "Unknown_User", // ✅ Ensure name is set
                    userEmail: user.userEmail || "No_Email", // ✅ Ensure email is set
                    ...adoptionData,
                    ...eventData,
                };
            })
        );

        const names = normalUsers.map(user => {
          console.log("Mapping User:", user);
          return {
              userId: user.userId,
              userName: user.userFname ? `${user.userFname} ${user.userLname}` : "Unknown_User",
              userEmail: user.userEmail || "No_Email",
          };
      });
        console.log("Generated name:", names); // ✅ Debugging log

        const reportsObj = reports.reduce((acc, report) => {
          const matchingUser = normalUsers.find(user => user.userId === report.userId); // ✅ Find matching user
          acc[report.userId] = {
              ...report,
              userName: matchingUser ? `${matchingUser.userFname} ${matchingUser.userLname}` : "Unknown_User",
              userEmail: matchingUser ? matchingUser.userEmail : "No_Email",
          };
          return acc;
      }, {});
      

        setUserReports(reportsObj);
        console.log("User Reports (After Setting):", reportsObj);

    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

const handleDownloadReport = (userId) => {
  const userData = userReports[userId];  // ✅ Get correct user data
  if (!userData) {
      console.error("User data not found for report.");
      return;
  }
  console.log("Final User Data for PDF:", userData);  // Debugging log
  downloadReportUser(userData);  // ✅ Pass complete user data
};
  const getTotalAdoptionRequests = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/user-adoptions/${userId}`)
      return {
        userName: response.data.userName, // ✅ Correct key name
        userEmail: response.data.userEmail,
        totalRequests: response.data.totalRequests,
        requests: response.data.requests,
      };
    } catch (error) {
      if (error.response) {
        console.error("Error fetching adoption requests:", {
          message: error.message,
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Request setup error:", error.message);
      }
  
      return { userName: "Unknown_User", userEmail: "No_Email", totalRequests: 0, requests: [] };
    }
  };
  
  const getTotalEventParticipation = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/user-events/${userId}`);
      console.log("Event Prticipation Data",response.data)
      console.log("Response of Event Participation", response.data);
  
      return {
        userName: response.data.userName,  // ✅ Fetch user name
        userEmail: response.data.userEmail, // ✅ Fetch user email
        totalEvents: response.data.totalEvents, // ✅ Total events participated
        events: response.data.events, // ✅ Event participation details
      };
    } catch (error) {
      if (error.response) {
        console.error("Error fetching event participation:", {
          message: error.message,
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Request setup error:", error.message);
      }
  
      return { userName: "Unknown_User", userEmail: "No_Email", totalEvents: 0, events: [] };
    }
  };

  const downloadReportUser = (userData) => {
    if (!userData || (!userData.requests && !userData.events)) {
      console.error("No data available to generate PDF.");
      return;
    }
    console.log(userData)
    const doc = new jsPDF();
  
    // ✅ Extract user details from userData
    const userName = userData.userName || "Unknown_User";
    const userEmail = userData.userEmail || "No_Email";
  
    // ✅ Add User Info at the top
    doc.setFontSize(14);
    doc.text("User Activity Report", 14, 15);
    doc.setFontSize(12);
    doc.text(`User Name: ${userName}`, 14, 25);
    doc.text(`User Email: ${userEmail}`, 14, 32);
  
    let startY = 40; // Initial Y position for tables
    

    // ✅ Adoption Requests Section
    if (userData.requests && userData.requests.length > 0) {
      doc.text("Adoption Requests", 14, startY);
      startY += 6;
  
      const adoptionColumns = ["Adopter Name", "Email", "Mobile No", "Request Date", "Status", "Shelter Name"];
      const adoptionRows = userData.requests.map(request => ([
        request.adopterName,
        request.email,
        request.mobile,
        moment(request.requestDate).format("DD-MM-YYYY"),
        request.status,
        request.shelterName
      ]));
  
      autoTable(doc, { head: [adoptionColumns], body: adoptionRows, startY });
      startY = doc.lastAutoTable.finalY + 10;
      doc.text(`Total Adoption Requests: ${userData.totalRequests}`, 14, startY);
      startY += 10;
    }
  
    // ✅ Event Participation Section
    if (userData.events && userData.events.length > 0) {
      doc.text("Event Participation", 14, startY);
      startY += 6;
  
      const eventColumns = ["Event Name", "Event Date", "Event Place","Max Limit","Time"];
      const eventRows = userData.events.map(event => ([
        event.eventname,
        moment(event.date).format("DD-MM-YYYY"),
        event.place,
        event.maxlimit,
        event.time
      ]));

      autoTable(doc, { head: [eventColumns], body: eventRows, startY });
      startY = doc.lastAutoTable.finalY + 10;
      doc.text(`Total Events Participated: ${userData.totalEvents}`, 14, startY);
    }
  
    // ✅ Save PDF using User's Name
    const sanitizedFileName = userName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${sanitizedFileName}_Report.pdf`;
  
    doc.save(fileName);
  };


  const downloadUserReportUser = () => {
    const doc = new jsPDF();
  
    // Add a title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("User Report", 105, 20, { align: "center" });
  
    // Subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Users: ${totalUsers}`, 105, 30, { align: "center" });
  
    // Line separator
    doc.setLineWidth(0.5);
    doc.line(15, 35, 195, 35);
  
    // Define table columns and rows
    const tableColumn = ["#", "Name", "Email", "Contact","Registration Date"];
    const tableRows = users.map((user, index) => [
      index + 1,
      user.userFname,
      user.userEmail,
      user.userContact,
      moment(user.createdAt).format('DD-MM-YYYY')
    ]);
  
    // Apply autoTable
    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 4,
        textColor: [44, 62, 80], // Dark grayish blue
      },
      headStyles: {
        fillColor: [52, 152, 219], // Light Blue Header
        textColor: [255, 255, 255], // White Text
        fontSize: 11,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light Gray
      },
    });
  
    // Add footer with page number
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, {
        align: "center",
      });
    }
  
    // Save PDF
    doc.save("User_Report.pdf");
  };
  // ✅ Fetch Shelters & Their Reports
  const fetchShelters = async () => {
    try {
      const response = await axios.get("http://localhost:8080/registerusers");
      const shelterUsers = response.data.filter(user => user.isShelter === "YES");
      
      setShelters(shelterUsers);
  
      const reports = await Promise.all(
        shelterUsers.map(async (shelter) => {
          
          const uniqueDonors = await fetchUniqueDonors(shelter.shelterName);
          const { petCount, petNames } = await fetchPetsByShelter(shelter.shelterId);
          const { eventCount, eventList } = await fetchEventsByShelter(shelter.shelterId);
          const { totalRequests, adoptionRequests } = await fetchAdoptionRequests(shelter.shelterId); // ✅ Fetch Adoption Requests
  
          return { 
            shelterId: shelter.shelterId, 
            shelterName:shelter.shelterName,
            shelterEmail:shelter.shelterEmail,
            uniqueDonors, 
            petCount, 
            petNames, 
            eventCount, 
            eventList, 
            totalRequests, 
            adoptionRequests // ✅ Added Adoption Request Data
          };
        })
      );
  
      const reportsObj = reports.reduce((acc, report) => {
        acc[report.shelterId] = report;
        return acc;
      }, {});
  
      setShelterReports(reportsObj);
    } catch (error) {
      console.error("Error fetching shelters:", error);
    }
  };
  const fetchShelterById = async (shelterId) => {
    try {
      const response = await axios.get("http://localhost:8080/registerusers");
      const shelter = response.data.find(user => user.isShelter === "YES" && user.shelterId === shelterId);
      
      if (shelter) {
        return { shelterName: shelter.shelterName, userEmail: shelter.userEmail }; 
      } else {
        return { shelterName: "Unknown", userEmail: "Unknown" };
      }
    } catch (error) {
      console.error("Error fetching shelter details:", error);
      return { shelterName: "Unknown", userEmail: "Unknown" };
    }
  };

  const fetchUserReport = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user-report");
      console.log("Total user Report",response.data.users);
      setUsers(response.data.users);
      setTotalUsers(response.data.totalUsers);
    } catch (error) {
      console.error("Error fetching user report:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // ✅ Fetch Total Pets & Their Names for Each Shelter
  const fetchPetsByShelter = async (shelterId) => {
    try {
        const response = await axios.get(`http://localhost:8080/shelter-pets/${shelterId}`);
  

        const petList = response.data.pets.map((pet) => ({
            name: pet.name,
            type: pet.type,
            age: pet.age
        }));

        console.log(petList);

        return {
            petCount: petList.length,
            petNames: petList // ✅ Store as an array instead of a string
        };
    } catch (error) {
        console.error("Error fetching pets:", error);
        return { petCount: 0, petNames: [] }; // ✅ Return an empty array if error
    }
};
const fetchAdoptionRequests = async (shelterId) => {
  try {
    const response = await axios.get(`http://localhost:8080/adoption-requests/${shelterId}`);


    return {
      totalRequests: response.data.totalRequests, // ✅ Match expected key
      adoptionRequests: response.data.adoptionRequests, // ✅ Match expected key
    };
  } catch (error) {
    console.error("Error fetching adoption requests:", error);
    return { totalRequests: 0, adoptionRequests: [] };
  }
};

  // ✅ Fetch Unique Donors for Each Shelter
  const fetchUniqueDonors = async (shelterName) => {
    try {
      const response = await axios.get(`http://localhost:8080/shelter-unique-donors/${shelterName}`);
      return response.data.uniqueDonorCount || 0;
    } catch (error) {
      console.error("Error fetching donor count:", error);
      return 0;
    }
  };
  const fetchEventsByShelter = async (shelterId) => {
    try {
      const response = await axios.get(`http://localhost:8080/shelter-events/${shelterId}`);
      return {
        eventCount: response.data.count || 0,
        eventList: response.data.events || []
      };
    } catch (error) {
      console.error("Error fetching events:", error);
      return { eventCount: 0, eventList: [] };
    }
  };

// Display in UI
<td>{eventData.count ?? "Loading..."}</td>

const downloadReport = async (type, data) => {
  const pdf = new jsPDF();
  pdf.setFontSize(20);
  pdf.text(`${type} Report`, 80, 20);
  pdf.setFontSize(14);

  let yPosition = 30;

  // ✅ Fetch Shelter Details using shelterId
  const { shelterName, userEmail } = await fetchShelterById(data.shelterId);
  console.log("Name is",shelterName,"Email is", userEmail)
  // ✅ Print Shelter Name & Email in the PDF
  pdf.text(`Shelter Name: ${shelterName}`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Shelter Email: ${userEmail}`, 20, yPosition);
  yPosition += 15;

const details = Object.entries(data)
  .filter(([key]) => !["pets", "petNames", "eventDetails", "adoptionRequests", "shelterId", "eventList", "totalDonationsReceived"].includes(key))
  .map(([key, value]) => [
    key === "shelterEmail" ? "userEmail" : key.replace(/([A-Z])/g, " $1"), 
    key === "shelterEmail" ? userEmail : value  // ✅ Ensure correct value
  ]);

console.log(details);

  if (details.length > 0) {
    autoTable(pdf, {
      startY: yPosition,
      head: [["Field", "Value"]],
      body: details,
    });
    yPosition = pdf.lastAutoTable.finalY + 10;
  }

  // ✅ Print Pets List in a Table
  if (type === "Shelter" && Array.isArray(data.petNames) && data.petNames.length > 0) {
    pdf.text("Pets List:", 14, yPosition);
    autoTable(pdf, {
      startY: yPosition + 5,
      head: [["#", "Name", "Type", "Age"]],
      body: data.petNames.map((pet, index) => [index + 1, pet.name, pet.type, pet.age]),
    });
    yPosition = pdf.lastAutoTable.finalY + 10;
  }

  // ✅ Print Events List in a Table
  if (type === "Shelter" && Array.isArray(data.eventList) && data.eventList.length > 0) {
    autoTable(pdf, {
      startY: yPosition + 5,
      head: [["#", "Name", "Date", "Location"]],
      body: data.eventList.map((event, index) => [
        index + 1,
        event.name,
        moment(event.date).format("DD-MM-YYYY"),
        event.location,
      ]),
    });
    yPosition = pdf.lastAutoTable.finalY + 10;
  }

  // ✅ Print Adoption Requests in a Table
  const requests = data.adoptionRequests || [];
  pdf.text("Adoption Requests:", 14, yPosition);

  if (requests.length > 0) {
    autoTable(pdf, {
      startY: yPosition + 5,
      head: [["#", "Adopter Name", "Address", "Email", "Status"]],
      body: requests.map((req, index) => [index + 1, req.name, req.address, req.email, req.status]),
    });
    yPosition = pdf.lastAutoTable.finalY + 10;
  } else {
    pdf.text("No Adoption Requests Found", 20, yPosition + 10);
    yPosition += 20;
  }

  // ✅ Footer
  pdf.setFontSize(12);
  pdf.text("Generated by Admin Panel", 20, yPosition + 20);

  // ✅ Save PDF with dynamic filename based on shelter name
  pdf.save(`${shelterName.replace(/\s+/g, "_")}_Report.pdf`);
};

  return (
    <div id="manage-section">
      <h2 id="manage-title">📊 Manage Reports</h2>

      {/* Toggle Reports */}
      <div className="report-toggle">
        <button className={selectedReport === "user" ? "active-tab" : ""} onClick={() => setSelectedReport("user")}>
          User Reports
        </button>
        <button className={selectedReport === "shelter" ? "active-tab" : ""} onClick={() => setSelectedReport("shelter")}>
          Shelter Reports
        </button>
      </div>

      {/* User Reports */}
      {selectedReport === "user" && (
        <>
       <table id="admin-table">
       <thead>
         <tr>
           <th>Name</th>
           <th>Email</th>
           <th>Total Adoption Requests</th>
           <th>Total Event Participation</th> {/* ✅ New Column */}
           <th>Actions</th>
         </tr>
       </thead>
       <tbody>
         {users.map((user) => (
           <tr key={user.userId}>
             <td>{user.userFname} {user.userLname}</td>
             <td>{user.userEmail}</td>
             <td>{userReports[user.userId]?.totalRequests ?? "Loading..."}</td>
             <td>{userReports[user.userId]?.totalEvents ?? "Loading..."}</td> {/* ✅ New Data */}
             <td>
               <button 
                 id="download-btn" 
                 onClick={() => handleDownloadReport(user.userId)}
               >
                 Download PDF
               </button>
             </td>
           </tr>
         ))}
       </tbody>
     </table>     
     <h3>Total Users: {totalUsers}</h3>
     <button onClick={downloadUserReportUser} disabled={loading}>
        Download User Report
      </button>
     </>
      )}

      {/* Shelter Reports */}
      {selectedReport === "shelter" && (
        <table id="admin-table">
          <thead>
            <tr>
              <th>Shelter Name</th>
              <th>Email</th>
              <th>Total Donors</th>
              <th>Total Pets</th>
              <th>Total Events</th>
              <th>Adoptio Request</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shelters.map(shelter => (
              <tr key={shelter.shelterId}>
                <td>{shelter.shelterName}</td>
                <td>{shelter.userEmail}</td>
                <td>{shelterReports[shelter.shelterId]?.uniqueDonors ?? "Loading..."}</td>
                <td>{shelterReports[shelter.shelterId]?.petCount ?? "Loading..."}</td>
                <td>{shelterReports[shelter.shelterId]?.eventCount ?? "Loading..."}</td>
                <td>{shelterReports[shelter.shelterId]?.totalRequests ?? "Loading"}</td>
                <td>
                  <button id="download-btn" onClick={() => downloadReport("Shelter", shelterReports[shelter.shelterId])}>
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
