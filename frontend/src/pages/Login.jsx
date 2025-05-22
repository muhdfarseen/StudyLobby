import {
  Card,
  Image,
  Text,
  Button,
  Flex,
  Input,
  Anchor,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import { BackendURL } from "../utils/constants";
import { jwtDecode } from "jwt-decode";
import { notifications } from "@mantine/notifications";
import axiosAuthInstance from "../utils/axiosAuthinstance";
import logo from "../assets/StudyLobby.svg"

export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateToSignup = () => {
    navigate("/signup");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      notifications.show({
        title: "Error",
        message: "Please fill in both email and password.",
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notifications.show({
        title: "Error",
        message: "Please enter a valid email address.",
      });
      return;
    }
    try {
      const response = await axios.post(
        `${BackendURL}login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.status === 200) {
        const decoded = jwtDecode(response.data.data);
        localStorage.setItem("token", response.data.data);

        axiosAuthInstance.defaults.headers[
          "Authorization"
        ] = `Bearer ${response.data.data}`;

        console.log(decoded.data.username);
        localStorage.setItem("username", decoded.data.username);
        navigate("/dashboard/session");
      } else {
        notifications.show({
          title: "Login failed",
          message: response.data.msg || "An error occurred during login.",
        });
      }
    } catch (err) {
      notifications.show({
        title: "Login failed",
        message: "An error occurred during login.",
      });
    }
  };

  return (
    <Flex
      direction={"column"}
      gap={30}
      justify="center"
      align="center"
      h={"100vh"}
    >
      <Image radius="md" w={250} src={logo} />
      <Card w={300} shadow="sm" padding="lg" radius="lg" withBorder>
        <Flex direction={"column"} gap={10}>
          <Title order={3}>Log in</Title>
          <Input.Wrapper label="Email">
            <Input
              required
              type="email"
              placeholder="email"
              radius="md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Input.Wrapper>
          <Input.Wrapper label="Password">
            <Input
              required
              type="password"
              placeholder="password"
              radius="md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Input.Wrapper>
          <Button onClick={handleLogin} color="blue" fullWidth radius="md">
            Sign in
          </Button>
          <Anchor align="center" href="#" size="sm">
            <Flex
              onClick={navigateToSignup}
              w={"100%"}
              gap={5}
              justify={"center"}
              align="center"
            >
              <Text c="dimmed"> Don't have an account? </Text>
              <b>Sign up</b>
            </Flex>
          </Anchor>
        </Flex>
      </Card>
    </Flex>
  );
};
