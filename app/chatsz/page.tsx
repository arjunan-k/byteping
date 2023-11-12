"use client";

import { motion } from "framer-motion";
import { fetchChats } from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { ChatState } from "@/contexts/ChatProvider";
import SideDrawer from "@/components/SideDrawer/SideDrawer";
import MyChats from "@/components/MyChats/MyChats";
import ChatBox from "@/components/ChatBox";
import Container from "@/styles/Container.styled";
import Flex from "@/styles/Flex.styled";
import Text from "@/styles/Text.styled";
import Theme from "@/styles/Theme.styled";
import Link from "next/link";

type Chat = {
  _id: string;
  chatName: string;
};

const Home = () => {
  const { user } = ChatState() || { user: null };

  const {
    data: chats,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["chats", { name: "j" }],
    queryFn: ({ signal }) => fetchChats({ signal, name: "j" }),
    staleTime: 5000,
    gcTime: 1000
  });

  const { data: newChat } = useQuery({
    queryKey: ["chats"],
    queryFn: fetchChats
  });

  const childVariants = {
    hidden: {
      opacity: 0,
      x: -50
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  let message;

  if (isLoading) {
    message = (
      <p>
        <Link href={"/chats"}>Loading...</Link>
      </p>
    );
  }

  if (isError) {
    message = <p>{`There is a error: ${error?.message || ""}`}</p>;
  }

  if (chats) {
    message = (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {chats.map((chat: Chat) => (
          <motion.div key={chat._id} variants={childVariants}>
            {chat.chatName}
          </motion.div>
        ))}
        {newChat?.map((chat: Chat) => (
          <motion.div key={chat._id} variants={childVariants}>
            {chat.chatName}
          </motion.div>
        ))}

        <Container border="4px solid red" borderRadius="4px">
          {user && <SideDrawer />}
        </Container>

        <Flex backgroundColor="#8EA7E9" textColor="#000" justifyContent="space-between">
          <Container>Search User</Container>
          <Text
            fontFamily={Theme.fonts.secondary}
            fontSize="30px"
            letterSpacing="1.6px"
            wordSpacing="0"
            color="#000000"
            fontWeight="700"
            textDecoration="none"
            fontStyle="normal"
            fontVariant="small-caps"
            textTransform="uppercase"
          >
            BytePing
          </Text>
          <Container>Account</Container>
          <Link href="/chat">chat page link</Link>
        </Flex>

        <section style={{ display: "flex", width: "100%", gap: "30px" }}>
          {user && <MyChats />}
          {user && <ChatBox />}
        </section>
      </motion.div>
    );
  }
  return message;
};

export default Home;
