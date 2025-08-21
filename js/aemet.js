const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqdWFuam9zZW1veWEuMUBnbWFpbC5jb20iLCJqdGkiOiI4ZTY5ZmExOC1hY2E4LTQ4MzYtYTZjNy04ZWY0NDUwNGM0MDEiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTc1NDMxNjk1MCwidXNlcklkIjoiOGU2OWZhMTgtYWNhOC00ODM2LWE2YzctOGVmNDQ1MDRjNDAxIiwicm9sZSI6IiJ9.AuD42_USJghFROOSk4tEBtQj81dv1KvbbvLG5Sehd6M";
const MUNICIPIO_ID = "21002"; // Aljaraque

async function cargarTiempo() {
    try {
        const res = await fetch(
            `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${MUNICIPIO_ID}?api_key=${API_KEY}`
        );

        const datos = await res.json();
        const resDatos = await fetch(datos.datos);
        const jsonFinal = await resDatos.json();

        const info = jsonFinal[0];
        const predicciones = info.prediccion.dia.slice(0, 3); // Solo 3 días

        // Función para asignar icono según el estado
        function obtenerIcono(estado) {
            const e = estado.toLowerCase();
            if (e.includes("despejado")) return '<i class="fas fa-sun" style="color:orange"></i>';
            if (e.includes("nuboso") || e.includes("nubes")) return '<i class="fas fa-cloud" style="color:gray"></i>';
            if (e.includes("lluvia")) return '<i class="fas fa-cloud-showers-heavy" style="color:blue"></i>';
            if (e.includes("tormenta")) return '<i class="fas fa-bolt" style="color:gold"></i>';
            if (e.includes("nieve")) return '<i class="fas fa-snowflake" style="color:lightblue"></i>';
            return '<i class="fas fa-smog" style="color:gray"></i>'; // por defecto
        }

        // Construir HTML con varios días
        let html = "<h5>Previsión para los próximos días</h5>";
        predicciones.forEach(dia => {
            const estado = dia.estadoCielo[0].descripcion;
            const icono = obtenerIcono(estado);
            html += `
                <div class="dia-tiempo">
                    <p><strong>${dia.fecha}</strong></p>
                    <p>${icono} ${estado}</p>
                    <p>🌡️ Máx: ${dia.temperatura.maxima} °C | Mín: ${dia.temperatura.minima} °C</p>
                </div>
                <hr>
            `;
        });

        document.getElementById("tiempo").innerHTML = html;
    } catch (error) {
        console.error("Error al cargar el tiempo:", error);
        document.getElementById("tiempo").innerHTML = "<p>Error al cargar los datos.</p>";
    }
}

cargarTiempo();
