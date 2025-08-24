const API_KEY = 'pub_ceec506c54ae435a8c9de57dd9ff4798';
const URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=es&language=es`;

async function cargarNoticias() {
    try {
        console.log('📡 Conectando con NewsData.io...');
        const response = await fetch(URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Datos recibidos:', data);
        

        if (data.results && data.results.length > 0) {
            mostrarNoticias(data.results.slice(0, 10)); // Primeras 10 noticias
        } else {
            document.getElementById('noticias-container').innerHTML = 
                '<p>No se encontraron noticias</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('noticias-container').innerHTML = 
            '<p>Error al cargar noticias. Verifica tu API key.</p>';
    }
}

function mostrarNoticias(noticias) {
    const html = noticias.map(noticia => `
        <div class="noticia">
            <h2>${noticia.title}</h2>
            ${noticia.image_url ? `<img src="${noticia.image_url}" width="100%" style="border-radius:5px;margin:10px 0;">` : ''}
            <p>${noticia.description || 'Sin descripción'}</p>
            <p><strong>Fuente:</strong> ${noticia.source_id || 'Desconocida'}</p>
            <p><strong>Fecha:</strong> ${new Date(noticia.pubDate).toLocaleDateString()}</p>
            <a href="${noticia.link}" target="_blank">Leer más →</a>
        </div>
    `).join('');
    
    document.getElementById('noticias-container').innerHTML = html;
}

cargarNoticias();