import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ScheduleForm = ({handleAddScheduleItem}) => {

    const eventId = useParams().id;
  const [formData, setFormData] = useState({
    eventId,
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.eventId) {
      newErrors.eventId = "Event ID is required";
    } else if (!/^[a-fA-F0-9]{24}$/.test(formData.eventId)) {
      newErrors.eventId = "Event ID must be a valid MongoDB ObjectId";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    } else if (isNaN(Date.parse(formData.startTime))) {
      newErrors.startTime = "Start time must be a valid date";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    } else if (isNaN(Date.parse(formData.endTime))) {
      newErrors.endTime = "End time must be a valid date";
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (start >= end) {
        newErrors.startTime = "Start time must be earlier than end time";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
        const created = handleAddScheduleItem(formData);
        if (created) {
            setFormData({ eventId, title: "", description: "", startTime: "", endTime: "" });
        }
    } catch (error) {
      console.error("Error creating schedule item:", error);
      alert("An error occurred while creating the schedule item.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
        {errors.title && <span style={{ color: "red" }}>{errors.title}</span>}
      </div>

      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
        {errors.description && <span style={{ color: "red" }}>{errors.description}</span>}
      </div>

      <div>
        <label>Start Time:</label>
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleInputChange}
        />
        {errors.startTime && <span style={{ color: "red" }}>{errors.startTime}</span>}
      </div>

      <div>
        <label>End Time:</label>
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleInputChange}
        />
        {errors.endTime && <span style={{ color: "red" }}>{errors.endTime}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ScheduleForm;