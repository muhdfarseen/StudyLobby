import { Divider, Flex } from "@mantine/core";
import { Header } from "../components/Header";
import { Outlet, useNavigate } from "react-router";
import { SideBar } from "../components/SideBar";
import { useEffect } from "react";

export const Dashboard = () => {

  const navigate=useNavigate()

  useEffect(()=>{

    const token=localStorage.getItem("token")
    if(!token){
      navigate('/')
    }

  },[])

  return (
    <Flex direction={"column"}>
      <Header />
      <Flex>
        <SideBar />
        <Divider orientation="vertical" />
        <Outlet />
      </Flex>
    </Flex>
  );
};
