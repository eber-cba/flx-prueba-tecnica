import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table, Modal, Input, Select, Spin, message } from "antd";
import { getAllUsers, deleteUser } from "../../../redux/users"; // Importa las acciones necesarias desde redux
import UserCreate from "../usersCreate/UsersCreate"; // Importa el componente para crear usuarios
import "./style.css"; // Importa los estilos CSS

const { Option } = Select; // Importa el componente Option de Ant Design
const { Search } = Input; // Importa el componente Search de Ant Design

export default function UsersList() {
  const dispatch = useDispatch(); // Crea una función dispatch para despachar acciones
  const users = useSelector((state) => state.users); // Obtiene el estado de los usuarios desde redux
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar el usuario seleccionado
  const [filteredUsers, setFilteredUsers] = useState(users); // Estado para almacenar los usuarios filtrados
  const [filter, setFilter] = useState("all"); // Estado para almacenar el filtro seleccionado
  const [searchText, setSearchText] = useState(""); // Estado para almacenar el texto de búsqueda
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false); // Estado para controlar la visibilidad del modal de confirmación de eliminación
  const [userToDelete, setUserToDelete] = useState(null); // Estado para almacenar el usuario que se va a eliminar
  const [isDeleting, setIsDeleting] = useState(false); // Estado para controlar el proceso de eliminación

  // Efecto para cargar los usuarios al montar el componente
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Efecto para filtrar los usuarios cuando cambia el estado de usuarios, el filtro o el texto de búsqueda
  useEffect(() => {
    filterUsers();
  }, [users, filter, searchText]);

  // Función para agregar un nuevo usuario
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalVisible(true);
  };

  // Función para editar un usuario
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  // Función para solicitar la eliminación de un usuario
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setConfirmDeleteVisible(true);
  };

  // Función para confirmar la eliminación de un usuario
  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await dispatch(deleteUser(userToDelete.id));
      setTimeout(() => {
        message.success("Usuario eliminado correctamente");
        setIsDeleting(false);
        setConfirmDeleteVisible(false);
        dispatch(getAllUsers());
      }, 1000);
    } catch (error) {
      setIsDeleting(false);
      message.error("Hubo un error al eliminar el usuario");
    }
  };

  // Función para cancelar la operación en el modal
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  // Función para cerrar el modal después de realizar una acción
  const handleModalOk = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  // Función para manejar el cambio en el filtro
  const handleFilterChange = (value) => {
    setFilter(value);
  };

  // Función para manejar el cambio en el texto de búsqueda
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Función para filtrar los usuarios
  const filterUsers = () => {
    let filteredData = users;

    if (filter !== "all") {
      filteredData = filteredData.filter((user) => user.status === filter);
    }

    if (searchText !== "") {
      filteredData = filteredData.filter(
        (user) =>
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.lastname.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredUsers(filteredData);
  };

  return (
    <div>
      {/* Contenedor de la tabla */}
      <div className='table-container'>
        <p>
          Usuarios / <b>Lista de usuarios</b>
        </p>
        {/* Contenedor de filtros */}
        <div className='container-filtros' style={{ marginBottom: 16 }}>
          <div>
            {/* Campo de búsqueda */}
            <Search
              placeholder='Búsqueda por nombre o apellido'
              style={{ width: 270, marginRight: 16 }}
              onChange={handleSearch}
            />
            {/* Selector de filtro por estado */}
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
          {/* Botón para agregar usuario */}
          <div>
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
                <span className='action-buttons'>
                  {/* Botones para editar y eliminar usuarios */}
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
                  {/* Indicador de carga al eliminar un usuario */}
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

      {/* Modal para editar/crear usuario */}
      <Modal
        title={selectedUser ? "Editar Usuario" : "Agregar Usuario"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
        destroyOnClose={true}
        footer={null}
      >
        <UserCreate initialValues={selectedUser} onCancel={handleModalCancel} />
      </Modal>

      {/* Modal para confirmar eliminación de usuario */}
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
