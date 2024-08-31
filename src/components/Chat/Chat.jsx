import Follow_Users from "../Follow/Follow";
import { useContext } from "react";
import { AuthContext } from "../../app/layout";
import PlaceHolder from "../../../public/images/user_149071.png";
import Image from "next/image";

export default function Chat() {
  const { followedUsers, followers, MessageUser, IsLogged } =
    useContext(AuthContext);
  return (
    <ul>
      {IsLogged ? (
        <li className="mb-2">
          <Follow_Users />
        </li>
      ) : (
        false
      )}

      {followedUsers.length !== 0 ? (
        <p className="block text-sm font-medium leading-6 text-black dark:text-white">
          Followed Users
        </p>
      ) : (
        false
      )}
      {followedUsers.map((user) => (
        <li
          onClick={() => MessageUser(user)}
          key={user.email}
          className="flex cursor-pointer justify-between gap-x-6 rounded-full py-2 pl-2 transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <div className="flex min-w-0 gap-x-4">
            {user.userPic !== "NULL" ? (
              <img
                className="h-12 w-12 flex-none rounded-full"
                style={{ borderColor: "#333", borderWidth: "1px" }}
                src={user.userPic}
                alt=""
              />
            ) : (
              <Image
                width={0}
                height={0}
                src={PlaceHolder}
                style={{ borderColor: "#333", borderWidth: "1px" }}
                alt="User"
                className="h-12 w-12 flex-none rounded-full"
              />
            )}

            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-dark dark:text-white">
                {user.name}
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-dark dark:text-white">
                {user.email}
              </p>
            </div>
          </div>
        </li>
      ))}
      {followers.length !== 0 ? (
        <p className="block text-sm font-medium leading-6 text-black dark:text-white">
          Followers
        </p>
      ) : (
        false
      )}
      {followers.map((user) => (
        <li
          onClick={() => MessageUser(user)}
          key={user.email}
          className="flex cursor-pointer justify-between gap-x-6 rounded-full py-2 pl-2 transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <div className="flex min-w-0 gap-x-4">
            <img
              className="h-12 w-12 flex-none rounded-full"
              src={user.userPic !== "NULL" ? user.userPic : PlaceHolder}
              alt=""
              style={{ borderColor: "#333", borderWidth: "1px" }}
            />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-dark dark:text-white">
                {user.name}
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-dark dark:text-white">
                {user.email}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
