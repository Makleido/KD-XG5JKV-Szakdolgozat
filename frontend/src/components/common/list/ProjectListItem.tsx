import Avatar from "../Avatar";
import Button from "../Button";

export const ListItem = ({
  name = "",
  description = "",
  badges = [],
  url = "",
  id,
  darkMode = true,
}: {
  name: string;
  description: string;
  badges: any[];
  url: string;
  id: number;
  darkMode: boolean;
}) => {
  return (
    <div className="bg-light-600 text-light-400 w-full h-[120px] rounded-2xl flex items-center my-10">
      <div className="w-[130px] flex justify-center">
        <Avatar image_url={url} width="w-[90px]" height="h-[90px]" />
      </div>
      <div className="w-full flex flex-col">
        <div className="flex">
          <div className="w-1/2 text-center">
            <h2 className="font-noto font-bold text-light-400 text-lg">
              {name}
            </h2>
          </div>
          <div className="w-1/2">{/* BADGES */}</div>
        </div>
        <div className="flex">
          <div className="w-[80%]">
            <p className="font-noto font-semibold text-light-400 text-base">
              {description}
            </p>
          </div>
          <div className="w-[20%]">
            <Button
              type={darkMode ? "dark" : "light"}
              label="View"
              route={`/auth/projects/${id}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};