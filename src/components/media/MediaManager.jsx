import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  VStack,
  useToast,
  Input,
  SimpleGrid,
  Text,
  Image,
  HStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { Upload, Trash2, RefreshCcw, Download } from "lucide-react";
import {
  createMedia,
  deleteMedia,
  getMedia,
  supabase,
} from "../../lib/supabase";

function MediaManager() {
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const toast = useToast();
  const cancelRef = React.useRef();

  const fetchMedia = async () => {
    try {
      const { data, error } = await getMedia();
      if (error) throw error;
      setMediaFiles(data || []);
    } catch (error) {
      toast({
        title: "Error fetching media",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user_id = session?.user?.id;

    try {
      const uploadedFiles = await Promise.all(
        Array.from(files).map(async (file) => {
          const base64Url = await readFileAsBase64(file);
          return {
            name: file.name,
            url: base64Url,
            type: file.type,
            size: file.size,
            created_at: new Date().toISOString(),
            user_id: user_id,
          };
        })
      );

      const { error } = await createMedia(uploadedFiles);
      if (error) throw error;

      fetchMedia();

      toast({
        title: "Files uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      const { error } = await deleteMedia(fileId);
      if (error) throw error;

      fetchMedia();

      toast({
        title: "File deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFileId) return;
    try {
      const { error } = await deleteMedia(selectedFileId);
      if (error) throw error;

      fetchMedia();

      toast({
        title: "File deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsOpen(false);
      setSelectedFileId(null);
    }
  };

  return (
    <Box maxW="1200px" mx="auto" py={6}>
      <VStack spacing={6} align="stretch">
        <HStack spacing={4}>
          <Input
            type="file"
            multiple
            accept="*"
            display="none"
            id="file-upload"
            onChange={handleFileUpload}
          />
          <Button
            as="label"
            htmlFor="file-upload"
            leftIcon={<Upload size={20} />}
            colorScheme="blue"
            isLoading={uploading}
          >
            Upload Files
          </Button>
          <Button
            leftIcon={<RefreshCcw size={20} />}
            colorScheme="gray"
            onClick={fetchMedia}
          >
            Reload
          </Button>
        </HStack>

        {mediaFiles.length === 0 ? (
          <Text>No media files available.</Text>
        ) : (
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={6}>
            {mediaFiles.map((file) => (
              <Box
                key={file.id}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                position="relative"
                maxW="100%"
                textAlign="center"
                p={2}
              >
                {/* Clickable Preview Logic */}
                {file.type.startsWith("image/") ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    width="100%"
                    height="200px"
                    objectFit="cover"
                    borderRadius="md"
                    cursor="pointer"
                    // onClick={() => window.open(file.url, "_blank")}
                  />
                ) : file.type.startsWith("video/") ? (
                  <video
                    src={file.url}
                    controls
                    width="100%"
                    height="300px"
                    style={{ cursor: "pointer" }}
                    // onClick={() => window.open(file.url, "_blank")}
                  />
                ) : file.type.startsWith("audio/") ? (
                  <audio controls>
                    <source src={file.url} type={file.type} />
                    Your browser does not support the audio tag.
                  </audio>
                ) : file.type === "application/pdf" ? (
                  <iframe
                    src={file.url}
                    width="100%"
                    height="200px"
                    title={file.name}
                    style={{ cursor: "pointer" }}
                    // onClick={() => window.open(file.url, "_blank")}
                  />
                ) : file.type.startsWith("text/") ? (
                  <Box
                    p={4}
                    bg="gray.100"
                    height="200px"
                    width="100%"
                    overflow="hidden"
                    cursor="pointer"
                    // onClick={() => window.open(file.url, "_blank")}
                  >
                    <Text>{file.name}</Text>
                  </Box>
                ) : (
                  <Box
                    p={4}
                    bg="gray.200"
                    height="200px"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                  >
                    <Text fontSize="sm">{file.name}</Text>
                    <Button
                      leftIcon={<Download size={16} />}
                      as="a"
                      href={file.url}
                      download={file.name}
                      size="sm"
                      mt={2}
                    >
                      Download
                    </Button>
                  </Box>
                )}

                {/* Delete Button */}
                <Button
                  size="sm"
                  colorScheme="red"
                  leftIcon={<Trash2 size={16} />}
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={() => {
                    setSelectedFileId(file.id);
                    setIsOpen(true);
                  }}
                >
                  Delete
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Delete
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this file? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default MediaManager;
