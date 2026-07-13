const fs = require('fs');

function addDisclaimer(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  const disclaimerHTML = `
  <div class="legal-card" style="background-color: #fff3cd; border-left: 5px solid #ffc107;">
      <div class="card-icon" style="color: #856404;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      </div>
      <h2 style="color: #856404;">Nota Importante de Precios</h2>
      <p style="color: #856404;"><strong>Los precios mostrados en esta plataforma son exclusivamente de referencia.</strong> Debido a la constante actualización y volatilidad del mercado en tienda física, el total final de su pedido podría tener variaciones. El precio final y definitivo será confirmado por nuestros agentes al momento de procesar su pedido.</p>
  </div>
  `;

  // Inject at the beginning of legal-content
  if (data.body.includes('<div class="legal-content">')) {
    data.body = data.body.replace('<div class="legal-content">', '<div class="legal-content">\n' + disclaimerHTML);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log('Successfully patched ' + file);
  } else {
    console.log('Could not find <div class="legal-content"> in ' + file);
  }
}

addDisclaimer('./src/webflow/terminos-del-servicio.json');
addDisclaimer('./src/webflow/aviso-de-privacidad.json');
