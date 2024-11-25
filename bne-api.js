class BNEClient {
    constructor() {
        this.librosPerPage = 12;
        this.currentPage = 1;
        this.totalLibros = 0;
    }

    formatearURL(url) {
        if (!url) return '#';
        
        if (url.includes('epub.vm')) {
            return url;
        }
        
        if (url.includes('text.vm')) {
            const matches = url.match(/id=(\d+)/);
            if (matches && matches[1]) {
                return `https://bdh-rd.bne.es/epub.vm?id=${matches[1]}&page=1#epubcfi(/6/2[id_portada]!/4/1:0)`;
            }
        }
        
        if (url.includes('viewer.vm')) {
            const matches = url.match(/id=(\d+)/);
            if (matches && matches[1]) {
                return `https://bdh-rd.bne.es/epub.vm?id=${matches[1]}&page=1#epubcfi(/6/2[id_portada]!/4/1:0)`;
            }
        }
        
        return url;
    }

    async obtenerLibros() {
        let todosLosLibros = [];
        
        for (let i = 0; i <= 10; i++) {
            try {
                const response = await fetch(`/data/set_epubs_${i}.json`);
                const libros = await response.json();
                todosLosLibros = [...todosLosLibros, ...libros];
            } catch (error) {
                console.warn(`Error al cargar set_epubs_${i}.json:`, error);
            }
        }
        
        return todosLosLibros;
    }

    paginarLibros(libros, pagina) {
        const inicio = (pagina - 1) * this.librosPerPage;
        const fin = inicio + this.librosPerPage;
        return libros.slice(inicio, fin);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const resultadosDiv = document.getElementById('resultados');
    const cliente = new BNEClient();
    let todosLosLibros = [];

    async function mostrarPagina(pagina) {
        const librosPaginados = cliente.paginarLibros(todosLosLibros, pagina);
        const totalPaginas = Math.ceil(todosLosLibros.length / cliente.librosPerPage);

        resultadosDiv.innerHTML = `
            <h2>Catálogo de EPUBs (${todosLosLibros.length} libros)</h2>
            <div class="libros-grid">
                ${librosPaginados.map(libro => `
                    <div class="libro">
                        <h3>${libro.título}</h3>
                        <p class="autor">${libro.autor_personas || 'Autor desconocido'}</p>
                        <p class="detalles">
                            <span class="fecha">${libro.fecha_publicacion}</span>
                        </p>
                        <div class="enlaces">
                            <a href="${libro.version_digital}" class="boton-descarga" target="_blank">Ver Digital</a>
                            <a href="${cliente.formatearURL(libro.version_digital)}" class="boton-epub" target="_blank">Ver Epub</a>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="paginacion">
                ${generarBotonesPaginacion(pagina, totalPaginas)}
            </div>
        `;

        document.querySelectorAll('.paginacion button').forEach(button => {
            button.addEventListener('click', (e) => {
                const nuevaPagina = parseInt(e.target.dataset.page);
                mostrarPagina(nuevaPagina);
                window.scrollTo(0, 0);
            });
        });
    }

    function generarBotonesPaginacion(paginaActual, totalPaginas) {
        let botones = [];
        
        if (paginaActual > 1) {
            botones.push(`<button data-page="${paginaActual - 1}">←</button>`);
        }

        for (let i = 1; i <= Math.min(3, totalPaginas); i++) {
            botones.push(`<button data-page="${i}" ${i === paginaActual ? 'class="active"' : ''}>${i}</button>`);
        }

        if (paginaActual > 4) {
            botones.push('<span>...</span>');
        }

        for (let i = Math.max(4, paginaActual - 1); i <= Math.min(totalPaginas - 3, paginaActual + 1); i++) {
            botones.push(`<button data-page="${i}" ${i === paginaActual ? 'class="active"' : ''}>${i}</button>`);
        }

        if (paginaActual < totalPaginas - 3) {
            botones.push('<span>...</span>');
        }
        
        for (let i = Math.max(totalPaginas - 2, paginaActual + 2); i <= totalPaginas; i++) {
            botones.push(`<button data-page="${i}" ${i === paginaActual ? 'class="active"' : ''}>${i}</button>`);
        }

        if (paginaActual < totalPaginas) {
            botones.push(`<button data-page="${paginaActual + 1}">→</button>`);
        }

        return botones.join('');
    }

    try {
        resultadosDiv.innerHTML = '<p>Cargando catálogo...</p>';
        todosLosLibros = await cliente.obtenerLibros();
        mostrarPagina(1);
    } catch (error) {
        resultadosDiv.innerHTML = '<p>Error al cargar el catálogo</p>';
        console.error('Error:', error);
    }
});
