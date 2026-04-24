let activeTab = 'div';

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const target = e.target.getAttribute('data-tab');
    activeTab = target;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.preview-item').forEach(p => p.classList.remove('active'));
    e.target.classList.add('active');
    document.getElementById('preview-' + target).classList.add('active');
    const radiusInput = document.getElementById('ctrl-radius');
    if(target === 'button') radiusInput.value = 50;
    else if(target === 'input') radiusInput.value = 16;
    else radiusInput.value = 32;
    update();
  });
});

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return {r, g, b};
}

function update() {
  const blur = parseFloat(document.getElementById('ctrl-blur').value);
  const opacity = parseFloat(document.getElementById('ctrl-opacity').value);
  const distort = parseInt(document.getElementById('ctrl-distort').value);
  const turb = parseFloat(document.getElementById('ctrl-turb').value);
  const radius = parseInt(document.getElementById('ctrl-radius').value);
  const shine = parseFloat(document.getElementById('ctrl-shine').value);
  const color = document.getElementById('ctrl-color').value;
  const rgb = hexToRgb(color);

  document.getElementById('val-blur').textContent = blur + 'px';
  document.getElementById('val-opacity').textContent = Math.round(opacity*100) + '%';
  document.getElementById('val-distort').textContent = distort;
  document.getElementById('val-turb').textContent = turb.toFixed(3);
  document.getElementById('val-radius').textContent = radius + 'px';
  document.getElementById('val-shine').textContent = Math.round(shine*100) + '%';

  document.getElementById('fe-turb').setAttribute('baseFrequency', turb + ' ' + turb);
  document.getElementById('fe-disp').setAttribute('scale', distort);

  const wrappers = document.querySelectorAll('.liquidGlass-wrapper');
  const tints = document.querySelectorAll('.liquidGlass-tint');
  const effects = document.querySelectorAll('.liquidGlass-effect');
  const shines = document.querySelectorAll('.liquidGlass-shine');

  wrappers.forEach(w => w.style.borderRadius = radius + 'px');
  tints.forEach(t => t.style.background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`);
  effects.forEach(e => e.style.backdropFilter = `blur(${blur}px)`);
  shines.forEach(s => s.style.boxShadow = `inset 2px 2px 2px 0 rgba(255,255,255,${shine}), inset -1px -1px 2px 0 rgba(255,255,255,${shine})`);

  generateCSS(blur, opacity, distort, turb, radius, shine, rgb);
  generateHTML();
}

function generateCSS(blur, opacity, distort, turb, radius, shine, rgb) {
  const code = `.hertz-container {
  position: relative;
  overflow: hidden;
  border-radius: ${radius}px;
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
  document.getElementById('code-out').textContent = code;
}

function generateHTML() {
  let content = "";
  let tag = "div";
  
  if (activeTab === 'button') {
    tag = "button";
    content = "Click Me";
  } else if (activeTab === 'input') {
    content = '<input type="text" placeholder="Type here...">';
  } else {
    content = "Your Content Here";
  }

  const html = `<${tag} class="hertz-container">
  <div class="hertz-blur"></div>
  <div class="hertz-tint"></div>
  <div class="hertz-highlight"></div>

  
  <div class="hertz-content">
    ${content}
  </div>
</${tag}>`;
  
  document.getElementById('html-out').textContent = html;
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
