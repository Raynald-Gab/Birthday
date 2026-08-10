const wrap = document.getElementById('envelopeWrap');
const envelope = document.getElementById('envelope');
const seal = document.getElementById('seal');
const letter = document.getElementById('letter');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');

const PEEK_HOLD_MS = 700;   // how long the peeking paper stays visible before it grows
const CLOSE_HOLD_MS = 550;  // how long it pauses at peek size on the way back in
let animating = false;

function openLetter(){
  if(animating || wrap.classList.contains('peek')) return;
  animating = true;
  wrap.classList.add('peek');       // flap opens, paper slides up and pauses
  overlay.classList.add('show');
  setTimeout(()=>{
    wrap.classList.add('open');     // then it grows and centers for reading
    animating = false;
  }, PEEK_HOLD_MS);
}

function closeLetter(){
  if(animating) return;
  if(!wrap.classList.contains('open') && !wrap.classList.contains('peek')) return;
  animating = true;
  wrap.classList.remove('open');    // shrinks back down to peek size/position
  setTimeout(()=>{
    wrap.classList.remove('peek');  // then slides back down, flap closes
    overlay.classList.remove('show');
    animating = false;
  }, CLOSE_HOLD_MS);
}

envelope.addEventListener('click', openLetter);
seal.addEventListener('click', (e)=>{ e.stopPropagation(); openLetter(); });
closeBtn.addEventListener('click', (e)=>{ e.stopPropagation(); closeLetter(); });
overlay.addEventListener('click', closeLetter);
letter.addEventListener('click', (e)=>{
  if(!wrap.classList.contains('open') && !wrap.classList.contains('peek')) openLetter();
  else e.stopPropagation();
});

// --- interactive background hearts ---
const scene = document.querySelector('.scene');
const glyphs = ['♡','♥'];

function spawnHeart(x, y, size){
  const h = document.createElement('span');
  h.className = 'heart-pop';
  h.textContent = glyphs[Math.random() < 0.5 ? 0 : 1];
  h.style.left = x + 'px';
  h.style.top = y + 'px';
  h.style.fontSize = size + 'px';
  scene.appendChild(h);
  h.addEventListener('animationend', () => h.remove());
}

// tapping empty background sprinkles a little heart
scene.addEventListener('click', (e) => {
  if (e.target !== scene) return;
  spawnHeart(e.clientX, e.clientY, 14 + Math.random() * 10);
});

// tapping a decorative heart/sparkle gives it a little glow pulse + burst
document.querySelectorAll('.deco').forEach((d) => {
  d.addEventListener('click', (e) => {
    e.stopPropagation();
    const r = d.getBoundingClientRect();
    spawnHeart(r.left + r.width / 2, r.top + r.height / 2, 16);
    d.classList.add('active');
    setTimeout(() => d.classList.remove('active'), 400);
  });
});