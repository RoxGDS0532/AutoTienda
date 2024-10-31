CREATE DATABASE tiendaDB;

USE tiendaDB;

-- Tabla Usuarios
CREATE TABLE Usuarios (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) NOT NULL UNIQUE,
    Contrasena VARCHAR(255) NOT NULL,
    Rol ENUM('Encargado', 'Administrador') NOT NULL  
);

-- Tabla Productos
CREATE TABLE Productos (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CodigoBarras NUMERIC(13),
    ImagenURL VARCHAR(300),  
    Nombre VARCHAR(100) NOT NULL,
    Categoria VARCHAR(50) NOT NULL,
    Precio DECIMAL(10, 2) NOT NULL,
    Cantidad INT NOT NULL,
    Stock INT NOT NULL  
);


-- Tabla Proveedores
CREATE TABLE Proveedores (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Contacto VARCHAR(100),
    Telefono VARCHAR(15),
    Email VARCHAR(100)
);

-- Tabla Pedidos
CREATE TABLE Pedidos (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProveedorId INT,
    Fecha DATE NOT NULL,
    FOREIGN KEY (ProveedorId) REFERENCES Proveedores(Id)
);

-- Tabla DetallesPedidos
CREATE TABLE DetallesPedidos (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PedidoId INT,
    ProductoId INT,
    Cantidad INT NOT NULL,
    FOREIGN KEY (PedidoId) REFERENCES Pedidos(Id),
    FOREIGN KEY (ProductoId) REFERENCES Productos(Id)
);

-- Tabla Reportes
CREATE TABLE Reportes (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Tipo ENUM('Ventas', 'Inventario', 'Proveedores') NOT NULL,
    Fecha DATE NOT NULL,
    Detalle TEXT,
    UsuarioId INT,
    FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id)
);

-- Tabla Pagos
CREATE TABLE Pagos (
    IdPago INT AUTO_INCREMENT PRIMARY KEY,
    FechaPago DATE NOT NULL,
    TipoPago ENUM('Efectivo', 'Transferencia') NOT NULL,
    CantidadTotal DECIMAL(10, 2) NOT NULL
);

-- Tabla Ventas
CREATE TABLE Ventas (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    IdProducto INT,
    FechaVenta DATE NOT NULL,
    CantidadProductos INT NOT NULL,
    PrecioUProducto DECIMAL(10, 2) NOT NULL,
    CantidadUProducto INT NOT NULL,
    HoraVenta TIME NOT NULL,
    PagoTotal DECIMAL(10, 2) NOT NULL,
    IdPago INT,
    FOREIGN KEY (IdProducto) REFERENCES Productos(Id),
    FOREIGN KEY (IdPago) REFERENCES Pagos(IdPago)
);