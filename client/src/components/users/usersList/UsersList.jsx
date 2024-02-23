import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllUsers, deleteUser } from "../../../redux/users";
import UserCreate from "../usersCreate/UsersCreate";

export default function UsersList() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

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
      // Después de eliminar el usuario, actualiza la lista de usuarios en el estado local
      dispatch(getAllUsers()); // Opcional: también podrías omitir este paso si el estado local ya se actualiza automáticamente mediante una suscripción a los cambios en la base de datos
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

  const handleModalAfterClose = () => {
    dispatch(getAllUsers());
  };

  return (
    <div>
      <h2>Lista de Usuarios:</h2>
      <Button type='primary' onClick={handleAddUser}>
        Agregar Usuario
      </Button>
      <Table
        dataSource={users}
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
                {status === "active" ? "active" : "inactive"}
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
        afterClose={handleModalAfterClose}
        destroyOnClose={true}
        footer={null}
      >
        <UserCreate initialValues={selectedUser} onCancel={handleModalCancel} />
      </Modal>
    </div>
  );
}
