import { Flex, Paper, Image, Avatar, Divider, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export const Header = () => {
  const isMobile = useMediaQuery("(max-width: 750px)");
  const name = localStorage.getItem("username");
  return (
    <>
      <Paper px="xl" py="sm">
        <Flex
          w="100%"
          justify="space-between"
          align="center"
          wrap={"wrap"}
          gap={15}
        >
          <Image radius="md" w={200} src="/StudyLobby.svg" />
          <Flex gap={15} align="center">
            {!isMobile && <Text>{`${name}` || ""}</Text>}

            <Avatar src={"/avatar.svg"} />
          </Flex>
        </Flex>
      </Paper>
      <Divider />
    </>
  );
};
