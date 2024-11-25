# Biblioteca Digital BNE - Catálogo de EPUBs

Aplicación web que muestra el catálogo completo de libros electrónicos (EPUBs) de la Biblioteca Nacional de España (BNE).

## Características

- Visualización del catálogo completo de EPUBs de la BNE
- Paginación para navegar fácilmente por los resultados
- Enlaces directos para:
  - Ver el libro en el visor digital de la BNE
  - Descargar el libro en formato EPUB
- Información detallada de cada libro:
  - Título
  - Autor
  - Fecha de publicación
  - Editorial

## Tecnologías utilizadas

- HTML5
- CSS3 (Grid Layout, Flexbox)
- JavaScript (ES6+)
- Fetch API para carga de datos
- JSON para el almacenamiento de datos

## Uso

1. Clona el repositorio
2. Coloca los archivos JSON en la carpeta `data/`
3. Abre `index.html` en un servidor web local

## Datos

Los datos provienen de la Biblioteca Digital Hispánica (BDH) y están disponibles en formato JSON. Cada archivo contiene información detallada sobre los libros digitalizados, incluyendo metadatos y enlaces de descarga.

## Funcionalidades

- Carga dinámica de datos desde múltiples archivos JSON
- Sistema de paginación intuitivo
- Interfaz responsive y amigable
- Conversión automática de URLs para acceso directo a EPUBs
