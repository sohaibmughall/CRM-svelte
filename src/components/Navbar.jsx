import React from "react";
import {
  Box,
  Flex,
  Button,
  Heading,
  Spacer,
  useColorMode,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
} from "@chakra-ui/react";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Settings,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { logout } from "../store/slices/authSlice";

function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  return (
    <Box
      bg={colorMode === "dark" ? "gray.900" : "blue.600"}
      px={6}
      py={4}
      boxShadow="md"
    >
      <Flex alignItems="center" maxW="1200px" mx="auto">
        <Heading size="lg" color="white" fontWeight="bold">
          <Link to={"/"}>React CRM</Link>
        </Heading>
        <Spacer />

        {[
          { label: "Dashboard", to: "/", icon: LayoutDashboard },
          { label: "Customers", to: "/customers", icon: Users },
          { label: "Content", to: "/content", icon: FileText },
          { label: "Media", to: "/media", icon: ImageIcon },
        ].map((item) => (
          <Tooltip label={item.label} key={item.to} hasArrow>
            <Button
              as={RouterLink}
              to={item.to}
              leftIcon={<item.icon size={20} />}
              colorScheme="whiteAlpha"
              variant="ghost"
              mr={2}
            >
              {item.label}
            </Button>
          </Tooltip>
        ))}

        {role === "admin" && (
          <Tooltip label="Users" hasArrow>
            <Button
              as={RouterLink}
              to="/users"
              leftIcon={<Users size={20} />}
              colorScheme="whiteAlpha"
              variant="ghost"
              mr={2}
            >
              Users
            </Button>
          </Tooltip>
        )}

        <Tooltip label="Toggle Color Mode" hasArrow>
          <IconButton
            icon={colorMode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            onClick={toggleColorMode}
            variant="ghost"
            colorScheme="whiteAlpha"
            mr={2}
            aria-label="Toggle color mode"
          />
        </Tooltip>

        <Menu>
          <Tooltip label="Profile & Settings" hasArrow>
            <MenuButton
              as={Avatar}
              size="sm"
              name={user?.name}
              cursor="pointer"
            />
          </Tooltip>
          <MenuList>
            <MenuItem
              icon={<Settings size={20} />}
              as={RouterLink}
              to="/settings"
            >
              Settings
            </MenuItem>
            <MenuItem icon={<LogOut size={20} />} onClick={handleLogout}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
}

export default Navbar;
