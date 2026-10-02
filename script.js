import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const canvas=document.getElementById("scene");
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x91b3c8);
scene.fog=new THREE.Fog(0x91b3c8,38,100);

const camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.1,250);
camera.position.set(22,18,24);

const controls=new OrbitControls(camera,canvas);
controls.target.set(0,3,0);
controls.enableDamping=true;
controls.maxPolarAngle=Math.PI*.46;
controls.minDistance=12;
controls.maxDistance=45;

const hemi=new THREE.HemisphereLight(0xddeeff,0x26301f,2.0);
scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe2bd,3.2);
sun.position.set(-20,30,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
scene.add(sun);

const mats={
 wall:new THREE.MeshStandardMaterial({color:0xe9dfcf,roughness:.85}),
 floor:new THREE.MeshStandardMaterial({color:0x75563d,roughness:.8}),
 darkFloor:new THREE.MeshStandardMaterial({color:0x3b3028,roughness:.9}),
 roof:new THREE.MeshStandardMaterial({color:0x4c3d39,roughness:.9}),
 wood:new THREE.MeshStandardMaterial({color:0x5c3c2b,roughness:.75}),
 glass:new THREE.MeshStandardMaterial({color:0x9fd7e8,transparent:true,opacity:.35,roughness:.1,metalness:.1}),
 sofa:new THREE.MeshStandardMaterial({color:0x7a8790,roughness:1}),
 skin:new THREE.MeshStandardMaterial({color:0xd59c79}),
 hair:new THREE.MeshStandardMaterial({color:0x251b18}),
 shirt1:new THREE.MeshStandardMaterial({color:0x5b79b9}),
 shirt2:new THREE.MeshStandardMaterial({color:0xb76868}),
 phone:new THREE.MeshStandardMaterial({color:0x11151a,metalness:.5,roughness:.25}),
 green:new THREE.MeshStandardMaterial({color:0x4e704d})
};

function box(name,x,y,z,sx,sy,sz,mat,rot=0){
 const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat);m.name=name;m.position.set(x,y,z);m.rotation.y=rot;m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;
}
function cyl(x,y,z,r,h,mat){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,16),mat);m.position.set(x,y,z);m.castShadow=true;scene.add(m);return m}
function sphere(x,y,z,r,mat){const m=new THREE.Mesh(new THREE.SphereGeometry(r,20,16),mat);m.position.set(x,y,z);m.castShadow=true;scene.add(m);return m}

// Ground
box("ground",0,-.35,0,62,.5,62,mats.green);
for(let i=-24;i<=24;i+=6){box("path",i,-.08,17,4,.12,2,mats.floor);box("path",i,-.08,-17,4,.12,2,mats.floor)}

// Main house shell: two floors visually open from camera side
box("floor1",0,.1,0,34,.35,24,mats.floor);
box("floor2",0,7.0,0,34,.35,24,mats.floor);
box("backWall",0,5, -11.7,34,10,0.5,mats.wall);
box("leftWall",-16.7,5,0,.5,10,24,mats.wall);
box("rightWall",16.7,5,0,.5,10,24,mats.wall);

// roof
const roof=new THREE.Mesh(new THREE.ConeGeometry(24,7,4),mats.roof);roof.rotation.y=Math.PI/4;roof.position.y=12;roof.scale.z=.7;roof.castShadow=true;scene.add(roof);

// room separators
box("wallLiving",-4.7,2.8,0,.35,5.5,11,mats.wall);
box("wallKitchen",6.5,2.8,4,20,.35,7,mats.wall);
box("stairsWall",9.5,2.8,-7,.35,5.5,9,mats.wall);

// windows
for(const x of [-11,-5,2,10]) box("window",x,5,-11.35,4.5,3,.15,mats.glass);
for(const x of [-11,12]) box("window",x,5,11.35,4.5,3,.15,mats.glass);

// doors
box("door",-4.5,2.1,-11.25,2.6,4,.25,mats.wood);
box("frontDoor",13,2.1,11.25,2.6,4,.25,mats.wood);

