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
      username.onChange({ target: { value: initialValues.username || "" } });
      name.onChange({ target: { value: initialValues.name || "" } });
      lastname.onChange({ target: { value: initialValues.lastname || "" } });
      email.onChange({ target: { value: initialValues.email || "" } });
      status.onChange({ target: { value: initialValues.status || "" } });
      age.onChange({ target: { value: initialValues.age || "" } });
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
      <input
        type='text'
        name='username'
        value={username.value}
        onChange={username.onChange}
        placeholder='Username'
      />
      <input
        type='text'
        name='name'
        value={name.value}
        onChange={name.onChange}
        placeholder='Name'
      />
      <input
        type='text'
        name='lastname'
        value={lastname.value}
        onChange={lastname.onChange}
        placeholder='Lastname'
      />
      <input
        type='email'
        name='email'
        value={email.value}
        onChange={email.onChange}
        placeholder='Email'
      />
      <input
        type='text'
        name='status'
        value={status.value}
        onChange={status.onChange}
        placeholder='Status'
      />
      <input
        type='number'
        name='age'
        value={age.value}
        onChange={age.onChange}
        placeholder='Age'
      />
      <button type='submit'>{isEditing ? "Edit User" : "Create User"}</button>
    </form>
  );
}
