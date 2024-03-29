import React, { useEffect, useRef, useState } from "react";
import { LoginTypes } from "../../constants/LoginTypes";
import { navButtons } from "../../constants/NavButtons";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/router";
import { useDarkMode } from "../../hooks/useDarkMode";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { useChatContext } from "../../contexts/ChatProvider";
import { CustomInput } from "../common/form/CustomInput";
import { axios } from "../../lib/axios";
import { API_URL } from "../../constants/url";
import NotificationDropdown from "../common/notifications/NotificationDropdown";

function Navbar() {
  const { darkMode } = useDarkMode();

  const router = useRouter();

  const { redirectPage } = useChatContext();

  const { user, logout, notifications } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: false,
  });

  const [username, setUsername] = useState("");
  const [usersList, setUsersList] = useState([]);

  const [searchOpen, setSearchOpen] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (searchOpen && ref.current && !ref.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener("click", checkIfClickedOutside);
    } else {
      document.removeEventListener("click", checkIfClickedOutside);
    }

    return () => {
      // Cleanup the event listener
      document.removeEventListener("click", checkIfClickedOutside);
    };
  }, [searchOpen]);

  const getUserlist = async (username) => {
    await axios(
      "get",
      `${API_URL}/user/search-by-username`,
      { string: username !== "" ? username : null },
      null,
      (res) => {
        setUsersList(res?.data);
      }
    );
  };

  useEffect(() => {
    let timer;
    if (user) {
      timer = setTimeout(() => {
        getUserlist(username);
      }, 250);
    }
    return () => clearInterval(timer);
  }, [username]);

  useEffect(() => {
    if (usersList?.length > 0) {
      setSearchOpen(true);
    } else setSearchOpen(false);
  }, [usersList]);

  const sendFriendReq = async (found) => {
    await axios(
      "post",
      `${API_URL}/user/add-new-friend`,
      { id: found?.id },
      null,
      (res) => {
        let tmp = [];
        usersList.map((item) => {
          if (item?.id !== found.id) tmp.push(item);
        });
        setUsersList(tmp);
      }
    );
  };

  const MenuButtons = () => {
    if (!user) {
      return navButtons.map((button, index) => {
        if (button?.type === LoginTypes.No_Login)
          return (
            <Button
              key={index}
              label={button?.label}
              route={button?.url}
              type={darkMode ? "dark" : "light"}
              buttonType="menu_nolog"
            />
          );
      });
    } else {
      return navButtons.map((button, index) => {
        if (button?.type === LoginTypes.Login)
          return (
            <Button
              key={index}
              label={button?.label}
              // route={button?.url}
              type={darkMode ? "dark" : "light"}
              buttonType="menu_log"
              clickHandler={
                button?.label === "Kijelentkezés"
                  ? () => logout()
                  : () => redirectPage(button?.url)
              }
            />
          );
      });
    }
  };

  return (
    <header
      className={`flex justify-between ${
        !user
          ? "py-7 pl-7"
          : `px-2 md:h-[160px] h-[200px] mb-10 ${
              darkMode ? "bg-dark-700 bg-opacity-30 text-light-400" : ""
            }`
      }`}
    >
      <>
        {!user ? (
          <>
            <Avatar
              width="w-[130px]"
              height="w-[130px]"
              circular
              route="/"
              className="-mt-5 md:flex hidden"
            />
            <h1 className=" text-2xl font-semibold md:flex hidden text-light-200">
              Follofox
            </h1>
            <div className="2xl:w-[100vh] xl:w-[90vh] lg:w-[80vh] md:w-[70vh] w-[90vh] bg-dark-100 xl:pl-24 xl:pr-8 md:pl-20 md:pr-5 px-5 max-h-[80px]md:h-[80px] h-[80px] md:rounded-tl-[50px] md:rounded-bl-[200px] md:rounded-tr-none md:rounded-br-none rounded-md flex items-center justify-between ">
              {MenuButtons()}
            </div>
          </>
        ) : (
          <div className="flex flex-col w-full">
            <div className="md:h-[40px] mb-10 flex items-center justify-between">
              <div className="md:h-[40px] h-[80px] w-[330px] bg-dark-100 pl-3 rounded-br-[20px] md:rounded-bl-none rounded-bl-[20px] transition-all ease-in-out duration-150">
                <h1 className="md:text-lg text-sm font-noto font-bold md:-mt-1">
                  {user?.username} - {`${user?.first_name} ${user?.last_name}`}
                </h1>
                <h2 className="font-noto font-semibold md:text-base text-xs md:-mt-2">
                  {user?.email}
                </h2>
              </div>
              <div className="relative min-w-[250px] max-w-[300px]">
                <CustomInput
                  placeholder="keresés felhasználónév szerint"
                  onChange={(e) => setUsername(e?.target?.value)}
                  value={username}
                />
                <div
                  ref={ref}
                  className={`${
                    searchOpen ? "absolute" : "hidden"
                  } z-[100] md:w-[250px] max-h-[200px] rounded-md border-2 border-dark-200 bg-dark-500 overflow-y-auto top-[50px] left-0`}
                >
                  {usersList?.map((found) =>
                    found?.id !== user?.id ? (
                      <div
                        key={found?.username}
                        className="flex justify-between items-center border-b-2 border-dark-200 py-3 px-2 w-full hover:bg-dark-400 transition-all ease-in-out"
                      >
                        <p className="text-dark-200 max-w-2/3">
                          {found?.username}
                        </p>
                        <Button
                          label="Hozzáadás"
                          clickHandler={() => sendFriendReq(found)}
                          className="my-1"
                          padding="py-2 px-5"
                        />
                      </div>
                    ) : (
                      <></>
                    )
                  )}
                </div>
              </div>
              <div className="md:h-[40px] h-[80px] w-[200px] bg-dark-100 rounded-bl-[20px] md:rounded-br-none rounded-br-[20px] font-noto text-lg font-bold text-center items-center flex justify-center transition-all ease-in-out duration-150">
                <NotificationDropdown notifications={notifications} />
              </div>
            </div>
            <div className="flex justify-between mb-5">{MenuButtons()}</div>
          </div>
        )}
      </>
    </header>
  );
}

export default Navbar;
