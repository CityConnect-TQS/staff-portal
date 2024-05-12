import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@nextui-org/react";
import {useState} from "react";
import { ThemeSwitcher } from "./themeSwitcher";
import { useMatchRoute, useNavigate } from '@tanstack/react-router';

export function NavbarStaff() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const matchRoute = useMatchRoute();
  const navigate = useNavigate(); // Removido o objeto desnecessário
  
  const menuItems = [
    {name: "Dashboard", link: "/", isActive: matchRoute({ to: "/" })!== false || matchRoute({ to: "/tripDetails" })!== false},
    {name: "Buses", link: "/bus", isActive: matchRoute({ to: "/bus" })!== false},
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="full">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <img src="/logo.svg" alt="CityConnect" className="h-8 mr-4 w-auto rounded" />
          <p className="font-bold text-inherit text-xl">CityConnect</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.name}-${index}`}>
            <Button color={item.isActive? "primary" : "default"} variant="light" size="lg" className="text-lg" onPress={()  => void navigate({to: item.link})}> 
              {item.name}
            </Button>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
      <ThemeSwitcher />
        <NavbarItem className="hidden lg:flex">
          <Link href="#" className="text-primary" size="lg">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} href="#" variant="flat" size="lg">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Button color={item.isActive? "primary" : "default"} variant="light" onPress={() => void navigate({to: item.link})}> 
              {item.name}
            </Button>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
