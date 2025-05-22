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
import axiosInstance from "../utils/axiosInstance";
import { notifications } from "@mantine/notifications";
import logo from "../assets/StudyLobby.svg"


export const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setErrorMsg("Please fill in all the fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/register", {
        username: form.name,
        email: form.email,
        password: form.password,
      });

      if (response.data) {
        navigate("/");
        notifications.show({
                title: `Registration Successful`,
                message: `You have successfully registered!`,
              });
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigate("/");
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
          <Title order={3}>Sign Up</Title>

          <Input.Wrapper label="Name">
            <Input
              required
              placeholder="name"
              radius="md"
              value={form.name}
              onChange={handleChange("name")}
            />
          </Input.Wrapper>

          <Input.Wrapper label="Email">
            <Input
              required
              type="email"
              placeholder="email"
              radius="md"
              value={form.email}
              onChange={handleChange("email")}
            />
          </Input.Wrapper>

          <Input.Wrapper label="Password">
            <Input
              required
              type="password"
              placeholder="password"
              radius="md"
              value={form.password}
              onChange={handleChange("password")}
            />
          </Input.Wrapper>

          <Input.Wrapper label="Confirm Password">
            <Input
              required
              type="password"
              placeholder="confirm password"
              radius="md"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
            />
          </Input.Wrapper>

          {errorMsg && (
            <Text size="sm" color="red">
              {errorMsg}
            </Text>
          )}

          <Button
            color="blue"
            fullWidth
            radius="md"
            onClick={handleSubmit}
            loading={loading}
          >
            Sign up
          </Button>

          <Anchor align="center" href="#" size="sm">
            <Flex
              onClick={navigateToLogin}
              w={"100%"}
              gap={5}
              justify={"center"}
              align="center"
            >
              <Text c="dimmed">Already have an account?</Text>
              <b>Sign in</b>
            </Flex>
          </Anchor>
        </Flex>
      </Card>
    </Flex>
  );
};
