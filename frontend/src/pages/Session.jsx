import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Flex,
  Progress,
  Modal,
  Text,
  Menu,
  Title,
  Input,
  Select,
  Divider,
  Paper,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowRightCircle,
  IconCalendarDue,
  IconCheck,
  IconNotebook,
  IconChevronRight,
  IconPencil,
  IconPlus,
  IconTrash,
  IconDotsVertical,
  IconHandMove,
} from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axiosAuthInstance from "../utils/axiosAuthinstance";

import { notifications } from "@mantine/notifications";

export const Session = () => {
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [completeOpened, { open: openComplete, close: closeComplete }] =
    useDisclosure(false);
  const [
    moveToPendingOpened,
    { open: openMoveToPending, close: closeMoveToPending },
  ] = useDisclosure(false);
  const [formOpened, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    topic: "",
    subject: "",
    from: null,
    to: null,
  });

  const [sessionId, setsessionId] = useState("");
  const [sessStatus, setSessStatus] = useState({
    sessionId: null,
    oldStatus: "",
  });
  const [userData, setUserData] = useState({});
  const [SubjectList, setSubjects] = useState([]);
  const [sessionList, setSessionList] = useState([]);

  const getsubjects = async () => {
    axiosAuthInstance.get("/getsubjects").then((response) => {
      if (response.data.status === 200) {
        setSubjects(response.data.data);
        // console.log("res", response.data.data);
      }
    });
  };

  const getSessions = async () => {
    axiosAuthInstance
      .get("/getsessions")
      .then((response) => {
        if (response.data.status === 200) {
          setSessionList(response.data.data);
          // console.log("sessions", response.data.data);
        }
      })
      .catch((error) => {
        notifications.show({
          title: "Fetch failed",
          message: "An error occurred during fetching sessions.",
        });
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    setUserData(decoded.data);
    getsubjects();
    getSessions();
  }, []);

  const handleAddSession = async () => {
    if (
      !formData.topic ||
      !formData.subject ||
      !formData.from ||
      !formData.to
    ) {
      notifications.show({
        title: "Error",
        message: "Please fill all field.",
      });
      return;
    }
    try {
      let response;
      if (isEdit === false) {
        response = await axiosAuthInstance.post(`/addsession`, {
          userId: userData._id,
          subjectName: formData.subject,
          topic: formData.topic,
          fromTime: formData.from,
          endTime: formData.to,
        });
      } else {
        response = await axiosAuthInstance.put(`/updatesession`, {
          sessionId: sessionId,
          subjectName: formData.subject,
          userId: userData._id,
          topic: formData.topic,
          fromTime: formData.from,
          endTime: formData.to,
        });
      }
      if (response.status === 200) {
        // console.log(isEdit ? "Updated:" : "Added:", formData);
        getSessions();
        closeForm();
      } else {
        notifications.show({
          color: "red",
          title: "Error",
          message: response.data || "An error occurred during adding session.",
        });
      }
    } catch (err) {
      notifications.show({
        color: "red",
        title: `${isEdit ? "update " : "add"} session failed`,
        message: `An error occurred during ${
          isEdit ? "updating " : "adding"
        } session.`,
      });
    }
  };

  const changeStatus = async () => {
    try {
      axiosAuthInstance.patch("/updatestatus", {
        sessionId: sessStatus.sessionId,
        oldStatus: sessStatus.oldStatus,
      });
      
      closeComplete();
      closeMoveToPending();
      getSessions();
    } catch (error) {
      notifications.show({
        color: "red",
        title: `status change failed`,
        message: `An error occurred during updating status`,
      });
    }
  };

  const deleteSession = async () => {
    try {
      const response = await axiosAuthInstance.delete("/deletesession", {
        headers: { sessionid: sessionId },
      });
      if (response.status === 200) {
        notifications.show({
          title: "Deleted",
          message: response.data || "session deleted Successfully",
        });
        getSessions();
        closeDelete();
      }
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Delete failed",
        message: "An error occurred during deleting subject.",
      });
      closeDelete();
    }
  };

  const handleEdit = (id) => {
    const editform = sessionList.filter((item) => item._id == id);
    // console.log("editform", editform);

    setFormData({
      topic: editform[0].topic,
      subject: editform[0].subjectId.subName,
      from: editform[0].fromTime,
      to: editform[0].endTime,
    });
    setsessionId(id);
    setIsEdit(true);
    openForm();
  };

  const handleAdd = () => {
    setFormData({
      topic: "",
      subject: "",
      from: null,
      to: null,
    });
    if (SubjectList.length == 0) {
      notifications.show({
        title: "Error",
        message: "Please add a subject first.",
      });
      return;
    }
    setIsEdit(false);
    openForm();
  };

  const filterSessions = (status) => {
    return sessionList.filter((session) => {
      const sessionDate = new Date(session.fromTime);
      const sessionDateOnly = new Date(
        sessionDate.getFullYear(),
        sessionDate.getMonth(),
        sessionDate.getDate()
      );

      let startOnly = null;
      if (startDate) {
        const parsedStart = new Date(startDate);
        if (!isNaN(parsedStart)) {
          startOnly = new Date(
            parsedStart.getFullYear(),
            parsedStart.getMonth(),
            parsedStart.getDate()
          );
        }
      }

      let endOnly = null;
      if (endDate) {
        const parsedEnd = new Date(endDate);
        if (!isNaN(parsedEnd)) {
          endOnly = new Date(
            parsedEnd.getFullYear(),
            parsedEnd.getMonth(),
            parsedEnd.getDate()
          );
        }
      }

      const matchesStatus = session.status === status;
      const matchesSubject =
        selectedSubject === "All" ||
        session.subjectId.subName === selectedSubject;
      const matchesStartDate = !startOnly || sessionDateOnly >= startOnly;
      const matchesEndDate = !endOnly || sessionDateOnly <= endOnly;

      return (
        matchesStatus && matchesSubject && matchesStartDate && matchesEndDate
      );
    });
  };

  const pend = filterSessions("pending").length;
  const comp = filterSessions("completed").length;
  const total = pend + comp;

  return (
    <>
      <Flex w="100%" direction="column" gap={20} p={20}>
        <Flex justify="space-between" align="center">
          <Title order={2}>Study Sessions</Title>

          <Flex align={"center"} gap={10}>
            <DatePickerInput
              leftSection={<IconCalendarDue color="gray" size={14} />}
              radius="md"
              placeholder="Pick date"
              flex={1}
              value={startDate}
              onChange={setStartDate}
              clearable
            />
            <IconChevronRight size={14} color="gray" />

            <DatePickerInput
              leftSection={<IconCalendarDue color="gray" size={14} />}
              radius="md"
              placeholder="Pick date"
              flex={1}
              value={endDate}
              onChange={setEndDate}
              clearable
            />

            <Select
              leftSection={<IconNotebook color="gray" size={14} />}
              w={150}
              radius="md"
              placeholder="Subject"
              data={["All", ...SubjectList.map((item) => item.subName)]}
              value={selectedSubject}
              onChange={setSelectedSubject}
              clearable = {false}
              allowDeselect={false}
            />
            <Button
              leftSection={<IconPlus size={14} />}
              radius="md"
              onClick={handleAdd}
            >
              Add New Session
            </Button>
          </Flex>
        </Flex>

        <Paper p={20} radius="md" withBorder>
          <Flex mb={15} gap={50} align="center">
            <Flex direction={"column"}>
              <Title order={1} c={"green"}>
                {filterSessions("completed").length}
              </Title>
              <Text size="sm" mr={10}>
                Completed Sessions
              </Text>
            </Flex>
            <Flex direction={"column"}>
              <Title order={1} c={"red"}>
                {filterSessions("pending").length}
              </Title>
              <Text size="sm" mr={10}>
                Pending Sessions
              </Text>
            </Flex>
          </Flex>
          <Progress.Root size="xl">
            <Progress.Section value={(comp / total) * 100} color="green">
              <Progress.Label>Completed</Progress.Label>
            </Progress.Section>
            <Progress.Section value={(pend / total) * 100} color="red">
              <Progress.Label>Pending</Progress.Label>
            </Progress.Section>
          </Progress.Root>
        </Paper>

        <Box>
          <Text mb={10} size="sm" c={"dimmed"}>
            Pending Sessions
          </Text>
          <Flex gap={10} wrap="wrap">
            {filterSessions("pending").length > 0 ? (
              filterSessions("pending").map((item) => (
                <Card
                  key={item._id}
                  style={{ height: "content-fit" }}
                  shadow="sm"
                  padding="sm"
                  radius="md"
                  withBorder
                >
                  <Flex align="center" direction="column" gap={5}>
                    <Flex
                      w={"100%"}
                      justify={"space-between"}
                      align={"center"}
                      gap={5}
                    >
                      <Badge
                        radius={0}
                        w="100%"
                        variant="light"
                        color={item.subjectId.subColor}
                      >
                        {item.subjectId.subName}
                      </Badge>
                      <Menu shadow="md">
                        <Menu.Target>
                          <ActionIcon
                            size={"xs"}
                            variant="default"
                            radius="sm"
                            aria-label="Delete"
                          >
                            <IconDotsVertical
                              style={{ width: "70%", height: "70%" }}
                              stroke={1.5}
                            />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            onClick={() => handleEdit(item._id)}
                            leftSection={<IconPencil size={14} />}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Item
                            onClick={openDelete}
                            leftSection={<IconTrash size={14} />}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Flex>

                    <Text size="sm">{item.topic}</Text>
                    <Flex gap={5} align="center">
                      <Text size="xs">{item.fromTime}</Text>
                      <IconArrowRightCircle color="gray" />
                      <Text size="xs">{item.endTime}</Text>
                    </Flex>
                    <Button
                      onClick={() => {
                        setSessStatus({
                          sessionId: item._id,
                          oldStatus: item.status,
                        });
                        openComplete();
                      }}
                      fullWidth
                      variant="default"
                      color="green"
                      size="xs"
                      radius={"md"}
                      leftSection={<IconCheck size={14} />}
                    >
                      Done
                    </Button>
                  </Flex>
                </Card>
              ))
            ) : (
              <Text size="sm" c={"green"}>
                No Pending Sessions
              </Text>
            )}
          </Flex>
        </Box>

        <Divider />

        <Box>
          <Text mb={10} size="sm" c={"dimmed"}>
            Completed Sessions
          </Text>
          <Flex gap={10} wrap="wrap">
            {filterSessions("completed").length > 0 ? (
              filterSessions("completed").map((item) => (
                <Card
                  key={item._id}
                  style={{ height: "content-fit" }}
                  padding="sm"
                  radius="md"
                  withBorder
                >
                  <Flex align="center" direction="column" gap={5}>
                    <Flex
                      w={"100%"}
                      justify={"space-between"}
                      align={"center"}
                      gap={5}
                    >
                      <Badge
                        radius={0}
                        w="100%"
                        variant="light"
                        color={item.subjectId.subColor}
                      >
                        {item.subjectId.subName}
                      </Badge>
                      <Menu shadow="md">
                        <Menu.Target>
                          <ActionIcon
                            size={"xs"}
                            variant="default"
                            radius="sm"
                            aria-label="Delete"
                          >
                            <IconDotsVertical
                              style={{ width: "70%", height: "70%" }}
                              stroke={1.5}
                            />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            onClick={() => handleEdit(item._id)}
                            leftSection={<IconPencil size={14} />}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Item
                            onClick={() => {
                              setsessionId(item._id);
                              openDelete();
                            }}
                            leftSection={<IconTrash size={14} />}
                          >
                            Delete
                          </Menu.Item>
                          <Menu.Item
                            onClick={() => {
                              setSessStatus({
                                sessionId: item._id,
                                oldStatus: item.status,
                              });
                              openMoveToPending();
                            }}
                            leftSection={<IconHandMove size={14} />}
                          >
                            Mark as Incomplete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Flex>

                    <Text size="sm">{item.topic}</Text>
                    <Flex gap={5} align="center">
                      <Text size="xs">{item.fromTime}</Text>
                      <IconArrowRightCircle color="gray" />
                      <Text size="xs">{item.endTime}</Text>
                    </Flex>
                  </Flex>
                </Card>
              ))
            ) : (
              <Text size="sm" c={"red"}>
                No Completed Sessions
              </Text>
            )}
          </Flex>
        </Box>
      </Flex>

      {/* Shared Add/Edit Modal */}
      <Modal
        radius="lg"
        opened={formOpened}
        onClose={closeForm}
        title={isEdit ? "Edit Session" : "Add Session"}
      >
        <Flex gap={10} direction="column">
          <Input.Wrapper label="Topic">
            <Input
              value={formData.topic}
              onChange={(e) =>
                setFormData({ ...formData, topic: e.target.value })
              }
              placeholder="topic"
              radius="md"
            />
          </Input.Wrapper>

          <Select
            radius="md"
            label="Subject"
            placeholder="Subject"
            data={SubjectList.map((item) => item.subName)}
            value={formData.subject}
            onChange={(value) => {
              setFormData({ ...formData, subject: value });
            }}
          />

          <Flex gap={10} justify="space-between">
            <DatePickerInput
              radius="md"
              label="From"
              placeholder="Pick date"
              value={formData.from}
              onChange={(value) => setFormData({ ...formData, from: value })}
              flex={1}
            />
            <DatePickerInput
              radius="md"
              label="Up To"
              placeholder="Pick date"
              value={formData.to}
              onChange={(value) => setFormData({ ...formData, to: value })}
              flex={1}
            />
          </Flex>

          <Flex mt="md" justify="flex-end" gap="sm">
            <Button radius="md" variant="default" onClick={closeForm}>
              Cancel
            </Button>
            <Button
              radius="md"
              color="green"
              onClick={() => handleAddSession()}
            >
              {isEdit ? "Update" : "Add"}
            </Button>
          </Flex>
        </Flex>
      </Modal>

      {/* Delete Modal */}
      <Modal
        radius="lg"
        opened={deleteOpened}
        onClose={closeDelete}
        title="Confirm Deletion"
      >
        <Text>Are you sure you want to delete this session?</Text>
        <Flex mt="md" justify="flex-end" gap="sm">
          <Button radius="md" variant="default" onClick={closeDelete}>
            Cancel
          </Button>
          <Button
            radius="md"
            color="red"
            onClick={() => {
              deleteSession();
              closeDelete();
            }}
          >
            Delete
          </Button>
        </Flex>
      </Modal>

      {/* Complete Modal */}
      <Modal
        radius="lg"
        opened={completeOpened}
        onClose={closeComplete}
        title="Mark as Completed"
      >
        <Text>Do you want to mark this session as completed?</Text>
        <Flex mt="md" justify="flex-end" gap="sm">
          <Button radius="md" variant="default" onClick={closeComplete}>
            Cancel
          </Button>
          <Button radius="md" color="green" onClick={changeStatus}>
            Confirm
          </Button>
        </Flex>
      </Modal>

      {/* MoveToPending Modal */}
      <Modal
        radius="lg"
        opened={moveToPendingOpened}
        onClose={closeMoveToPending}
        title="Move to Pending"
      >
        <Text>Mark this session as Pending?</Text>
        <Flex mt="md" justify="flex-end" gap="sm">
          <Button radius="md" variant="default" onClick={closeComplete}>
            Cancel
          </Button>
          <Button radius="md" color="green" onClick={changeStatus}>
            Confirm
          </Button>
        </Flex>
      </Modal>
    </>
  );
};
