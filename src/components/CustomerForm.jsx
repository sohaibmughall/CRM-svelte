import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, updateCustomer } from "../store/slices/customersSlice";
import {
  createCustomer,
  updateCustomer as updateCustomerApi,
} from "../lib/supabase";

function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const customers = useSelector((state) => state.customers.customers);
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  useEffect(() => {
    if (id) {
      const customer = customers.find((c) => c.id === id);
      if (customer) {
        setFormData(customer);
      }
    }
  }, [id, customers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        const { data, error } = await updateCustomerApi(id, formData);
        if (error) throw error;

        dispatch(updateCustomer({ ...data }));
        toast({
          title: "Customer updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const { data, error } = await createCustomer(formData, user);
        if (error) throw error;

        dispatch(addCustomer(data));
        toast({
          title: "Customer added.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      navigate("/customers");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box maxW="600px" mx="auto">
      <Heading size="lg" mb={6}>
        {id ? "Edit Customer" : "Add New Customer"}
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter customer name"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Phone</FormLabel>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Company</FormLabel>
            <Input
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            {id ? "Update Customer" : "Add Customer"}
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default CustomerForm;
