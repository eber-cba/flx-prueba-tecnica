import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table, Modal, Input, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
  const [filteredUsers, setFilteredUsers] = useState(users); // Estado para almacenar usuarios filtrados
  const [filter, setFilter] = useState("all"); // Estado para almacenar el filtro de estado
  const [searchText, setSearchText] = useState(""); // Estado para almacenar el texto de búsqueda

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    filterUsers();
  }, [users, filter, searchText]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalVisible(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleDeleteUser = async (user) => {
    try {
      await dispatch(deleteUser(user.id));
      dispatch(getAllUsers());
    } catch (error) {
      // Manejar cualquier error aquí
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
          placeholder='Buscar usuarios'
          style={{ width: 200, marginRight: 16 }}
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
          align='right' // Alinea las últimas dos columnas a la derecha
          columns={[
            {
              title: <div className='custom-column-username'>Usuario</div>,
              dataIndex: "username",
              key: "username",
              align: "center",
              className: "first-three-columns", // Agregar clase a las primeras tres columnas
            },
            {
              title: <div className='custom-column-name'>Nombre</div>,
              dataIndex: "name",
              key: "name",
              align: "center",
              className: "first-three-columns", // Agregar clase a las primeras tres columnas
            },
            {
              title: <div className='custom-column-lastname'>Apellido</div>,
              dataIndex: "lastname",
              key: "lastname",
              align: "center",
              className: "first-three-columns", // Agregar clase a las primeras tres columnas
            },
            {
              title: <div className='custom-column-action'>Estado</div>,
              dataIndex: "status",
              key: "status",
              className: "custom-column-data column-status", // Aplicar clases para alineación y posicionamiento
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
                    display: "flex", // Usa display flex
                    alignItems: "center", // Alinea verticalmente el contenido
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
              className: "custom-column-data column-action", // Aplicar clases para alineación y posicionamiento
              render: (text, record) => (
                <span className='action-buttons'>
                  <Button type='link' onClick={() => handleEditUser(record)}>
                    Editar
                  </Button>{" "}
                  <Button type='link' onClick={() => handleDeleteUser(record)}>
                    Eliminar
                  </Button>
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
    </div>
  );
}
