const fs = require('fs');

function patch(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const disclaimer = `
<div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; margin-top: 20px; margin-bottom: 20px; font-weight: bold;">
  Nota importante sobre precios: Los precios mostrados en esta plataforma son de referencia. Debido a la constante actualización en tienda física, el total final podría tener ligeras variaciones que te confirmaremos al procesar tu pedido.
</div>
`;
  
  // Find a good place to inject. The content is usually wrapped in some div.
  // We can just append it before the closing </div> or add it at the top.
  // Let's just prepend it right after <div class="w-layout-blockcontainer container-11 w-container"> or similar.
  // Let's just append it to body[0].
  
  data.body = disclaimer + data.body;
  
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log('Patched ' + file);
}

patch('./src/webflow/terminos-del-servicio.json');
patch('./src/webflow/aviso-de-privacidad.json');
