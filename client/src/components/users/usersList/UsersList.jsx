import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table, Modal, Input, Select } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getAllUsers, deleteUser } from "../../../redux/users";
import UserCreate from "../usersCreate/UsersCreate";

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
      <Table
        dataSource={filteredUsers}
        rowKey='id'
        columns={[
          {
            title: "Usuario",
            dataIndex: "username",
            key: "username",
          },
          {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Apellido",
            dataIndex: "lastname",
            key: "lastname",
          },
          {
            title: "Estado",
            dataIndex: "status",
            key: "status",
            render: (status) => (
              <Button type='outline'>
                {status === "active" ? "Activo" : "Inactivo"}
              </Button>
            ),
          },
          {
            title: "Acción",
            key: "action",
            render: (text, record) => (
              <span>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEditUser(record)}
                >
                  Editar
                </Button>{" "}
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteUser(record)}
                >
                  Eliminar
                </Button>
              </span>
            ),
          },
        ]}
      />
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
