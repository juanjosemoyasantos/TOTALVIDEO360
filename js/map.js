// Coordenadas del negocio
        const businessCoords = [40.4168, -3.7038]; // Ejemplo: Madrid, España
        
        // Inicializar el mapa
        const map = L.map('map').setView(businessCoords, 13);
        
        // Capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Añadir marcador del negocio
        const businessMarker = L.marker(businessCoords).addTo(map)
            .bindPopup("<b>Nuestro Negocio</b><br>Aquí nos ubicamos");
        
        // Variable para controlar la ruta
        let routeControl;
        
        // Función para geocodificar una dirección
        async function geocodeAddress(address) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
                const data = await response.json();
                
                if (data.length > 0) {
                    return {
                        lat: parseFloat(data[0].lat),
                        lng: parseFloat(data[0].lon),
                        address: data[0].display_name
                    };
                } else {
                    throw new Error("Dirección no encontrada");
                }
            } catch (error) {
                console.error("Error en geocodificación:", error);
                alert("No se pudo encontrar la dirección. Por favor, inténtalo de nuevo con una dirección más específica.");
                return null;
            }
        }
        
        // Función para calcular y mostrar la ruta
        async function calculateAndDisplayRoute() {
            const clientAddress = document.getElementById('client-address').value;
            
            if (!clientAddress) {
                alert("Por favor, ingresa la dirección del cliente");
                return;
            }
            
            // Geocodificar la dirección del cliente
            const clientLocation = await geocodeAddress(clientAddress);
            
            if (!clientLocation) return;
            
            // Eliminar ruta anterior si existe
            if (routeControl) {
                map.removeControl(routeControl);
            }
            
            // Crear y mostrar la nueva ruta
            routeControl = L.Routing.control({
                waypoints: [
                    L.latLng(businessCoords[0], businessCoords[1]),
                    L.latLng(clientLocation.lat, clientLocation.lng)
                ],
                routeWhileDragging: true,
                showAlternatives: false,
                addWaypoints: false,
                draggableWaypoints: false,
                fitSelectedRoutes: true,
                show: true,
                language: 'es',
                lineOptions: {
                    styles: [{color: '#3388ff', opacity: 0.7, weight: 5}]
                },
                createMarker: function(i, wp) {
                    if (i === 0) {
                        return businessMarker;
                    }
                    return L.marker(wp.latLng).bindPopup(`<b>Cliente</b><br>${clientLocation.address}`);
                }
            }).addTo(map);
            
            // Mostrar información de la ruta cuando esté lista
            routeControl.on('routesfound', function(e) {
                const routes = e.routes;
                const summary = routes[0].summary;
                
                // Convertir metros a kilómetros
                const distanceKm = (summary.totalDistance / 1000).toFixed(2);
                
                // Convertir segundos a minutos
                const timeMin = Math.round(summary.totalTime / 60);
                
                const routeInfo = document.getElementById('route-info');
                routeInfo.innerHTML = `
                    <strong>Distancia:</strong> ${distanceKm} km<br>
                    <strong>Tiempo estimado:</strong> ${timeMin} minutos
                `;
                routeInfo.style.display = 'block';
            });
        }
        
        // Evento para el botón de calcular ruta
        document.getElementById('calculate-route').addEventListener('click', calculateAndDisplayRoute);