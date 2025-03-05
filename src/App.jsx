import React from "react";
import { ChakraProvider, Box, ColorModeScript } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import CustomerList from "./components/CustomerList";
import CustomerForm from "./components/CustomerForm";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import ContentManager from "./components/content/ContentManager";
import MediaManager from "./components/media/MediaManager";
import UserManager from "./components/users/UserManager";
import Settings from "./components/settings/Settings";
import SignUp from "./components/auth/SignUp";

function App() {
  return (
    <Box minH="100vh">
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <Navbar />
        <Box p={4}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <PrivateRoute>
                  <CustomerList />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers/new"
              element={
                <PrivateRoute>
                  <CustomerForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers/edit/:id"
              element={
                <PrivateRoute>
                  <CustomerForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/content/*"
              element={
                <PrivateRoute>
                  <ContentManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/media"
              element={
                <PrivateRoute>
                  <MediaManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute roles={["admin"]}>
                  <UserManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Router>
    </Box>
  );
}

export default App;
