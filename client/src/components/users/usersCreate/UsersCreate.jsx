// CreateUserForm.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createUser, editUser } from "../../../redux/users";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../../../hook/useInput";

export default function CreateUserForm({ initialValues, onCancel }) {
  const dispatch = useDispatch();
  const isEditing = !!initialValues && !!initialValues.id;

  const [editedUser, setEditedUser] = useState(initialValues || {});

  const username = useInput(initialValues?.username || "");
  const name = useInput(initialValues?.name || "");
  const lastname = useInput(initialValues?.lastname || "");
  const email = useInput(initialValues?.email || "");
  const status = useInput(initialValues?.status || "");
  const age = useInput(initialValues?.age || "");

  useEffect(() => {
    setEditedUser(initialValues || {});
    if (initialValues) {
      username.setValue(initialValues.username || "");
      name.setValue(initialValues.name || "");
      lastname.setValue(initialValues.lastname || "");
      email.setValue(initialValues.email || "");
      status.setValue(initialValues.status || "");
      age.setValue(initialValues.age || "");
    }
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      id: isEditing ? initialValues.id : uuidv4(),
      username: username.value,
      name: name.value,
      lastname: lastname.value,
      email: email.value,
      status: status.value,
      age: age.value,
    };

    if (isEditing) {
      dispatch(editUser(userData));
    } else {
      dispatch(createUser(userData));
    }

    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='text' name='username' {...username} placeholder='Username' />
      <input type='text' name='name' {...name} placeholder='Name' />
      <input type='text' name='lastname' {...lastname} placeholder='Lastname' />
      <input type='email' name='email' {...email} placeholder='Email' />
      <input type='text' name='status' {...status} placeholder='Status' />
      <input type='number' name='age' {...age} placeholder='Age' />
      <button type='submit'>{isEditing ? "Edit User" : "Create User"}</button>
    </form>
  );
}
