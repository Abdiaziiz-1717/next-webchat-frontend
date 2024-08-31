import { Fragment, useState, useContext } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { AuthContext } from "../../app/layout";
import { ActiveChat, ActiveUser, Url } from "../../Global";
import PlaceHolder from "../../../public/images/user_149071.png";
import { toast } from "sonner";
import Image from "next/image";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Follow_Users() {
  const { users, followedUsers, setFollowedUsers, followers, setIsFetching } =
    useContext(AuthContext);
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? users.filter((person) => person.email !== ActiveUser.Email)
      : users.filter(
          (person) =>
            person.name.toLowerCase().includes(query.toLowerCase()) &&
            person.email !== ActiveUser.Email,
        );

  const handleFollow = async (person) => {
    try {
      setIsFetching(true);
      const response = await fetch(`${Url}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: ActiveUser.Email,
          followedUserEmail: person.email,
        }),
      });
      setIsFetching(false);
      const data = await response.json();
      if (data.message) {
        setFollowedUsers([...followedUsers, person]);
      }
    } catch (error) {
      toast.error("Error: server has issues");
    }
  };

  const handleUnfollow = async (person) => {
    try {
      setIsFetching(true);
      const response = await fetch(`${Url}/unfollow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: ActiveUser.Email,
          followedUserEmail: person.email,
        }),
      });
      setIsFetching(false);

      const data = await response.json();
      if (data.message) {
        setFollowedUsers(
          followedUsers.filter((user) => user.email !== person.email),
        );
      }
    } catch (error) {
      toast.error("Error: server has issues");
    }
  };

  const isFollowed = (person) => {
    return followedUsers.some((user) => user.email === person.email);
  };

  // Check if ActiveChat.Email is in either followers or followed users
  const isInFollowed = followedUsers.some(
    (user) => user.email === ActiveChat.Email,
  );
  const isInFollowers = followers.some(
    (user) => user.email === ActiveChat.Email,
  );

  if (!isInFollowed && !isInFollowers) {
    // Clear ActiveChat if not found in followed or followers
    ActiveChat.Name = "";
    ActiveChat.Pic = "";
    ActiveChat.Email = "";
  }

  return (
    <Combobox as="div">
      <Combobox.Label className="ml-4 block text-sm font-medium leading-6 text-dark dark:text-white">
        Search user
      </Combobox.Label>
      <div className="relative mt-2">
        <div className="relative w-full cursor-default overflow-hidden  text-left shadow-sm sm:text-sm">
          <Combobox.Input
            className="w-full rounded-full border border-stroke bg-gray-2 py-3 pl-4 pr-5 text-dark focus:border-primary focus:outline-none dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:focus:border-primary "
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search..."
          />
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-100 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black  sm:text-sm">
            {filteredPeople.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-white">
                Nothing found.
              </div>
            ) : (
              filteredPeople.map((person) => (
                <Combobox.Option
                  key={person.email}
                  className={({ active }) =>
                    classNames(
                      active
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-900 dark:text-white",
                      "relative cursor-default select-none py-2 pl-3 pr-9",
                    )
                  }
                  value={person}
                >
                  {({ active }) => (
                    <>
                      <div className="flex items-center">
                        {person.userPic !== "NULL" ? (
                          <img
                            className="h-5 w-5 flex-shrink-0 rounded-full"
                            src={person.userPic}
                            alt=""
                          />
                        ) : (
                          <Image
                            width={0}
                            height={0}
                            src={PlaceHolder}
                            alt="User"
                            className="h-5 w-5 flex-shrink-0 rounded-full"
                          />
                        )}

                        <span className={classNames("ml-3 block truncate")}>
                          {person.name}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents the Combobox.Option click event from firing
                          isFollowed(person)
                            ? handleUnfollow(person)
                            : handleFollow(person);
                        }}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs text-indigo-600 dark:text-white"
                      >
                        {isFollowed(person) ? "Unfollow" : "Follow"}
                      </button>
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