// furniture
box("sofa",-10,1.25,4,7,2,2,mats.sofa);
box("coffee", -10,0.7,0,3.5,.8,1.6,mats.wood);
box("tv", -10,3,-10.8,5,3,.35,mats.phone);
box("kitchenCounter",8,1.5,7,13,2.3,2,mats.wood);
box("table",5,1.2,-2,5,1.6,3,mats.wood);
for(const x of [3.2,6.8]) for(const z of [-3.8,-.2]) cyl(x,.65,z,.35,1.2,mats.wood);
box("bedroomBed",-10,8.4,4,7,1.5,4,mats.sofa);
box("bedroomBed2",4,8.4,4,7,1.5,4,mats.sofa);
box("upTV",0,9,-11.1,6,3,.35,mats.phone);

// stairs
for(let i=0;i<10;i++) box("step",8.5+i*.55,.4+i*.62,-8.5+i*.25,5,.6,1.6,mats.wood);

// lamps
function lamp(x,y,z){
 cyl(x,y,z,.12,3,mats.wood);sphere(x,y-1.5,z,.55,new THREE.MeshStandardMaterial({color:0xffe5a0,emissive:0xffb74d,emissiveIntensity:1}));
 const l=new THREE.PointLight(0xffc477,2.2,9);l.position.set(x,y-1.5,z);scene.add(l);
}
lamp(-9,5,1);lamp(4,5,6);lamp(-9,12,3);lamp(5,12,3);

// Characters
const chars=[];
const conversations={
 "نور":[
  ["نور","يمّا، وين الهاتف تاعي؟"],
  ["الأم","راه فوق الطاولة في الصالون."],
  ["نور","لقيتو 😂 شكرا!"]
 ],
 "الأم":[
  ["الأم","نور، تعالي للعشاء كي تكملي في الهاتف."],
  ["نور","حاضر يمّا، دقيقة برك."]
 ],
 "الأب":[
  ["الأب","كيفاش كان نهارك اليوم؟"],
  ["نور","كان مليح، راني نرتاح شوية."]
 ],
 "الأخ":[
  ["الأخ","واش راكي تديري؟"],
  ["نور","نهدر شوية في الهاتف 😄"]
 ]
};

function character(name,x,z,shirtMat){
 const g=new THREE.Group();g.position.set(x,0,z);
 const body=new THREE.Mesh(new THREE.CapsuleGeometry(.58,1.4,6,12),shirtMat);body.position.y=1.35;body.castShadow=true;g.add(body);
 const head=sphere(0,2.65,0,.48,mats.skin);g.add(head);
 const hair=sphere(0,2.98,0,.5,mats.hair);hair.scale.y=.5;g.add(hair);
 const phone=box("phone",.62,1.25,.05,.18,.4,.07,mats.phone);g.add(phone);
 const label=makeLabel(name);label.position.y=3.45;g.add(label);
 scene.add(g);
 const c={name,g,home:new THREE.Vector3(x,0,z),target:new THREE.Vector3(x,0,z),speed:.9,phase:Math.random()*6,phone};
 chars.push(c);return c;
}
function makeLabel(text){
 const c=document.createElement("canvas");c.width=256;c.height=64;const ctx=c.getContext("2d");
 ctx.fillStyle="rgba(8,15,24,.82)";ctx.roundRect(8,8,240,48,18);ctx.fill();
 ctx.fillStyle="#fff";ctx.font="bold 25px Arial";ctx.textAlign="center";ctx.fillText(text,128,40);
 const t=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true}));s.scale.set(2.8,.7,1);return s;
}

character("نور",-8,2,mats.shirt1);
character("الأم",-2,5,mats.shirt2);
character("الأب",3,7,mats.shirt1);
character("الأخ",9,-2,mats.shirt2);

// interaction raycast
const ray=new THREE.Raycaster(), mouse=new THREE.Vector2();
function pointer(e){
 const r=canvas.getBoundingClientRect();mouse.x=((e.clientX-r.left)/r.width)*2-1;mouse.y=-((e.clientY-r.top)/r.height)*2+1;
 ray.setFromCamera(mouse,camera);
 const hits=ray.intersectObjects(scene.children,true);
 for(const h of hits){
   let obj=h.object,c=null;while(obj){c=chars.find(q=>q.g===obj);if(c)break;obj=obj.parent}
   if(c){openDialog(c);return}
 }
}
canvas.addEventListener("click",pointer);
canvas.addEventListener("touchend",e=>{if(e.changedTouches[0])pointer(e.changedTouches[0])},{passive:true});

