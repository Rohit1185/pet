// import "../../assets/ManageEvents.css";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search Query
  const [currentPage, setCurrentPage] = useState(1); // ✅ Pagination
  const eventsPerPage = 5; // ✅ Show 5 events per page

  const [editingEventId, setEditingEventId] = useState(null);
  const [editableEvent, setEditableEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/shelter-add-events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        alert("Failed to fetch events.");
      }
    };

    fetchEvents();
  }, []);

  // ✅ Delete Event
  const deleteEvent = async (_id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:8080/shelter-add-events/${_id}`);
        setEvents(events.filter(event => event._id !== _id));
        alert("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event.");
      }
    }
  };

  // ✅ Enable Editing Mode
  const startEditing = (event) => {
    setEditingEventId(event._id);
    setEditableEvent({ ...event });
  };

  // ✅ Handle Input Changes (Updated to use eventname instead of eventName)
  const handleChange = (e, field) => {
    setEditableEvent({ ...editableEvent, [field]: e.target.value });
  };

  // ✅ Save Updated Event
  const saveEvent = async () => {
    try {
      await axios.put(`http://localhost:8080/shelter-add-events/${editableEvent._id}`, editableEvent);
      setEvents(events.map(event => (event._id === editableEvent._id ? editableEvent : event)));
      alert("Event updated successfully!");
      setEditingEventId(null);
      setEditableEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };

  // ✅ Filter & Search Events
  const filteredEvents = events.filter(event =>
    event.eventname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination Logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  return (
    <div id="manage-section">
      <div className="manage-header">
        <h2 id="manage-title">📅 Manage Events</h2>
        <input
          type="text"
          placeholder="Search Events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <table id="admin-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Location</th>
            <th>Category</th>
            <th>Organizer</th>
            <th>Contact</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map(event => (
            <tr key={event._id}>
              <td>
                {editingEventId === event._id ? (
                  <input type="text" value={editableEvent.eventname} onChange={(e) => handleChange(e, "eventname")} />
                ) : (
                  event.eventname
                )}
              </td>
              <td>{event.place}</td>
              <td>{event.category}</td>
              <td>{event.shelterName}</td>
              <td>{event.shelterContact}</td>
              <td>{moment(event.eventDate).format("DD-MM-YYYY")}</td>
              <td>
                {editingEventId === event._id ? (
                  <>
                    <button id="save-btn" onClick={saveEvent}>Save</button>
                    <button id="cancel-btn" onClick={() => setEditingEventId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button id="update-btn" onClick={() => startEditing(event)}>Update</button>
                    <button id="delete-btn" onClick={() => deleteEvent(event._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Pagination Buttons */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} className={currentPage === i + 1 ? "active-page" : ""} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
}
