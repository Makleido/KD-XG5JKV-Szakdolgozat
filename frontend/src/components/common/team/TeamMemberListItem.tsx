import React from "react";
import Button from "../Button";

function TeamMemberListItem({ member, setMembers, members }) {
  return (
    <div className="flex w-full justify-between mx-auto my-3 font-semibold items-center hover:bg-dark-200 hover:bg-opacity-30 transition-all ease-in-out duration-150 rounded-md px-3 py-2">
      <p className="text-light-200">{member?.username}</p>
      <Button
        className="px-3 py-1"
        label="Törlés"
        color="error"
        clickHandler={() => {
          let tmp = members?.filter((item) => item?.id !== member?.id);
          setMembers(tmp);
        }}
      />
    </div>
  );
}

export default TeamMemberListItem;
