import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import { useState } from "react";
import { ThemeSwitcher } from "./themeSwitcher";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { MaterialSymbol } from "react-material-symbols";
import { User } from "@/types/user.ts";
import { useCookies } from "react-cookie";

export function NavbarStaff() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const matchRoute = useMatchRoute();
  const navigate = useNavigate(); // Removido o objeto desnecessário
  const [cookies, , removeCookies] = useCookies(["user"]);
  const user = cookies.user !== undefined ? (cookies.user as User) : undefined;

  const menuItems = [
    {
      name: "Dashboard",
      link: "/",
      isActive:
        matchRoute({ to: "/" }) !== false ||
        matchRoute({ to: "/tripDetails" }) !== false,
    },
    {
      name: "Buses",
      link: "/bus",
      isActive: matchRoute({ to: "/bus" }) !== false,
    },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="full">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <img
            src="/logo.svg"
            alt="CityConnect"
            className="h-8 mr-4 w-auto rounded"
          />
          <p className="font-bold text-inherit text-xl">CityConnect</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.name}-${index}`}>
            <Button
              color={item.isActive ? "primary" : "default"}
              variant="light"
              onClick={() => void navigate({ to: item.link })}
              id={`${item.name}NavBtn`}
            >
              {item.name}
            </Button>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <ThemeSwitcher />
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className="transition-transform"
                id="avatarBtn"
                color={user ? "primary" : "default"}
                fallback={
                  user ? (
                    <p className={"text-xl"}>{user.name.charAt(0)}</p>
                  ) : (
                    <MaterialSymbol
                      icon={"account_circle_off"}
                      size={24}
                      className={"text-default-500"}
                    />
                  )
                }
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownSection showDivider>
                {user ? (
                  <DropdownItem
                    key="profile"
                    className="h-14 gap-2"
                    id={"userText"}
                  >
                    <p>Signed in as</p>
                    <p className="font-semibold">{user.name}</p>
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    key="login"
                    id={"loginBtn"}
                    onClick={() => void navigate({ to: "/login" })}
                    startContent={<MaterialSymbol icon="login" size={20} />}
                  >
                    Login
                  </DropdownItem>
                )}
                {user ? (
                  <DropdownItem
                    key="logout"
                    color="danger"
                    id={"logoutBtn"}
                    startContent={<MaterialSymbol icon="logout" size={20} />}
                    onClick={() => {
                      removeCookies("user");
                      void navigate({ to: "/login" });
                    }}
                  >
                    Log Out
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    key="register"
                    id={"signUpBtn"}
                    startContent={
                      <MaterialSymbol icon="app_registration" size={20} />
                    }
                  >
                    Ask an admin to signup
                  </DropdownItem>
                )}
              </DropdownSection>
              <DropdownItem
                key="settings"
                startContent={<MaterialSymbol icon="settings" size={20} />}
              >
                Settings
              </DropdownItem>
              <DropdownItem
                key="help_and_feedback"
                startContent={<MaterialSymbol icon="help" size={20} />}
              >
                Help & Feedback
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Button
              color={item.isActive ? "primary" : "default"}
              variant="light"
              onClick={() => void navigate({ to: item.link })}
              id={`${item.name}Btn`}
            >
              {item.name}
            </Button>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
