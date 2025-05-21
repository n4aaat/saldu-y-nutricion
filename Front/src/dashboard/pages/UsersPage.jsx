import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
  AvatarIcon,
  Button,
  Input
} from "@nextui-org/react";
import { TablePagination } from "../components/TablePagination";
import backendApi from "../../api/backendApi";
import { EyeIcon } from "../../assets/icons/EyeIcon";
import { DeleteIcon } from "../../assets/icons/DeleteIcon";
import { Link } from "react-router-dom";
import { PlusIcon } from "../../assets/icons/PlusIcon";

// Componente para el ícono de búsqueda
const SearchIcon = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

// Componente para el ícono de descarga
const DownloadIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const eliminarPaciente = async (id, onSuccess) => {	
  try {
    const response = await backendApi.delete(`/paciente/${id}`);
    console.log('Eliminar Paciente', response.data)
    onSuccess();
  } catch (error) {
    console.error("Error al eliminar el paciente:", error);
  }
};

// Función para exportar a Excel
const exportToExcel = async () => {
  try {
    const response = await backendApi.get('/paciente/export-excel', {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pacientes.xlsx');
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error al exportar a Excel:", error);
  }
};

export const UserPage = () => {
  const [listUser, setListUser] = useState([]);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "nombre",
    direction: "descending",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchPaciente = async () => {
    try {
      const response = await backendApi.get(`/paciente`);
      console.log(response.data)
      setListUser(response.data);
    } catch (error) {
      console.error("Error al obtener el paciente:", error);
    }
  };

  useEffect(() => {		
    fetchPaciente();		
  }, []);

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return listUser || [];
    
    return (listUser || []).filter(user => 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [listUser, searchTerm]);

  // Resetear la página a 1 cuando cambia el término de búsqueda
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const pages = Math.ceil(filteredUsers.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredUsers.slice(start, end);
  }, [page, filteredUsers]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const columns = [
    { name: "Nombre", uid: "nombre", sortable: true },
    { name: "Genero", uid: "genero", sortable: true },
    { name: "Peso", uid: "peso_actual", sortable: true },
    { name: "Altura", uid: "altura_actual", sortable: true },
    { name: "Acciones", uid: "actions" },
  ];

  // Manejar cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsSearching(true);
    
    // Simular un pequeño retraso para mostrar el "buscando..."
    setTimeout(() => {
      setIsSearching(false);
    }, 300);
  };

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "nombre":
        return (
          <User
            avatarProps={{
              radius: "lg",
              classNames: {
                base: (user.genero === "hombre") ? "bg-blue-300" : "bg-pink-300"
              },
              icon:(<AvatarIcon />)
            }}
            description={`${user.edad_actual.anios} años`}
            name={cellValue}
          >
            {cellValue}
          </User>
        )
      case "genero":
        return <p>{cellValue}</p>
      case "altura_actual":
        return <p>{cellValue}</p>
      case "peso_actual":
        return <p>{cellValue}</p>
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Detalles">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Link to={'/dashboard/user/'+user.id}><EyeIcon /></Link>
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar">
              <span onClick={() => eliminarPaciente(user.id, fetchPaciente)} className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        )
    }
  }, []);

  return (
    <div className='container mx-auto mt-8'>
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <Input
              isClearable
              className="w-full max-w-xs"
              placeholder="Buscar por nombre..."
              startContent={<SearchIcon />}
              value={searchTerm}
              onChange={handleSearchChange}
              onClear={() => setSearchTerm("")}
            />
            {isSearching ? (
              <span className="text-sm text-gray-500 mt-1">Buscando...</span>
            ) : searchTerm ? (
              <span className="text-sm text-gray-500 mt-1">
                {filteredUsers.length} resultado(s) encontrado(s)
              </span>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button
              endContent={<DownloadIcon />}
              color="success"
              onClick={exportToExcel}>
              Exportar Excel
            </Button>
            <Button
              endContent={<PlusIcon />}
              color="primary">
              <Link to="/form">Agregar Nuevo</Link>
            </Button>
          </div>
        </div>
      </div>

      <Table
        aria-label="Tabla de usuarios"
        isHeaderSticky
        shadow="none"
        selectionMode="single"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        bottomContent={
          <TablePagination
            page={page}
            pages={pages}
            onPageChange={setPage} />
        }
        bottomContentPlacement="outside">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody 
          emptyContent={"No se encontraron usuarios"} 
          items={sortedItems}
          loadingContent={<div>Cargando...</div>}
          loadingState={listUser.length === 0 ? "loading" : "idle"}
        >
          {(item) => (
            <TableRow key={item.id || item.key}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}