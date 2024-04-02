import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiOutlineMinusSm,
  HiOutlinePlusSm,
} from "react-icons/hi";

import { setSection } from "../../redux/profileSection/SectionSlice";
import { useDispatch } from "react-redux";

export default function Dashsidebar() {
  const location = useLocation();
  const [tab, setTab] = useState(null);
  const dispatch = useDispatch();

  const sections = [
    { name: "My details", id: "details" },
    { name: "Update Account", id: "update" },
    { name: "Add user", id: "adduser" },
  ];

  const { Section } = useSelector((state) => state.section);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <Sidebar className="w-full md:w-56 !bg-gray-500 shadow-md">
      <Sidebar.Items className="flex flex-col gap-1">
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Collapse
              icon={HiUser}
              label="profile"
              open={tab === "profile"}
              className={`  ${
                tab === "profile"
                  ? "bg-gray-100 dark:bg-gray-700 font-semibold"
                  : ""
              }`}
              as="div"
              renderChevronIcon={(theme, open) => {
                const IconComponent = open ? HiOutlineMinusSm : HiOutlinePlusSm;

                return (
                  <IconComponent
                    aria-hidden
                    className={`${theme.label.icon.open[open ? "on" : "off"]}`}
                  />
                );
              }}
            >
              {sections.map((section) => (
                <div
                  onClick={() => dispatch(setSection(section.id))}
                  key={section.id}
                >
                  <Sidebar.Item
                    as="div"
                    className={`text-gray-400 dark:text-gray-400 text-xs font-semibold ${
                      Section === section.id
                        ? "text-blue-500 dark:text-blue-500"
                        : ""
                    } `}
                  >
                    {section.name}
                  </Sidebar.Item>
                </div>
              ))}
            </Sidebar.Collapse>
          </Link>
          <>
            <Link to="/dashboard?tab=requests">
              <Sidebar.Item
                active={tab === "requests"}
                icon={HiDocumentText}
                as="div"
              >
                Requests
              </Sidebar.Item>
            </Link>
            <Link to="/dashboard?tab=make-request">
              <Sidebar.Item
                active={tab === "make-request"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Make a Request
              </Sidebar.Item>
            </Link>
            <Link to="/dashboard?tab=tracking">
              <Sidebar.Item
                active={tab === "tracking"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Track Request
              </Sidebar.Item>
            </Link>
          </>
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer mt-20">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
