/*
 * Copyright (C) 2023 Moises Núñez
 * Este archivo es parte de The Last Kart.
 * The Last Kart está licenciado bajo la GNU Affero General Public License v3.0.
 */

// main.js — v0.3.0
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const W = canvas.width, H = canvas.height;

// HUD refs
const lapEl = document.getElementById('lap');
const totalLapsEl = document.getElementById('totalLaps');
const speedEl = document.getElementById('speed');
const fpsEl = document.getElementById('fps');
const checkEl = document.getElementById('check');
const totalChecksEl = document.getElementById('totalChecks');

let targetLaps = 3;
totalLapsEl.textContent = targetLaps;

// Input
const keys = {};
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Utility: line intersection
function lineIntersect(ax,ay,bx,by,cx,cy,dx,dy){
  const u = ((cx-ax)*(ay-by)-(cy-ay)*(ax-bx))/((dx-cx)*(ay-by)-(dy-cy)*(ax-bx));
  const t = ((cx-ax)*(dy-cy)-(cy-ay)*(dx-cx))/((bx-ax)*(dy-cy)-(by-ay)*(dx-cx));
  return (t>=0 && t<=1 && u>=0 && u<=1);
}

// Track: outer polygon and inner polygon (donut track)
const outer = [
  {x:80,y:80},{x:W-80,y:80},{x:W-80,y:H-160},{x:W-240,y:H-160},
  {x:W-240,y:H-80},{x:240,y:H-80},{x:240,y:H-160},{x:80,y:H-160}
];
const inner = [
  {x:240,y:200},{x:W-240,y:200},{x:W-240,y:H-260},{x:240,y:H-260}
];

// Checkpoints: ordered segments around track to prevent shortcutting
// We'll place checkpoints at midpoints of track corridors (simple approximation)
const checkpoints = [
  // top mid (left->right)
  {ax:200,ay:120,bx:W-200,by:120},
  // right curve (top->down)
  {ax:W-120,ay:200,bx:W-120,by:H-220},
  // bottom mid (right->left)
  {ax:W-200,ay:H-120,bx:200,by:H-120},
  // left curve (down->top)
  {ax:120,ay:H-220,bx:120,by:200}
];
totalChecksEl.textContent = checkpoints.length;

// Finish line is first checkpoint but we'll treat finish as a distinct small segment
const finish = {ax: (200 + W-200)/2 - 20, ay: 120, bx: (200 + W-200)/2 + 20, by: 120};

// Car
const car = {
  x: (200 + W-200)/2, // start center top area just past finish
  y: 120 - 40,
  angle: Math.PI/2, // pointing down
  vel: 0,
  maxSpeed: 6.5,
  accel: 0.18,
  brake: 0.28,
  turnSpeed: 0.04,
  width: 28,
  height: 44,
  color: '#ff4444'
};

// Lap & checkpoint state
let currentLap = 0;
let visited = new Array(checkpoints.length).fill(false);
lapEl.textContent = currentLap;
checkEl.textContent = visited.filter(v=>v).length;

// Physics & timing
let last = performance.now();
let fpsCounter = {frames:0,lastTime:performance.now(),value:0};

// Helpers to draw polygons
function drawPoly(pts, fillStyle=null, strokeStyle='#444', lineWidth=2){
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  if(fillStyle){ ctx.fillStyle = fillStyle; ctx.fill(); }
  ctx.strokeStyle = strokeStyle; ctx.lineWidth = lineWidth; ctx.stroke();
}

// Draw track (donut)
function drawTrack(){
  // background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0,0,W,H);

  // outer wall
  drawPoly(outer, '#2b2b2b', '#5a5a5a', 4);

  // inner hole (cut)
  ctx.save();
  // draw full outer fill then punch hole using globalCompositeOperation
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.moveTo(inner[0].x, inner[0].y);
  for(let i=1;i<inner.length;i++) ctx.lineTo(inner[i].x, inner[i].y);
  ctx.closePath();
  ctx.fillStyle = '#000';
  ctx.fill();
  ctx.restore();

  // Track center line (dashed)
  ctx.setLineDash([20,18]);
  ctx.strokeStyle = '#bbbb44';
  ctx.lineWidth = 2;
  ctx.beginPath();
  // path through middle of track rectangle-ish loop
  ctx.moveTo( (200), 120 );
  ctx.lineTo( W-200, 120 );
  ctx.lineTo( W-120, 200 );
  ctx.lineTo( W-120, H-200 );
  ctx.lineTo( W-200, H-120 );
  ctx.lineTo( 200, H-120 );
  ctx.lineTo( 120, H-200 );
  ctx.lineTo( 120, 200 );
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);

  // draw checkpoints
  for(let i=0;i<checkpoints.length;i++){
    const c = checkpoints[i];
    ctx.strokeStyle = visited[i] ? '#4CAF50' : '#cc3333';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(c.ax, c.ay);
    ctx.lineTo(c.bx, c.by);
    ctx.stroke();
  }

  // finish line
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(finish.ax, finish.ay);
  ctx.lineTo(finish.bx, finish.by);
  ctx.stroke();

  // small decorative border
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  ctx.strokeRect(2,2,W-4,H-4);
}

