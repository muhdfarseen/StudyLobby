import { Flex, NavLink } from "@mantine/core";
import {
  IconTimelineEvent,
  IconNotebook,
  IconLogout2,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router";

export const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (param) => {
    navigate(param);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Flex
      h={"calc(100vh - 63px)"}
      w={200}
      justify={"space-between"}
      direction={"column"}
      p={10}
    >
      <Flex direction={"column"} >
        <NavLink
          style={{ borderRadius: 10 }}
          label="Session"
          leftSection={<IconTimelineEvent size={16} stroke={1.5} />}
          onClick={() => handleNavigation("/dashboard/session")}
          active={location.pathname === "/dashboard/session"}
        />
        <NavLink
          style={{ borderRadius: 10 }}
          label="Subject"
          leftSection={<IconNotebook size={16} stroke={1.5} />}
          onClick={() => handleNavigation("/dashboard/subject")}
          active={location.pathname === "/dashboard/subject"}
        />
      </Flex>

      <NavLink
        style={{ borderRadius: 10 }}
        onClick={handleLogout}
        label="Log Out"
        leftSection={<IconLogout2 size={16} stroke={1.5} />}
        variant="light"
        color="red"
        c={"red"}
        active
      />
    </Flex>
  );
};
