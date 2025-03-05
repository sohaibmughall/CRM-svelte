import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Heading,
  HStack,
  useToast,
  TableContainer,
  Text,
  IconButton,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { deleteCustomer, getCustomers } from '../lib/supabase';
import { setCustomers, deleteCustomer as deleteCustomerAction } from '../store/slices/customersSlice';

function CustomerList() {
  const [loading, setLoading] = useState(true);
  const customers = useSelector((state) => state.customers.customers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await getCustomers();
      if (error) {
        toast({
          title: 'Error fetching customers',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        dispatch(setCustomers(data));
      }
      setLoading(false);
    };
    fetchCustomers();
  }, [dispatch, toast]);

  const handleDelete = async (id) => {
    try {
      const { error } = await deleteCustomer(id);
      if (error) throw error;
      
      dispatch(deleteCustomerAction(id));
      toast({
        title: 'Customer deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting customer',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="1200px" mx="auto" p={4}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Customers</Heading>
        <Button leftIcon={<UserPlus size={20} />} colorScheme="blue" onClick={() => navigate('/customers/new')}>
          Add Customer
        </Button>
      </HStack>

      {loading ? (
        <Center py={10}>
          <Spinner size="xl" />
        </Center>
      ) : (
        <TableContainer borderRadius="lg" boxShadow="md" overflowX="auto">
          {customers.length > 0 ? (
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Company</Th>
                  <Th textAlign="center">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {customers.map((customer) => (
                  <Tr key={customer.id} _hover={{ bg: 'gray.100' }}>
                    <Td>{customer.name}</Td>
                    <Td>{customer.email}</Td>
                    <Td>{customer.phone}</Td>
                    <Td>{customer.company}</Td>
                    <Td>
                      <HStack spacing={2} justify="center">
                        <IconButton
                          icon={<Pencil size={16} />}
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => navigate(`/customers/edit/${customer.id}`)}
                          aria-label="Edit customer"
                        />
                        <IconButton
                          icon={<Trash2 size={16} />}
                          colorScheme="red"
                          variant="outline"
                          onClick={() => handleDelete(customer.id)}
                          aria-label="Delete customer"
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg" color="gray.600">No customers found.</Text>
            </Box>
          )}
        </TableContainer>
      )}
    </Box>
  );
}

export default CustomerList;