// Scripts personalizados para Si Vas a Cúcuta

// === ASISTENTE IA (asistente.html) ===
async function enviarMensajeChatGPT(mensaje, historial, callback) {
  // Reemplaza 'TU_API_KEY_AQUI' por tu clave de OpenAI
  const apiKey = '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';
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const mensajes = historial.concat([{ role: 'user', content: mensaje }]);
  const body = {
    model: 'gpt-3.5-turbo',
    messages: mensajes,
    max_tokens: 300,
    temperature: 0.7
  };
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.choices && data.choices[0]) {
      callback(data.choices[0].message.content);
    } else {
      callback('Lo siento, no pude obtener respuesta.');
    }
  } catch (e) {
    callback('Error de conexión con el asistente IA.');
  }
}

if (window.location.pathname.endsWith('asistente.html')) {
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  let historial = [{ role: 'system', content: 'Eres un asistente experto en turismo de Norte de Santander y rutas binacionales Colombia-Venezuela.' }];

  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;
    chatMessages.innerHTML += `<div class='chat-bubble user animate__animated animate__fadeInRight'>${userMsg}</div>`;
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    enviarMensajeChatGPT(userMsg, historial, function(respuesta) {
      chatMessages.innerHTML += `<div class='chat-bubble ia animate__animated animate__fadeInLeft'>${respuesta}</div>`;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      historial.push({ role: 'user', content: userMsg });
      historial.push({ role: 'assistant', content: respuesta });
    });
  });
}

// === COTIZADOR IA (cotiza.html) ===
async function cotizarViajeOpenAI(datos, callback) {
  // Reemplaza 'TU_API_KEY_AQUI' por tu clave de OpenAI
  const apiKey = 'TU_API_KEY_AQUI';
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const prompt = `Eres un agente de viajes experto. Genera una propuesta de itinerario para un viaje a ${datos.destino} de ${datos.dias} días para ${datos.personas} personas, tipo de experiencia: ${datos.experiencia}. Incluye actividades diarias, recomendaciones y un mensaje motivador. Responde en formato de tarjeta para mostrar en web.`;
  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Eres un agente de viajes creativo y profesional.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 500,
    temperature: 0.8
  };
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.choices && data.choices[0]) {
      callback(data.choices[0].message.content);
    } else {
      callback('No se pudo generar la cotización.');
    }
  } catch (e) {
    callback('Error de conexión con el cotizador IA.');
  }
}

if (window.location.pathname.endsWith('cotiza.html')) {
  const form = document.querySelector('form');
  const respuestaDiv = document.getElementById('cotiza-respuesta');
  // Agregar campo de experiencia si no existe
  if (!document.getElementById('experiencia')) {
    const expDiv = document.createElement('div');
    expDiv.className = 'col-md-6';
    expDiv.innerHTML = `
      <label for="experiencia" class="form-label">Tipo de experiencia</label>
      <select class="form-select" id="experiencia" required>
        <option value="">Selecciona...</option>
        <option value="Aventura">Aventura</option>
        <option value="Cultural">Cultural</option>
        <option value="Relax">Relax</option>
        <option value="Familiar">Familiar</option>
      </select>
    `;
    form.querySelector('.row.g-3').appendChild(expDiv);
  }
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const datos = {
      destino: document.getElementById('destino').value,
      personas: document.getElementById('personas').value,
      dias: document.getElementById('fecha').value ? calcularDias(document.getElementById('fecha').value) : 3,
      experiencia: document.getElementById('experiencia').value
    };
    respuestaDiv.classList.remove('d-none');
    respuestaDiv.innerHTML = '<div class="spinner-border text-danger" role="status"><span class="visually-hidden">Cargando...</span></div> Generando propuesta IA...';
    cotizarViajeOpenAI(datos, function(respuesta) {
      respuestaDiv.innerHTML = `<div class='card shadow animate__animated animate__fadeInUp'><div class='card-body'>${respuesta.replace(/\n/g, '<br>')}</div></div><div class='mt-3'><a href="mailto:?subject=Cotización de viaje&body=${encodeURIComponent(respuesta)}" class="btn btn-outline-danger me-2"><i class="fas fa-envelope"></i> Enviar por correo</a><a href="https://wa.me/?text=${encodeURIComponent(respuesta)}" target="_blank" class="btn btn-success"><i class="fab fa-whatsapp"></i> Enviar por WhatsApp</a></div>`;
    });
  });
  function calcularDias(fecha) {
    // Simula 3 días si no se puede calcular
    return 3;
  }
}async function sendMessage() {
    const input = document.getElementById("user-input");
    const message = input.value.trim();
    if (!message) return;
  
    appendMessage("Tú", message);
    input.value = "";
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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" // ← Reemplaza aquí con tu API Key
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Eres un asistente de turismo para la agencia 'Si Vas a Cúcuta'. Ayudas a viajeros con paquetes turísticos, preguntas sobre Norte de Santander, Cúcuta, Táchira y Mérida." },
            { role: "user", content: message }
          ]
        })
      });
  
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Lo siento, no obtuve respuesta.";
      appendMessage("Asistente", reply);
    } catch (error) {
      appendMessage("Asistente", "Lo siento, ocurrió un error.");
      console.error(error);
    }
  }  
  function appendMessage(sender, text) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  