// Draw simple pixel-like rally car (shape)
function drawCar(){
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(-car.width/2+4, -car.height/2+10, car.width, 12);
  // body
  ctx.fillStyle = car.color;
  roundRect(ctx, -car.width/2, -car.height/2, car.width, car.height, 4, true, false);
  // windshield
  ctx.fillStyle = '#222';
  roundRect(ctx, -car.width/4, -car.height/2+4, car.width/2, car.height/3, 2, true, false);
  // wheels (simple)
  ctx.fillStyle = '#111';
  ctx.fillRect(-car.width/2-4, -car.height/2+8, 6, 12); // front-left
  ctx.fillRect(car.width/2-2, -car.height/2+8, 6, 12); // front-right
  ctx.fillRect(-car.width/2-4, car.height/2-20, 6, 12); // rear-left
  ctx.fillRect(car.width/2-2, car.height/2-20, 6, 12); // rear-right
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r, fill, stroke){
  if (r === undefined) r = 5;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if(fill) ctx.fill();
  if(stroke) ctx.stroke();
}

// Movement, steering, update
function update(dt){
  // controls: forward/back + strafe/turning style that gives 360° handling
  const up = keys['w'] || keys['arrowup'];
  const down = keys['s'] || keys['arrowdown'];
  const left = keys['a'] || keys['arrowleft'];
  const right = keys['d'] || keys['arrowright'];
  const brake = keys[' ']; // space

  // acceleration/brake
  if(up) car.vel += car.accel;
  if(down) car.vel -= car.brake;
  if(!up && !down){
    // natural friction
    car.vel *= 0.985;
  }
  if(brake) car.vel *= 0.92;

  // clamp speed
  car.vel = Math.max(-2.5, Math.min(car.vel, car.maxSpeed));

  // turning scaled by speed magnitude (reversed when reversing)
  const turn = (left ? -1 : 0) + (right ? 1 : 0);
  const sign = car.vel >= 0 ? 1 : -1;
  car.angle += turn * car.turnSpeed * (1 + Math.abs(car.vel)/8) * sign;

  // integrate position
  car.x += Math.cos(car.angle - Math.PI/2) * car.vel;
  car.y += Math.sin(car.angle - Math.PI/2) * car.vel;

  // keep inside canvas bounding rect — simple wall collision (push back)
  if(car.x < 60) car.x = 60;
  if(car.x > W-60) car.x = W-60;
  if(car.y < 60) car.y = 60;
  if(car.y > H-60) car.y = H-60;

  // speed HUD (approx to km/h)
  speedEl.textContent = Math.round(Math.abs(car.vel)*42);

  // checkpoint detection — check segment intersection between previous pos and current pos
  const prev = {x: car.prevX, y: car.prevY};
  const now = {x: car.x, y: car.y};
  if(prev.x !== undefined){
    for(let i=0;i<checkpoints.length;i++){
      if(!visited[i]){
        const c = checkpoints[i];
        if(lineIntersect(prev.x,prev.y,now.x,now.y,c.ax,c.ay,c.bx,c.by)){
          visited[i] = true;
          checkEl.textContent = visited.filter(v=>v).length;
        }
      }
    }
    // finish crossing: allow lap increment only if all checkpoints visited in order
    // detect crossing finish segment (top mid)
    if(lineIntersect(prev.x,prev.y,now.x,now.y,finish.ax,finish.ay,finish.bx,finish.by)){
      // require all visited
      const all = visited.every(v=>v);
      if(all){
        currentLap++;
        lapEl.textContent = currentLap;
        // reset visited for next lap
        visited = new Array(checkpoints.length).fill(false);
        checkEl.textContent = 0;
      } else {
        // false finish — ignore
      }
    }
  }
  car.prevX = car.x; car.prevY = car.y;
}

// Render loop
function render(){
  drawTrack();
  drawCar();
}

// Main loop
function loop(t){
  const now = performance.now();
  const dt = Math.min(32, now - last);
  last = now;

  update(dt/16);
  render();

  // FPS
  fpsCounter.frames++;
  if(now - fpsCounter.lastTime >= 500){
    fpsCounter.value = Math.round((fpsCounter.frames*1000)/(now - fpsCounter.lastTime));
    fpsCounter.frames = 0;
    fpsCounter.lastTime = now;
    fpsEl.textContent = fpsCounter.value;
  }

  requestAnimationFrame(loop);
}

// Reset function
function reset(){
  car.x = (200 + W-200)/2;
  car.y = 120 - 40;
  car.angle = Math.PI/2;
  car.vel = 0;
  currentLap = 0;
  lapEl.textContent = currentLap;
  visited = new Array(checkpoints.length).fill(false);
  checkEl.textContent = 0;
}

// keyboard helper for reset R
window.addEventListener('keydown', (e)=>{
  if(e.key.toLowerCase() === 'r'){ reset(); }
});

// initial values
lapEl.textContent = currentLap;
checkEl.textContent = visited.filter(v=>v).length;
totalChecksEl.textContent = checkpoints.length;

// start
requestAnimationFrame(loop);
