import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;
  const [editingEventId, setEditingEventId] = useState(null);
  const [editableEvent, setEditableEvent] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/shelter-add-events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to fetch events.");
      }
    };
    fetchEvents();
  }, []);

  // Delete Event
  const deleteEvent = async (_id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:8080/shelter-add-events/${_id}`);
        setEvents(events.filter(event => event._id !== _id));
        toast.success("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Failed to delete event.");
      }
    }
  };

  // Enable Editing Mode
  const startEditing = (event) => {
    setEditingEventId(event._id);
    setEditableEvent({ ...event });
    setErrors({});
  };

  // Handle Input Changes
  const handleChange = (e, field) => {
    setEditableEvent({ ...editableEvent, [field]: e.target.value });
  };

  // Validation Function
  const validateForm = () => {
    const newErrors = {};

    if (!editableEvent.eventname.trim()) newErrors.eventname = "Event name is required.";
    if (!editableEvent.place.trim()) newErrors.place = "Location is required.";
    if (!editableEvent.category.trim()) newErrors.category = "Category is required.";
    if (!editableEvent.shelterName.trim()) newErrors.shelterName = "Organizer is required.";
    if (!/^\d{10}$/.test(editableEvent.shelterContact)) newErrors.shelterContact = "Contact must be 10 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save Updated Event
  const saveEvent = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors before saving.");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/shelter-add-events/${editableEvent._id}`, editableEvent);
      setEvents(events.map(event => (event._id === editableEvent._id ? editableEvent : event)));
      toast.success("Event updated successfully!");
      setEditingEventId(null);
      setEditableEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event.");
    }
  };

  // Filter & Search Events
  const filteredEvents = events.filter(event =>
    event.eventname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
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
                  <>
                    <input
                      type="text"
                      value={editableEvent.eventname}
                      onChange={(e) => handleChange(e, "eventname")}
                    />
                    {errors.eventname && <p className="error">{errors.eventname}</p>}
                  </>
                ) : (
                  event.eventname
                )}
              </td>
              <td>
                {editingEventId === event._id ? (
                  <>
                    <input
                      type="text"
                      value={editableEvent.place}
                      onChange={(e) => handleChange(e, "place")}
                    />
                    {errors.place && <p className="error">{errors.place}</p>}
                  </>
                ) : (
                  event.place
                )}
              </td>
              <td>
                {editingEventId === event._id ? (
                  <>
                    <input
                      type="text"
                      value={editableEvent.category}
                      onChange={(e) => handleChange(e, "category")}
                    />
                    {errors.category && <p className="error">{errors.category}</p>}
                  </>
                ) : (
                  event.category
                )}
              </td>
              <td>
                {editingEventId === event._id ? (
                  <>
                    <input
                      type="text"
                      value={editableEvent.shelterName}
                      onChange={(e) => handleChange(e, "shelterName")}
                    />
                    {errors.shelterName && <p className="error">{errors.shelterName}</p>}
                  </>
                ) : (
                  event.shelterName
                )}
              </td>
              <td>
                {editingEventId === event._id ? (
                  <>
                    <input
                      type="text"
                      value={editableEvent.shelterContact}
                      onChange={(e) => handleChange(e, "shelterContact")}
                    />
                    {errors.shelterContact && <p className="error">{errors.shelterContact}</p>}
                  </>
                ) : (
                  event.shelterContact
                )}
              </td>
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

      {/* Pagination Buttons */}
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
