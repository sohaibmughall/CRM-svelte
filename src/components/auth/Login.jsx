import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Container,
  HStack,
  Text,
  Link,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../../store/slices/authSlice";
import { signIn, signInWithOtp } from "../../lib/supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await signIn({ email, password });
      if (error) throw error;

      dispatch(
        login({
          user: data.user,
          token: data.session.access_token,
          role: data.user.user_metadata.role || "viewer",
        })
      );

      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithOtp(phone);
      if (error) throw error;
      setIsOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Check your phone for the OTP.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await signInWithOtp(phone, otp);
      if (error) throw error;

      dispatch(
        login({
          user: data.user,
          token: data.session.access_token,
          role: data.user.user_metadata.role || "viewer",
        })
      );

      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Box bg="white" p={8} rounded="lg" shadow="base">
        <VStack spacing={4}>
          <Heading size="lg">Login to CRM</Heading>
          <Tabs
            variant="line"
            colorScheme="blue"
            align="center"
            width="full"
            borderRadius={1}
          >
            <TabList justifyContent="center">
              <Tab style={{ width: "50%" }}>Email</Tab>
              <Tab style={{ width: "50%" }}>Phone</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <form onSubmit={handleEmailLogin} style={{ width: "100%" }}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                        />
                        <InputRightElement>
                          <IconButton
                            icon={
                              showPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )
                            }
                            variant="ghost"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      width="full"
                      isLoading={isLoading}
                    >
                      Login
                    </Button>
                  </VStack>
                </form>
              </TabPanel>
              <TabPanel>
                <form onSubmit={handleVerifyOtp} style={{ width: "100%" }}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        isDisabled={isOtpSent}
                      />
                    </FormControl>
                    {isOtpSent && (
                      <FormControl isRequired>
                        <FormLabel>OTP</FormLabel>
                        <Input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter OTP"
                        />
                      </FormControl>
                    )}
                    {!isOtpSent ? (
                      <Button
                        colorScheme="blue"
                        width="full"
                        onClick={handleSendOtp}
                        isLoading={isLoading}
                      >
                        Send OTP
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        colorScheme="blue"
                        width="full"
                        isLoading={isLoading}
                      >
                        Verify OTP
                      </Button>
                    )}
                  </VStack>
                </form>
              </TabPanel>
            </TabPanels>
          </Tabs>
          {/* <HStack justify="center" width="full" pt={2}>
            <Text>Don't have an account?</Text>
            <Link as={RouterLink} to="/signup" color="blue.500">
              Sign up here
            </Link>
          </HStack> */}
        </VStack>
      </Box>
    </Container>
  );
}

export default Login;
