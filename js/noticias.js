const API_KEY = 'db4f1f514c464bfe833ef5d4d7bfd4e8';
        const URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

        async function cargarNoticias() {
            try {
                const response = await fetch(URL);
                const data = await response.json();
                
                if (data.articles && data.articles.length > 0) {
                    mostrarNoticias(data.articles.slice(0, 10)); // Primeras 10 noticias
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
                    ${noticia.urlToImage ? `<img src="${noticia.urlToImage}" width="100%" style="border-radius:5px;margin:10px 0;">` : ''}
                    <p>${noticia.description || 'Sin descripción'}</p>
                    <p><strong>Fuente:</strong> ${noticia.source.name}</p>
                    <p><strong>Fecha:</strong> ${new Date(noticia.publishedAt).toLocaleDateString()}</p>
                    <a href="${noticia.url}" target="_blank">Leer más →</a>
                </div>
            `).join('');
            
            document.getElementById('noticias-container').innerHTML = html;
        }

cargarNoticias();