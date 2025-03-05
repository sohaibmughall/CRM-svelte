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
  Select,
  IconButton,
} from "@chakra-ui/react";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPage,
  updatePage,
  deletePage,
  setPages,
} from "../../store/slices/contentSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createPage, getPages, updatePageApi } from "../../lib/supabase";

function PagesList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    status: "draft",
  });

  const dispatch = useDispatch();
  const toast = useToast();
  const pages = useSelector((state) => state.content.pages);

  useEffect(() => {
    const fetchPages = async () => {
      const { data, error } = await getPages();
      if (error) {
        toast({
          title: "Error fetching Pages.....",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        dispatch(setPages(data));
      }
    };
    fetchPages();
  }, [dispatch, toast]);

  const handleOpenModal = (page = null) => {
    if (page) {
      setEditingPage(page);
      setFormData({
        title: page.title,
        slug: page.slug,
        content: page.content,
        status: page.status,
      });
    } else {
      setEditingPage(null);
      setFormData({
        title: "",
        slug: "",
        content: "",
        status: "draft",
      });
    }
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPage) {
      const { error } = await updatePageApi(editingPage.id, formData);
      if (error) throw error;
      dispatch(
        updatePage({
          ...editingPage,
          ...formData,
          updatedAt: new Date().toISOString(),
        })
      );
      toast({
        title: "Page updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      const { data, error } = await createPage(formData);
      if (error) throw error;
      dispatch(addPage(data));
      toast({
        title: "Page created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };

  const handleDelete = (pageId) => {
    dispatch(deletePage(pageId));
    toast({
      title: "Page deleted successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <Button
        leftIcon={<FileText size={20} />}
        colorScheme="blue"
        mb={6}
        onClick={() => handleOpenModal()}
      >
        Create Page
      </Button>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Status</Th>
            <Th>Last Updated</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pages.map((page) => (
            <Tr key={page.id}>
              <Td>{page.title}</Td>
              <Td>{page.status}</Td>
              <Td>{new Date(page.updatedAt).toLocaleDateString()}</Td>
              <Td>
                <IconButton
                  icon={<Pencil size={16} />}
                  size="sm"
                  mr={2}
                  onClick={() => handleOpenModal(page)}
                >
                  Edit
                </IconButton>
                <IconButton
                  size="sm"
                  icon={<Trash2 size={16} />}
                  colorScheme="red"
                  onClick={() => handleDelete(page.id)}
                >
                  Delete
                </IconButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingPage ? "Edit Page" : "Create New Page"}
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl mb={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter page title"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Slug</FormLabel>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="enter-page-slug"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Content</FormLabel>
                <Box border="1px" borderColor="gray.200" rounded="md">
                  <ReactQuill
                    value={formData.content}
                    onChange={(content) =>
                      setFormData({ ...formData, content })
                    }
                    style={{ height: "200px", marginBottom: "50px" }}
                  />
                </Box>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Status</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </Select>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {editingPage ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default PagesList;
