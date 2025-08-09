/*
 * Copyright (C) 2023 Moises Núñez
 * Este archivo es parte de The Last Kart.
 * The Last Kart está licenciado bajo la GNU Affero General Public License v3.0.
 */

// main.js — v0.4.1
import { keys, getKeyboardInput, getGamepadInput } from 'https://mizulegendsstudios.github.io/The_Last_Kart/scripts/input.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const W = canvas.width, H = canvas.height;

const lapP1El = document.getElementById('lapP1');
const lapP2El = document.getElementById('lapP2');
const totalLapsEl = document.getElementById('totalLaps');
const speedP1El = document.getElementById('speedP1');
const speedP2El = document.getElementById('speedP2');
const fpsEl = document.getElementById('fps');
const checkP1El = document.getElementById('checkP1');
const checkP2El = document.getElementById('checkP2');
const totalChecksEl = document.getElementById('totalChecks');

let targetLaps = 3;
totalLapsEl.textContent = targetLaps;

function lineIntersect(ax,ay,bx,by,cx,cy,dx,dy){
  const u = ((cx-ax)*(ay-by)-(cy-ay)*(ax-bx))/((dx-cx)*(ay-by)-(dy-cy)*(ax-bx));
  const t = ((cx-ax)*(dy-cy)-(cy-ay)*(dx-cx))/((bx-ax)*(dy-cy)-(by-ay)*(dx-cx));
  return (t>=0 && t<=1 && u>=0 && u<=1);
}

const outer = [
  {x:80,y:80},{x:W-80,y:80},{x:W-80,y:H-160},{x:W-240,y:H-160},
  {x:W-240,y:H-80},{x:240,y:H-80},{x:240,y:H-160},{x:80,y:H-160}
];
const inner = [
  {x:240,y:200},{x:W-240,y:200},{x:W-240,y:H-260},{x:240,y:H-260}
];

const checkpoints = [
  {ax:200,ay:120,bx:W-200,by:120},
  {ax:W-120,ay:200,bx:W-120,by:H-220},
  {ax:W-200,ay:H-120,bx:200,by:H-120},
  {ax:120,ay:H-220,bx:120,by:200}
];
totalChecksEl.textContent = checkpoints.length;

const finish = {ax: (200 + W-200)/2 - 20, ay: 120, bx: (200 + W-200)/2 + 20, by: 120};

class Car {
  constructor(x, y, angle, color, controls=null){
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.vel = 0;
    this.width = 28;
    this.height = 44;
    this.color = color;
    this.maxSpeed = 6.5;
    this.accel = 0.18;
    this.brake = 0.28;
    this.turnSpeed = 0.04;
    this.controls = controls;
    this.visited = new Array(checkpoints.length).fill(false);
    this.currentLap = 0;
    this.prevX = undefined;
    this.prevY = undefined;
  }

  update(dt, inputState){
    let up=false, down=false, left=false, right=false, brake=false;

    if(this.controls){
      if(inputState){
        up = inputState[this.controls.up];
        down = inputState[this.controls.down];
        left = inputState[this.controls.left];
        right = inputState[this.controls.right];
        brake = inputState[this.controls.brake] || false;
      }
    } else if(typeof inputState === 'function'){
      const aiInput = inputState(this);
      up = aiInput.up;
      down = aiInput.down;
      left = aiInput.left;
      right = aiInput.right;
      brake = aiInput.brake || false;
    }

    if(up) this.vel += this.accel;
    if(down) this.vel -= this.brake;
    if(!up && !down) this.vel *= 0.985;
    if(brake) this.vel *= 0.92;
    this.vel = Math.max(-2.5, Math.min(this.vel, this.maxSpeed));

    const turn = (left ? -1 : 0) + (right ? 1 : 0);
    const sign = this.vel >= 0 ? 1 : -1;
    this.angle += turn * this.turnSpeed * (1 + Math.abs(this.vel)/8) * sign;

    this.x += Math.cos(this.angle - Math.PI/2) * this.vel;
    this.y += Math.sin(this.angle - Math.PI/2) * this.vel;

    if(this.x < 60) this.x = 60;
    if(this.x > W-60) this.x = W-60;
    if(this.y < 60) this.y = 60;
    if(this.y > H-60) this.y = H-60;

    if(this.prevX !== undefined){
      for(let i=0; i<checkpoints.length; i++){
        if(!this.visited[i]){
          const c = checkpoints[i];
          if(lineIntersect(this.prevX,this.prevY,this.x,this.y,c.ax,c.ay,c.bx,c.by)){
            this.visited[i] = true;
          }
        }
      }
      if(lineIntersect(this.prevX,this.prevY,this.x,this.y,finish.ax,finish.ay,finish.bx,finish.by)){
        if(this.visited.every(v=>v)){
          this.currentLap++;
          this.visited = new Array(checkpoints.length).fill(false);
        }
      }
    }
    this.prevX = this.x;
    this.prevY = this.y;
  }

