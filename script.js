let activeTab = 'div';

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', (e) => {
    activeTab = e.target.getAttribute('data-tab');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.preview-item').forEach(p => p.classList.remove('active'));
    e.target.classList.add('active');
    document.getElementById('preview-' + activeTab).classList.add('active');
    update();
  });
});

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16), g = parseInt(hex.slice(3,5), 16), b = parseInt(hex.slice(5,7), 16);
  return {r, g, b};
}

function update() {
  const blur = document.getElementById('ctrl-blur').value, opacity = document.getElementById('ctrl-opacity').value;
  const distort = document.getElementById('ctrl-distort').value, turb = document.getElementById('ctrl-turb').value;
  const radius = document.getElementById('ctrl-radius').value, shine = document.getElementById('ctrl-shine').value;
  const color = document.getElementById('ctrl-color').value, rgb = hexToRgb(color);

  document.getElementById('val-blur').textContent = blur + 'px';
  document.getElementById('val-opacity').textContent = Math.round(opacity*100) + '%';
  document.getElementById('val-distort').textContent = distort;
  document.getElementById('val-turb').textContent = turb;
  document.getElementById('val-radius').textContent = radius + 'px';
  document.getElementById('val-shine').textContent = Math.round(shine*100) + '%';

  document.getElementById('fe-turb').setAttribute('baseFrequency', turb + ' ' + turb);
  document.getElementById('fe-disp').setAttribute('scale', distort);

  document.querySelectorAll('.liquidGlass-wrapper').forEach(w => w.style.borderRadius = radius + 'px');
  document.querySelectorAll('.liquidGlass-tint').forEach(t => t.style.background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`);
  document.querySelectorAll('.liquidGlass-effect').forEach(e => e.style.backdropFilter = `blur(${blur}px)`);
  document.querySelectorAll('.liquidGlass-shine').forEach(s => s.style.boxShadow = `inset 2px 2px 2px 0 rgba(255,255,255,${shine})`);

  generateCSS(blur, opacity, distort, turb, radius, shine, rgb);
  generateHTML();
  generateSVG(distort, turb);
}

function generateCSS(blur, opacity, distort, turb, radius, shine, rgb) {
  let extraStyles = "";
  if (activeTab === 'button') {
    extraStyles = "\n  border: none;\n  cursor: pointer;\n  padding: 14px 28px;\n  min-width: 160px;\n  display: flex;\n  justify-content: center;";
  } else if (activeTab === 'input') {
    extraStyles = "\n  width: 300px;\n  height: 50px;\n  padding: 0 20px;\n  display: flex;\n  align-items: center;";
  } else {
    extraStyles = "\n  width: 300px;\n  height: 200px;\n  display: flex;\n  align-items: center;\n  justify-content: center;";
  }

  document.getElementById('code-out').textContent = `.hertz-container {
  position: relative;
  overflow: hidden;
  border-radius: ${radius}px;${extraStyles}
}
.hertz-blur {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(${blur}px);
  filter: url(#hertz-distortion);
}
.hertz-tint {
  position: absolute;
  inset: 0;
  background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity});
}
.hertz-highlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 2px 2px 2px rgba(255,255,255,${shine});
}
.hertz-content {
  position: relative;
  z-index: 10;
}`;
}

function generateHTML() {
  let content = activeTab === 'input' ? '<input type="text" placeholder="Entry..." style="background:transparent;border:none;outline:none;width:100%">' : (activeTab === 'button' ? 'HertzUI Button' : 'HertzUI');
  let tag = activeTab === 'button' ? 'button' : 'div';
  
  document.getElementById('html-out').textContent = `<${tag} class="hertz-container">
  <div class="hertz-blur"></div>
  <div class="hertz-tint"></div>
  <div class="hertz-highlight"></div>
  <div class="hertz-content">${content}</div>
</${tag}>`;
}

function generateSVG(distort, turb) {
  document.getElementById('svg-out').textContent = `
<svg style="display:none">
  <filter id="hertz-distortion">
    <feTurbulence type="fractalNoise" baseFrequency="${turb}" numOctaves="2" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="${distort}"/>
  </filter>
</svg>`;
}

function copyText(id) {
  const text = document.getElementById(id).textContent;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

window.onload = update;
