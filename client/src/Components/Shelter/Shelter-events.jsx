import axios from 'axios';
import { useState, useRef } from 'react';
import { Categories } from '../Categories';
import { useContext } from 'react';
import userProfile from '../../Context/userProfile';
import '../../assets/AddEvent.css';

export default function AddEvent() {

  let user = useContext(userProfile);
  const [errors, setErrors] = useState({});
  const eventnameref = useRef();
  const placeref = useRef();
  const dateref = useRef();
  const timeref = useRef();
  const maxlimitref = useRef();
  const categoryref = useRef();
  const imgref = useRef();

  const userId = user.userdetails.userId;
  const shelterId = user.userdetails.shelterId;
  const shelterName = user.userdetails.shelterName;
  const shelterContact = user.userdetails.shelterContact;
  const validateForm = () => {
    let newErrors = {};
    const today = new Date().toISOString().split('T')[0];

    if (!eventnameref.current.value.trim()) newErrors.eventname = 'Event name is required';
    if (!placeref.current.value.trim()) newErrors.place = 'Place is required';
    if (!dateref.current.value) newErrors.date = 'Date is required';
    else if (dateref.current.value < today) newErrors.date = 'Date must be in the future';
    if (!timeref.current.value) newErrors.time = 'Time is required';
    if (!maxlimitref.current.value || isNaN(maxlimitref.current.value)) newErrors.maxlimit = 'Enter a valid number';
    if (!categoryref.current.value) newErrors.category = 'Category is required';
    if (!imgref.current.files[0]) newErrors.img = 'Event image is required';
    if (!shelterName) newErrors.shelterName = 'Shelter Name is required';
    if (!shelterContact || isNaN(shelterContact)) newErrors.shelterContact = 'Enter a valid contact number';
    if (!shelterId) newErrors.shelterId = 'Shelter ID is required';
    if (!userId) newErrors.userId = 'User ID is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const add = () => {
    if (!validateForm()) return;
    
    let formData = new FormData();
    formData.append('eventname', eventnameref.current.value);
    formData.append('place', placeref.current.value);
    formData.append('date', dateref.current.value);
    formData.append('time', timeref.current.value);
    formData.append('maxlimit', maxlimitref.current.value);
    formData.append('category', categoryref.current.value);
    formData.append('img', imgref.current.files[0]);
    formData.append('shelterName',shelterName);
    formData.append('shelterContact', shelterContact);
    formData.append('shelterId',shelterId);
    formData.append('userId', userId);



    axios.post("http://localhost:8080/shelter-add-events", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then((response) => {
      if (response.data.message === "event added") {
        alert("Event added successfully!");
      } else {
        alert("Something went wrong");
      }
    })
    .catch((error) => alert(error));
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Event</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Event Name</label>
          <input type="text" ref={eventnameref} />
          {errors.eventname && <p className="error-text">{errors.eventname}</p>}
        </div>
        <div className="form-group">
          <label>Place</label>
          <input type="text" ref={placeref} />
          {errors.place && <p className="error-text">{errors.place}</p>}
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" ref={dateref} min={new Date().toISOString().split('T')[0]} />
          {errors.date && <p className="error-text">{errors.date}</p>}
        </div>
        <div className="form-group">
          <label>Time</label>
          <input type="time" ref={timeref} />
          {errors.time && <p className="error-text">{errors.time}</p>}
        </div>
        <div className="form-group">
          <label>Max Limit</label>
          <input type="number" ref={maxlimitref} />
          {errors.maxlimit && <p className="error-text">{errors.maxlimit}</p>}
        </div>
        <div className="form-group">
          <label>Category</label>
          <select ref={categoryref}>
            {Categories.map((c) => (
              <option key={c.cid} value={c.categoryname}>{c.categoryname}</option>
            ))}
          </select>
          {errors.category && <p className="error-text">{errors.category}</p>}
        </div>
        <div className="form-group">
          <label>Shelter Name</label>
          <input type="text" value={shelterName} disabled/>
          {errors.shelterName && <p className="error-text">{errors.shelterName}</p>}
        </div>
        <div className="form-group">
          <label>Shelter Contact</label>
          <input type="text"value={shelterContact} />
          {errors.shelterContact && <p className="error-text">{errors.shelterContact}</p>}
        </div>
        <div className="form-group">
          <label>Shelter ID</label>
          <input type="text" value={shelterId} disabled/>
          {errors.shelterId && <p className="error-text">{errors.shelterId}</p>}
        </div>
        <div className="form-group">
          <label>User ID</label>
          <input type="text" value={userId} disabled />
          {errors.shelterId && <p className="error-text">{errors.shelterId}</p>}
        </div>
        <div className="form-group file-input">
          <label>Event Image</label>
          <input type="file" ref={imgref} />
          {errors.img && <p className="error-text">{errors.img}</p>}
        </div>
      </div>
      <button onClick={add} className="submit-btn">Add Event</button>
    </div>
  );
}