  draw(){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(-this.width/2+4, -this.height/2+10, this.width, 12);
    ctx.fillStyle = this.color;
    roundRect(ctx, -this.width/2, -this.height/2, this.width, this.height, 4, true, false);
    ctx.fillStyle = '#222';
    roundRect(ctx, -this.width/4, -this.height/2+4, this.width/2, this.height/3, 2, true, false);
    ctx.fillStyle = '#111';
    ctx.fillRect(-this.width/2-4, -this.height/2+8, 6, 12);
    ctx.fillRect(this.width/2-2, -this.height/2+8, 6, 12);
    ctx.fillRect(-this.width/2-4, this.height/2-20, 6, 12);
    ctx.fillRect(this.width/2-2, this.height/2-20, 6, 12);
    ctx.restore();
  }
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

const controlsP1 = {up: 'w', down: 's', left: 'a', right: 'd', brake: ' '};
const controlsP2 = {up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright', brake: null};

const player1 = new Car((200 + W-200)/2 - 40, 120 - 40, Math.PI/2, '#ff4444', controlsP1);
const player2 = new Car((200 + W-200)/2 + 40, 120 - 40, Math.PI/2, '#4488ff', controlsP2);


function aiController(car){
  let targetIndex = car.visited.findIndex(v => !v);
  if(targetIndex === -1) targetIndex = 0;

  const c = checkpoints[targetIndex];
  const targetX = (c.ax + c.bx) / 2;
  const targetY = (c.ay + c.by) / 2;

  const dx = targetX - car.x;
  const dy = targetY - car.y;
  const targetAngle = Math.atan2(dy, dx);

  let diff = targetAngle - (car.angle - Math.PI/2);
  while(diff > Math.PI) diff -= 2*Math.PI;
  while(diff < -Math.PI) diff += 2*Math.PI;

  const turnLeft = diff < 0;
  const turnRight = diff > 0;

  return {
    up: true,
    down: false,
    left: turnLeft,
    right: turnRight,
    brake: false
  };
}

let aiCar = new Car(W-100, H-100, Math.PI/2, '#44ff44');
aiCar.visited = new Array(checkpoints.length).fill(false);

function update(dt){
  const kbInput = getKeyboardInput();
  const gpInput = getGamepadInput();

  // Player 1 usa gamepad si hay input, sino teclado WASD
  const inputP1 = (gpInput && (gpInput.up || gpInput.down || gpInput.left || gpInput.right)) ? gpInput : kbInput.player1;

  // Player 2 usa teclado flechas
  const inputP2 = kbInput.player2;

  player1.update(dt, inputP1);
  player2.update(dt, inputP2);
  aiCar.update(dt, aiController);
}

function drawPoly(pts, fillStyle=null, strokeStyle='#444', lineWidth=2){
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  if(fillStyle){ ctx.fillStyle = fillStyle; ctx.fill(); }
  ctx.strokeStyle = strokeStyle; ctx.lineWidth = lineWidth; ctx.stroke();
}

function drawTrack(){
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0,0,W,H);

  let gradOuter = ctx.createLinearGradient(0,0,W,0);
  gradOuter.addColorStop(0,'#2b2b2b');
  gradOuter.addColorStop(1,'#555555');
  drawPoly(outer, gradOuter, '#5a5a5a', 4);

  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.moveTo(inner[0].x, inner[0].y);
  for(let i=1;i<inner.length;i++) ctx.lineTo(inner[i].x, inner[i].y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.setLineDash([20,18]);
  ctx.strokeStyle = '#bbbb44';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(200, 120);
  ctx.lineTo(W-200, 120);
  ctx.lineTo(W-120, 200);
  ctx.lineTo(W-120, H-200);
  ctx.lineTo(W-200, H-120);
  ctx.lineTo(200, H-120);
  ctx.lineTo(120, H-200);
  ctx.lineTo(120, 200);
  ctx.closePath();
  ctx.stroke();

  ctx.setLineDash([]);

  ctx.strokeStyle = '#77ff44';
  ctx.lineWidth = 3;
  for(let c of checkpoints){
    ctx.beginPath();
    ctx.moveTo(c.ax,c.ay);
    ctx.lineTo(c.bx,c.by);
    ctx.stroke();
  }

  ctx.strokeStyle = '#ffcc00';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(finish.ax, finish.ay);
  ctx.lineTo(finish.bx, finish.by);
  ctx.stroke();
}

function render(){
  drawTrack();
  player1.draw();
  player2.draw();
  aiCar.draw();
}

let lastTime = 0;
let frames = 0;
let fps = 0;

function loop(ts=0){
  const dt = (ts - lastTime)/16.666;
  lastTime = ts;

  update(dt);
  render();

  // Update HUD
  lapP1El.textContent = player1.currentLap;
  lapP2El.textContent = player2.currentLap;
  speedP1El.textContent = Math.round(player1.vel*10);
  speedP2El.textContent = Math.round(player2.vel*10);
  checkP1El.textContent = player1.visited.filter(v => v).length;
  checkP2El.textContent = player2.visited.filter(v => v).length;

  // FPS  
let fpsTimer = 0;
function loop(ts = 0) {
const dt = (ts - lastTime) / 16.666;
  lastTime = ts;
  fpsTimer += ts - lastTime;
  frames++;

  if (fpsTimer >= 1000) {
    fps = frames;
    frames = 0;
    fpsTimer = 0;
  }
}

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
