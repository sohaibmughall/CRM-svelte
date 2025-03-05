import React from 'react';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Switch,
  Text,
  Divider,
  useColorMode,
} from '@chakra-ui/react';

function Settings() {
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleSave = (e) => {
    e.preventDefault();
    toast({
      title: 'Settings saved successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="800px" mx="auto" py={6}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Settings</Heading>

        <Box>
          <Heading size="md" mb={4}>Appearance</Heading>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">
              Dark Mode
            </FormLabel>
            <Switch
              isChecked={colorMode === 'dark'}
              onChange={toggleColorMode}
            />
          </FormControl>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>SEO Settings</Heading>
          <form onSubmit={handleSave}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Site Title</FormLabel>
                <Input placeholder="Enter site title" />
              </FormControl>

              <FormControl>
                <FormLabel>Meta Description</FormLabel>
                <Input placeholder="Enter meta description" />
              </FormControl>

              <FormControl>
                <FormLabel>Keywords</FormLabel>
                <Input placeholder="Enter keywords (comma-separated)" />
              </FormControl>

              <Button type="submit" colorScheme="blue">
                Save SEO Settings
              </Button>
            </VStack>
          </form>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>Analytics Integration</Heading>
          <FormControl>
            <FormLabel>Google Analytics ID</FormLabel>
            <Input placeholder="Enter Google Analytics ID" />
          </FormControl>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>API Settings</Heading>
          <Text mb={4}>Configure API access and authentication settings.</Text>
          <Button colorScheme="blue">
            Generate New API Key
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}

export default Settings;