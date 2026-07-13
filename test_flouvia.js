

const fetch = require("node-fetch"); // Or use global fetch in Node 18+

async function testApi() {
  const apiKey = process.env.CORD_SECRET_KEY || "TU_API_KEY";
  const url = "https://cord.flouvia.com/api/v1/cotizaciones";
  
  const payload = {
    notas: `Cliente: Test\nEmail: test@test.com\nMensaje: test`,
    send: false, 
    items: [
      {
        descripcion: "Solicitud desde formulario web (revisar y ajustar precios)",
        cantidad: 1,
        precio_unitario: 0
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
  } catch(e) {
    console.error(e);
  }
}

testApi();
