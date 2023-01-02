import React from "react";
import { useNavigate } from "react-router-dom";
import ChatSc from "./chat-sc";

function StartChat({ computer }) { 
  const navigate = useNavigate();

  const createChat = async (e) => {
    try {
      e.preventDefault();
      const publicKey = computer.getPublicKey();
      console.log('creating chat')
      let chat
      try {
        console.log(`ChatSc ${ChatSc} ${publicKey}`)
        chat = await computer.new(ChatSc, [publicKey]);
      } catch (err) {
        console.log('error creating chat', err)
      }
      console.log('created chat', chat)
      navigate(`/chat/${chat._id}`);
    } catch (err) {
      if (err.message.startsWith("Insufficient balance in address"))
        alert("You have to fund your wallet https://faucet.bitcoincloud.net/");
    }
  };
  return (
    <div>
      <button onClick={createChat}>Create Chat</button>
    </div>
  );
}

export default StartChat;
