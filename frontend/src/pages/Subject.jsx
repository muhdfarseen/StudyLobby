import { DonutChart } from "@mantine/charts";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Flex,
  Modal,
  Text,
  Menu,
  Title,
  Input,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import {
  IconDotsVertical,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import axiosAuthInstance from "../utils/axiosAuthinstance";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const Subject = () => {
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [formOpened, { open: openForm, close: closeForm }] =
    useDisclosure(false);

  const [editMode, setEditMode] = useState(false);
  const [subId, setSubid] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    color: "",
  });
  const [userData, setUserData] = useState({});
  const [subjectData, setSubject] = useState([]);

  const fetchDataSubject = async () => {
    axiosAuthInstance
      .get("/getsubjects")
      .then((response) => {
        if (response.data.status === 200) {
          setSubject(response.data.data);
           console.log("res sub data :", response.data.data);
        }
      })
      .catch((error) => {
        notifications.show({
          title: "Fetch failed",
          message: "An error occurred during fetching subject.",
        });
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    fetchDataSubject();

    setUserData(decoded.data);
  }, []);

  // console.log("uder", userData);

  const handleEdit = (subject) => {
    setEditMode(true);
    setFormData(subject);

    openForm();
  };

  const handleAdd = () => {
    setEditMode(false);
    setFormData({ name: "", color: "blue" });

    openForm();
  };
  // console.log(editMode);

  const handleAddSub = async () => {
    if (!formData.name) {
      notifications.show({
        title: "Error",
        message: "Please enter a subject name.",
      });
      return;
    }
    try {
      let response;
      if (editMode === false) {
        response = await axiosAuthInstance.post(`/addsubject`, {
          userId: userData._id,
          subName: formData.name,
          subColor: formData.color,
        });
      } else {
        response = await axiosAuthInstance.put(`/updatesubject`, {
          subId: subId,
          userId: userData._id,
          subName: formData.name,
          subColor: formData.color,
        });
      }

      if (response.status === 200) {
        // console.log(editMode ? "Updated:" : "Added:", formData);
        closeForm();

        fetchDataSubject();
      } else {
        notifications.show({
          title: "Some error occured",
          message: response.data || " ",
        });
      }
    } catch (err) {
      notifications.show({
        title: `${editMode ? "update " : "add"} subject failed`,
        message: `An error occurred during ${
          editMode ? "updating " : "adding"
        } subject.`,
      });
    }
  };

  const DeleteSubject = async () => {
    try {
      const response = await axiosAuthInstance.delete("/deletesubject", {
        headers: { subid: subId },
      });
      if (response.status === 200) {
        fetchDataSubject();

        notifications.show({
          title: "Deleted",
          message: response.data || "Subject deleted Successfully",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Delete failed",
        message: "An error occurred during deleting subject.",
      });
    }
  };

  return (
    <>
      <Flex w="100%" direction="column" gap={20} p={20}>
        <Flex justify="space-between" align="center">
          <Title order={2}>Subjects</Title>
          <Button
            leftSection={<IconPlus size={14} />}
            radius="md"
            onClick={handleAdd}
          >
            Add New Subject
          </Button>
        </Flex>

        <Flex gap={20} wrap="wrap">
          {subjectData.length > 0 ? (
            subjectData.map((item, index) => (
              <Card
                key={index}
                style={{ height: "content-fit" }}
                shadow="sm"
                padding="sm"
                radius="md"
                withBorder
              >
                <Flex align="center" direction="column" gap={20}>
                  <Flex
                    w={"100%"}
                    justify={"space-between"}
                    align={"center"}
                    gap={5}
                  >
                    <Badge
                      size="lg"
                      radius={0}
                      w="100%"
                      variant="light"
                      color={item.subColor}
                    >
                      {item.subName}
                    </Badge>
                    <Menu shadow="md">
                      <Menu.Target>
                        <ActionIcon
                          size={"sm"}
                          variant="default"
                          radius="sm"
                          aria-label="Options"
                        >
                          <IconDotsVertical
                            style={{ width: "70%", height: "70%" }}
                            stroke={1.5}
                          />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconPencil size={14} />}
                          onClick={() => {
                            setSubid(item._id);
                            handleEdit({
                              name: `${item.subName}`,
                              color: `${item.subColor}`,
                            });
                          }}
                        >
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => {
                            setSubid(item._id);
                            openDelete();
                          }}
                          leftSection={<IconTrash size={14} />}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Flex>

                  <DonutChart
                    size={100}
                    thickness={15}
                    data={[
                      { name: "Completed", value: item.completedCount, color: "teal.6" },
                      { name: "Pending", value: item.pendingCount, color: "yellow.6" },
                    ]}
                  />

                  <Flex>
                    <Flex gap={20} align="center">
                      <Flex direction={"column"}>
                        <Title order={1} c={"teal.6"}>
                          {item.completedCount}
                        </Title>
                        <Text c={"dimmed"} size="xs">
                          Completed <br /> Sessions
                        </Text>
                      </Flex>
                      <Flex direction={"column"}>
                        <Title order={1} c={"yellow.6"}>
                          {item.pendingCount}
                        </Title>
                        <Text c={"dimmed"} size="xs">
                          Pending <br /> Sessions
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </Card>
            ))
          ) : (
            <Text size="sm" c={"red"}>
              No subjects added yet
            </Text>
          )}
        </Flex>
      </Flex>

      {/* Confirm Delete Modal */}
      <Modal
        radius="lg"
        opened={deleteOpened}
        onClose={closeDelete}
        title="Confirm Deletion"
      >
        <Text>Are you sure you want to delete this subject?</Text>
        <Flex mt="md" justify="flex-end" gap="sm">
          <Button radius="md" variant="default" onClick={closeDelete}>
            Cancel
          </Button>
          <Button
            radius="md"
            color="red"
            onClick={() => {
              DeleteSubject(), closeDelete();
            }}
          >
            Delete
          </Button>
        </Flex>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        radius="lg"
        opened={formOpened}
        onClose={closeForm}
        title={editMode ? "Edit Subject" : "Add New Subject"}
      >
        <Flex direction="column" gap="md">
          <Input.Wrapper label="Subject Name">
            <Input
              radius={"md"}
              placeholder="Enter subject name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.currentTarget.value })
              }
            />
          </Input.Wrapper>
          <Select
            radius={"md"}
            label="Color"
            data={["red", "blue", "yellow", "green", "orange", "pink"]}
            value={formData.color}
            onChange={(value) => setFormData({ ...formData, color: value })}
          />

          <Flex justify="flex-end" gap="sm">
            <Button radius={"md"} variant="default" onClick={closeForm}>
              Cancel
            </Button>
            <Button radius={"md"} onClick={handleAddSub}>
              {editMode ? "Update" : "Add"}
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};
