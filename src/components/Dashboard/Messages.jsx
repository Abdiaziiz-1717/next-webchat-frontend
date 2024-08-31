"use client";
import React, { useEffect, useState, useContext } from "react";
import PlaceHolder from "../../../public/images/user_149071.png";
import { ActiveChat, ActiveUser, Url } from "../../Global";
import { AuthContext } from "../../app/layout";
import { toast } from "sonner";
import Image from "next/image";

function Messages() {
  const { messages, setMessages, fetchMessages, setIsFetching } =
    useContext(AuthContext);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (ActiveUser.Email && ActiveChat.Email) {
      fetchMessages(ActiveUser.Email, ActiveChat.Email);
    }
  }, [fetchMessages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage = {
      senderEmail: ActiveUser.Email,
      receiverEmail: ActiveChat.Email,
      content: input,
    };

    try {
      setIsFetching(true);
      const response = await fetch(`${Url}/SaveMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });
      setIsFetching(false);
      const savedMessage = await response.json();
      // Update the messages state with the new message
      setMessages((prevMessages) => [...prevMessages, savedMessage]);
      setInput("");
    } catch (error) {
      toast.error("Error: server has issues");
    }
  };

  return (
    <div className=" flex h-full flex-col">
      {/* Header Section */}
      {ActiveChat.Email !== "" ? (
        <div className="fixed top-16 flex w-full items-center justify-center p-0  pr-4 pt-2 sm:pr-4 md:pr-34 lg:pr-80 xl:pr-80 ">
          <div className="mr-4 text-lg font-semibold text-black dark:text-white ">
            {ActiveChat.Name}
          </div>
          {ActiveChat.Pic !== "NULL" ? (
            <img
              className=" h-10 w-10 rounded-full"
              src={ActiveChat.Pic}
              alt=""
            />
          ) : (
            <Image
              width={0}
              height={0}
              src={PlaceHolder}
              alt="Recipient Avatar"
              className=" h-10 w-10 rounded-full"
            />
          )}
        </div>
      ) : (
        false
      )}

      <div className="no-scrollbar mt-10 flex max-h-[72vh] flex-grow flex-col overflow-auto  p-4">
        {ActiveChat.Email === "" ? (
          <div className="flex h-full w-full items-center justify-center">
            <h1>No Chat</h1>
          </div>
        ) : (
          false
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderEmail === ActiveUser.Email
                ? "justify-end"
                : "justify-start"
            } mb-4`}
          >
            {message.senderEmail !== ActiveUser.Email && (
              <>
                {ActiveChat.Pic !== "NULL" ? (
                  <img
                    className="mr-2 h-8 w-8 rounded-full"
                    src={ActiveChat.Pic}
                    alt=""
                  />
                ) : (
                  <Image
                    width={0}
                    height={0}
                    src={PlaceHolder}
                    alt=""
                    className="mr-2 h-8 w-8 rounded-full"
                  />
                )}
              </>
            )}
            <div
              className={` mx-2 flex max-w-xs flex-col space-y-2 text-sm items-${
                message.senderEmail === ActiveUser.Email ? "end" : "start"
              }`}
            >
              <div>
                <span
                  className={`inline-block rounded-lg px-4 py-2 ${
                    message.senderEmail === ActiveUser.Email
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {message.content}
                </span>
              </div>
            </div>
            {message.senderEmail === ActiveUser.Email && (
              <>
                {ActiveUser.ProfilePic !== "NULL" ? (
                  <img
                    className="ml-2 h-8 w-8 rounded-full"
                    src={ActiveUser.ProfilePic}
                    alt=""
                  />
                ) : (
                  <Image
                    width={0}
                    height={0}
                    src={PlaceHolder}
                    alt=""
                    className="ml-2 h-8 w-8 rounded-full"
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {ActiveChat.Email !== "" ? (
        <div className=" fixed bottom-0 flex w-full items-center p-4 pr-4 sm:pr-4 md:pr-34 lg:pr-80 xl:pr-80">
          <input
            type="text"
            className="flex-grow rounded-md border border-gray-600 bg-gray-900 p-2 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="ml-2 rounded-md bg-green-700 p-2 text-white"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      ) : (
        false
      )}
    </div>
  );
}

export default Messages;
