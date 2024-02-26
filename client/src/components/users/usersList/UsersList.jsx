import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table, Modal, Input, Select, Spin, message } from "antd";
import { getAllUsers, deleteUser } from "../../../redux/users";
import UserCreate from "../usersCreate/UsersCreate"; // Importa el componente UserCreate para agregar/editar usuarios
import "./style.css";

const { Option } = Select;
const { Search } = Input;

export default function UsersList() {
  const dispatch = useDispatch(); // Obtiene la función de despacho de Redux
  const users = useSelector((state) => state.users); // Obtiene los usuarios del estado global
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar el usuario seleccionado para editar
  const [filteredUsers, setFilteredUsers] = useState(users); // Estado para almacenar los usuarios filtrados
  const [filter, setFilter] = useState("all"); // Estado para almacenar el filtro seleccionado
  const [searchText, setSearchText] = useState(""); // Estado para almacenar el texto de búsqueda
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false); // Estado para controlar la visibilidad del modal de confirmación de eliminación
  const [userToDelete, setUserToDelete] = useState(null); // Estado para almacenar el usuario que se eliminará
  const [isDeleting, setIsDeleting] = useState(false); // Estado para controlar el estado de eliminación

  useEffect(() => {
    dispatch(getAllUsers()); // Obtiene todos los usuarios al montar el componente
  }, [dispatch]);

  useEffect(() => {
    filterUsers(); // Filtra los usuarios cuando cambia la lista de usuarios, el filtro o el texto de búsqueda
  }, [users, filter, searchText]); // Actualiza el parámetro

  // Función para manejar la adición de un nuevo usuario
  const handleAddUser = () => {
    setSelectedUser(null); // Restablece el usuario seleccionado
    setIsModalVisible(true); // Muestra el modal
  };

  // Función para manejar la edición de un usuario
  const handleEditUser = (user) => {
    setSelectedUser(user); // Establece el usuario seleccionado para edición
    setIsModalVisible(true); // Muestra el modal
  };

  // Función para manejar la eliminación de un usuario
  const handleDeleteUser = (user) => {
    setUserToDelete(user); // Establece el usuario que se eliminará
    setConfirmDeleteVisible(true); // Muestra el modal de confirmación de eliminación
  };

  // Función para confirmar la eliminación de un usuario
  const confirmDelete = async () => {
    try {
      setIsDeleting(true); // Establece el estado de eliminación en verdadero
      await dispatch(deleteUser(userToDelete.id)); // Elimina el usuario
      setTimeout(() => {
        message.success("Usuario eliminado correctamente"); // Muestra un mensaje de éxito
        setIsDeleting(false); // Restablece el estado de eliminación
        setConfirmDeleteVisible(false); // Oculta el modal de confirmación de eliminación
        dispatch(getAllUsers()); // Obtiene todos los usuarios actualizados
      }, 3000);
    } catch (error) {
      setIsDeleting(false); // Restablece el estado de eliminación en caso de error
      message.error("Hubo un error al eliminar el usuario"); // Muestra un mensaje de error
    }
  };

  // Función para manejar el cierre del modal
  const handleModalCancel = () => {
    setIsModalVisible(false); // Oculta el modal
    setSelectedUser(null); // Restablece el usuario seleccionado
  };

  // Función para manejar la acción al confirmar en el modal
  const handleModalOk = () => {
    setIsModalVisible(false); // Oculta el modal
    setSelectedUser(null); // Restablece el usuario seleccionado
  };

  // Función para manejar el cambio de filtro
  const handleFilterChange = (value) => {
    setFilter(value); // Establece el filtro seleccionado
  };

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    setSearchText(e.target.value); // Establece el texto de búsqueda
  };

  // Función para filtrar los usuarios según el filtro y el texto de búsqueda
  const filterUsers = () => {
    let filteredData = users; // Inicialmente, muestra todos los usuarios

    // Filtra por estado si se selecciona un estado específico
    if (filter !== "all") {
      filteredData = filteredData.filter((user) => user.status === filter);
    }

    // Filtra por texto de búsqueda en nombre o apellido
    if (searchText !== "") {
      filteredData = filteredData.filter(
        (user) =>
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.lastname.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredUsers(filteredData); // Actualiza la lista de usuarios filtrados
  };

  return (
    <div>
      <div className='table-container'>
        <p>
          Usuarios / <b>Lista de usuarios</b>
        </p>
        <div className='container-filtros' style={{ marginBottom: 16 }}>
          <div>
            {/* Entrada de búsqueda */}
            <Search
              placeholder='Búsqueda por nombre o apellido'
              style={{ width: 270, marginRight: 16 }}
              onChange={handleSearch}
            />
            {/* Selector de filtro */}
            <Select
              style={{ width: 170, marginRight: 16 }}
              onChange={handleFilterChange}
              placeholder='Filtrar por estado'
            >
              <Option value='all'>Todos</Option>
              <Option value='active'>Activos</Option>
              <Option value='inactive'>Inactivos</Option>
            </Select>
          </div>
          <div>
            {/* Botón para agregar usuario */}
            <Button type='primary' onClick={handleAddUser}>
              Agregar Usuario
            </Button>
          </div>
        </div>
        {/* Tabla de usuarios */}
        <Table
          className='table'
          dataSource={filteredUsers}
          rowKey='id'
          align='right'
          columns={[
            // Columnas de la tabla
            {
              title: <div className='custom-column-username'>Usuario</div>,
              dataIndex: "username",
              key: "username",
              align: "center",
              className: "first-three-columns",
            },
            {
              title: <div className='custom-column-name'>Nombre</div>,
              dataIndex: "name",
              key: "name",
              align: "center",
              className: "first-three-columns",
            },
            {
              title: <div className='custom-column-lastname'>Apellido</div>,
              dataIndex: "lastname",
              key: "lastname",
              align: "center",
              className: "first-three-columns",
            },
            {
              title: <div className='custom-column-action'>Estado</div>,
              dataIndex: "status",
              key: "status",
              className: "custom-column-data column-status",
              render: (status) => (
                // Botón con el estado del usuario
                <Button
                  type='outline'
                  style={{
                    height: "23px",
                    borderRadius: "3px",
                    width: "90%",
                    backgroundColor:
                      status === "active" ? "#f6ffed" : "#fff1f0",
                    borderColor: status === "active" ? "#beed99" : "#ffa39e",
                    color: status === "active" ? "#52c41a" : "#f5222d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {status === "active" ? "Activo" : "Inactivo"}
                </Button>
              ),
            },
            {
              title: <div className='custom-column-action'>Acción</div>,
              key: "action",
              className: "custom-column-data column-action",
              render: (text, record) => (
                // Botones de acción para editar y eliminar usuarios
                <span className='action-buttons'>
                  <Button type='link' onClick={() => handleEditUser(record)}>
                    Editar
                  </Button>{" "}
                  <Button
                    type='link'
                    onClick={() => handleDeleteUser(record)}
                    disabled={isDeleting}
                  >
                    Eliminar
                  </Button>
                  {isDeleting &&
                    userToDelete &&
                    userToDelete.id === record.id && (
                      <Spin size='small' style={{ marginLeft: "5px" }} />
                    )}
                </span>
              ),
            },
          ]}
          pagination={{ showSizeChanger: false }}
        />
      </div>

      {/* Modal para agregar/editar usuarios */}
      <Modal
        className='modal-users'
        title={selectedUser ? "Editar Usuario" : "Agregar usuario"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        destroyOnClose={true}
        footer={null}
      >
        <UserCreate initialValues={selectedUser} onCancel={handleModalCancel} />
      </Modal>

      {/* Modal de confirmación de eliminación */}
      {confirmDeleteVisible && (
        <Modal
          style={{ width: "200px" }}
          title='Eliminar usuario'
          open={confirmDeleteVisible}
          onCancel={() => setConfirmDeleteVisible(false)}
          footer={[
            <Button key='cancel' onClick={() => setConfirmDeleteVisible(false)}>
              Cancelar
            </Button>,
            <Button
              key='delete'
              type='primary'
              onClick={confirmDelete}
              danger
              loading={isDeleting}
            >
              Eliminar
            </Button>,
          ]}
        >
          {!isDeleting && (
            <p style={{ padding: "5%" }}>
              ¿Estás seguro de que deseas eliminar este usuario{" "}
              <span style={{ color: "red" }}>
                {userToDelete && userToDelete.username}
              </span>
              ?
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}
