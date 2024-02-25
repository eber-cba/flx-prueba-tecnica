import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createUser, editUser } from "../../../redux/users";
import { v4 as uuidv4 } from "uuid";
import { useInput } from "../../../hook/useInput";
import { Input, Select, Button } from "antd";
import "./style.css";

const { Option } = Select;

export default function CreateUserForm({ initialValues, onCancel }) {
  const dispatch = useDispatch();
  const isEditing = !!initialValues && !!initialValues.id;

  const [editedUser, setEditedUser] = useState(initialValues || {});

  const inputClass = "form-input";

  const username = useInput(initialValues?.username || "");
  const name = useInput(initialValues?.name || "");
  const lastname = useInput(initialValues?.lastname || "");
  const email = useInput(initialValues?.email || "");
  const [status, setStatus] = useState(undefined); // Initialize status state with undefined
  const age = useInput(initialValues?.age || "");

  useEffect(() => {
    setEditedUser(initialValues || {});
    if (initialValues) {
      username.onChange({ target: { value: initialValues.username || "" } });
      name.onChange({ target: { value: initialValues.name || "" } });
      lastname.onChange({ target: { value: initialValues.lastname || "" } });
      email.onChange({ target: { value: initialValues.email || "" } });
      setStatus(initialValues.status || undefined); // Set status to undefined if no initial value
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
      status: status,
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
    <form onSubmit={handleSubmit} className='create-user-form'>
      <div className='form-column'>
        <label className='form-label' htmlFor='username'>
          Usuario
        </label>
        <Input
          type='text'
          name='username'
          value={username.value}
          onChange={username.onChange}
          placeholder='johndoe'
          className={inputClass}
        />

        <label className='form-label' htmlFor='name'>
          Nombre
        </label>
        <Input
          type='text'
          name='name'
          value={name.value}
          onChange={name.onChange}
          placeholder='John'
          className={inputClass}
        />

        <label className='form-label' htmlFor='status'>
          Estado
        </label>
        <Select
          name='status'
          value={status}
          onChange={setStatus}
          placeholder='Seleccione un estado'
          className={inputClass}
        >
          <Option value='active'>Activo</Option>
          <Option value='inactive'>Inactivo</Option>
        </Select>
      </div>
      <div className='form-column'>
        <label className='form-label' htmlFor='lastname'>
          Apellido
        </label>
        <Input
          type='text'
          name='lastname'
          value={lastname.value}
          onChange={lastname.onChange}
          placeholder='Doe'
          className={inputClass}
        />

        <label className='form-label' htmlFor='email'>
          Email
        </label>
        <Input
          type='email'
          name='email'
          value={email.value}
          onChange={email.onChange}
          placeholder='jhondoe@domain.com'
          className={inputClass}
        />

        <label className='form-label' htmlFor='age'>
          Edad
        </label>
        <Input
          type='number'
          name='age'
          value={age.value}
          onChange={age.onChange}
          placeholder='43'
          className={inputClass}
        />

        <Button
          type='primary'
          htmlType='submit'
          size='middle'
          className='form-button'
        >
          {isEditing ? "Editar usuario" : "Agregar usuario"}
        </Button>
      </div>
    </form>
  );
}
