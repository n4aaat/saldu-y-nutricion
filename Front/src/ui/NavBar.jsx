import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownTrigger, Button, Dropdown, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Image } from "@nextui-org/image";
import logo from '../assets/img/logo.png'
import { ModalLogin } from "./ModalLogin";
import { ChevronDown } from "../assets/icons/ChevronDown";

export const NavBar = ({ status, user, logout }) => {

    return (
        <Navbar isBordered>
            <NavbarBrand>
                <Image width={170} src={logo} draggable={false} />
            </NavbarBrand>
            <NavbarContent justify="center">
            <NavbarItem>
                    <Link color="foreground" href="/">
                        Inicio
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/form">
                        Registro de paciente
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                {status === "authenticated" ? (
                    <Dropdown>
                        <NavbarItem>
                            <DropdownTrigger>
                                <Button
                                    disableRipple
                                    className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                                    endContent={<ChevronDown fill="currentColor" size={16}/>}
                                    radius="sm"
                                    variant="light"
                                >
                                    {user.name}
                                </Button>
                            </DropdownTrigger>
                        </NavbarItem>
                        <DropdownMenu aria-label="menu">
                            <DropdownItem key="pasientes" href="/dashboard/users">
                                Pacientes
                            </DropdownItem>
                            <DropdownItem key="logout" onClick={logout}>
                                Cerrar Sesion
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <NavbarItem>
                        <ModalLogin />
                    </NavbarItem>
                )}
            </NavbarContent>
        </Navbar>
    )
}