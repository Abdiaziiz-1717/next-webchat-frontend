"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import "@/css/custom-bootstrap.scss";
import React, { useEffect, useState, createContext } from "react";
import Loader from "@/components/common/Loader";
import { ActiveChat, ActiveUser, Url } from "../Global";
import { toast, Toaster } from "sonner";

export const AuthContext = createContext({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [ActiveChatEMail, setActiveChatEMail] = useState("");
  const [IsLogged, setIsLogged] = useState(false);
  const [users, setUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [IsFetching, setIsFetching] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      if (IsLogged) {
        try {
          const response = await fetch(`${Url}/getUsers`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setUsers(data.result);

          // Fetch followed users for the logged-in user
          const followedResponse = await fetch(`${Url}/followedUsers`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail: ActiveUser.Email }),
          });
          const followedData = await followedResponse.json();
          setFollowedUsers(Object.values(followedData.result));

          // Fetch followers for the logged-in user
          const followerResponse = await fetch(`${Url}/followers`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail: ActiveUser.Email }),
          });
          const followerData = await followerResponse.json();
          setFollowers(Object.values(followerData.result));
        } catch (error) {
          toast.error("Error: server has issues");
        }
      }
    }
    fetchUsers();

    // Set up interval to fetch users every 30 seconds
    const intervalId = setInterval(fetchUsers, 3000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [IsLogged, ActiveChatEMail]);

  function LogOut() {
    const confirmation = window.confirm("Are you sure you want to log out?");

    if (confirmation) {
      ActiveUser.Name = "Guest";
      ActiveUser.Email = "";
      ActiveUser.ProfilePic = "";
      //..........................
      ActiveChat.Name = "";
      ActiveChat.Pic = "";
      ActiveChat.Email = "";
      //..........................
      setUsers([]);
      setFollowedUsers([]);
      setFollowers([]);
      setIsLogged(false);
    }
  }

  async function MessageUser(user: {
    name: string;
    userPic: string;
    email: string;
  }) {
    ActiveChat.Name = user.name;
    ActiveChat.Pic = user.userPic;
    ActiveChat.Email = user.email;
    setActiveChatEMail(user.email);
  }

  async function fetchMessages(senderEmail: string, receiverEmail: string) {
    try {
      const response = await fetch(`${Url}/getMessages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderEmail: senderEmail,
          receiverEmail: receiverEmail,
          content: "",
        }),
      });

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      toast.error("Error: server has issues");
    }
  }

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {loading ? (
          <Loader />
        ) : (
          <AuthContext.Provider
            value={{
              IsLogged,
              setIsLogged,
              users,
              LogOut,
              followedUsers,
              setFollowedUsers,
              followers,
              setFollowers,
              MessageUser,
              messages,
              setMessages,
              fetchMessages,
              IsFetching,
              setIsFetching,
            }}
          >
            {IsFetching ? (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ zIndex: "10000" }}
              >
                <Loader />
              </div>
            ) : (
              false
            )}
            {children}
          </AuthContext.Provider>
        )}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
