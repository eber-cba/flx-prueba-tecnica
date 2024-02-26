import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createUser, editUser } from "../../../redux/users"; // Importa las acciones de crear y editar usuario desde el archivo de acciones correspondiente en Redux
import { v4 as uuidv4 } from "uuid"; // Importa la función uuidv4 para generar IDs únicos
import { useInput } from "../../../hook/useInput"; // Importa el hook useInput, probablemente personalizado
import { Input, Select, Button, Spin, message } from "antd"; // Importa componentes de Ant Design
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"; // Importa iconos de Ant Design

import "./style.css"; // Importa estilos locales

const { Option } = Select; // Define la constante Option para usarla con Select

export default function CreateUserForm({ initialValues, onCancel }) {
  const dispatch = useDispatch(); // Obtiene la función de despacho de acciones de Redux
  const isEditing = !!initialValues && !!initialValues.id; // Determina si el formulario está en modo de edición

  const [loading, setLoading] = useState(false); // Estado para controlar el estado de carga del formulario
  const [formSubmitted, setFormSubmitted] = useState(false); // Estado para rastrear si el formulario se ha enviado

  const inputClass = "form-input"; // Clase CSS para los campos de entrada del formulario

  // Define los campos del formulario y sus estados usando el hook useInput
  const username = useInput(initialValues?.username || "");
  const name = useInput(initialValues?.name || "");
  const lastname = useInput(initialValues?.lastname || "");
  const email = useInput(initialValues?.email || "");
  const [status, setStatus] = useState(initialValues?.status || undefined);
  const age = useInput(initialValues?.age || "");

  // Expresiones regulares para validar los campos del formulario
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const nameRegex = /^[a-zA-Z\s]{1,30}$/;
  const lastnameRegex = /^[a-zA-Z\s]{1,30}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el comportamiento de envío predeterminado del formulario
    setLoading(true); // Establece el estado de carga en verdadero
    setFormSubmitted(true); // Marca el formulario como enviado

    // Valida todos los campos del formulario
    const updatedValidity = {
      username: usernameRegex.test(username.value),
      name: nameRegex.test(name.value),
      lastname: lastnameRegex.test(lastname.value),
      email: emailRegex.test(email.value),
      age: !!age.value,
      status: !!status,
    };

    // Si algún campo no es válido, muestra un mensaje de error y detiene el envío del formulario
    if (!Object.values(updatedValidity).every((valid) => valid)) {
      message.error("Por favor, complete todos los campos correctamente");
      setLoading(false); // Establece el estado de carga en falso
      return;
    }

    // Construye el objeto de datos del usuario a partir de los valores del formulario
    const userData = {
      id: isEditing ? initialValues.id : uuidv4(),
      username: username.value,
      name: name.value,
      lastname: lastname.value,
      email: email.value,
      status: status,
      age: age.value,
    };

    // Simula una espera de 2 segundos antes de realizar la acción correspondiente (crear o editar usuario)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Realiza la acción correspondiente (crear o editar usuario) según el modo de edición
    if (isEditing) {
      dispatch(editUser(userData)); // Despacha la acción para editar usuario
      message.success("Usuario editado correctamente"); // Muestra un mensaje de éxito
    } else {
      dispatch(createUser(userData)); // Despacha la acción para crear usuario
      message.success("Usuario agregado correctamente"); // Muestra un mensaje de éxito
    }

    setLoading(false); // Establece el estado de carga en falso
    onCancel(); // Llama a la función onCancel para cerrar el formulario
  };

  return (
    <form onSubmit={handleSubmit} className='create-user-form'>
      <div className='form-column'>
        {/* Campo de entrada para el nombre de usuario */}
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
          suffix={
            // Ícono de marca de verificación si el valor del campo es válido, ícono de exclamación si no lo es
            username.value && usernameRegex.test(username.value) ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              formSubmitted && (
                <ExclamationCircleOutlined style={{ color: "red" }} />
              )
            )
          }
        />

        {/* Campo de entrada para el nombre */}
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
          suffix={
            // Ícono de marca de verificación si el valor del campo es válido, ícono de exclamación si no lo es
            name.value && nameRegex.test(name.value) ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              formSubmitted && (
                <ExclamationCircleOutlined style={{ color: "red" }} />
              )
            )
          }
        />

        {/* Selector para el estado del usuario */}
        <label className='form-label' htmlFor='status'>
          Estado
        </label>
        <Select
          name='status'
          value={status}
          onChange={setStatus}
          placeholder='Seleccione un estado'
          className={inputClass}
          suffixIcon={
            // Ícono de marca de verificación si el valor del campo es válido, ícono de exclamación si no lo es
            status ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              formSubmitted && (
                <ExclamationCircleOutlined style={{ color: "red" }} />
              )
            )
          }
        >
          <Option value='active'>Activo</Option>
          <Option value='inactive'>Inactivo</Option>
        </Select>
      </div>
      <div className='form-column'>
        {/* Campo de entrada para el apellido */}
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
          suffix={
            // Ícono de marca de verificación si el valor del campo es válido, ícono de exclamación si no lo es
            lastname.value && lastnameRegex.test(lastname.value) ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              formSubmitted && (
                <ExclamationCircleOutlined style={{ color: "red" }} />
              )
            )
          }
        />

        {/* Campo de entrada para el correo electrónico */}
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
          suffix={
            // Ícono de marca de verificación si el valor del campo es válido, ícono de exclamación si no lo es
            email.value && emailRegex.test(email.value) ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              formSubmitted && (
                <ExclamationCircleOutlined style={{ color: "red" }} />
              )
            )
          }
        />

        {/* Campo de entrada para la edad */}
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
          suffix={
            // Ícono de marca de verificación si el valor del campo es válido, ícono de exclamación si no lo es
            age.value ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              formSubmitted && (
                <ExclamationCircleOutlined style={{ color: "red" }} />
              )
            )
          }
        />

        {/* Botón de enviar el formulario */}
        <Button
          type='primary'
          htmlType='submit'
          size='middle'
          className='form-button'
          disabled={loading}
          icon={loading ? <Spin /> : null}
        >
          {isEditing ? "Editar usuario" : "Agregar usuario"}
        </Button>
      </div>
    </form>
  );
}