function openDialog(c){
 document.getElementById("dialogName").textContent=c.name+" · الهاتف";
 document.getElementById("dialogText").textContent="هذه الشخصية تستعمل هاتفها الآن. اضغط عليها مرة أخرى لاحقًا لفتح محادثتها.";
 document.getElementById("dialog").classList.remove("hidden");
 document.getElementById("phoneOwner").textContent="هاتف "+c.name;
 const list=document.getElementById("chatList");list.innerHTML="";
 (conversations[c.name]||[]).forEach((m,i)=>{const d=document.createElement("div");d.className="msg "+(i%2?"them":"me");d.innerHTML=`${m[1]}<span class="time">${m[0]} · الآن</span>`;list.appendChild(d)});
 document.getElementById("phonePanel").classList.remove("hidden");
}
document.getElementById("dialogClose").onclick=()=>document.getElementById("dialog").classList.add("hidden");
document.getElementById("closePhone").onclick=()=>document.getElementById("phonePanel").classList.add("hidden");

document.getElementById("sendBtn").onclick=sendMessage;
document.getElementById("chatInput").addEventListener("keydown",e=>{if(e.key==="Enter")sendMessage()});
function sendMessage(){
 const inp=document.getElementById("chatInput"),v=inp.value.trim();if(!v)return;
 const d=document.createElement("div");d.className="msg me";d.innerHTML=`${v}<span class="time">أنت · الآن</span>`;
 document.getElementById("chatList").appendChild(d);inp.value="";
 setTimeout(()=>{const r=document.createElement("div");r.className="msg them";r.innerHTML="تمام ❤️<span class=\"time\">الآن</span>";document.getElementById("chatList").appendChild(r);document.getElementById("chatList").scrollTop=99999},600);
}

// movement
const keys={};
addEventListener("keydown",e=>keys[e.key.toLowerCase()]=true);
addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll(".mobileControls button").forEach(b=>{
 b.addEventListener("pointerdown",()=>keys[b.dataset.key]=true);
 b.addEventListener("pointerup",()=>keys[b.dataset.key]=false);
 b.addEventListener("pointerleave",()=>keys[b.dataset.key]=false);
});
function playerMove(dt){
 const dir=new THREE.Vector3();
 if(keys.w)dir.z-=1;if(keys.s)dir.z+=1;if(keys.a)dir.x-=1;if(keys.d)dir.x+=1;
 if(dir.length()){dir.normalize();camera.position.addScaledVector(dir,dt*8);controls.target.addScaledVector(dir,dt*8)}
}
let t=0;
function animate(){
 requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);t+=dt;
 playerMove(dt);
 chars.forEach((c,i)=>{
   if(Math.sin(t*.25+c.phase)>.82)c.target.set(c.home.x+Math.sin(t*.17+c.phase)*3,0,c.home.z+Math.cos(t*.19+c.phase)*3);
   const d=c.target.clone().sub(c.g.position);d.y=0;
   if(d.length()>.15){d.normalize();c.g.position.addScaledVector(d,dt*c.speed);c.g.rotation.y=Math.atan2(d.x,d.z)}
   c.phone.rotation.z=Math.sin(t*3+i)*.08;
 });
 controls.update();renderer.render(scene,camera);
}
const clock=new THREE.Clock();
animate();

document.getElementById("nightBtn").onclick=()=>{
 const night=scene.background.getHex()===0x121a2d;
 scene.background.set(night?0x91b3c8:0x121a2d);scene.fog.color.set(night?0x91b3c8:0x121a2d);
 sun.intensity=night?3.2:.55;hemi.intensity=night?2:.55;
 document.getElementById("weather").textContent=night?"مساء هادئ":"ليل هادئ";
};
document.getElementById("homeBtn").onclick=()=>{camera.position.set(22,18,24);controls.target.set(0,3,0)};
setInterval(()=>{const d=new Date();document.getElementById("clock").textContent=d.toLocaleTimeString("ar-DZ",{hour:"2-digit",minute:"2-digit"})},1000);

addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
setTimeout(()=>document.getElementById("loading").remove(),900);
