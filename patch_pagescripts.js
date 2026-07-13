const fs = require('fs');
const path = 'src/app/(marketing)/PageScripts.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /for \(const code of js\) \{([\s\S]*?)\} \/\/ wrap in IIFE/,
  'for (const code of js) {'
);

const newInjectLogic = `
      const initEvent = "zarco-init-" + Date.now() + "-" + Math.random().toString(36).substring(2);
      for (const code of js) {
        const el = document.createElement("script");
        const trimmed = code.trimStart();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          el.type = "application/ld+json";
          el.textContent = code;
        } else {
          // Replace DOMContentLoaded with our unique event so old listeners don't re-trigger
          let safeCode = code.replace(/['"\`]DOMContentLoaded['"\`]/g, \`"\${initEvent}"\`);
          el.textContent = \`(function(){ \${safeCode} \n})();\`;
        }
        el.dataset.wfPage = "1";
        document.body.appendChild(el);
        injected.push(el);
      }
      document.dispatchEvent(new Event(initEvent));
`;

content = content.replace(/for \(const code of js\) \{[\s\S]*?document\.dispatchEvent\(new Event\("DOMContentLoaded"\)(?:, \{ bubbles: true, cancelable: true \})?\);/, newInjectLogic.trim());

fs.writeFileSync(path, content);
console.log('Patched PageScripts.tsx');
