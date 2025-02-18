CREATE DATABASE IF NOT EXISTS GestioEntrades;
USE GestioEntrades;

-- Taula Empresa
CREATE TABLE Empresa (
    idEmpresa INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contacto VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    tipoPlan INT
);

-- Taula Clients
CREATE TABLE Clients (
    idCliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido1 VARCHAR(255),
    apellido2 VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    dni VARCHAR(20) UNIQUE NOT NULL
);

-- Taula Plan
CREATE TABLE Plan (
    idPlan INT AUTO_INCREMENT PRIMARY KEY,
    nombrePlan VARCHAR(255) NOT NULL,
    funcionalitats TEXT
);

-- Taula Pago
CREATE TABLE Pago (
    idPago INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contacto VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    tipoPlan INT,
    FOREIGN KEY (tipoPlan) REFERENCES Plan(idPlan) ON DELETE SET NULL
);

-- Taula Evento
CREATE TABLE Evento (
    idEvento INT AUTO_INCREMENT PRIMARY KEY,
    idEmpresa INT NOT NULL,
    nombreEvento VARCHAR(255) NOT NULL,
    fechaEvento DATE NOT NULL,
    lugar VARCHAR(255),
    FOREIGN KEY (idEmpresa) REFERENCES Empresa(idEmpresa) ON DELETE CASCADE
);

-- Taula Entrada
CREATE TABLE Entrada (
    idEntrada INT AUTO_INCREMENT PRIMARY KEY,
    fechaVenta DATE NOT NULL,
    nombrePersona VARCHAR(255),
    apellido1 VARCHAR(255),
    apellido2 VARCHAR(255),
    idEstadisticas INT,
    idEvento INT NOT NULL,
    FOREIGN KEY (idEvento) REFERENCES Evento(idEvento) ON DELETE CASCADE
);

-- Taula Estadístiques
CREATE TABLE Estadistiques (
    idEstadistiques INT AUTO_INCREMENT PRIMARY KEY,
    idEmpresa INT NOT NULL,
    idEvento INT NOT NULL,
    visitesTotals INT DEFAULT 0,
    entradesVendes INT DEFAULT 0,
    tipusPlan INT,
    valoracioProm DECIMAL(3,2),
    FOREIGN KEY (idEmpresa) REFERENCES Empresa(idEmpresa) ON DELETE CASCADE,
    FOREIGN KEY (idEvento) REFERENCES Evento(idEvento) ON DELETE CASCADE,
    FOREIGN KEY (tipusPlan) REFERENCES Plan(idPlan) ON DELETE SET NULL
);

-- Taula VentaEntrada
CREATE TABLE VentaEntrada (
    idVentaEntrada INT AUTO_INCREMENT PRIMARY KEY,
    dniCliente VARCHAR(20) NOT NULL,
    fechaCompra DATE NOT NULL,
    estadoPago ENUM('Pagat', 'Pendent', 'Cancel·lat') DEFAULT 'Pendent',
    subtotal DECIMAL(10,2),
    impuestos DECIMAL(10,2),
    descuento DECIMAL(10,2),
    montoTotal DECIMAL(10,2),
    idEntrada INT NOT NULL,
    idPago INT NOT NULL,
    FOREIGN KEY (dniCliente) REFERENCES Clients(dni) ON DELETE CASCADE,
    FOREIGN KEY (idEntrada) REFERENCES Entrada(idEntrada) ON DELETE CASCADE,
    FOREIGN KEY (idPago) REFERENCES Pago(idPago) ON DELETE CASCADE
);

-- Taula Factura
CREATE TABLE Factura (
    idFactura INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    montoTotal DECIMAL(10,2),
    descuento DECIMAL(10,2),
    impostos DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    idEntrada INT NOT NULL,
    idPago INT NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES Clients(idCliente) ON DELETE CASCADE,
    FOREIGN KEY (idEntrada) REFERENCES Entrada(idEntrada) ON DELETE CASCADE,
    FOREIGN KEY (idPago) REFERENCES Pago(idPago) ON DELETE CASCADE
);

-- Taula Valoracion
CREATE TABLE Valoracion (
    idValoracion INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    idEvento INT NOT NULL,
    puntuacion INT CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    FOREIGN KEY (idCliente) REFERENCES Clients(idCliente) ON DELETE CASCADE,
    FOREIGN KEY (idEvento) REFERENCES Evento(idEvento) ON DELETE CASCADE
);

-- Taula Newsletter
CREATE TABLE Newsletter (
    idNewsletter INT AUTO_INCREMENT PRIMARY KEY,
    spotNotification BOOLEAN DEFAULT FALSE,
    fechaEvento DATE NOT NULL,
    contenido TEXT,
    idEvento INT NOT NULL,
    FOREIGN KEY (idEvento) REFERENCES Evento(idEvento) ON DELETE CASCADE
);

-- Taula Visita
CREATE TABLE Visita (
    idVisita INT AUTO_INCREMENT PRIMARY KEY,
    idClient INT NOT NULL,
    idEmpresa INT NOT NULL,
    idEvent INT NOT NULL,
    fechaVisita DATE NOT NULL,
    tipoVisita ENUM('SiFavorito', 'NoFavorito') DEFAULT 'NoFavorito',
    FOREIGN KEY (idClient) REFERENCES Clients(idCliente) ON DELETE CASCADE,
    FOREIGN KEY (idEmpresa) REFERENCES Empresa(idEmpresa) ON DELETE CASCADE,
    FOREIGN KEY (idEvent) REFERENCES Evento(idEvento) ON DELETE CASCADE
);

