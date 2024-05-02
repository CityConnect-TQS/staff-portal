import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button} from "@nextui-org/react";
import {useState} from "react";
import { ThemeSwitcher } from "./themeSwitcher";
import { useMatchRoute } from '@tanstack/react-router';

export function NavbarStaff() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const matchRoute = useMatchRoute()
  
  const menuItems = [
    {name: "Dashboard", link: "/", isActive: matchRoute({ to: "/" }) !== false},
    {name: "Trips", link: "/trips", isActive: matchRoute({ to: "/trips" }) !== false},
 ];


  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <img src="/logo.jpeg" alt="CityConnect" className="h-8 mr-4 w-auto rounded" />
          <p className="font-bold text-inherit">CityConnect</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.name}-${index}`}>
            <Link
              color={
                item.isActive ? "primary" : "foreground"
              }
              href={item.link}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
      <ThemeSwitcher />
        <NavbarItem className="hidden lg:flex ">
          <Link href="#" className="text-primary">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              color={
                item.isActive ? "primary" : "foreground"
              }
              href={item.link}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
