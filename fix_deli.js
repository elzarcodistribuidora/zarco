const fs = require('fs');
let code = fs.readFileSync('src/components/DelicatessenNavbar.tsx', 'utf8');

// Replace desktop-only and mobile-only with deli-desktop-only and deli-mobile-only
code = code.replace(/desktop-only/g, 'deli-desktop-only');
code = code.replace(/mobile-only/g, 'deli-mobile-only');

// Add the media queries to the <style> block
const newCSS = `
        /* Sobrescribir colores para la sección Delicatessen */
        #deli-navbar .nav-top { background-color: #343a40 !important; }
        #deli-navbar .nav-bottom { background-color: #A81200 !important; }
        
        /* Bypass the broken global .desktop-only class from delicatessen.css */
        @media (max-width: 1024px) {
          #deli-navbar .deli-desktop-only { display: none !important; }
          #deli-navbar .deli-mobile-only { display: flex !important; }
          #deli-navbar .nav-logo-mobile.deli-mobile-only { display: block !important; }
        }
        @media (min-width: 1025px) {
          #deli-navbar .deli-mobile-only { display: none !important; }
        }
`;

code = code.replace(/\/\* Sobrescribir colores para la sección Delicatessen \*\/[\s\S]*?#deli-navbar \.nav-bottom \{ background-color: #A81200 !important; \}/, newCSS.trim());

fs.writeFileSync('src/components/DelicatessenNavbar.tsx', code);
console.log('Fixed classes');
