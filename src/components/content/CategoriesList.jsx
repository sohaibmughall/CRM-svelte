import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
  useToast,
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import { FolderPlus, Pencil, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  updateCategory,
  deleteCategory,
  setCategories,
} from "../../store/slices/contentSlice";
import {
  createCategory,
  getCategories,
  updateCategoryApi,
} from "../../lib/supabase";

function CategoriesList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const dispatch = useDispatch();
  const toast = useToast();
  const categories = useSelector((state) => state.content.categories);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await getCategories();
      if (error) {
        toast({
          title: "Error fetching Categories.....",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        dispatch(setCategories(data));
      }
    };
    fetchCategories();
  }, [dispatch, toast]);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
      });
    }
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCategory) {
      const { error } = await updateCategoryApi(editingCategory.id, formData);
      if (error) throw error;
      dispatch(
        updateCategory({
          ...editingCategory,
          ...formData,
        })
      );
      toast({
        title: "Category updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      const { data, error } = await createCategory(formData);
      if (error) throw error;
      dispatch(addCategory(data));
      toast({
        title: "Category created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };

  const handleDelete = (categoryId) => {
    dispatch(deleteCategory(categoryId));
    toast({
      title: "Category deleted successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <Button
        leftIcon={<FolderPlus size={20} />}
        colorScheme="blue"
        mb={6}
        onClick={() => handleOpenModal()}
      >
        Create Category
      </Button>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Slug</Th>
            <Th>Description</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categories.map((category) => (
            <Tr key={category.id}>
              <Td>{category.name}</Td>
              <Td>{category.slug}</Td>
              <Td>{category.description}</Td>
              <Td>
                <IconButton
                  size="sm"
                  icon={<Pencil size={16} />}
                  mr={2}
                  onClick={() => handleOpenModal(category)}
                ></IconButton>
                <IconButton
                  size="sm"
                  icon={<Trash2 size={16} />}
                  colorScheme="red"
                  onClick={() => handleDelete(category.id)}
                ></IconButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingCategory ? "Edit Category" : "Create New Category"}
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter category name"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Slug</FormLabel>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="enter-category-slug"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter category description"
                />
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CategoriesList;
