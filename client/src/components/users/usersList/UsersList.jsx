import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table, Modal, Input, Select, Spin, message } from "antd";
import { getAllUsers, deleteUser } from "../../../redux/users";
import UserCreate from "../usersCreate/UsersCreate";
import "./style.css";

const { Option } = Select;
const { Search } = Input;

export default function UsersList() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    filterUsers();
  }, [users, filter, searchText]); // Actualiza el parámetro aquí

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalVisible(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setConfirmDeleteVisible(true);
  };

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

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

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
      <p>
        Usuarios/<b>Lista de usuarios</b>
      </p>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder='Búsqueda por nombre o apellido'
          style={{ width: 250, marginRight: 16 }}
          onChange={handleSearch}
        />
        <Select
          style={{ width: 170, marginRight: 16 }}
          onChange={handleFilterChange}
          placeholder='Filtrar por estado'
        >
          <Option value='all'>Todos</Option>
          <Option value='active'>Activos</Option>
          <Option value='inactive'>Inactivos</Option>
        </Select>

        <Button type='primary' onClick={handleAddUser}>
          Agregar Usuario
        </Button>
      </div>
      <div className='table-container'>
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
