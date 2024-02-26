import React, { useState } from "react"; // Importa React y useState desde React
import { useDispatch } from "react-redux"; // Importa useDispatch desde react-redux
import { createUser, editUser } from "../../../redux/users"; // Importa las acciones createUser y editUser desde el archivo users en la carpeta redux
import { v4 as uuidv4 } from "uuid"; // Importa la función v4 de la librería uuid como uuidv4
import { useInput } from "../../../hook/useInput"; // Importa la función useInput desde el archivo useInput en la carpeta hook
import { Input, Select, Button, Spin, message } from "antd"; // Importa componentes específicos desde la librería antd
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"; // Importa iconos específicos desde la librería de iconos de Ant Design

import "./style.css"; // Importa estilos CSS desde un archivo local

const { Option } = Select; // Extrae el componente Option de Select

export default function CreateUserForm({ initialValues, onCancel }) {
  // Define el componente CreateUserForm
  const dispatch = useDispatch(); // Inicializa dispatch con la función useDispatch de react-redux
  const isEditing = !!initialValues && !!initialValues.id; // Determina si initialValues existe y tiene un id

  const [loading, setLoading] = useState(false); // Inicializa loading y setLoading con useState, loading se inicializa en false
  const [formSubmitted, setFormSubmitted] = useState(false); // Inicializa formSubmitted y setFormSubmitted con useState, formSubmitted se inicializa en false

  const inputClass = "form-input"; // Define la clase CSS inputClass como "form-input"

  // Define varios estados locales con la función useInput y utiliza los valores iniciales proporcionados o cadenas vacías si no se proporcionan
  const username = useInput(initialValues?.username || "");
  const name = useInput(initialValues?.name || "");
  const lastname = useInput(initialValues?.lastname || "");
  const email = useInput(initialValues?.email || "");
  const [status, setStatus] = useState(initialValues?.status || undefined);
  const age = useInput(initialValues?.age || "");

  // Define expresiones regulares para validar la entrada del usuario en los campos de formulario
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const nameRegex = /^[a-zA-Z\s]{1,30}$/;
  const lastnameRegex = /^[a-zA-Z\s]{1,30}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Define la función handleSubmit para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe automáticamente

    setLoading(true); // Establece loading en true para mostrar un indicador de carga
    setFormSubmitted(true); // Establece formSubmitted en true para indicar que el formulario ha sido enviado

    // Objeto que almacena la validez de cada campo del formulario
    const updatedValidity = {
      username: usernameRegex.test(username.value),
      name: nameRegex.test(name.value),
      lastname: lastnameRegex.test(lastname.value),
      email: emailRegex.test(email.value),
      age: !!age.value,
      status: !!status,
    };

    // Verifica si todos los campos tienen valores válidos
    if (!Object.values(updatedValidity).every((valid) => valid)) {
      message.error("Por favor, complete todos los campos correctamente"); // Muestra un mensaje de error si algún campo no es válido
      setLoading(false); // Establece loading en false para ocultar el indicador de carga
      return; // Sale de la función handleSubmit
    }

    // Objeto que contiene los datos del usuario a enviar al servidor
    const userData = {
      id: isEditing ? initialValues.id : uuidv4(),
      username: username.value,
      name: name.value,
      lastname: lastname.value,
      email: email.value,
      status: status,
      age: age.value,
    };

    // Simula un tiempo de espera de 2 segundos antes de enviar los datos al servidor
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Envia los datos del usuario al servidor dependiendo de si se está editando o creando un nuevo usuario
    if (isEditing) {
      dispatch(editUser(userData)); // Envia los datos editados del usuario al servidor
      message.success("Usuario editado correctamente"); // Muestra un mensaje de éxito
    } else {
      dispatch(createUser(userData)); // Crea un nuevo usuario enviando los datos al servidor
      message.success("Usuario agregado correctamente"); // Muestra un mensaje de éxito
    }

    setLoading(false); // Establece loading en false para ocultar el indicador de carga
    onCancel(); // Ejecuta la función onCancel para cerrar el formulario o realizar otra acción deseada
  };

  // Retorna el formulario con los campos de entrada y botones
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
          autoFocus
          addonAfter={
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
          autoFocus
          type='text'
          name='name'
          value={name.value}
          onChange={name.onChange}
          placeholder='John'
          className={inputClass}
          addonAfter={
            name.value && nameRegex.test(name.value) ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              formSubmitted && (
                <ExclamationCircleOutlined style={{ color: "red" }} />
              )
            )
          }
        />

        {/* Campo de selección para el estado */}
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
          autoFocus
          type='text'
          name='lastname'
          value={lastname.value}
          onChange={lastname.onChange}
          placeholder='Doe'
          className={inputClass}
          addonAfter={
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
          autoFocus
          type='email'
          name='email'
          value={email.value}
          onChange={email.onChange}
          placeholder='jhondoe@domain.com'
          className={inputClass}
          addonAfter={
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
          autoFocus
          type='number'
          name='age'
          value={age.value}
          onChange={age.onChange}
          placeholder='43'
          className={inputClass}
          addonAfter={
            age.value ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              formSubmitted && (
                <ExclamationCircleOutlined style={{ color: "red" }} />
              )
            )
          }
        />

        {/* Botón para enviar el formulario */}
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
