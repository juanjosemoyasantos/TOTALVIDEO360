document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario
    const form = document.getElementById('presupuesto-form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessages = document.getElementById('form-messages');

    // Elementos para el cálculo del presupuesto
    const productOptions = document.querySelectorAll('input[name="product"]');
    const plazoInput = document.getElementById('plazo');
    const extraOptions = document.querySelectorAll('input[name="extra"]');
    const budgetAmount = document.getElementById('budget-amount');
    const budgetDetails = document.getElementById('budget-details');
    
    // Política de precios según plazo
    const pricingPolicy = {
        fast: { days: 7, rate: 1.10, text: "10% de recargo por urgencia" },    // +10%
        standard: { days: 14, rate: 1.00, text: "Tarifa estándar" },          // 0%
        discount: { days: 21, rate: 0.95, text: "5% de descuento" }           // -5%
    };
    
    // Validación de campos de contacto
    function validateContactFields() {
        let isValid = true;
        
        // Validar nombre (solo letras, 15 caracteres)
        const nombre = document.getElementById('nombre');
        if (!/^[A-Za-zÁ-úñÑ\s]{1,15}$/.test(nombre.value.trim())) {
            nombre.nextElementSibling.textContent = "Solo letras (máx. 15 caracteres)";
            isValid = false;
        } else {
            nombre.nextElementSibling.textContent = "";
        }
        
        // Validar apellidos (solo letras, 40 caracteres)
        const apellidos = document.getElementById('apellidos');
        if (!/^[A-Za-zÁ-úñÑ\s]{1,40}$/.test(apellidos.value.trim())) {
            apellidos.nextElementSibling.textContent = "Solo letras (máx. 40 caracteres)";
            isValid = false;
        } else {
            apellidos.nextElementSibling.textContent = "";
        }
        
        // Validar teléfono (9 dígitos)
        const telefono = document.getElementById('telefono');
        if (!/^[0-9]{9}$/.test(telefono.value.trim())) {
            telefono.nextElementSibling.textContent = "9 dígitos requeridos";
            isValid = false;
        } else {
            telefono.nextElementSibling.textContent = "";
        }
        
        // Validar email
        const email = document.getElementById('email');
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value.trim())) {
            email.nextElementSibling.textContent = "Ingrese un correo válido";
            isValid = false;
        } else {
            email.nextElementSibling.textContent = "";
        }
        
        return isValid;
    }
    
    // Calcular presupuesto
    function calculateBudget() {
        // Obtener producto seleccionado
        const selectedProduct = document.querySelector('input[name="product"]:checked');
        const productName = selectedProduct.nextElementSibling.textContent.split('\n')[0].trim();
        const basePrice = parseFloat(selectedProduct.dataset.price);
        
        // Determinar política de precios según plazo
        const plazo = parseInt(plazoInput.value);
        let rateInfo;
        
        if (plazo <= 7) {
            rateInfo = pricingPolicy.fast;
        } else if (plazo <= 14) {
            rateInfo = pricingPolicy.standard;
        } else {
            rateInfo = pricingPolicy.discount;
        }
        
        // Calcular extras
        let extrasPrice = 0;
        const selectedExtras = [];
        
        extraOptions.forEach(extra => {
            if (extra.checked) {
                const price = parseFloat(extra.dataset.price);
                extrasPrice += price;
                selectedExtras.push({
                    name: extra.nextElementSibling.textContent.split('\n')[0].trim(),
                    price: price
                });
            }
        });
        
        // Calcular total
        const subtotal = basePrice + extrasPrice;
        const total = subtotal * rateInfo.rate;
        const adjustment = subtotal * (rateInfo.rate - 1);
        
        // Mostrar resultados
        budgetAmount.textContent = total.toFixed(2) + "€";
        
        // Mostrar detalles
        let detailsHTML = `
            <div><strong>Producto principal:</strong> ${productName} (${basePrice.toFixed(2)}€)</div>
        `;
        
        if (selectedExtras.length > 0) {
            detailsHTML += `<div><strong>Extras:</strong></div>`;
            selectedExtras.forEach(extra => {
                detailsHTML += `<div>• ${extra.name}: +${extra.price.toFixed(2)}€</div>`;
            });
        }
        
        detailsHTML += `
            <div><strong>Subtotal:</strong> ${subtotal.toFixed(2)}€</div>
            <div><strong>Plazo:</strong> ${plazo} días (${rateInfo.text})</div>
        `;
        
        if (adjustment !== 0) {
            const adjustmentType = adjustment > 0 ? "Recargo" : "Descuento";
            detailsHTML += `<div><strong>${adjustmentType}:</strong> ${Math.abs(adjustment).toFixed(2)}€</div>`;
        }
        
        detailsHTML += `<div><strong>Total estimado:</strong> ${total.toFixed(2)}€</div>`;
        
        budgetDetails.innerHTML = detailsHTML;
    }
    
    // Event listeners para cálculo en tiempo real
    productOptions.forEach(option => {
        option.addEventListener('change', calculateBudget);
    });
    
    plazoInput.addEventListener('input', calculateBudget);
    
    extraOptions.forEach(option => {
        option.addEventListener('change', calculateBudget);
    });
    
    // Calcular presupuesto inicial
    calculateBudget();
    
    // Enviar formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos de contacto
        if (!validateContactFields()) {
            showMessage('Por favor corrige los errores en los datos de contacto', 'error');
            return;
        }
        
        // Validar condiciones
        const conditions = document.getElementById('accept-conditions');
        if (!conditions.checked) {
            conditions.nextElementSibling.nextElementSibling.textContent = "Debes aceptar las condiciones para continuar";
            showMessage('Debes aceptar las condiciones de privacidad', 'error');
            return;
        } else {
            conditions.nextElementSibling.nextElementSibling.textContent = "";
        }
        
        // Deshabilitar botón
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // Simular envío (en producción sería una llamada AJAX)
        setTimeout(() => {
            showMessage('¡Gracias por tu solicitud! Hemos recibido tu presupuesto y nos pondremos en contacto contigo en menos de 24 horas.', 'success');
            
            // Aquí normalmente se enviarían los datos al servidor
            console.log('Formulario enviado:', {
                nombre: document.getElementById('nombre').value,
                apellidos: document.getElementById('apellidos').value,
                telefono: document.getElementById('telefono').value,
                email: document.getElementById('email').value,
                producto: document.querySelector('input[name="product"]:checked').value,
                plazo: document.getElementById('plazo').value,
                extras: Array.from(document.querySelectorAll('input[name="extra"]:checked')).map(el => el.value),
                presupuesto: budgetAmount.textContent
            });
            
            // Restaurar botón después de 3 segundos
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado con éxito';
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Solicitar Presupuesto';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        }, 1500);
    });
    
    // Mostrar mensajes
    function showMessage(message, type) {
        formMessages.innerHTML = `
            <div class="alert-message alert-${type}">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
                ${message}
            </div>
        `;
        
        // Ocultar mensaje después de 5 segundos (solo éxito)
        if (type === 'success') {
            setTimeout(() => {
                const alert = formMessages.querySelector('.alert-message');
                if (alert) {
                    alert.style.opacity = '0';
                    setTimeout(() => alert.remove(), 300);
                }
            }, 5000);
        }
    }
});