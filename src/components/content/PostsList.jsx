import React, { useState, useEffect } from "react";
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
  Textarea,
  useDisclosure,
  useToast,
  Select,
  IconButton,
} from "@chakra-ui/react";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPost,
  updatePost,
  deletePost,
  setPosts,
} from "../../store/slices/contentSlice";
import {
  getPosts,
  createPost,
  deletePost as deletePostApi,
  updatePostApi,
} from "../../lib/supabase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function PostsList() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    category_id: "",
    status: "draft",
  });

  const dispatch = useDispatch();
  const toast = useToast();
  const posts = useSelector((state) => state.content.posts);
  const categories = useSelector((state) => state.content.categories);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await getPosts();
      if (error) {
        toast({
          title: "Error fetching posts",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        dispatch(setPosts(data));
      }
    };
    fetchPosts();
  }, [dispatch, toast]);

  const handleOpenModal = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        category_id: post.category_id,
        status: post.status,
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: "",
        slug: "",
        content: "",
        category_id: "",
        status: "draft",
      });
    }
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        const { error } = await updatePostApi(editingPost.id, formData);
        if (error) throw error;
        dispatch(
          updatePost({
            ...editingPost,
            ...formData,
            updatedAt: new Date().toISOString(),
          })
        );
        toast({
          title: "Post updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const { data, error } = await createPost(formData);
        if (error) throw error;
        dispatch(addPost(data));
        toast({
          title: "Post created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (postId) => {
    try {
      const { error } = await deletePostApi(postId);
      if (error) throw error;
      dispatch(deletePost(postId));
      toast({
        title: "Post deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Button
        leftIcon={<FileText size={20} />}
        colorScheme="blue"
        mb={6}
        onClick={() => handleOpenModal()}
      >
        Create Post
      </Button>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Category</Th>
            <Th>Status</Th>
            <Th>Created At</Th>
            <Th>Last Updated</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {posts.map((post) => (
            <Tr key={post.id}>
              <Td>{post.title}</Td>
              <Td>{post.category_id}</Td>
              <Td>{post.status}</Td>
              <Td>{new Date(post.created_at).toLocaleDateString()}</Td>
              <Td>{new Date(post.updated_at).toLocaleDateString()}</Td>
              <Td>
                <IconButton
                  icon={<Pencil size={16} />}
                  size="sm"
                  mr={2}
                  onClick={() => handleOpenModal(post)}
                >
                  Edit
                </IconButton>
                <IconButton
                  icon={<Trash2 size={16} />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(post.id)}
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
            {editingPost ? "Edit Post" : "Create New Post"}
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
                  placeholder="Enter post title"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Slug</FormLabel>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="enter-post-slug"
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Category</FormLabel>
                <Select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
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
              {editingPost ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default PostsList;
