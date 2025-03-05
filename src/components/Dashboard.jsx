import React, { useEffect } from "react";
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Building, Mail } from "lucide-react";
import { getCustomers } from "../lib/supabase";
import { setCustomers } from "../store/slices/customersSlice";

function StatCard({ title, value, icon: Icon, helpText }) {
  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="sm" color={"black"}>
      <Stat>
        <Box display="flex" alignItems="center" mb={2}>
          <Box mr={2}>
            <Icon size={24} />
          </Box>
          <StatLabel fontSize="lg">{title}</StatLabel>
        </Box>
        <StatNumber fontSize="3xl">{value}</StatNumber>
        {helpText && <StatHelpText>{helpText}</StatHelpText>}
      </Stat>
    </Box>
  );
}

function Dashboard() {
  const customers = useSelector((state) => state.customers.customers);

  const totalCustomers = customers?.length;
  const totalCompanies = new Set(customers.map((c) => c.company)).size;
  const activeEmails = customers.filter((c) => c.email).length;

  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await getCustomers();
      if (error) {
        toast({
          title: "Error fetching customers",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        dispatch(setCustomers(data));
      }
    };
    fetchCustomers();
  }, [dispatch, toast]);

  return (
    <Box maxW="1200px" mx="auto">
      <Heading size="lg" mb={6}>
        Dashboard
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon={Users}
          helpText="All registered customers"
        />
        <StatCard
          title="Companies"
          value={totalCompanies}
          icon={Building}
          helpText="Unique companies"
        />
        <StatCard
          title="Active Emails"
          value={activeEmails}
          icon={Mail}
          helpText="Customers with email"
        />
        <StatCard
          title="Active Emails"
          value={activeEmails}
          icon={Mail}
          helpText="Customers with email"
        />
        <StatCard
          title="Active Emails"
          value={activeEmails}
          icon={Mail}
          helpText="Customers with email"
        />
        <StatCard
          title="Active Emails"
          value={activeEmails}
          icon={Mail}
          helpText="Customers with email"
        />
      </SimpleGrid>
    </Box>
  );
}

export default Dashboard;
