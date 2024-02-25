import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createUser, editUser } from "../../../redux/users"; // Importa las acciones para crear y editar usuarios desde redux
import { v4 as uuidv4 } from "uuid"; // Importa la función uuidv4 para generar IDs únicos
import { useInput } from "../../../hook/useInput"; // Importa el hook useInput personalizado
import { Input, Select, Button, Spin, message } from "antd"; // Importa componentes de Ant Design
import "./style.css"; // Importa los estilos CSS

const { Option } = Select; // Importa el componente Option de Ant Design

export default function CreateUserForm({ initialValues, onCancel }) {
  const dispatch = useDispatch(); // Crea una función dispatch para despachar acciones
  const isEditing = !!initialValues && !!initialValues.id; // Verifica si se está editando un usuario existente

  const [editedUser, setEditedUser] = useState(initialValues || {}); // Estado para almacenar el usuario editado
  const [loading, setLoading] = useState(false); // Estado para controlar el estado de carga

  const inputClass = "form-input"; // Clase CSS para los campos de entrada

  // Hook personalizado para manejar el estado de los campos de entrada
  const username = useInput(initialValues?.username || "");
  const name = useInput(initialValues?.name || "");
  const lastname = useInput(initialValues?.lastname || "");
  const email = useInput(initialValues?.email || "");
  const [status, setStatus] = useState(undefined); // Estado para el estado del usuario (activo/inactivo)
  const age = useInput(initialValues?.age || "");

  // Efecto para actualizar los valores de los campos de entrada cuando cambian los valores iniciales
  useEffect(() => {
    setEditedUser(initialValues || {});
    if (initialValues) {
      username.onChange({ target: { value: initialValues.username || "" } });
      name.onChange({ target: { value: initialValues.name || "" } });
      lastname.onChange({ target: { value: initialValues.lastname || "" } });
      email.onChange({ target: { value: initialValues.email || "" } });
      setStatus(initialValues.status || undefined);
      age.onChange({ target: { value: initialValues.age || "" } });
    }
  }, [initialValues]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario
    setLoading(true); // Muestra el estado de carga

    // Objeto con los datos del usuario
    const userData = {
      id: isEditing ? initialValues.id : uuidv4(), // Genera un ID único si se está creando un nuevo usuario
      username: username.value,
      name: name.value,
      lastname: lastname.value,
      email: email.value,
      status: status,
      age: age.value,
    };

    // Simula una operación asincrónica (reemplazar con una llamada API real)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Si se está editando, despacha la acción para editar el usuario, de lo contrario, crea un nuevo usuario
    if (isEditing) {
      dispatch(editUser(userData));
      message.success("Usuario editado correctamente");
    } else {
      dispatch(createUser(userData));
      message.success("Usuario agregado correctamente");
    }

    setLoading(false); // Oculta el estado de carga
    onCancel(); // Llama a la función para cancelar y cerrar el formulario
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
        />

        {/* Botón para enviar el formulario */}
        <Button
          type='primary'
          htmlType='submit'
          size='middle'
          className='form-button'
          disabled={loading} // Deshabilita el botón mientras se carga
          icon={loading ? <Spin /> : null} // Muestra el icono de carga si está cargando
        >
          {isEditing ? "Editar usuario" : "Agregar usuario"}
        </Button>
      </div>
    </form>
  );
}
