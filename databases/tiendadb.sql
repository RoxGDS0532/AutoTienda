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

CREATE TABLE Categorias (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla Productos
CREATE TABLE Productos (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ImagenURL VARCHAR(300),
    CodigoBarras VARCHAR(255),   
    Nombre VARCHAR(100) NOT NULL,
    Precio DECIMAL(10, 2) NOT NULL,
    Cantidad INT NOT NULL,    
    CategoriaId INT, 
    FOREIGN KEY (CategoriaId) REFERENCES Categorias(Id) 
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
CREATE TABLE venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    fecha_venta DATETIME NOT NULL,
    hora_venta TIME NOT NULL,
    pago_total DECIMAL(10, 2) NOT NULL,
    tipo_pago VARCHAR(10)
);

CREATE TABLE detalle_venta (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT,
    id_producto INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(Id) ON DELETE CASCADE
);

CREATE TABLE Solicitudes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productoId INT NOT NULL,
  proveedorId INT NOT NULL,
  cantidad INT NOT NULL,
  FOREIGN KEY (productoId) REFERENCES Productos(Id),
  FOREIGN KEY (proveedorId) REFERENCES Proveedores(Id)
);

DELIMITER //

CREATE TRIGGER reducir_cantidad_producto
AFTER INSERT ON detalle_venta
FOR EACH ROW
BEGIN
    UPDATE Productos
    SET Cantidad = Cantidad - NEW.cantidad
    WHERE Id = NEW.id_producto;
END //

DELIMITER ;