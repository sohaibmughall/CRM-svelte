import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { UserPlus, Pencil, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser, deleteUser, setUserRole } from '../../store/slices/userSlice';

function UserManager() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'viewer',
  });

  const dispatch = useDispatch();
  const toast = useToast();
  const users = useSelector((state) => state.users.users);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'viewer',
      });
    }
    onOpen();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      dispatch(updateUser({
        ...editingUser,
        ...formData,
      }));
      toast({
        title: 'User updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      dispatch(addUser({
        id: Date.now().toString(),
        ...formData,
      }));
      toast({
        title: 'User added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(setUserRole({ userId, role: newRole }));
    toast({
      title: 'Role updated successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId));
    toast({
      title: 'User deleted successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="1200px" mx="auto" py={6}>
      <Button
        leftIcon={<UserPlus size={20} />}
        colorScheme="blue"
        mb={6}
        onClick={() => handleOpenModal()}
      >
        Add User
      </Button>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  width="150px"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </Select>
              </Td>
              <Td>
                <Button
                  size="sm"
                  leftIcon={<Pencil size={16} />}
                  mr={2}
                  onClick={() => handleOpenModal(user)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  leftIcon={<Trash2 size={16} />}
                  colorScheme="red"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingUser ? 'Edit User' : 'Add New User'}
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Role</FormLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </Select>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {editingUser ? 'Update' : 'Add'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default UserManager;