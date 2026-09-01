'use strict';
/* =========================================================================
   RUANG PENYULUH — landing page seluruh tools sebagai ruangan 8-bit.
   Semua link tools dikumpulkan di sini; ganti URL cukup di daftar ini.
   ========================================================================= */
const TOOLS = [
  { id:'harian', name:'DAYDAYREPORT',     desc:'LTT harian, rekap komoditas, analisis usaha tani',
    url:'https://hari-hari-laporan-v2.vercel.app/',      color:'#7ee06a', floor:0, lo:18, rect:{x:16,y:2, w:3, h:1} },
  { id:'lcs',    name:'EVIDENCE',         desc:'Dokumentasi eviden kunjungan LCS',
    url:'https://evidenlcs.vercel.app/',                 color:'#4cc9e0', floor:0, lo:16, rect:{x:4, y:2, w:3, h:1} },
  { id:'disem',  name:'DIFFUSION REPORT', desc:'Rangkuman diseminasi media sosial',
    url:'https://laporandiseminasi.vercel.app/',         color:'#e07ad0', floor:0, lo:20, rect:{x:20,y:2, w:3, h:1} },
  { id:'ksa',    name:'AREA SAMPLING',    desc:'Pendampingan Kerangka Sampel Area',
    url:'https://ksapendampingan.vercel.app/',           color:'#e8c05a', floor:2, lo:40, rect:{x:3, y:11,w:3, h:2} },
  { id:'forge',  name:'ESC FORGE',        desc:'Generator laporan bulanan SKP',
    url:'https://skp-forge.vercel.app/', color:'#ff8c4a', floor:0, lo:22, rect:{x:17,y:9, w:3, h:2} },
  { id:'farm',   name:'COOPERSTOWN',      desc:'FARM AXIS — peta poktan interaktif',
    url:'https://hari-hari-laporan-v2.vercel.app/peta-poktan.html', color:'#5ee8c8', floor:2, lo:26, rect:{x:17,y:9, w:3, h:1} },
  { id:'workshop', name:'WORKSHOP',       desc:'Bengkel alat & blueprint (Drum Seeder, dll.)',
    url:'https://drum-seeder-pm-aas.vercel.app/', color:'#9fb8d0', floor:0, lo:8, rect:{x:17,y:14,w:3, h:2} },
  /* --- LANTAI 2 (naik lift) : ruang arsip & dokumen --- */
  { id:'rdkk',   name:'PROJEKT-FER',     desc:'Generator template e-RDKK dari database poktan',
    url:'https://projekt-fer.vercel.app/', color:'#c2f24a', floor:1, lo:14, rect:{x:9, y:2, w:3, h:1} },
  { id:'rops',   name:'PROJECT ROPS',    desc:'Generator proposal bantuan alsintan poktan',
    url:'https://project-rops.vercel.app/', color:'#a78bfa', floor:1, lo:16, rect:{x:17,y:2, w:3, h:1} },
  { id:'cpcl',   name:'CPCLs',    desc:'Generator CPCL PM AAS per kelompok tani',
    url:'https://cpcls.vercel.app/', color:'#5ab0f2', floor:1, lo:16, rect:{x:13,y:2, w:3, h:1} },
];

const T=16, COLS=25, ROWS=19, W=COLS*T, H=ROWS*T;
const cv=document.getElementById('game'), cx=cv.getContext('2d');
cx.imageSmoothingEnabled=false;

/* ---------- denah markas: '#' dinding, '.' lantai ----------
   Lorong tengah vertikal (hallway) membelah markas:
   - kiri  : kamar besar tak-beraturan — EVIDENCE, AREA SAMPLING, COOPERSTOWN
   - kanan atas : kamar bentuk L — DAYDAYREPORT + DIFFUSION REPORT
   - kanan bawah: kamar bentuk L — ESC FORGE + WORKSHOP
   Celah di dinding = pintu dari lorong ke tiap kamar. */
const MAP=[
'#########################',
'#########################',
'#.......###...#.........#',
'#.......###...#.........#',
'#.......###.............#',
'#.............#.........#',
'#.........#...###.......#',
'#.........#...###.......#',
'#.........#...###########',
'##........#...#.........#',
'##........#...#.........#',
'#.........#...#.........#',
'#.........#.............#',
'#.............#......####',
'#.........#...#......####',
'#.........#...#......####',
'###.......#...#......####',
'###########...###########',
'#########################',
];

/* ---------- peta kepadatan (collision) ---------- */
const DECOR_SOLID=[
  {x:1, y:2, w:1,h:1},{x:23,y:2, w:1,h:1},{x:19,y:15,w:2,h:1},  // rak, rak, peti
  {x:7, y:2, w:1,h:1},{x:1, y:7, w:1,h:1},{x:19,y:2, w:1,h:1},  // pot (samping stasiun)
  {x:8, y:16,w:2,h:1},{x:9, y:11,w:1,h:1},                      // bangku (pojok santai), drum
  {x:15,y:2, w:1,h:1},{x:20,y:9, w:1,h:1},  // kabinet, rak alat
  {x:11,y:2, w:3,h:1},{x:5, y:14,w:2,h:1},{x:5, y:16,w:2,h:1},  // hidroponik (lorong), TV, sofa
  {x:18,y:5, w:3,h:1},                                          // meja rapat (kamar kanan-atas)
  {x:7, y:16,w:1,h:1},{x:1, y:4, w:1,h:1},                      // lampu lantai, dispenser air
  {x:1, y:12,w:1,h:1},{x:9, y:6, w:1,h:1},                      // peti, loker
  {x:4,y:13,w:4,h:1},                                          // partisi separator lounge (celah masuk di kanan) — lift kini menempel dinding (row 1, sudah solid)
  {x:2,y:9, w:6,h:1},                                          // partisi pemisah EVIDENCE (atas) ↔ lounge (bawah), celah di kanan (kolom 8-9)
  {x:23,y:4, w:1,h:1},{x:17,y:7, w:1,h:1},                     // rak data, tanaman (kanan-atas)
  {x:17,y:5, w:1,h:1},{x:21,y:5, w:1,h:1},{x:18,y:6, w:3,h:1}, // kursi rapat (ujung + sisi depan)
  {x:23,y:10,w:1,h:1},{x:15,y:10,w:1,h:1},{x:15,y:16,w:1,h:1}, // rak besi, tabung, ban (kanan-bawah)
  {x:4, y:16,w:1,h:1},                                          // jukebox (lounge)
];

/* ---------- denah LANTAI 2 — dek arsip, hanya dicapai lewat lift ----------
   Lebih kecil dari lantai dasar: serambi lift di kiri (x1-5) lalu satu aula
   arsip memanjang (x7-23). Sisa petak = rongga gelap (di luar bangunan). */
const MAP2=[
'#########################',
'#########################',
'#.....#.................#',
'#.....#.................#',
'#.......................#',
'#.....#.................#',
'#.....#.................#',
'#.....#.................#',
'#.....#.................#',
'#########################',
'#########################',
'#########################',
'#########################',
'#########################',
'#########################',
'#########################',
'#########################',
'#########################',
'#########################',
];
const DECOR2_SOLID=[
  {x:7, y:2,w:1,h:1},                      // mesin pemindai berkas (dinding utara)
  {x:8, y:2,w:1,h:1},{x:21,y:2,w:2,h:1},   // rak arsip (dinding utara)
  {x:7, y:6,w:1,h:1},                      // troli dokumen (merapat sekat barat)
  {x:23,y:2,w:1,h:1},{x:23,y:7,w:1,h:1},   // dispenser (sudut timur laut) & pot (dinding timur)
  {x:1, y:5,w:1,h:1},{x:5, y:2,w:1,h:1},   // pot & peti kayu (serambi lift)
];                    // tengah aula & baris 8 sengaja kosong: lantai lapang + jalur tepi railing

/* ---------- denah AREA LUAR — sawah bertabur pepohonan, di depan gedung kota ----------
   '#' (baris 0-1) = fasad gedung markas (pintu balik di tengah). '#' lain = petak sawah
   (air), sengaja bentuk tak beraturan. '.' = pematang/jalan yang bisa dilewati.
   Pepohonan (OUT_TREES) berdiri sebagai furnitur padat mengisi lapangan; batangnya
   jadi tile solid. Dua stasiun: AREA SAMPLING (kiri) & tiang papan-nama COOPERSTOWN. */
const MAP3=[
'#########################',
'#########################',
'#.......................#',
'#..##...........###.....#',
'#..##...........####....#',
'#................##.....#',
'#.......................#',
'#.......................#',
'#.......................#',
'#.......................#',
'#.......................#',
'#.......................#',
'#.......................#',
'#.......###.......###...#',
'#......####.......##....#',
'#.......##..............#',
'#.......................#',
'#.......................#',
'#########################',
];
/* pepohonan: {x,y,big,seed} — batang jadi solid; `big` = pohon besar (kanopi lebar) */
const OUT_TREES=[
  {x:1,y:4,big:1,s:1},{x:1,y:12,big:1,s:2},{x:23,y:4,big:1,s:3},{x:23,y:14,big:1,s:4},{x:7,y:16,big:1,s:5},
  {x:1,y:8,s:6},{x:2,y:7,s:7},{x:1,y:16,s:8},{x:23,y:8,s:9},{x:22,y:12,s:10},{x:23,y:16,s:11},
  {x:6,y:6,s:12},{x:9,y:8,s:13},{x:14,y:11,s:14},{x:22,y:9,s:15},{x:15,y:15,s:16},{x:13,y:4,s:17},{x:6,y:13,s:18},
  {x:5,y:5,s:19},{x:9,y:11,s:20},{x:11,y:17,s:21},{x:16,y:16,s:22},{x:4,y:17,s:23},
];
const DECOR3_SOLID=[
  ...OUT_TREES.map(t=>({x:t.x,y:t.y,w:1,h:1})),        // batang pohon = solid
];

/* ---------- peta kepadatan per-lantai ---------- */
function makeSolid(map,tools,decor){
  const sl=new Uint8Array(COLS*ROWS);
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)
    if(map[y][x]==='#')sl[y*COLS+x]=1;
  const mark=r=>{for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)sl[y*COLS+x]=1;};
  tools.forEach(t=>mark(t.rect)); decor.forEach(mark);
  return sl;
}
const onFloor=n=>TOOLS.filter(t=>(t.floor||0)===n);
const SOLIDS=[makeSolid(MAP,onFloor(0),DECOR_SOLID),
              makeSolid(MAP2,onFloor(1),DECOR2_SOLID),
              makeSolid(MAP3,onFloor(2),DECOR3_SOLID)];   // area luar (sawah & desa)
let solid=SOLIDS[0];                       // ditukar oleh setFloor()
const S=(x,y)=>solid[y*COLS+x];

/* ---------- LIFT: penghubung lantai 1 & 2 (posisi sama di kedua denah) ---------- */
const LIFT_RECT={x:2,y:1,w:2,h:1};
const LIFT_TOOL=[
  {id:'lift-up',  name:'LIFT — NAIK',  btn:'NAIK &#9650;', isLift:true, to:1, color:'#4cc9e0',
   desc:'Lantai 2 · ruang arsip — PROJEKT-FER & PROJECT ROPS'},
  {id:'lift-down',name:'LIFT — TURUN', btn:'TURUN &#9660;',isLift:true, to:0, color:'#e8c05a',
   desc:'Lantai 1 · lantai kerja utama & lounge'},
];

/* ---------- PINTU UTAMA: penghubung markas (lt.1) ↔ area luar (sawah & desa) ----------
   Pintu geser di dasar lorong lt.1 (kolom 12-13) menembus ke fasad markas di area luar
   (kolom 11-13, baris 1). Perpindahan pakai mekanisme fade yang sama dengan lift, tapi
   membawa titik-muncul (spawn) tujuan supaya dino keluar/masuk tepat di depan pintu. */
const PRIME_DOOR={x:12,y:18,w:2,h:1};      // pintu keluar lt.1 (sudah digambar di buildBG)
const OUT_DOOR ={x:11,y:1, w:3,h:1};       // pintu balik ke markas di fasad luar
const DOOR_OUT={id:'door-out',name:'PINTU UTAMA', btn:'KELUAR &#9660;', isPortal:true, to:2,
  spawn:{x:12.5*T,y:2*T+12,dir:'down'}, color:'#7ee06a', desc:'Keluar ke area sawah & desa poktan'};
const DOOR_IN ={id:'door-in', name:'PINTU MARKAS',btn:'MASUK &#9650;',  isPortal:true, to:0,
  spawn:{x:12.5*T,y:17*T+12,dir:'up'},  color:'#4cc9e0', desc:'Kembali ke markas'};

/* zona interaksi = ring tile berjalan di sekeliling furnitur */
function makeZones(tools,sl,liftTool){
  const z={},free=(x,y)=>x>=0&&y>=0&&x<COLS&&y<ROWS&&!sl[y*COLS+x];
  tools.forEach(t=>{
    const r=t.rect;
    for(let y=r.y-1;y<=r.y+r.h;y++)for(let x=r.x-1;x<=r.x+r.w;x++){
      if(!free(x,y))continue;
      z[x+','+y]=t;
    }
  });
  const r=LIFT_RECT;                       // petak tepat di depan pintu lift -> milik lift
  for(let x=r.x;x<r.x+r.w;x++){const y=r.y+r.h;if(free(x,y))z[x+','+y]=liftTool;}
  return z;
}
const ZONES=[makeZones(onFloor(0),SOLIDS[0],LIFT_TOOL[0]),
             makeZones(onFloor(1),SOLIDS[1],LIFT_TOOL[1]),
             makeZones(onFloor(2),SOLIDS[2],null)];       // area luar: tanpa lift
/* daftarkan petak di depan pintu utama sebagai zona portal (dua arah) */
// prime door (lt.1): petak tepat di atas ambang pintu
for(let x=PRIME_DOOR.x;x<PRIME_DOOR.x+PRIME_DOOR.w;x++){const y=PRIME_DOOR.y-1;
  if(!SOLIDS[0][y*COLS+x])ZONES[0][x+','+y]=DOOR_OUT;}
// pintu markas (luar): petak tepat di bawah fasad
for(let x=OUT_DOOR.x;x<OUT_DOOR.x+OUT_DOOR.w;x++){const y=OUT_DOOR.y+OUT_DOOR.h;
  if(!SOLIDS[2][y*COLS+x])ZONES[2][x+','+y]=DOOR_IN;}
let zoneOf=ZONES[0];

/* ---------- kabut perang (mobile): cahaya mengikuti dino ----------
   Empat petak menutup peta tanpa celah. Tiap petak punya kadar gelap `a`
   (1 = pekat) yang bergerak halus ke 0 saat dino di dalamnya, dan kembali
   ke 1 setelah ia pergi — jadi meredup/menggelap bertahap, bukan seketika. */
const ROOMSETS=[
  [{x:0, y:0,w:10,h:19,a:1},   // kamar kiri
   {x:10,y:0,w:5, h:19,a:1},   // lorong tengah
   {x:15,y:0,w:10,h:9, a:1},   // kamar kanan-atas
   {x:15,y:9,w:10,h:10,a:1}],  // kamar kanan-bawah
  [{x:0, y:0,w:7, h:19,a:1},   // lt.2 - serambi lift
   {x:7, y:0,w:18,h:19,a:1}],  // lt.2 - aula arsip (satu ruangan terbuka, jangan dipotong)
  [{x:0, y:0,w:13,h:19,a:1},   // luar - paruh barat (sawah kiri)
   {x:13,y:0,w:12,h:19,a:1}],  // luar - paruh timur (desa & sawah kanan)
];
let ROOMS=ROOMSETS[0];
let fogOn=false;
const fogCv=document.createElement('canvas');   // lapisan gelap + lubang halo dino

/* ---------- jendela dinding luar ----------
   Kaca langit di dinding perimeter (barat/timur) + berkas cahaya siang
   yang tumpah ke lantai di dalamnya. `side` W=cahaya ke timur, E=ke barat. */
const WINDOWS=[
  {side:'W', ty0:12,ty1:15},   // dinding barat — sejajar tempat santai
  {side:'E', ty0:3, ty1:6},    // dinding timur — kamar kanan-atas
  {side:'E', ty0:9, ty1:12},   // dinding timur — kamar kanan-bawah
];
const WINDOWS2=[
  {side:'W', ty0:2, ty1:3},    // lt.2 — serambi lift
  {side:'E', ty0:4, ty1:7},    // lt.2 — aula arsip
];

/* ---------- siklus siang–malam ----------
   Langit di jendela, matahari/bulan, berkas cahaya, dan suasana interior
   bergeser mengikuti jam asli pengunjung. `tint` = warna suasana keseluruhan,
   `lamp` = seberapa hangat lampu interior menyala (paling terang saat gelap). */
const SKY_KF=[
  {h:0,   top:[8,10,26],   bot:[18,22,46],   beam:[150,172,212], bp:.06, star:.85, disc:[186,196,220], dyf:.30, tint:[12,18,46,.22], lamp:1},
  {h:5.5, top:[64,54,96],  bot:[210,126,110],beam:[232,150,120], bp:.12, star:.15, disc:[255,196,150], dyf:.66, tint:[70,44,58,.12], lamp:.6},
  {h:8,   top:[98,152,202],bot:[190,212,236],beam:[210,226,240], bp:.17, star:0,   disc:[255,244,214], dyf:.40, tint:[0,0,0,0],     lamp:.15},
  {h:13,  top:[120,178,216],bot:[196,224,240],beam:[206,230,246],bp:.20, star:0,   disc:[255,250,230], dyf:.22, tint:[0,0,0,0],     lamp:0},
  {h:17.5,top:[74,62,112], bot:[236,142,82], beam:[240,162,92],  bp:.14, star:.15, disc:[255,180,110], dyf:.66, tint:[96,48,18,.12], lamp:.6},
  {h:20,  top:[12,14,32],  bot:[24,30,54],   beam:[150,172,212], bp:.07, star:.7,  disc:[190,200,224], dyf:.32, tint:[12,18,46,.20], lamp:.9},
  {h:24,  top:[8,10,26],   bot:[18,22,46],   beam:[150,172,212], bp:.06, star:.85, disc:[186,196,220], dyf:.30, tint:[12,18,46,.22], lamp:1},
];
let forcedHour=null;                                   // override waktu untuk uji
const curHour=()=>forcedHour!=null?forcedHour:(d=>d.getHours()+d.getMinutes()/60)(new Date());
const lerp=(a,b,f)=>a+(b-a)*f;
const lerpA=(a,b,f)=>a.map((v,i)=>lerp(v,b[i],f));
function daylightAt(hh){
  let i=0;while(i<SKY_KF.length-1&&SKY_KF[i+1].h<=hh)i++;
  const a=SKY_KF[i],b=SKY_KF[Math.min(i+1,SKY_KF.length-1)];
  const f=b.h>a.h?(hh-a.h)/(b.h-a.h):0;
  return {top:lerpA(a.top,b.top,f),bot:lerpA(a.bot,b.bot,f),beam:lerpA(a.beam,b.beam,f),
    bp:lerp(a.bp,b.bp,f),star:lerp(a.star,b.star,f),disc:lerpA(a.disc,b.disc,f),
    dyf:lerp(a.dyf,b.dyf,f),tint:lerpA(a.tint,b.tint,f),lamp:lerp(a.lamp,b.lamp,f)};
}
let daylight=daylightAt(curHour());

/* =========================================================================
   FONT BITMAP 3x5 — label pixel-perfect di kanvas
   ========================================================================= */
const F3={A:[2,5,7,5,5],B:[6,5,6,5,6],C:[3,4,4,4,3],D:[6,5,5,5,6],E:[7,4,6,4,7],
F:[7,4,6,4,4],G:[3,4,5,5,3],H:[5,5,7,5,5],I:[7,2,2,2,7],J:[1,1,1,5,2],K:[5,5,6,5,5],
L:[4,4,4,4,7],M:[5,7,5,5,5],N:[6,5,5,5,5],O:[2,5,5,5,2],P:[6,5,6,4,4],Q:[2,5,5,6,3],
R:[6,5,6,5,5],S:[3,4,2,1,6],T:[7,2,2,2,2],U:[5,5,5,5,7],V:[5,5,5,5,2],W:[5,5,5,7,5],
X:[5,5,2,5,5],Y:[5,5,2,2,2],Z:[7,1,2,4,7],'0':[7,5,5,5,7],'1':[2,6,2,2,7],
'2':[6,1,2,4,7],'3':[6,1,2,1,6],'4':[5,5,7,1,1],'5':[7,4,6,1,6],'6':[3,4,6,5,2],
'7':[7,1,2,2,2],'8':[7,5,2,5,7],'9':[2,5,3,1,6],'-':[0,0,7,0,0],'.':[0,0,0,0,2],
'/':[1,1,2,4,4],':':[0,2,0,2,0],' ':[0,0,0,0,0],s:[0,3,4,1,6]};  // s huruf kecil (khusus label CPCLs)
function textW(s){return s.length*4-1;}
function drawText(g,s,x,y,color){
  g.fillStyle=color;
  for(const ch of s){
    const gl=F3[ch]||F3[ch.toUpperCase()]||F3[' '];   // huruf mentah dulu (dukung 's' kecil), lalu KAPITAL
    for(let r=0;r<5;r++)for(let c=0;c<3;c++)
      if(gl[r]>>(2-c)&1)g.fillRect(x+c,y+r,1,1);
    x+=4;
  }
}

/* =========================================================================
   SPRITE KARAKTER 12x16 — dinosaurus T-rex hijau, 4 arah x 3 frame
   ========================================================================= */
const SPAL={k:'#131008',g:'#a05ae0',G:'#6b36a8',l:'#e0c2f5',e:'#1b1b24'};
const TOP_DOWN=[            // menghadap depan (13 baris badan)
'....kkkk....',
'..kkggggkk..',
'.kggggggggk.',
'.kgeggggegk.',
'.kggggggggk.',
'.kgGkkkkGgk.',
'..kggggggk..',
'..kgllllgk..',
'.kgGllllGgk.',
'.kggllllggk.',
'..kgllllgk..',
'..kggggggk..',
'...kggggk...'];
const LEGS_DOWN=[
 ['..kgg..ggk..','..kgg..ggk..','..kkk..kkk..'],
 ['..kgg..ggk..','..kgg..gk...','..kkk...kk..'],
 ['..kgg..ggk..','...kg..ggk..','..kk...kkk..']];
const TOP_UP=[              // membelakangi (duri punggung + ekor)
'....kkkk....',
'..kkggggkk..',
'.kggGggGggk.',
'.kggggggggk.',
'.kggggggggk.',
'.kgggGGgggk.',
'..kggggggk..',
'..kggggggk..',
'..kgGggGgk..',
'..kggggggk..',
'..kgGGGGgk..',
'..kggGGggk..',
'...kgGGgk...'];
const LEGS_UP=[
 ['..kggGGggk..','..kgg..ggk..','..kkk..kkk..'],
 ['..kggGGggk..','..kgg..gk...','..kkk...kk..'],
 ['..kggGGggk..','...kg..ggk..','..kk...kkk..']];
const TOP_SIDE=[            // profil hadap kanan (14px), proporsi tampak depan:
'....kkkkkk....',           // kepala besar bulat + moncong, pita mulut gelap,
'...kggggggkk..',           // badan mungil berperut terang, ekor panjang
'...kggggggggk.',
'...kgggggeggkk',
'...kggggggggkk',
'...kgGkkkkkkk.',
'....kggggggk..',
'kk..kgggllgk..',
'kGGgggggllggk.',
'.kkkggggllgk..',
'....kgggllgk..',
'....kggggggk..',
'.....kggggk...'];
const LEGS_SIDE=[
 ['......kgggk...','......kg.gk...','......kk.kk...'],
 ['......kgggk...','.....kg...gk..','.....kk...kk..'],
 ['......kgggk...','.......kgk....','.......kkk....']];

function frameCanvas(rows,flip){
  const w=rows[0].length;                      // 12 (depan/belakang) atau 14 (samping)
  const c=document.createElement('canvas');c.width=w;c.height=16;
  const g=c.getContext('2d');
  rows.forEach((row,y)=>{for(let x=0;x<w;x++){
    const col=SPAL[row[x]];if(col){g.fillStyle=col;g.fillRect(flip?w-1-x:x,y,1,1);}}});
  return c;
}
const SPR={
  down :LEGS_DOWN.map(l=>frameCanvas([...TOP_DOWN,...l],false)),
  up   :LEGS_UP.map(l=>frameCanvas([...TOP_UP,...l],false)),
  right:LEGS_SIDE.map(l=>frameCanvas([...TOP_SIDE,...l],false)),
  left :LEGS_SIDE.map(l=>frameCanvas([...TOP_SIDE,...l],true)),
};

/* --- anak dino peliharaan: sprite mini 8x8, 2 frame --- */
function miniCanvas(rows,flip){
  const w=rows[0].length,c=document.createElement('canvas');
  c.width=w;c.height=rows.length;
  const g=c.getContext('2d');
  rows.forEach((row,y)=>{for(let x=0;x<w;x++){
    const col=SPAL[row[x]];if(col){g.fillStyle=col;g.fillRect(flip?w-1-x:x,y,1,1);}}});
  return c;
}
const PET_TOP=[
'..kkkk..',
'.kggggk.',
'.kgeggkk',
'.kggggk.',
'kkgggk..',
'kGgggk..'];
const PET_LEGS=[['.kg.gk..','.kk.kk..'],['..kgk...','..kkk...']];
const PETSPR={
  r:PET_LEGS.map(l=>miniCanvas([...PET_TOP,...l],false)),
  l:PET_LEGS.map(l=>miniCanvas([...PET_TOP,...l],true)),
};

/* favicon: potret kepala dino saja (crop wajah sprite depan) */
(function(){
  const c=document.createElement('canvas');c.width=48;c.height=48;
  const g=c.getContext('2d');g.imageSmoothingEnabled=false;
  g.drawImage(SPR.down[0],0,0,12,7,0,10,48,28);           // kepala, skala 4x
  document.querySelector('link[rel=icon]').href=c.toDataURL();
})();

/* =========================================================================
   LATAR: lantai, dinding, karpet, dekor dinding — digambar sekali
   ========================================================================= */
const bg=document.createElement('canvas');bg.width=W;bg.height=H;
const bgc=bg.getContext('2d');
const bg2=document.createElement('canvas');bg2.width=W;bg2.height=H;   // latar lantai 2
const bg2c=bg2.getContext('2d');
const bg3=document.createElement('canvas');bg3.width=W;bg3.height=H;   // latar area luar
const bg3c=bg3.getContext('2d');
function P(g,c,x,y,w=1,h=1){g.fillStyle=c;g.fillRect(x,y,w,h);}
const rnd=(x,y)=>((x*73856093)^(y*19349663))>>>0;
/* kolam cahaya di lantai — pita translusen yang memudar ke bawah */
function pool(g,x,y,w,h,rgb,peak){
  for(let i=0;i<h;i++)P(g,`rgba(${rgb},${(peak*(1-i/h)).toFixed(3)})`,x,y+i,w,1);
}

/* jendela dinding luar dipakai kedua lantai — daftar jendelanya yang berbeda */
function drawWindows(g,list){
  /* --- jendela dinding luar: langit ikut waktu + berkas cahaya masuk --- */
  const dl=daylight, ci=a=>`rgb(${a[0]|0},${a[1]|0},${a[2]|0})`;
  /* matahari/bulan cuma tampak di satu jendela sesuai arahnya —
     pagi terbit di timur (jendela timur), sore/malam di barat. */
  const hostWin = curHour()<12 ? (list.find(w=>w.side==='E')||list[0])
                               : (list.find(w=>w.side==='W')||list[0]);
  for(const wd of list){
    const rows=wd.ty1-wd.ty0+1, ww=12, wh=rows*T-4;
    const wx=wd.side==='W'?2:W-14, wy=wd.ty0*T+2;
    const kSh=wd.side==='W'?.55:-.55;                     // arah miring (di-swap) ikut sudut pandang
    /* gambar jendela LURUS ke kanvas kecil, lalu miringkan per-kolom:
       kusen + jeruji ikut miring jadi jajaran-genjang, garis tegak tetap tegak */
    const wc=document.createElement('canvas');wc.width=ww;wc.height=wh;
    const wg=wc.getContext('2d');
    P(wg,'#2b3340',0,0,ww,wh);                            // bingkai baja
    P(wg,'#3a4454',0,0,ww,1);P(wg,'#3a4454',0,0,1,wh);   // sorot kiri/atas
    P(wg,'#171d26',0,wh-1,ww,1);P(wg,'#171d26',ww-1,0,1,wh); // list bawah/kanan
    const gx=2,gy=2,gwd=ww-4,ght=wh-4;                    // kaca (koordinat lokal)
    for(let i=0;i<ght;i++)P(wg,ci(lerpA(dl.top,dl.bot,i/ght)),gx,gy+i,gwd,1); // kaca langit
    if(wd===hostWin){                                    // matahari / bulan (satu jendela saja)
      const dcx=gx+((gwd/2)|0),dcy=gy+Math.round(dl.dyf*ght);
      P(wg,`rgba(${dl.disc[0]|0},${dl.disc[1]|0},${dl.disc[2]|0},.18)`,dcx-3,dcy-3,7,7);
      P(wg,`rgba(${dl.disc[0]|0},${dl.disc[1]|0},${dl.disc[2]|0},.42)`,dcx-2,dcy-2,5,5);
      P(wg,ci(dl.disc),dcx-1,dcy-1,3,3);
    }
    if(dl.star>.02)for(let i=0;i<rows*3;i++){             // bintang (malam)
      const sx=gx+((rnd(wd.side==='W'?7:311,wd.ty0*3+i)>>3)%gwd);
      const sy=gy+((rnd(wd.side==='W'?31:97,wd.ty0*5+i)>>2)%ght);
      P(wg,`rgba(255,255,255,${(dl.star*.75).toFixed(3)})`,sx,sy,1,1);
    }
    P(wg,'#232a34',gx+((gwd/2)|0),gy,1,ght);              // jeruji tegak
    for(let r=1;r<rows;r++)P(wg,'#232a34',gx,gy+r*T-1,gwd,1); // jeruji datar
    P(wg,'rgba(206,230,246,.5)',gx,gy+ght-1,gwd,1);       // kilau ambang
    for(let x=0;x<ww;x++){                                // miringkan: geser tiap kolom
      const yo=Math.round((x-ww/2)*kSh);
      P(g,'#0a0d13',wx+x,wy+yo-1,1,wh+2);                 // relung gelap ikut miring
      g.drawImage(wc,x,0,1,wh,wx+x,wy+yo,1,wh);
    }
    /* berkas cahaya jatuh ke lantai — warna & kuat ikut waktu */
    const beamW=44, start=wd.side==='W'?wx+ww:wx-1, bc=dl.beam;
    const beamX0=wd.side==='W'?start:start-beamW+1;
    for(let b=0;b<beamW;b++){
      const fall=1-b/beamW, a=(dl.bp*fall*fall).toFixed(3);
      const X=wd.side==='W'?start+b:start-b;
      P(g,`rgba(${bc[0]|0},${bc[1]|0},${bc[2]|0},${a})`,X,wy,1,wh);
    }
    for(let ry=wy;ry<wy+wh;ry+=T)P(g,'rgba(10,14,20,.09)',beamX0,ry,beamW,2); // bayang jeruji
  }
}

/* jendela lantai 2 = jendela kapal ke luar angkasa: bintang + planet jauh */
function drawSpaceWindows(g,list){
  for(const wd of list){
    const rows=wd.ty1-wd.ty0+1, ww=12, wh=rows*T-4;
    const wx=wd.side==='W'?2:W-14, wy=wd.ty0*T+2;
    const kSh=wd.side==='W'?.55:-.55;
    const wc=document.createElement('canvas');wc.width=ww;wc.height=wh;
    const wg=wc.getContext('2d');
    P(wg,'#2b3340',0,0,ww,wh);P(wg,'#3a4454',0,0,ww,1);P(wg,'#3a4454',0,0,1,wh); // bingkai
    P(wg,'#171d26',0,wh-1,ww,1);P(wg,'#171d26',ww-1,0,1,wh);
    const gx=2,gy=2,gwd=ww-4,ght=wh-4;
    for(let i=0;i<ght;i++)P(wg,`rgb(${6+(i/ght*4)|0},${8+(i/ght*6)|0},${16+(i/ght*10)|0})`,gx,gy+i,gwd,1); // ruang angkasa
    for(let i=0;i<rows*8;i++){                                  // bintang
      const sx=gx+((rnd(wd.side==='W'?7:311,wd.ty0*3+i)>>3)%gwd);
      const sy=gy+((rnd(wd.side==='W'?31:97,wd.ty0*5+i)>>2)%ght);
      const br=(0.35+0.6*((rnd(i*13,wd.ty0*7)>>2)%10)/10).toFixed(2);
      P(wg,`rgba(220,235,255,${br})`,sx,sy,1,1);
    }
    if(wd===list[0]){const pcx=gx+gwd-4,pcy=gy+6;              // planet jauh (satu jendela)
      P(wg,'#2a4568',pcx-3,pcy-3,7,7);P(wg,'#3a5a8a',pcx-2,pcy-3,5,5);
      P(wg,'#4a6f9f',pcx-1,pcy-3,3,1);P(wg,'#26507a',pcx-1,pcy+1,4,2);}
    P(wg,'#232a34',gx+((gwd/2)|0),gy,1,ght);                    // jeruji
    for(let r=1;r<rows;r++)P(wg,'#232a34',gx,gy+r*T-1,gwd,1);
    P(wg,'rgba(150,200,240,.35)',gx,gy+ght-1,gwd,1);           // kilau dingin
    for(let x=0;x<ww;x++){const yo=Math.round((x-ww/2)*kSh);
      P(g,'#0a0d13',wx+x,wy+yo-1,1,wh+2);
      g.drawImage(wc,x,0,1,wh,wx+x,wy+yo,1,wh);}
    const beamW=40,start=wd.side==='W'?wx+ww:wx-1;             // pendar dingin ke lantai
    for(let b=0;b<beamW;b++){const fall=1-b/beamW,a=(0.05*fall*fall).toFixed(3);
      const X=wd.side==='W'?start+b:start-b;
      P(g,`rgba(120,170,230,${a})`,X,wy,1,wh);}
  }
}

function buildBG(){
  const g=bgc;
  P(g,'#0c1016',0,0,W,H);
  /* lantai per-ruang — tiap zona punya karakter sesuai fungsinya
     L=ruang data (panel akses) · C=lorong transit (aspal) · RT=briefing · RB=bengkel */
  const DATA_VENTS=new Set(['3,5','8,6','4,12']);        // hanya 3 panel ventilasi menyala
  for(let ty=0;ty<ROWS;ty++)for(let tx=0;tx<COLS;tx++){
    if(MAP[ty][tx]!=='.')continue;
    const px=tx*T,py=ty*T,alt=((tx+ty)%2),r=rnd(tx,ty)%14;
    const z=tx<10?'L':tx<15?'C':(ty<9?'RT':'RB');
    if(z==='L'){                                          // panel akses ruang data
      P(g,'#2a313d',px,py,T,T);
      P(g,'#333c49',px,py,T,1);P(g,'#333c49',px,py,1,T);
      P(g,'#191e27',px,py+T-1,T,1);P(g,'#191e27',px+T-1,py,1,T);   // nat tegas
      P(g,'#3b4453',px+1,py+1,1,1);P(g,'#3b4453',px+T-2,py+1,1,1); // sekrup sudut
      P(g,'#3b4453',px+1,py+T-2,1,1);P(g,'#3b4453',px+T-2,py+T-2,1,1);
      if(DATA_VENTS.has(tx+','+ty)){P(g,'#12161d',px+4,py+4,8,8);  // panel berlubang menyala (3 saja)
        for(let a=5;a<12;a+=2)for(let b=5;b<12;b+=2)P(g,'rgba(60,200,255,.4)',px+a,py+b,1,1);}
    }else if(z==='C'){                                    // lorong — aspal transit
      P(g,'#242a32',px,py,T,T);
      P(g,'#2b323c',px,py,T,1);P(g,'#181d24',px,py+T-1,T,1);
      if(r===1)P(g,'#2e3540',px+5,py+9,6,1);                       // goresan halus
    }else if(z==='RT'){                                   // briefing — pelat halus + grid holo
      P(g,'#262d39',px,py,T,T);
      P(g,'#2e3644',px,py,T,1);P(g,'#1b212a',px,py+T-1,T,1);
      P(g,'rgba(76,201,224,.05)',px,py,T,1);P(g,'rgba(76,201,224,.05)',px,py,1,T);
    }else{                                                // bengkel — pelat bordes
      P(g,alt?'#2b2e35':'#2f323a',px,py,T,T);
      P(g,'#363a43',px+3,py+3,2,2);P(g,'#363a43',px+11,py+11,2,2);
      P(g,'#363a43',px+11,py+3,2,2);P(g,'#363a43',px+3,py+11,2,2); // tonjolan bordes
      P(g,'#22252c',px,py+T-1,T,1);P(g,'#22252c',px+T-1,py,1,T);
      if(r===0)P(g,'rgba(12,8,5,.4)',px+3,py+4,10,7);              // noda oli sesekali
    }
  }
  /* dinding (tile '#'): muka baja bila ada lantai tepat di bawahnya,
     selain itu pelat gelap berlist — denah kamar & lorong terbaca dari sini */
  for(let ty=0;ty<ROWS;ty++)for(let tx=0;tx<COLS;tx++){
    if(MAP[ty][tx]!=='#')continue;
    const px=tx*T,py=ty*T;
    const face=ty+1<ROWS&&MAP[ty+1][tx]==='.';
    if(face){
      P(g,'#232a36',px,py,T,T);
      for(let x=0;x<T;x+=6)P(g,'#1d2430',px+x,py,1,T);
      P(g,'#10141c',px,py+T-4,T,4);                      // list bawah dinding
      /* strip cahaya: warna per-zona · redup siang / terang malam · hazard di ruang panas */
      const wz=tx<10?'L':tx<15?'C':((ty+1)<9?'RT':'RB');
      const br=(0.45+0.55*daylight.lamp).toFixed(2);     // kecerahan ikut jam
      const SC={L:[46,224,255],C:[219,176,63],RT:[110,224,168]};  // data cyan · lorong amber · briefing hijau
      if(wz==='RB'){                                      // forge/bengkel — pita hazard kuning-hitam
        for(let x=0;x<T;x+=6){P(g,`rgba(219,176,63,${br})`,px+x,py+T-5,3,1);
          P(g,'rgba(10,10,12,.85)',px+x+3,py+T-5,3,1);}
      }else{const c=SC[wz];P(g,`rgba(${c[0]},${c[1]},${c[2]},${br})`,px,py+T-5,T,1);}
      P(g,'rgba(0,0,0,.25)',px,py+T,T,4);                // bayangan jatuh ke lantai
      const gc=(SC[wz]||[219,176,63]).join(',');
      pool(g,px,py+T+4,T,7,gc,(.05*daylight.lamp+.02).toFixed(3)); // cahaya meleleh ke lantai
    }else{
      P(g,'#161b24',px,py,T,T);
      for(let y=0;y<T;y+=8)P(g,'#1a2029',px,py+y,T,1);
    }
    if(ty===0)P(g,'#141922',px,0,T,3);                   // trim atas
  }
  /* pintu geser keluar (bawah, kolom 12) */
  P(g,'#07090d',12*T-2,18*T,T+4,T);
  P(g,'#2e3542',12*T-4,18*T,2,T);P(g,'#2e3542',13*T+2,18*T,2,T);
  P(g,'#4ce0ff',12*T+2,18*T+2,12,2);                     // cahaya lorong
  /* pad sensor pintu */
  P(g,'#1a212c',12*T+1,17*T+3,14,10);P(g,'#2ee0ff',12*T+1,17*T+3,14,1);
  P(g,'#1a7f99',12*T+4,17*T+7,8,2);
  /* --- marka lantai per-zona --- */
  (function(){
    /* lorong: garis pandu hijau putus-putus menuju pintu keluar (seperti semula) */
    for(let y=2*T;y<17*T;y+=12)P(g,'#173441',12*T+7,y,2,6);
    /* bengkel: strip hazard + gosong di depan tungku ESC FORGE, + kisi drainase */
    for(let i=0;i<3*T;i+=6){P(g,'#c8a838',17*T+i,11*T+1,3,2);P(g,'#141414',17*T+i+3,11*T+1,3,2);}
    P(g,'rgba(10,6,4,.45)',17*T+8,11*T+3,20,9);P(g,'rgba(10,6,4,.3)',17*T+3,11*T+2,30,4);
    P(g,'#12151b',16*T+2,12*T+4,12,8);for(let i=0;i<12;i+=3)P(g,'#2a2f38',16*T+3+i,12*T+5,1,6);
  })();
  /* --- aksen lantai lain: keset, noda oli --- */
  P(g,'#1d3a30',2*T+2,2*T+2,28,12);P(g,'#2a4d3f',2*T+4,2*T+4,24,8);   // keset depan lift
  P(g,'#1d3a30',2*T+8,2*T+6,16,4);
  const stain=(sx,sy)=>{P(g,'rgba(8,10,14,.55)',sx,sy,10,5);
    P(g,'rgba(8,10,14,.55)',sx+3,sy-3,5,11);P(g,'rgba(8,10,14,.35)',sx-3,sy+2,16,3);};
  stain(6*T+4,9*T+8);stain(18*T+2,13*T+8);stain(12*T+4,5*T+6);        // noda oli
  /* karpet lounge — menyatukan TV, sofa & bangku jadi satu ruang duduk */
  (function(){
    const rx=4*T, ry=14*T+2, rw=6*T-2, rh=3*T-5;
    P(g,'#241f38',rx,ry,rw,rh);                                       // dasar karpet
    P(g,'#38305c',rx,ry,rw,2);P(g,'#38305c',rx,ry+rh-2,rw,2);         // tepi atas/bawah
    P(g,'#38305c',rx,ry,2,rh);P(g,'#38305c',rx+rw-2,ry,2,rh);         // tepi kiri/kanan
    for(let yy=ry+7;yy<ry+rh-4;yy+=9)for(let xx=rx+9;xx<rx+rw-6;xx+=11)
      P(g,'#2e2748',xx,yy,2,2);                                       // pola titik
    P(g,'rgba(255,222,150,.09)',6*T+4,14*T+2,3*T-2,3*T-6);            // cahaya hangat lampu
    P(g,'rgba(255,222,150,.06)',6*T,14*T,4*T-2,3*T-2);
  })();
  /* (bekas planning bay dikosongkan — kini dipisah tembok partisi row 9, lihat divider2) */
  /* ventilasi besar (dinding kanan-atas) */
  P(g,'#10141c',21*T+2,8*T+3,24,8);
  for(let i=0;i<5;i++)P(g,'#39414f',21*T+5+i*4,8*T+4,2,6);            // kisi ventilasi
  /* holo-pad di lorong tengah */
  const rx=11*T+2,ry=8*T+2,rw=3*T-4,rh=3*T-4;
  P(g,'#10151d',rx-2,ry-2,rw+4,rh+4);
  P(g,'#171d28',rx,ry,rw,rh);
  for(let i=8;i<rw-4;i+=8)P(g,'#1f2836',rx+i,ry+2,1,rh-4);   // grid halus
  for(let j=8;j<rh-4;j+=8)P(g,'#1f2836',rx+2,ry+j,rw-4,1);
  g.imageSmoothingEnabled=false;                                   // emblem kepala dino
  g.drawImage(SPR.down[0],0,0,12,7,rx+Math.floor(rw/2)-12,ry+Math.floor(rh/2)-7,24,14);
  /* --- dekor dinding --- */
  /* panel status (kolom 1) — LED dianimasikan */
  P(g,'#10141c',T+2,5,12,15);P(g,'#2e3542',T+2,5,12,2);
  P(g,'#1a7f99',T+4,15,8,1);P(g,'#1a7f99',T+4,17,6,1);
  /* emblem HQ (kolom 12, di atas lorong) */
  P(g,'#2e3542',12*T+2,4,12,16);P(g,'#0c1118',12*T+3,5,10,14);
  drawText(g,'HQ',12*T+4,8,'#4ce0ff');
  P(g,'#e8c05a',12*T+4,15,8,1);
  /* rak trofi logam (kolom 15) */
  P(g,'#2e3542',15*T+1,14,14,3);
  P(g,'#e8c05a',15*T+5,6,6,5);P(g,'#c89a3a',15*T+7,11,2,2);P(g,'#39414f',15*T+5,13,6,2);
  /* --- kolam cahaya tiap stasiun jatuh ke lantai di depannya --- */
  pool(g,16*T+4,3*T, 40, 9,'126,224,106',.10);   // layar DAYDAYREPORT (hijau)
  pool(g, 4*T+4,3*T, 40, 9,'76,201,224', .10);   // papan EVIDENCE (cyan)
  pool(g,20*T+4,3*T, 40, 9,'224,122,208',.09);   // TV DIFFUSION (merah muda)
  pool(g,11*T+3,3*T, 42,10,'160,90,224', .12);   // lampu tumbuh hidroponik (ungu)
  pool(g,17*T+4,11*T,40,12,'224,124,58', .16);   // bara tungku ESC FORGE (oranye)
  pool(g,17*T+4,14*T,40,12,'159,184,208', .12);   // meja bengkel WORKSHOP (netral)
  drawWindows(g,WINDOWS);
  /* lampu interior menyala lebih hangat saat langit gelap */
  if(daylight.lamp>.02){
    P(g,`rgba(255,214,140,${(.15*daylight.lamp).toFixed(3)})`,5*T,13*T+4,5*T,3*T); // lampu lounge
  }
}
buildBG();

/* =========================================================================
   FURNITUR — kanvas statis + overlay animasi, digambar urut kedalaman
   ========================================================================= */
function furn(rect,oy,paint){
  const c=document.createElement('canvas');
  c.width=rect.w*T;c.height=rect.h*T+oy;
  paint(c.getContext('2d'),c.width,c.height);
  return {rect,oy,canvas:c,px:rect.x*T,py:rect.y*T-oy,baseY:(rect.y+rect.h)*T};
}
let anims=[];     // {fn(g,t)} digambar tiap frame di atas furnitur (ditukar per lantai)
let FURN=[];

/* --- MEJA KOMPUTER : LAPORAN HARIAN V2 --- */
FURN.push(furn(TOOLS[0].rect,18,(g,w,h)=>{
  P(g,'#39414f',2,18,w-4,12);P(g,'#4a5468',2,18,w-4,3);       // meja konsol
  P(g,'#2a303c',3,30,3,h-30);P(g,'#2a303c',w-6,30,3,h-30);    // kaki
  P(g,'#2b2b33',8,2,20,16);P(g,'#101014',10,4,16,11);          // monitor
  P(g,'#3a3a44',15,18,6,2);
  P(g,'#c9c9d2',30,12,10,6);P(g,'#b5b5c0',30,12,10,1);         // kertas
  P(g,'#4cc9e0',33,14,4,1);P(g,'#4cc9e0',32,16,6,1);
  P(g,'#7a3a2a',w-12,12,6,6);P(g,'#7a3a2a',w-7,13,2,3);        // cangkir
  /* keyboard + mouse + tower + LED daya */
  P(g,'#2a303c',6,22,17,4);P(g,'#20262f',6,22,17,1);           // keyboard
  for(let x=7;x<22;x+=2)P(g,'#3a4250',x,24,1,1);               // tuts
  P(g,'#39414f',25,23,4,3);P(g,'#4a5468',25,23,4,1);           // mouse
  P(g,'#26262e',w-9,19,6,11);P(g,'#1a1a20',w-8,20,4,9);        // tower CPU
  P(g,'#8fd45e',w-7,21,1,1);P(g,'#4cc9e0',w-7,23,1,1);         // LED tower
  P(g,'#8fd45e',26,3,1,1);                                     // LED daya monitor
}));
anims.push({f:FURN[0],fn:(g,t)=>{                              // layar: konten bergilir (batang/tren/peta)
  const x=FURN[0].px+10,y=FURN[0].py+4,mode=Math.floor(t/5000)%3;
  P(g,'#0f2f18',x,y,16,11);
  g.fillStyle='#46d160';
  if(mode===0){                                               // grafik batang LTT
    for(let i=0;i<14;i++){const v=3+Math.round(3*Math.sin((i+t/300)*.8)+2*Math.sin(i*2.2));
      g.fillRect(x+1+i,y+10-Math.max(1,Math.min(9,v)),1,1);}
  }else if(mode===1){                                         // grafik garis tren
    let pv=y+6;for(let i=0;i<15;i++){const nv=y+6-Math.round(3*Math.sin((i+t/400)*.7));
      const lo=Math.min(pv,nv),hi=Math.max(pv,nv);g.fillRect(x+1+i,lo,1,hi-lo+1);pv=nv;}
  }else{                                                      // peta titik sebaran
    for(let k=0;k<10;k++){const px=x+2+((k*37+3)%13),pyy=y+1+((k*53+1)%9);
      g.fillStyle=((Math.floor(t/300)+k)%3)?'#46d160':'#8fd45e';g.fillRect(px,pyy,1,1);}
  }
  if(Math.floor(t/500)%2)P(g,'#8fd45e',x+13,y+1,2,2);          // kursor kedip
}});

/* --- PAPAN FOTO + KAMERA : EVIDEN LCS --- */
FURN.push(furn(TOOLS[1].rect,16,(g,w,h)=>{
  P(g,'#3a4252',2,0,w-4,26);P(g,'#1d232e',4,2,w-8,22);         // papan monitor
  P(g,'#2a303c',3,26,4,h-26);P(g,'#2a303c',w-7,26,4,h-26);     // kaki
  const ph=[['#7ee06a','#46a14e'],['#e8e0c8','#cf9c6e'],['#4cc9e0','#2a7f95']];
  ph.forEach((p,i)=>{const px=7+i*13;
    P(g,'#f0ead8',px,5,10,12);P(g,p[0],px+1,6,8,7);P(g,p[1],px+1,10,8,3);
    P(g,'#c04a3a',px+4,4,2,2);});                              // pin merah
  P(g,'#26262e',w-15,20,11,7);P(g,'#101014',w-11,22,4,4);      // kamera di ledge
  P(g,'#3a3a44',w-15,20,11,1);
  /* benang merah antar-pin (papan investigasi) + sticky note */
  P(g,'#b83a2a',11,6,26,1);                                    // benang mendatar
  P(g,'#b83a2a',11,6,1,11);P(g,'#b83a2a',37,6,1,9);           // benang turun
  P(g,'#e8d84a',7,18,7,5);P(g,'#c9b93a',7,18,7,1);            // sticky note kuning
  P(g,'#3a3a44',10,17,1,2);                                    // pin note
}));
anims.push({f:FURN[1],fn:(g,t)=>{                              // blitz kamera
  if(t%5200<160){const f=FURN[1];
    P(g,'rgba(255,255,255,.85)',f.px+f.canvas.width-13,f.py+21,7,3);
    P(g,'rgba(255,255,255,.25)',f.px+f.canvas.width-19,f.py+16,17,13);}
}});

/* --- TV SIARAN + TOA : LAPORAN DISEMINASI --- */
FURN.push(furn(TOOLS[2].rect,20,(g,w,h)=>{
  P(g,'#39414f',2,22,w-4,10);P(g,'#4a5468',2,22,w-4,3);        // kabinet logam
  P(g,'#2a303c',3,32,3,h-32);P(g,'#2a303c',w-6,32,3,h-32);
  P(g,'#2b2b33',7,4,24,19);P(g,'#101014',9,6,18,13);            // TV CRT
  P(g,'#3a3a44',28,8,2,10);P(g,'#8fd45e',28,9,2,2);             // panel + lampu
  P(g,'#55555f',13,0,1,5);P(g,'#55555f',20,0,1,5);              // antena V
  P(g,'#55555f',12,0,3,1);P(g,'#55555f',19,0,3,1);
  P(g,'#e8c05a',34,12,9,7);P(g,'#c89a3a',41,13,3,5);P(g,'#2a303c',36,19,3,3); // toa
  /* pintu kabinet + gagang + modem ber-LED + kabel */
  P(g,'#2a303c',(w/2)|0,23,1,8);                               // sekat pintu
  P(g,'#c9c9d2',10,26,3,1);P(g,'#c9c9d2',w-13,26,3,1);        // gagang
  P(g,'#1a1a20',5,23,7,3);                                     // modem
  P(g,'#8fd45e',6,24,1,1);P(g,'#4cc9e0',8,24,1,1);P(g,'#ff5a5a',10,24,1,1); // LED modem
  P(g,'#2a303c',24,19,1,4);                                    // kabel TV→kabinet
}));
anims.push({f:FURN[2],fn:(g,t)=>{                              // siaran feed medsos
  const x=FURN[2].px+9,y=FURN[2].py+6;
  if(t%9000<420){                                              // sesekali "semut"
    for(let i=0;i<40;i++){const r=rnd(i,Math.floor(t/60));
      P(g,(r%3)?'#5a5a66':'#c9c9d2',x+r%18,y+(r>>4)%13,1,1);}
    return;
  }
  P(g,'#141422',x,y,18,13);
  const cols=['#e07ad0','#4cc9e0','#e8c05a','#7ee06a'];
  for(let i=0;i<4;i++){
    const yy=y+1+((i*3+Math.floor(t/450))%12);
    P(g,cols[i],x+2,yy,8+((i*5)%6),2);
  }
  if(Math.floor(t/800)%2)P(g,'#ff5a5a',x+15,y+1,2,2);          // titik LIVE
}});

/* AREA SAMPLING (KSA) & COOPERSTOWN kini berdiri di AREA LUAR (lihat bagian
   "AREA LUAR" di bawah) — furnitur & animasinya dibangun di sana. */

/* --- TUNGKU TEMPA : SKP FORGE --- */
FURN.push(furn(TOOLS[4].rect,22,(g,w,h)=>{
  P(g,'#232833',2,h-4,w-4,4);                                   // alas logam
  /* --- badan tungku batu (kiri-tengah) --- */
  P(g,'#544a40',2,10,26,h-14);                                 // blok batu hangat
  for(let y=13;y<h-6;y+=6)P(g,'#39322a',2,y,26,1);             // garis mortar
  for(let y=11;y<h-8;y+=6)for(let x=4;x<26;x+=8)               // pola bata selang-seling
    P(g,'#5f5548',x+((y/6)&1?4:0),y+1,6,4);
  P(g,'#2e2820',18,26,1,10);P(g,'#2e2820',19,30,1,4);          // retak
  /* pita besi + paku keling */
  P(g,'#33333d',2,20,26,3);P(g,'#26262e',2,22,26,1);
  P(g,'#33333d',2,40,26,3);P(g,'#26262e',2,42,26,1);
  for(let x=5;x<27;x+=6){P(g,'#5a6675',x,20,1,1);P(g,'#5a6675',x,40,1,1);}
  /* --- cerobong di atas mulut --- */
  P(g,'#4a4238',9,0,12,12);
  for(let y=2;y<12;y+=3)P(g,'#39322a',9,y,12,1);               // susunan bata
  P(g,'#33333d',8,0,14,3);P(g,'#5a6675',11,1,1,1);P(g,'#5a6675',18,1,1,1); // tudung besi + keling
  P(g,'#241a12',13,3,2,9);                                     // jelaga
  /* --- mulut melengkung + jelaga --- */
  P(g,'#241a12',5,23,20,21);                                   // halo jelaga
  P(g,'#6b5f4e',6,24,18,3);P(g,'#7a6d58',13,23,4,3);           // lengkung bata + batu kunci
  P(g,'#120c07',7,28,16,15);                                   // rongga (diisi anim)
  /* tang tergantung di sisi badan */
  P(g,'#55555f',25,14,3,2);P(g,'#8a6a42',25,16,1,8);P(g,'#8a6a42',27,16,1,8);
  /* --- landasan (anvil) + tunggul kayu --- */
  P(g,'#3a2a1a',32,45,10,h-45);P(g,'#4a3420',32,45,10,2);      // tunggul
  P(g,'#3a3a44',30,39,15,4);P(g,'#4a4a54',30,39,15,1);         // muka landasan
  P(g,'#2a2a32',27,40,3,2);                                    // tanduk
  P(g,'#2a2a32',34,43,7,3);                                    // pinggang + kaki
  /* rangka palu-tempa vertikal (gantry di atas landasan) */
  P(g,'#33333d',29,19,17,3);P(g,'#4a4a54',29,19,17,1);         // palang atas
  P(g,'#3a3a44',30,21,2,19);P(g,'#2a2a32',30,21,1,19);         // tiang kiri
  P(g,'#3a3a44',43,21,2,19);P(g,'#4a4a54',44,21,1,19);         // tiang kanan
}));
anims.push({f:FURN[3],fn:(g,t)=>{                              // api bernapas + tempa + asap (KSA pindah luar → forge kini idx 3)
  const f=FURN[3], mx=f.px+7, my=f.py+28;
  const breath=0.55+0.45*Math.sin(t/480), fr=Math.floor(t/120)%3;
  P(g,'#160e07',mx,my,16,15);                                  // rongga gelap
  P(g,'#7a2410',mx+1,my+11,14,4);P(g,'#c8401a',mx+2,my+12,12,2); // hamparan bara
  P(g,'#e04f2a',mx+2,my+6,12,9);                               // api merah
  P(g,'#ff8c3a',mx+3+(fr===1?1:0),my+4,10,10);                 // oranye
  P(g,'#ffd75e',mx+5+(fr===2?1:0),my+3,6,9);                   // kuning
  P(g,'#fff3c0',mx+7,my+7,2,5);                                // inti putih
  P(g,`rgba(255,150,60,${(0.14*breath).toFixed(3)})`,mx-3,my-3,22,22); // pendar bata
  const r=rnd(Math.floor(t/150),3);
  if(r%2===0)P(g,'#ffd75e',mx+2+r%12,my-2-(r>>3)%5,1,1);       // percikan naik
  /* palu-tempa VERTIKAL: kepala besi jatuh lurus dalam rangka ke billet panas */
  const cyc=(t%1300)/1300;
  let s; if(cyc<0.58)s=0; else if(cyc<0.66)s=(cyc-0.58)/0.08;    // tahan terangkat → jatuh cepat
    else if(cyc<0.74)s=1; else s=1-(cyc-0.74)/0.26;             // hantam (tahan) → naik lagi
  const cxh=f.px+36, topY=f.py+20+Math.round(11*s);             // kepala turun saat s→1
  const shH=topY-(f.py+21); if(shH>0)P(g,'#8a8a94',cxh-1,f.py+21,2,shH); // batang shaft
  P(g,'#4a4a54',cxh-3,topY,6,8);P(g,'#6a6a72',cxh-3,topY,6,1);  // kepala besi (vertikal)
  P(g,'#2f2f37',cxh-3,topY,1,8);P(g,'#5a5a64',cxh+2,topY,1,8);  // sisi gelap/terang
  P(g,'#33333d',cxh-3,topY+7,6,1);                              // muka pemukul (bawah)
  const hit=s>0.85, wx=f.px+32, wy=f.py+37;                      // billet panas di landasan
  P(g,hit?'#fff3c0':'#ff9a3a',wx,wy,6,2);P(g,hit?'#ffd75e':'#e0641a',wx,wy+1,6,1);
  if(hit){for(let i=0;i<7;i++){const a=rnd(i,Math.floor(t/40));
    P(g,'#ffd75e',wx+3+(a%9)-4,wy-1-(a>>3)%5,1,1);}
    P(g,'rgba(255,220,120,.55)',wx-2,wy-2,10,3);}               // dentum → kilau + percikan
  /* asap cerobong — tiga kepul naik memudar */
  const puff=(o,al,sz)=>{const yy=f.py-3-((t/45+o)%20);
    P(g,`rgba(200,200,210,${al})`,f.px+13+(Math.sin((t+o*400)/500)*2|0),yy,sz,sz-1);};
  puff(0,.28,6);puff(600,.19,8);puff(1200,.11,10);
}});

/* COOPERSTOWN (FARM AXIS) dipindah ke AREA LUAR — dibangun di bagian bawah. */

/* --- MEJA BENGKEL UMUM : WORKSHOP (isi menyusul, tak khusus drum seeder) --- */
FURN.push(furn(TOOLS[6].rect,8,(g,w,h)=>{
  /* papan alat (pegboard) di dinding */
  P(g,'#39414f',3,2,w-6,13);P(g,'#2a2f3a',5,4,w-10,9);
  for(let y=6;y<12;y+=3)for(let x=8;x<w-8;x+=4)P(g,'#1b202a',x,y,1,1);   // lubang pegboard
  P(g,'#8a6a42',9,5,1,7);P(g,'#55555f',7,4,5,3);                        // palu
  P(g,'#c9c9d2',17,5,1,8);P(g,'#c9c9d2',16,4,3,2);                      // kunci inggris
  P(g,'#8a6a42',w-15,5,7,1);P(g,'#9fb0c0',w-15,6,8,3);                  // gergaji (bilah)
  for(let i=0;i<8;i++)P(g,'#c9d4e0',w-15+i,9,1,1);                      // gigi gergaji
  /* meja kerja */
  P(g,'#4a5468',2,h-14,w-4,4);P(g,'#39414f',2,h-10,w-4,7);
  P(g,'#2a303c',4,h-3,3,3);P(g,'#2a303c',w-7,h-3,3,3);                  // kaki
  /* ragum (vise) */
  P(g,'#55555f',6,h-18,8,5);P(g,'#3a3a42',8,h-19,4,2);
  /* suku cadang di meja */
  P(g,'#7a7f88',20,h-16,6,3);P(g,'#9aa0aa',20,h-16,6,1);               // balok logam
  P(g,'#c9a24a',28,h-15,4,2);                                          // baut kuningan
  P(g,'#5f6670',34,h-17,5,4);P(g,'#787f8a',35,h-16,3,1);               // roda gigi
  /* lampu kerja menggantung */
  P(g,'#2a303c',w-11,0,2,3);P(g,'#3a3a42',w-14,3,8,3);P(g,'#ffe6a0',w-13,5,6,1);
  /* blueprint tertempel + obeng di pegboard */
  P(g,'#1c3a5a',25,4,11,9);P(g,'#2a5a86',25,4,11,1);                    // blueprint biru
  for(let i=6;i<12;i+=2)P(g,'#4a86b8',27,i,7,1);
  P(g,'#7fb8e0',28,6,4,3);P(g,'#c04a3a',30,3,2,2);                      // sketsa + pin
  P(g,'#c9c9d2',21,5,1,7);P(g,'#e8c05a',21,4,1,2);                      // obeng
  P(g,'#c9c9d2',23,5,1,7);P(g,'#4cc9e0',23,4,1,2);
  /* isi meja: benda terjepit ragum, nampan baut, kaleng oli, kayu, gram */
  P(g,'#b5482f',8,h-21,4,3);P(g,'#c95a3a',8,h-21,4,1);                  // benda kerja di ragum
  P(g,'#2a303c',15,h-17,5,3);P(g,'#c9a24a',16,h-16,1,1);P(g,'#c9a24a',18,h-16,1,1); // nampan baut
  P(g,'#3a5a3a',42,h-19,4,6);P(g,'#4a6f4a',42,h-19,4,1);P(g,'#26262e',43,h-21,2,2); // kaleng oli
  P(g,'#8a6a42',30,h-16,8,1);P(g,'#6e4a2a',30,h-15,8,1);                // bilah kayu
  for(let i=0;i<5;i++)P(g,'#5f6670',22+i*2,h-3,1,1);                    // gram logam
}));

/* --- dekor berdiri: rak server & peti logam --- */
const rackPaint=(g)=>{
  P(g,'#1d232e',3,0,10,20);P(g,'#39414f',3,0,10,2);
  P(g,'#10141c',5,4,6,3);P(g,'#10141c',5,9,6,3);P(g,'#10141c',5,14,6,3);
  P(g,'#454f61',4,3,1,16);};
const rackA=furn({x:1,y:2,w:1,h:1},4,g=>{rackPaint(g);});
const rackB=furn({x:23,y:2,w:1,h:1},4,g=>{rackPaint(g);});
const crates=furn({x:19,y:15,w:2,h:1},8,(g)=>{
  P(g,'#2e3542',2,8,13,15);P(g,'#39414f',2,8,13,2);P(g,'#10141c',2,22,13,1);
  P(g,'#e8c05a',3,16,4,2);P(g,'#454f61',8,12,5,4);
  P(g,'#39414f',16,12,13,11);P(g,'#454f61',16,12,13,2);
  P(g,'#e8c05a',18,17,6,2);P(g,'#10141c',16,22,13,1);});
FURN.push(rackA,rackB,crates);

/* --- dekor pengisi ruangan: pot, bangku, drum, kabinet, rak alat, tong --- */
const potPaint=g=>{
  P(g,'#5f2d20',4,13,8,6);P(g,'#7a3a2a',4,13,8,2);P(g,'#3f1e15',4,18,8,1);   // pot tanah liat
  P(g,'#2f7a4a',7,7,2,6);                                                    // batang
  P(g,'#46a14e',3,4,4,4);P(g,'#46a14e',9,3,4,4);P(g,'#2f7a4a',6,2,4,3);      // daun
  P(g,'#7ee06a',7,4,2,2);P(g,'#7ee06a',4,5,2,1);
};
const potA=furn({x:7, y:2, w:1,h:1},4,potPaint);
const potB=furn({x:1, y:7, w:1,h:1},4,potPaint);
const potC=furn({x:19,y:2, w:1,h:1},4,potPaint);
const bench=furn({x:8,y:16,w:2,h:1},6,(g,w,h)=>{
  P(g,'#39414f',2,8,w-4,5);P(g,'#4a5468',2,8,w-4,2);                         // dudukan logam
  P(g,'#2a303c',3,13,3,h-14);P(g,'#2a303c',w-6,13,3,h-14);                   // kaki
});
const drum=furn({x:9,y:11,w:1,h:1},6,(g)=>{
  P(g,'#3a5a8a',3,4,10,17);P(g,'#4a6f9f',3,4,10,2);                          // drum baja biru
  P(g,'#2a4568',3,10,10,2);P(g,'#2a4568',3,16,10,2);P(g,'#151a22',3,20,10,1);
});
const kabinet=furn({x:15,y:2,w:1,h:1},10,(g)=>{
  P(g,'#4a5468',3,2,10,23);P(g,'#39414f',3,2,10,2);                          // kabinet arsip
  P(g,'#2a303c',4,6,8,4);P(g,'#2a303c',4,12,8,4);P(g,'#2a303c',4,18,8,4);    // laci
  P(g,'#e8c05a',7,7,2,1);P(g,'#e8c05a',7,13,2,1);P(g,'#e8c05a',7,19,2,1);    // pegangan
});
const toolRack=furn({x:20,y:9,w:1,h:1},12,(g)=>{
  P(g,'#39414f',2,2,12,16);P(g,'#26262e',3,3,10,14);                         // papan alat
  P(g,'#8a6a42',5,5,1,6);P(g,'#55555f',4,3,3,3);                             // palu
  P(g,'#8a6a42',10,5,1,7);P(g,'#c9c9d2',9,3,3,2);                            // kunci
  P(g,'#2a303c',2,18,12,10);                                                 // meja bawah
});
/* lampu lantai — penyatu pojok santai + aksen hangat di kamar kanan */
const lampPaint=(g,w,h)=>{
  P(g,'#c89a3a',4,2,8,2);                                                     // rim kap
  P(g,'#ffe6a0',3,4,10,6);P(g,'#fff3c0',5,6,6,3);                            // kap + cahaya
  P(g,'#4a4a52',7,10,2,h-14);                                                 // tiang
  P(g,'#3a3a42',5,h-4,6,2);P(g,'#2a2a32',4,h-2,8,2);                          // dasar
};
const lamp=furn({x:7,y:16,w:1,h:1},20,lampPaint);
/* dispenser air (pengisi dinding kiri, bawah rak server) */
const cooler=furn({x:1,y:4,w:1,h:1},6,(g,w,h)=>{
  P(g,'#3a5a8a',5,2,6,5);P(g,'#8fc9e0',6,2,4,4);                              // galon air
  P(g,'#dfe6ee',4,7,8,h-9);P(g,'#c2ccd6',4,7,8,2);                           // badan dispenser
  P(g,'#2a303c',6,12,4,2);P(g,'#4cc9e0',7,12,1,1);                           // keran
  P(g,'#9aa4b0',4,h-3,8,3);                                                   // dasar
});
/* tumpukan peti kayu (pengisi dinding kiri bawah) */
const boxes=furn({x:1,y:12,w:1,h:1},7,(g,w,h)=>{
  P(g,'#6e4a2a',2,6,11,10);P(g,'#815a36',2,6,11,2);P(g,'#573a20',2,11,11,1); // peti bawah
  P(g,'#4a3018',7,6,1,10);
  P(g,'#7a5330',4,0,8,6);P(g,'#8f6338',4,0,8,2);P(g,'#e8c05a',6,2,4,1);       // peti atas
});
/* loker dua pintu (pengisi dinding pembatas, dekat AREA SAMPLING) */
const locker=furn({x:9,y:6,w:1,h:1},8,(g,w,h)=>{
  P(g,'#455063',3,2,10,h-4);P(g,'#39414f',3,2,10,2);                          // badan loker
  P(g,'#2a303c',4,4,4,h-8);P(g,'#2a303c',9,4,3,h-8);                          // dua pintu
  P(g,'#1a2029',4,5,4,1);P(g,'#1a2029',9,5,3,1);                              // ventilasi
  P(g,'#c9c9d2',6,9,1,2);P(g,'#c9c9d2',10,9,1,2);                             // gagang
});
/* LIFT — elevator menempel dinding di samping EVIDENCE; kabinnya menghubungkan
   lantai 1 (ruang kerja) dengan lantai 2 (ruang arsip). Posisi sama di kedua denah.
   Pintu KACA semi-transparan yang menggeser buka-tutup; interior kabin terlihat. */
const liftPaint=(g,w,h)=>{
  /* interior kabin (di dalam bukaan — tampak lewat kaca / saat pintu terbuka) */
  P(g,'#141922',5,6,w-10,h-6);                                 // rongga
  P(g,'#20272f',6,8,w-12,h-11);                                // dinding belakang
  P(g,'#262e38',7,11,w-14,1);P(g,'#262e38',7,17,w-14,1);       // garis panel
  P(g,'#12161c',6,h-3,w-12,3);                                 // lantai kabin
  P(g,'#3a4450',w-10,12,3,8);P(g,'#5ee8c8',w-9,13,1,1);P(g,'#e8c05a',w-9,16,1,1); // panel kendali + LED
  P(g,'rgba(150,210,235,.10)',6,8,w-12,4);                     // cahaya plafon
  /* rangka baja flush dinding: lintel + jamb (tanpa sill, menempel) */
  P(g,'#2b3039',0,0,w,6);P(g,'#3a414c',0,0,w,1);               // lintel
  P(g,'#2b3039',0,0,5,h);P(g,'#2b3039',w-5,0,5,h);             // jamb kiri/kanan
  P(g,'#12161c',5,6,1,h-6);P(g,'#12161c',w-6,6,1,h-6);         // bayangan dalam
  P(g,'#0a0e13',8,1,16,4);                                     // housing indikator (anim)
};
/* pasang lift di daftar furnitur lantai yang sedang dibangun.
   `up` = arah tujuan kabin (true di lt.1 → naik, false di lt.2 → turun). */
function mkLift(up){
  const f=furn(LIFT_RECT,16,liftPaint);
  FURN.push(f);
  anims.push({f,fn:(g,t)=>{                                    // pintu kaca geser + indikator
    const px=f.px, py=f.py, Wc=f.canvas.width, Hc=f.canvas.height;
    const ox=px+5, oyd=py+6, ow=Wc-10, oh=Hc-6, half=ow>>1;
    const p=(t%6000)/6000;                                     // siklus buka-tutup
    let op; if(p<0.15)op=p/0.15; else if(p<0.55)op=1; else if(p<0.70)op=1-(p-0.55)/0.15; else op=0;
    const cover=Math.round(half*(1-op));
    const leaf=(lx,lw)=>{ if(lw<=0)return;
      g.fillStyle='rgba(150,182,208,0.32)';g.fillRect(lx,oyd,lw,oh);       // kaca semi-transparan
      g.fillStyle='rgba(205,228,245,0.20)';g.fillRect(lx,oyd,lw,1);        // kilau atas
      g.fillStyle='rgba(96,126,156,0.55)';g.fillRect(lx,oyd,1,oh); };      // rangka tepi daun
    leaf(ox, cover);                                           // daun kiri (menempel jamb)
    leaf(ox+ow-cover, cover);                                  // daun kanan
    if(op<0.12)P(g,'rgba(40,50,62,.85)',ox+half-1,oyd,2,oh);   // celah tengah saat tertutup
    if(op>0.6)P(g,`rgba(150,200,230,${(0.12*op).toFixed(3)})`,px+6,py+Hc,Wc-12,6); // cahaya tumpah ke lantai
    /* indikator lantai */
    const ix=px+8, iy=py+1, open=op>0.5, col=open?'#7ee06a':(up?'#e8c05a':'#a78bfa');
    P(g,'#0a0e13',ix,iy,16,4);
    if(open)P(g,col,ix+7,iy+1,2,2);                            // dot menyala (kabin tiba)
    else if(up){P(g,col,ix+7,iy,1,1);P(g,col,ix+6,iy+1,3,1);P(g,col,ix+6,iy+2,3,1);}   // panah naik
    else{P(g,col,ix+6,iy,3,1);P(g,col,ix+6,iy+1,3,1);P(g,col,ix+7,iy+2,1,1);}          // panah turun
    if(p>0.13&&p<0.22)P(g,'rgba(255,220,120,.5)',ix,iy,16,4); // "ding" saat tiba
  }});
  return f;
}
const lift=mkLift(true);
/* partisi separator — batas kaca-logam antara ruang kerja & lounge (celah masuk di kanan, kolom 8-9) */
const divider=furn({x:4,y:13,w:4,h:1},10,(g,w,h)=>{
  const yt=4, yb=h-3;                                          // atas & dasar partisi (naik ~6px di atas ubin)
  P(g,'rgba(120,170,200,.20)',1,yt+3,w-2,yb-yt-5);           // panel kaca beku
  P(g,'rgba(190,220,238,.12)',1,yt+3,w-2,3);                  // kilau atas kaca
  P(g,'#3a4453',0,yt,w,3);P(g,'#4cc9e0',0,yt+1,w,1);          // rel atas logam + garis neon cyan
  P(g,'#2b3340',0,yb,w,3);P(g,'#1a2029',0,yb+2,w,1);          // rel bawah logam
  for(let x=0;x<w;x+=15){P(g,'#455063',x,yt,3,yb-yt+3);P(g,'#5a6675',x,yt,3,2);} // tiang tiap ubin
});
FURN.push(divider);
/* partisi kedua — memisahkan zona EVIDENCE (atas) dari lounge (bawah), celah masuk di kanan (kolom 8-9) */
const divider2=furn({x:2,y:9,w:6,h:1},10,(g,w,h)=>{
  const yt=4, yb=h-3;
  P(g,'rgba(120,170,200,.20)',1,yt+3,w-2,yb-yt-5);           // panel kaca beku
  P(g,'rgba(190,220,238,.12)',1,yt+3,w-2,3);                  // kilau atas kaca
  P(g,'#3a4453',0,yt,w,3);P(g,'#4cc9e0',0,yt+1,w,1);          // rel atas + neon cyan
  P(g,'#2b3340',0,yb,w,3);P(g,'#1a2029',0,yb+2,w,1);          // rel bawah
  for(let x=0;x<w;x+=15){P(g,'#455063',x,yt,3,yb-yt+3);P(g,'#5a6675',x,yt,3,2);} // tiang
});
FURN.push(divider2);
/* --- pengisi kamar kanan-atas (pelaporan) --- */
const rackC=furn({x:23,y:4,w:1,h:1},4,g=>{rackPaint(g);});   // rak data (dinding kanan)
const potRA=furn({x:17,y:7,w:1,h:1},4,potPaint);             // tanaman sudut
/* --- pengisi kamar kanan-bawah (bengkel) --- */
const shelfR=furn({x:23,y:10,w:1,h:1},8,(g,w,h)=>{           // rak besi suku cadang
  P(g,'#3a4250',2,2,12,h-4);P(g,'#2a303c',2,2,12,2);           // rangka
  P(g,'#4a5468',3,7,10,1);P(g,'#4a5468',3,13,10,1);            // ambalan
  P(g,'#7a7f88',4,3,3,2);P(g,'#9aa0aa',9,3,2,2);               // balok logam
  P(g,'#c9a24a',5,9,2,3);P(g,'#5f6670',9,9,3,3);               // baut & roda gigi
  P(g,'#8a6a42',4,15,6,2);                                     // kayu
});
const gasCyl=furn({x:15,y:10,w:1,h:1},8,(g,w,h)=>{           // tabung gas
  P(g,'#55555f',6,1,4,5);P(g,'#3a3a42',6,1,4,2);               // katup
  P(g,'#b5482f',4,5,8,h-7);P(g,'#c95a3a',4,5,8,2);             // tabung merah
  P(g,'#8a3422',4,5,2,h-7);                                    // sisi gelap
  P(g,'#e8c05a',5,11,6,1);                                     // strip label
  P(g,'#151a22',4,h-3,8,1);                                    // dasar
});
const tires=furn({x:15,y:16,w:1,h:1},6,(g,w,h)=>{           // tumpukan ban
  for(let i=0;i<2;i++){const yy=h-6-i*6;
    P(g,'#1a1a1f',2,yy,12,5);P(g,'#26262e',3,yy+1,10,3);P(g,'#0e0e12',5,yy+2,6,1);}
});
/* --- jukebox (lounge, samping sofa) --- */
const jukebox=furn({x:4,y:16,w:1,h:1},14,(g,w,h)=>{          // h=30
  P(g,'#4a2f1c',2,5,12,h-5);P(g,'#6e4a2a',3,6,10,h-8);        // badan kayu
  P(g,'#e07ad0',3,2,10,2);P(g,'#4cc9e0',4,1,8,1);            // busur neon
  P(g,'#08131c',4,6,8,4);                                     // layar (diisi anim)
  P(g,'#241610',4,13,8,7);                                    // kisi speaker
  P(g,'#160d07',5,14,6,1);P(g,'#160d07',5,16,6,1);P(g,'#160d07',5,18,6,1);
  P(g,'#e8c05a',5,22,2,2);P(g,'#7ee06a',8,22,2,2);P(g,'#4cc9e0',11,22,1,2); // tombol
  P(g,'#2a1810',2,h-3,12,3);                                  // dasar
});
FURN.push(potA,potB,potC,bench,drum,kabinet,toolRack,lamp,cooler,boxes,locker,
          rackC,potRA,shelfR,gasCyl,tires,jukebox);
anims.push({fn:(g,t)=>{                                       // layar & equalizer jukebox
  const jx=jukebox.px,jy=jukebox.py,dx=jx+4,dy=jy+6;
  if(music.on){
    g.fillStyle='#04121a';g.fillRect(dx,dy,8,4);
    const cols=['#4cc9e0','#7ee06a','#e8c05a','#e07ad0','#7ec8ff','#ffa0d8'];
    for(let i=0;i<6;i++){let bh=1+Math.round((Math.sin(t/80+i*1.3)+Math.sin(t/47+i)+2)*.85);
      bh=Math.max(1,Math.min(4,bh));g.fillStyle=cols[i];g.fillRect(dx+1+i,dy+4-bh,1,bh);}
    const gl=(Math.sin(t/220)+1)/2;                            // busur neon berdenyut
    g.fillStyle='rgba(224,122,208,'+(0.25+gl*0.4).toFixed(2)+')';g.fillRect(jx+3,jy+1,10,2);
    for(let k=0;k<2;k++){const p=((t/750)+k*.5)%1,ny=jy-1-p*16,nx=jx+11+Math.round(Math.sin(t/140+k*3)*3);
      g.fillStyle='rgba(126,224,106,'+(1-p).toFixed(2)+')';g.fillRect(nx,ny,2,2);g.fillRect(nx+1,ny+2,1,2);}
  }else{g.fillStyle='#06171f';g.fillRect(dx,dy,8,4);
    if(Math.floor(t/700)%2){g.fillStyle='#0a3a2a';g.fillRect(dx+1,dy+3,2,1);}}
}});

/* --- kebun hidroponik: rak tanam 2 tingkat + lampu tumbuh + tandon air --- */
const hydro=furn({x:11,y:2,w:3,h:1},12,(g,w,h)=>{
  P(g,'#2a303c',2,0,2,h-4);P(g,'#2a303c',w-4,0,2,h-4);          // tiang rangka
  P(g,'#39414f',2,4,w-4,2);P(g,'#39414f',2,14,w-4,2);           // ambalan 2 tingkat
  P(g,'#241a10',5,2,w-10,2);P(g,'#241a10',5,12,w-10,2);         // media tanam tiap ambalan
  P(g,'#10141c',2,h-8,w-4,6);P(g,'#3a5a8a',4,h-6,w-8,3);        // tandon air
});
/* kebun tumbuh: tiap slot melewati benih→tunas→muda→berbuah→panen,
   distaggered sehingga rak selalu menampilkan campuran tahap tumbuh. */
const windGust=t=>Math.max(0,Math.sin(t/5200));               // 0..1: angin berhembus lalu reda
const SLOTX=[9,18,27,36], GROW_DUR=36000, GROW=[];
const SPECIES=['selada','tomat','cabai','bayam'];             // ragam tanaman per slot
[{ly:4,maxH:4},{ly:14,maxH:8}].forEach((sh,s)=>SLOTX.forEach((lx,c)=>{
  const idx=s*SLOTX.length+c;
  GROW.push({wx:hydro.px+lx, wy:hydro.py+sh.ly, maxH:sh.maxH,
    off:idx/(SLOTX.length*2), sp:SPECIES[idx%4]});
}));
function drawPlant(ctx,wx,wy,maxH,gp,sp,sway){
  ctx.fillStyle='#4a3320';ctx.fillRect(wx-1,wy-1,3,1);          // media / tanah
  if(gp<0.06||gp>=0.9)return;                                   // benih / sudah dipanen
  const gr=Math.min(1,(gp-0.06)/0.74), sw=gr>0.45?sway:0;
  if(sp==='selada'){                                            // selada: rimbun rendah, tanpa batang
    const h=Math.max(1,Math.round(maxH*0.6*gr));
    ctx.fillStyle='#4e9a44';
    for(let yy=0;yy<h;yy++){const wd=Math.min(2,Math.round((h-yy)/2)+(gr>0.5?1:0));
      ctx.fillRect(wx-wd+sw,wy-1-yy,wd*2+1,1);}
    ctx.fillStyle='#6ec258';ctx.fillRect(wx-1+sw,wy-h,3,1);
    return;
  }
  const hgt=Math.max(1,Math.round(maxH*(sp==='bayam'?0.85:1)*gr));
  ctx.fillStyle=sp==='bayam'?'#357a34':'#3f7a3a';ctx.fillRect(wx+sw,wy-hgt,1,hgt); // batang
  ctx.fillStyle=sp==='bayam'?'#4e9a44':'#5aa84e';
  const lv=Math.min(3,Math.floor(gr*3.2)+(sp==='bayam'?1:0));
  for(let l=1;l<=lv;l++){const ly=wy-Math.round(l/(lv+1)*hgt);
    if(sp==='bayam'){ctx.fillRect(wx-2+sw,ly,2,1);ctx.fillRect(wx+1+sw,ly,2,1);}  // daun lebar
    else{ctx.fillRect(wx-1+sw,ly,1,1);ctx.fillRect(wx+1+sw,ly,1,1);}}             // daun kecil
  ctx.fillStyle='#7ee06a';ctx.fillRect(wx+sw,wy-hgt-1,1,1);     // pucuk
  if(gr>0.75){
    if(sp==='tomat'){ctx.fillStyle='#e0503a';ctx.fillRect(wx-1+sw,wy-hgt+2,2,2);}                  // tomat bulat
    else if(sp==='cabai'){ctx.fillStyle='#d23a2a';ctx.fillRect(wx+1+sw,wy-hgt+2,1,3);ctx.fillRect(wx-1+sw,wy-hgt+5,1,2);}} // cabai menggantung
}
anims.push({fn:(g,t)=>{
  const gust=windGust(t);
  for(const p of GROW){const gp=((t/GROW_DUR)+p.off)%1;
    const sway=Math.round(Math.sin(t/1500+p.wx*0.25)*gust);    // goyang angin per tanaman
    drawPlant(g,p.wx,p.wy,p.maxH,gp,p.sp,sway);}
  const gl=Math.floor(t/700)%2;                                 // pendar lampu tumbuh (ungu)
  P(g,gl?'rgba(160,90,224,.20)':'rgba(160,90,224,.10)',hydro.px+3,hydro.py+4,hydro.canvas.width-6,11);
  P(g,'#4cc9e0',hydro.px+9,hydro.py+16+(Math.floor(t/300)%4)*2,1,2);   // tetes air
}});

/* --- pojok santai: TV menghadap sofa ungu --- */
const tvset=furn({x:5,y:14,w:2,h:1},8,(g,w,h)=>{
  P(g,'#39414f',2,16,w-4,6);                                     // meja rendah
  P(g,'#2b2b33',4,2,w-8,14);P(g,'#101014',6,4,w-12,9);           // TV CRT + layar
  P(g,'#55555f',11,0,1,3);P(g,'#55555f',19,0,1,3);               // antena
});
anims.push({fn:(g,t)=>{                                          // layar TV berganti warna
  const x=tvset.px+6,y=tvset.py+4;
  P(g,'#101014',x,y,20,9);
  P(g,['#3a5a8a','#46a14e','#e07ad0'][Math.floor(t/600)%3],x+2,y+2,16,5);
  P(g,'rgba(255,255,255,.15)',x+2,y+2+(Math.floor(t/120)%5),16,1);
}});
const sofa=furn({x:5,y:16,w:2,h:1},10,(g,w,h)=>{                 // sofa menghadap UTARA (ke TV), tampak dari belakang
  P(g,'#3a1e60',1,20,w-2,6);                                     // dasar/bayangan
  P(g,'#6b36a8',0,6,6,18);P(g,'#6b36a8',w-6,6,6,18);             // bantalan lengan kiri & kanan
  P(g,'#7d45c0',0,6,6,3);P(g,'#7d45c0',w-6,6,6,3);               // kilau atas lengan
  P(g,'#5a2c90',0,21,6,3);P(g,'#5a2c90',w-6,21,6,3);             // bayangan bawah lengan
  P(g,'#8548c8',6,13,w-12,12);                                   // sandaran punggung (menghadap kita)
  P(g,'#9a5ad8',6,13,w-12,3);                                    // kilau atas sandaran
  P(g,'#6b36a8',6,22,w-12,3);                                    // dasar sandaran (gelap)
});
sofa.baseY=1e6;                                                  // selalu di DEPAN dino: dino menghadap TV, punggung ke kita
FURN.push(hydro,tvset,sofa);

/* --- kursi yang bisa diduduki: sofa & bangku di pojok santai ---
   sofa: dino menghadap UTARA (ke TV), punggung ke kita, badan bawah ketutup sofa.
   bangku: dino menghadap kita, kaki disembunyikan di balik dudukan. */
const SEATS=[{rect:{x:5,y:16,w:2,h:1},dir:'up'},{rect:{x:8,y:16,w:2,h:1},dir:'down'}];
const seatFront={};                       // tile berdiri di depan kursi → kursinya
SEATS.forEach(s=>{
  const r=s.rect;
  s.sx=(r.x+r.w/2)*T;
  s.sy = s.dir==='up' ? r.y*T+6 : (r.y+r.h)*T+1;   // hadap utara: duduk lebih tinggi, kepala nyembul
  const ty=r.y-1;
  for(let x=r.x;x<r.x+r.w;x++)
    if(ty>=0&&!S(x,ty))seatFront[x+','+ty]=s;
});

/* --- meja rapat + proyektor hologram (kamar kanan-atas) --- */
const meetTable=furn({x:18,y:5,w:3,h:1},4,(g,w,h)=>{
  P(g,'#39414f',3,7,w-6,h-11);P(g,'#4a5468',3,7,w-6,2);        // permukaan meja
  P(g,'#2a303c',6,h-4,3,4);P(g,'#2a303c',w-9,h-4,3,4);         // kaki
  P(g,'#26262e',(w>>1)-4,2,8,5);P(g,'#101014',(w>>1)-3,3,6,2); // proyektor
  P(g,'#2ee0ff',(w>>1)-1,2,2,1);
});
FURN.push(meetTable);
/* kursi rapat mengelilingi meja (sisi depan + dua ujung) */
const chairPaint=(g,w,h,dir)=>{
  P(g,'#454f5e',4,5,8,7);P(g,'#5a6675',4,5,8,1);P(g,'#39414f',5,6,6,5);   // dudukan
  if(dir==='S'){P(g,'#2e3540',4,11,8,3);P(g,'#3a4250',4,11,8,1);}         // sandaran (sisi luar)
  else if(dir==='W'){P(g,'#2e3540',3,4,3,8);P(g,'#3a4250',3,4,1,8);}
  else if(dir==='E'){P(g,'#2e3540',10,4,3,8);P(g,'#3a4250',12,4,1,8);}
  P(g,'#2a303c',7,h-3,2,2);P(g,'#3a4250',4,h-1,8,1);                       // tiang + kaki bintang
};
FURN.push(
  furn({x:18,y:6,w:1,h:1},3,(g,w,h)=>chairPaint(g,w,h,'S')),
  furn({x:19,y:6,w:1,h:1},3,(g,w,h)=>chairPaint(g,w,h,'S')),
  furn({x:20,y:6,w:1,h:1},3,(g,w,h)=>chairPaint(g,w,h,'S')),
  furn({x:17,y:5,w:1,h:1},3,(g,w,h)=>chairPaint(g,w,h,'W')),
  furn({x:21,y:5,w:1,h:1},3,(g,w,h)=>chairPaint(g,w,h,'E')));
anims.push({fn:(g,t)=>{                                         // globe hologram berputar
  const cxp=meetTable.px+(meetTable.canvas.width>>1),cyp=meetTable.py-7;
  P(g,'rgba(46,224,255,.10)',cxp-3,cyp,7,9);                    // sinar proyektor
  P(g,Math.floor(t/450)%2?'rgba(46,224,255,.6)':'rgba(46,224,255,.4)',cxp-1,cyp-2,2,2);
  for(let i=0;i<10;i++){
    const a=t/600+i*0.6283;
    P(g,'rgba(46,224,255,.4)',cxp+Math.round(Math.cos(a)*7),cyp-2+Math.round(Math.sin(a)*3),1,1);
    P(g,'rgba(160,90,224,.38)',cxp+Math.round(Math.cos(a+1)*4),cyp-2+Math.round(Math.sin(a+1)*5),1,1);
  }
}});

/* --- animasi ambience HQ: LED panel, rak server, holo-pad --- */
anims.push({fn:(g,t)=>{
  const LC=['#46d160','#e8c05a','#ff5a5a','#2ee0ff'];
  for(let i=0;i<6;i++)
    P(g,LC[(Math.floor(t/350)+i)%4],T+4+(i%3)*3,8+((i/3)|0)*3,2,2);
  const bl=Math.floor(t/450)%2;
  [rackA,rackB].forEach((r,i)=>{
    P(g,(bl^(i&1))?'#46d160':'#0d3a1c',r.px+6,r.py+5,1,1);
    P(g,((bl+1+i)&1)?'#e8c05a':'#5a4a16',r.px+9,r.py+10,1,1);
    P(g,(bl^(i&1))?'#ff5a5a':'#4a1616',r.px+6,r.py+15,1,1);
  });
}});

/* --- jendela: pantulan cahaya luar bergerak turun di kaca --- */
function winShimmer(g,t,list){
  for(const wd of list){
    const rows=wd.ty1-wd.ty0+1;
    const wx=wd.side==='W'?2:W-14, gx=wx+2, gy=wd.ty0*T+4;
    const gwd=8, ght=rows*T-8;
    const ph=((t/2600)+(wd.side==='W'?0:.5))%1;      // kilau meluncur (miring ikut jeruji)
    const kSh=wd.side==='W'?.55:-.55, by=gy+Math.round(ph*(ght-2));
    g.fillStyle='rgba(255,255,255,.14)';
    for(let x=0;x<gwd;x++){let y=by+Math.round((x-gwd/2)*kSh);
      y=Math.max(gy,Math.min(gy+ght-2,y));g.fillRect(gx+x,y,1,2);}
    if(Math.floor(t/540+wd.ty0)%3===0){              // bintik berkedip
      g.fillStyle='rgba(255,255,255,.55)';
      g.fillRect(gx+(wd.side==='W'?2:5),gy+rows*3,1,1);
    }
    const pulse=(0.05+0.03*Math.sin(t/900+wd.ty0)).toFixed(3);  // berkas lantai bernapas
    g.fillStyle=`rgba(206,230,246,${pulse})`;
    if(wd.side==='W')g.fillRect(wx+12,wd.ty0*T+2,10,rows*T-4);
    else g.fillRect(wx-11,wd.ty0*T+2,10,rows*T-4);
  }
}
anims.push({fn:(g,t)=>winShimmer(g,t,WINDOWS)});

/* --- cuaca: sesekali hujan di kaca & kawanan burung lewat --- */
const weather={mode:'clear',next:9000,bird:null,flashT0:-1e9,flashNext:1e12,rainbowT0:-1e9,star:null};
const winGlass=wd=>{const rows=wd.ty1-wd.ty0+1,wx=wd.side==='W'?2:W-14;
  return {gx:wx+2,gy:wd.ty0*T+4,gw:8,gh:rows*T-8};};
/* dipakai kedua lantai — daftar jendela & ketinggian pita kabut yang berbeda */
function drawWeather(g,t,list,mistY){
  if(weather.bird&&list.indexOf(weather.bird.wd)<0)weather.bird=null;   // jendela milik lantai lain
  if(weather.star&&list.indexOf(weather.star.wd)<0)weather.star=null;
  if(t>weather.next){                                    // ganti cuaca tiap ~20–50 dtk
    const wasRain=weather.mode==='rain';
    weather.next=t+18000+Math.random()*30000;
    weather.mode=Math.random()<.30?'rain':'clear';
    weather.flashNext=weather.mode==='rain'?t+5000+Math.random()*10000:1e12; // jadwal petir
    if(wasRain&&weather.mode==='clear')weather.rainbowT0=t;   // pelangi sehabis hujan
  }
  if(weather.mode==='rain'){                             // tetes air mengalir turun di kaca
    for(const wd of list){const q=winGlass(wd);
      g.fillStyle='rgba(120,150,180,.10)';g.fillRect(q.gx,q.gy,q.gw,q.gh); // kaca basah
      g.fillStyle='rgba(206,228,246,.55)';
      for(let k=0;k<7;k++){
        const seed=k*97+wd.ty0*13, x=q.gx+((seed*7)%q.gw);
        const y=q.gy+((t*.12+seed*23)%(q.gh+6))-3;
        for(let s=0;s<3;s++){const yy=(y+s)|0;if(yy>=q.gy&&yy<q.gy+q.gh)g.fillRect(x,yy,1,1);}
      }
    }
  }
  if(!weather.bird&&daylight.star<.25&&Math.random()<.0009){ // kawanan burung (siang, sesekali)
    const wd=list[(Math.random()*list.length)|0];
    weather.bird={wd,t0:t,dur:4200,dir:Math.random()<.5?1:-1};
  }
  if(weather.bird){
    const b=weather.bird,p=(t-b.t0)/b.dur;
    if(p>=1){weather.bird=null;}
    else{const q=winGlass(b.wd);
      g.fillStyle='rgba(18,24,32,.85)';
      for(let n=0;n<3;n++){                               // tiga burung beriringan
        const pn=p-n*.12;if(pn<0||pn>1)continue;
        const bx=Math.round(q.gx+(b.dir>0?pn*q.gw:(1-pn)*q.gw));
        const by=Math.round(q.gy+pn*q.gh);
        if(bx>=q.gx&&bx<q.gx+q.gw&&by>=q.gy+1&&by<q.gy+q.gh){
          g.fillRect(bx,by,1,1);g.fillRect(bx-1,by-1,1,1);g.fillRect(bx+1,by-1,1,1); // ^ sayap
        }
      }
    }
  }
  /* petir: sesekali menyambar saat hujan — jendela silau + ruang terang sekejap */
  if(weather.mode==='rain'&&t>weather.flashNext){
    weather.flashT0=t; weather.flashNext=t+9000+Math.random()*16000;
  }
  const fdt=t-weather.flashT0;
  if(fdt>=0&&fdt<440){                                    // amplop kilat: sambaran ganda cepat
    const flash=Math.min(1,Math.exp(-(((fdt-40)/40)**2))+.7*Math.exp(-(((fdt-230)/70)**2)));
    if(flash>.01){
      for(const wd of list){const q=winGlass(wd);         // langit jendela menyilau
        g.fillStyle='rgba(228,238,255,'+(flash*.72).toFixed(3)+')';g.fillRect(q.gx,q.gy,q.gw,q.gh);}
      g.fillStyle='rgba(200,218,255,'+(flash*.16).toFixed(3)+')';g.fillRect(0,0,W,H); // ruang terang sekejap
    }
  }
  /* pelangi samar sehabis hujan — lengkung tipis di jendela timur (siang) */
  const rdt=t-weather.rainbowT0;
  if(rdt>=0&&rdt<9000&&daylight.star<.25){
    const fade=Math.min(1,rdt/1200)*Math.min(1,(9000-rdt)/1200), q=winGlass(list.find(w=>w.side==='E')||list[0]);
    const cols=['232,96,96','240,180,90','120,200,120','96,170,236'];
    for(let b=0;b<4;b++)for(let i=0;i<q.gw;i++){
      const yy=q.gy+2+b+Math.round(2*Math.sin((i/q.gw)*Math.PI));
      if(yy>=q.gy&&yy<q.gy+q.gh){g.fillStyle='rgba('+cols[b]+','+(fade*.35).toFixed(3)+')';g.fillRect(q.gx+i,yy,1,1);}
    }
  }
  /* bintang jatuh — sesekali di malam cerah, melesat di kaca */
  if(!weather.star&&daylight.star>.5&&weather.mode==='clear'&&Math.random()<.0016){
    weather.star={wd:list[(Math.random()*list.length)|0],t0:t,dur:700,dir:Math.random()<.5?1:-1};
  }
  if(weather.star){
    const s=weather.star,p=(t-s.t0)/s.dur;
    if(p>=1){weather.star=null;}
    else{const q=winGlass(s.wd),hx=q.gx+(s.dir>0?p*q.gw:(1-p)*q.gw),hy=q.gy+p*q.gh*.55+1;
      g.fillStyle='rgba(255,255,255,'+(1-p*0.8).toFixed(2)+')';
      for(let k=0;k<4;k++){const bx=Math.round(hx-(s.dir>0?k:-k)),by=Math.round(hy-k*.6);
        if(bx>=q.gx&&bx<q.gx+q.gw&&by>=q.gy&&by<q.gy+q.gh)g.fillRect(bx,by,1,1);}
    }
  }
  /* kabut pagi tipis (jam ~5.5–8) menghanyut rendah di ruangan */
  const hr=curHour(), mist=(hr>5&&hr<8)?Math.min(1,Math.min(hr-5,8-hr)/1.2):0;
  if(mist>.02)for(let i=0;i<8;i++){
    const px=((t/50+i*150)%(W+140))-70, py=mistY-((i*43)%78)+Math.round(Math.sin(t/2000+i)*3);
    g.fillStyle='rgba(210,222,236,'+(mist*.14).toFixed(3)+')';g.fillRect(px,py,64,12);
  }
}
anims.push({fn:(g,t)=>drawWeather(g,t,WINDOWS,H-26)});

/* --- debu melayang: butir halus hanyut pelan, hanya di atas lantai terbuka --- */
anims.push({fn:(g,t)=>{
  for(let i=0;i<16;i++){
    const x=(i*163)%(W-48)+24+Math.sin(t/2400+i*1.7)*7;
    const y=((t/26+i*97)%(H-72))+36;
    const tx=Math.floor(x/T),ty=Math.floor(y/T);
    if(tx<0||ty<0||tx>=COLS||ty>=ROWS||MAP[ty][tx]!=='.')continue;
    P(g,`rgba(205,228,246,${(.09+.05*Math.sin(t/650+i*1.3)).toFixed(3)})`,
      Math.round(x),Math.round(y),1,1);
  }
}});

/* =========================================================================
   LANTAI 2 — DEK ARSIP
   Set furnitur & latar terpisah; setFloor() menukar rujukan FURN/anims/bg.
   ========================================================================= */
const FURNS=[FURN], ANIMS=[anims];              // indeks = nomor lantai
FURN=[];anims=[];                               // mulai daftar lantai 2

/* --- jendela intip ke lantai 1 (dilihat dari dek lt.2, di balik railing) ---
   Baris 8 denah lt.2 terbuka ke rongga; di baliknya kita tembuskan potongan
   lantai kerja di bawah. PEEK_HH = seberapa dalam pandangan turun (makin besar
   = makin panjang). Konstanta ini dipakai bersama oleh buildBG2 (latar dipanggang)
   dan drawPeekLife (animasi tiap frame) supaya keduanya sejajar. */
const PEEK_Y0=9*T, PEEK_HH=84;                  // dulu 52 — diperpanjang
const PEEK_AX0=8*T, PEEK_AX1=23*T;              // rentang aula (jendela lebar)
const PEEK_MOTES=16;
const PEEK_COLS=[];
for(let tx=0;tx<COLS;tx++)if(MAP2[8][tx]==='.')PEEK_COLS.push(tx);

function buildBG2(){
  const g=bg2c;
  P(g,'#05070b',0,0,W,H);                                      // rongga gelap di luar dek
  /* lantai: serambi lift = pelat beton · aula arsip = papan kayu hangat */
  for(let ty=0;ty<ROWS;ty++)for(let tx=0;tx<COLS;tx++){
    if(MAP2[ty][tx]!=='.')continue;
    const px=tx*T,py=ty*T,r=rnd(tx,ty)%14;
    const alt=(tx+ty)&1;                                       // pelat lambung kapal antariksa
    P(g,alt?'#2a313d':'#262c37',px,py,T,T);
    P(g,'#333c4a',px,py,T,1);P(g,'#181d26',px,py+T-1,T,1);     // bevel atas/bawah
    P(g,'#181d26',px+T-1,py,1,T);                              // nat kanan
    P(g,'#3a4452',px+1,py+1,1,1);P(g,'#3a4452',px+T-2,py+1,1,1);   // rivet sudut
    P(g,'#3a4452',px+1,py+T-2,1,1);P(g,'#3a4452',px+T-2,py+T-2,1,1);
    if(r===3)P(g,'#313a48',px+4,py+7,8,1);                     // goresan pelat
    if(r===9)P(g,'rgba(76,201,224,.045)',px+3,py+3,T-6,T-6);   // panel berpendar sesekali
  }
  /* dinding — muka baja bila ada lantai di bawahnya, sisanya rongga */
  for(let ty=0;ty<ROWS;ty++)for(let tx=0;tx<COLS;tx++){
    if(MAP2[ty][tx]!=='#')continue;
    const px=tx*T,py=ty*T;
    if(ty+1<ROWS&&MAP2[ty+1][tx]==='.'){
      P(g,'#2a2f3a',px,py,T,T);
      for(let x=0;x<T;x+=6)P(g,'#232833',px+x,py,1,T);
      P(g,'#14181f',px,py+T-4,T,4);                             // list bawah dinding
      const br=(0.45+0.55*daylight.lamp).toFixed(2);
      const c=tx<7?[76,201,224]:[90,176,242];                   // strip lampu kapal (cyan · biru)
      P(g,`rgba(${c[0]},${c[1]},${c[2]},${br})`,px,py+T-5,T,1);
      P(g,'rgba(0,0,0,.25)',px,py+T,T,4);
      pool(g,px,py+T+4,T,7,c.join(','),(.05*daylight.lamp+.02).toFixed(3));
    }else{
      P(g,'#12161d',px,py,T,T);
      for(let y=0;y<T;y+=8)P(g,'#171c24',px,py+y,T,1);
    }
  }
  /* di balik tepi dek: sepotong lantai kerja di bawah.
     `bg` hanya berisi lantai & dinding — perabot lt.1 hidup di kanvas terpisah,
     jadi disusun dulu jadi satu potret utuh supaya yang terlihat dari atas
     bukan lantai kosong. Latar lt.1 selalu dipanggang lebih dulu (tickSky). */
  const bawah=document.createElement('canvas');
  bawah.width=W;bawah.height=H;
  const bg1=bawah.getContext('2d');
  bg1.imageSmoothingEnabled=false;
  bg1.drawImage(bg,0,0);
  FURNS[0].forEach(f=>bg1.drawImage(f.canvas,f.px,f.py));
  for(let tx=0;tx<COLS;tx++){
    if(MAP2[8][tx]!=='.')continue;
    const px=tx*T,y0=PEEK_Y0,hh=PEEK_HH;
    g.save();
    g.beginPath();g.rect(px,y0,T,hh);g.clip();
    g.imageSmoothingEnabled=false;
    g.drawImage(bawah,px,y0,T,hh,px,y0,T,hh);                   // petak lt.1 tepat di bawahnya
    P(g,'rgba(18,28,44,.18)',px,y0,T,hh);                       // kabut jarak
    for(let i=0;i<hh;i++)                                       // makin jauh ke bawah makin gelap
      P(g,`rgba(5,7,12,${(0.05+0.80*i/hh).toFixed(3)})`,px,y0+i,T,1);
    P(g,'rgba(0,0,0,.5)',px,y0,T,3);                            // bayangan tepat di bawah tepi dek
    g.restore();
    P(g,'rgba(255,214,140,.06)',px,y0,T,12);                    // cahaya lt.1 merembes naik
  }
  /* railing tepi dek: sisi selatan terbuka ke rongga lantai bawah */
  for(let tx=0;tx<COLS;tx++){
    if(MAP2[8][tx]!=='.')continue;
    const px=tx*T,py=9*T;
    P(g,'rgba(0,0,0,.45)',px,py,T,3);                           // bayang tepi lantai
    for(let x=2;x<T;x+=7)P(g,'#39414f',px+x,py-5,2,7);          // tiang
    P(g,'#4c5668',px,py-6,T,2);P(g,'#5a6675',px,py-6,T,1);      // rel atas
    P(g,'#39414f',px,py-1,T,2);                                 // rel bawah
  }
  /* ambang pintu serambi → aula (kolom 6) */
  P(g,'#171c24',6*T,4*T,T,2);P(g,'#4cc9e0',6*T+3,4*T,10,1);
  /* karpet lorong pamer di depan dua stasiun */
  (function(){
    const rx=8*T, ry=3*T+2, rw=13*T, rh=T+6;
    P(g,'#28212f',rx,ry,rw,rh);
    P(g,'#3a3048',rx,ry,rw,2);P(g,'#3a3048',rx,ry+rh-2,rw,2);
    P(g,'#3a3048',rx,ry,2,rh);P(g,'#3a3048',rx+rw-2,ry,2,rh);
    for(let xx=rx+9;xx<rx+rw-7;xx+=13)P(g,'#352b45',xx,ry+(rh>>1)-1,3,3);
  })();
  /* kolam cahaya tiap stasiun jatuh ke karpet */
  pool(g, 9*T+4,3*T,40,10,'194,242,74', .12);                   // PROJEKT-FER (hijau limau)
  pool(g,13*T+4,3*T,40,10,'90,176,242', .12);                   // CPCL STATION (biru langit)
  pool(g,17*T+4,3*T,40,10,'167,139,250',.12);                   // PROJECT ROPS (ungu)
  /* keset di depan lift */
  P(g,'#1d3a30',2*T+2,2*T+2,28,12);P(g,'#2a4d3f',2*T+4,2*T+4,24,8);
  P(g,'#1d3a30',2*T+8,2*T+6,16,4);
  /* jendela ke luar angkasa + cahaya kabin dingin */
  drawSpaceWindows(g,WINDOWS2);
  P(g,'rgba(120,170,230,.05)',7*T,2*T,17*T,7*T);              // ambience kabin biru dingin
}

/* --- animasi hidup di jendela intip lantai 1 ---
   Latar lt.1 di jendela ini dipanggang statis (potret perabot), jadi supaya
   terasa "ada kehidupan di bawah" kita timpakan tiap frame: pendar hangat yang
   bernapas, debu naik dalam berkas cahaya, dan satu robot layanan yang meluncur
   pelan di lorong. Semuanya dijepit ke kolom terbuka baris 8 supaya rapi di
   dalam railing, dan diredupkan sesuai kedalaman agar menyatu dengan latarnya. */
function drawPeekLife(t){
  const y0=PEEK_Y0, hh=PEEK_HH, yb=y0+hh;
  cx.save();
  cx.beginPath();
  for(const tx of PEEK_COLS)cx.rect(tx*T,y0,T,hh);
  cx.clip();

  /* pendar hangat naik dari lantai bawah — bernapas pelan */
  cx.fillStyle=`rgba(255,206,132,${(0.06+0.035*Math.sin(t/1100)).toFixed(3)})`;
  cx.fillRect(0,y0,W,18);

  /* robot layanan meluncur di lorong lt.1 (bolak-balik pelan) */
  const span=PEEK_AX1-PEEK_AX0-24;
  const bx=Math.round(PEEK_AX0+12+(0.5+0.5*Math.sin(t/3400))*span);
  const by=y0+Math.round(hh*0.36);
  const dk=1-(by-y0)/hh*0.4;                        // makin dalam makin redup (halus)
  const C=(r,gg,b)=>`rgb(${Math.round(r*dk)},${Math.round(gg*dk)},${Math.round(b*dk)})`;
  const halo=cx.createRadialGradient(bx,by,1,bx,by,11);   // pendar lampu robot
  halo.addColorStop(0,`rgba(90,210,255,${(0.22*dk).toFixed(3)})`);
  halo.addColorStop(1,'rgba(90,210,255,0)');
  cx.fillStyle=halo;cx.fillRect(bx-11,by-11,22,22);
  cx.fillStyle='rgba(0,0,0,.32)';cx.fillRect(bx-5,by+4,10,2);  // bayangan
  cx.fillStyle=C(46,58,72);cx.fillRect(bx-5,by-3,10,6);        // badan
  cx.fillStyle=C(78,98,120);cx.fillRect(bx-5,by-3,10,1);       // kilap atas
  const on=Math.floor(t/380)%2;
  cx.fillStyle=on?C(90,226,255):C(30,110,140);
  cx.fillRect(bx-1,by-1,3,2);                                  // lampu kedip
  cx.fillStyle=`rgba(120,230,255,${(0.14*dk).toFixed(3)})`;    // sapuan sinar ke lantai
  cx.fillRect(bx-2,by+1,4,7);

  /* debu naik dalam berkas cahaya */
  const inner=PEEK_AX1-PEEK_AX0-12;
  for(let i=0;i<PEEK_MOTES;i++){
    const sp=7+(i%4)*3, prog=(t/1000*sp+i*53.7)%hh, my=yb-prog;
    const mx=PEEK_AX0+6+((i*97)%inner)+Math.round(3*Math.sin(t/1300+i));
    let a=0.6*(1-(my-y0)/hh);
    if(prog<10)a*=prog/10; else if(prog>hh-10)a*=(hh-prog)/10;
    if(a<=0.01)continue;
    cx.fillStyle=`rgba(255,228,176,${a.toFixed(3)})`;
    cx.fillRect(Math.round(mx),Math.round(my),1,1);
  }
  cx.restore();
}

buildBG2();

/* --- LIFT lantai 2 (kabin yang sama, indikator menunjuk turun) --- */
const lift2=mkLift(false);

/* --- MEJA ARSIP e-RDKK : PROJEKT-FER (satu ruangan dgn forge & bengkel) --- */
const rdkkT=furn(TOOLS[7].rect,14,(g,w,h)=>{
  /* monitor lembar kerja, ramping supaya meja tetap seukuran meja lain */
  P(g,'#2b3038',10,0,28,15);P(g,'#3a4252',10,0,28,1);          // bingkai
  P(g,'#0d1218',12,2,24,11);                                   // kaca
  P(g,'#1e2830',12,2,24,2);                                    // baris judul kolom
  for(let x=18;x<36;x+=8)P(g,'#1e2830',x,2,1,11);              // garis kolom
  P(g,'#c2f24a',35,3,1,1);                                     // LED daya
  /* meja arsip */
  P(g,'#4a5468',2,15,w-4,3);P(g,'#5a657c',2,15,w-4,1);         // permukaan
  P(g,'#39414f',4,18,w-8,h-21);                                // badan laci
  P(g,'#2a303c',4,h-3,w-8,3);                                  // sokle
  for(let i=0;i<2;i++){                                        // dua laci + gagang
    P(g,'#434c5e',7,20+i*5,w-14,3);P(g,'#8f98a8',20,21+i*5,8,1);
  }
  /* tumpukan formulir di kiri, karung pupuk di kanan */
  P(g,'#e8e4d8',2,10,8,5);P(g,'#cfcabb',2,10,8,1);
  P(g,'#9fb8d0',4,12,4,1);
  P(g,'#c9c2a8',39,8,7,7);P(g,'#b3ab90',39,8,7,1);
  P(g,'#4c7a00',40,11,5,3);P(g,'#6b9e12',40,11,5,1);
});
FURN.push(rdkkT);
anims.push({f:rdkkT,fn:(g,t)=>{                                // baris lembar kerja terisi satu per satu
  const x=rdkkT.px+13,y=rdkkT.py+5,n=Math.floor(t/430)%4;
  for(let i=0;i<n;i++){
    P(g,'#c2f24a',x,y+i*3,2,2);
    P(g,'#7f9e2e',x+3,y+i*3,10+((i*5)%8),2);
  }
  if(n<3&&Math.floor(t/500)%2)P(g,'#c2f24a',x+3,y+n*3,2,2);    // kursor kedip
  if(t%6400<220)P(g,'rgba(194,242,74,.16)',rdkkT.px+12,rdkkT.py+2,24,11); // kilat simpan
}});

/* --- MEJA PROPOSAL & PENJILIDAN : PROJECT ROPS --- */
const ropsT=furn(TOOLS[8].rect,16,(g,w,h)=>{
  /* mesin cetak proposal berdiri di belakang meja */
  P(g,'#2b3038',6,0,24,14);P(g,'#3a4252',6,0,24,1);            // badan mesin
  P(g,'#10141c',9,3,18,6);P(g,'#1a2230',9,3,18,1);             // panel kaca
  P(g,'#0d1218',9,11,18,2);                                    // celah keluar kertas
  P(g,'#454f61',6,13,24,1);                                    // ambang bawah
  /* cap & bantalan tinta di ujung kiri meja */
  P(g,'#8a5a3a',1,8,4,2);P(g,'#5a3a2a',2,10,2,3);              // gagang cap
  P(g,'#26262e',0,13,6,2);P(g,'#b83a2a',1,13,4,1);             // bantalan tinta
  /* tumpukan proposal terjilid di ujung kanan */
  P(g,'#e8e4d8',33,7,13,7);P(g,'#cfcabb',33,7,13,1);           // berkas
  P(g,'#a78bfa',33,7,2,7);                                     // punggung jilid
  P(g,'#9aa0aa',38,10,6,1);P(g,'#9aa0aa',38,12,4,1);           // baris teks sampul
  /* meja arsip */
  P(g,'#4a5468',1,14,w-2,3);P(g,'#5a657c',1,14,w-2,1);         // permukaan
  P(g,'#39414f',3,17,w-6,10);                                  // badan
  P(g,'#2a303c',3,27,w-6,2);                                   // sokle
  P(g,'#2a303c',4,29,3,3);P(g,'#2a303c',w-7,29,3,3);           // kaki
  P(g,'#434c5e',6,19,w-12,3);P(g,'#8f98a8',18,20,12,1);        // laci atas
  P(g,'#434c5e',6,23,w-12,3);P(g,'#8f98a8',18,24,12,1);        // laci bawah
});
FURN.push(ropsT);
anims.push({f:ropsT,fn:(g,t)=>{                                // naskah tersusun lalu tercetak
  const x=ropsT.px,y=ropsT.py;
  const n=Math.floor(t/380)%5;
  for(let i=0;i<n;i++)P(g,'#a78bfa',x+11,y+5+i,7+((i*3)%8),1); // baris naskah di panel
  if(Math.floor(t/500)%2)P(g,'#c9b6ff',x+26,y+4,1,1);          // LED daya kedip
  const cyc=t%3400,out=cyc<2200?Math.round(cyc/2200*6):0;      // lembar keluar dari celah
  if(out>0){
    P(g,'#f0ead8',x+12,y+13,12,out);
    P(g,'#cfcabb',x+12,y+12+out,12,1);
    for(let i=2;i<out;i+=2)P(g,'#9aa0aa',x+14,y+13+i,8,1);
  }
  if(cyc>2200&&cyc<2420)P(g,'rgba(167,139,250,.18)',x+9,y+3,18,6); // kilat selesai cetak
}});

/* --- MEJA CPCL PM AAS : daftar calon petani calon lokasi --- */
const cpclT=furn(TOOLS[9].rect,16,(g,w,h)=>{
  /* papan daftar CPCL berdiri di belakang meja */
  P(g,'#2b3038',4,0,26,14);P(g,'#3a4252',4,0,26,1);            // bingkai papan
  P(g,'#e8e4d8',6,2,22,11);P(g,'#5ab0f2',6,2,22,2);            // lembar daftar + kepala tabel
  P(g,'#cfcabb',16,4,1,9);                                     // garis pemisah kolom
  P(g,'#b9bec6',8,6,7,1);P(g,'#b9bec6',18,6,7,1);              // baris nama & luas
  P(g,'#b9bec6',8,8,8,1);P(g,'#b9bec6',18,8,6,1);
  P(g,'#b9bec6',8,10,6,1);P(g,'#b9bec6',18,10,8,1);
  P(g,'#454f61',4,13,26,1);                                    // ambang bawah papan
  /* karung benih & pupuk bertumpuk di ujung kanan meja */
  P(g,'#c9b98f',33,5,13,9);P(g,'#ddcfa6',33,5,13,1);           // karung besar
  P(g,'#8d7f5c',33,9,13,1);P(g,'#5ab0f2',36,11,7,1);           // jahitan & label
  P(g,'#b3a37c',35,1,9,4);P(g,'#c9b98f',35,1,9,1);             // karung kecil di atasnya
  /* timbangan di ujung kiri meja */
  P(g,'#39414f',0,10,4,4);P(g,'#8f98a8',0,9,4,1);
  /* meja arsip */
  P(g,'#4a5468',1,14,w-2,3);P(g,'#5a657c',1,14,w-2,1);         // permukaan
  P(g,'#39414f',3,17,w-6,10);                                  // badan
  P(g,'#2a303c',3,27,w-6,2);                                   // sokle
  P(g,'#2a303c',4,29,3,3);P(g,'#2a303c',w-7,29,3,3);           // kaki
  P(g,'#434c5e',6,19,w-12,3);P(g,'#8f98a8',18,20,12,1);        // laci atas
  P(g,'#434c5e',6,23,w-12,3);P(g,'#8f98a8',18,24,12,1);        // laci bawah
});
FURN.push(cpclT);
anims.push({f:cpclT,fn:(g,t)=>{                                // daftar terisi baris demi baris lalu dicap sah
  const x=cpclT.px,y=cpclT.py;
  const n=Math.floor(t/430)%4;
  for(let i=0;i<n;i++){
    P(g,'#5ab0f2',x+7,y+6+i*2,1,1);                            // centang di kolom nama
    P(g,'#7f8790',x+8,y+6+i*2,7+((i*5)%6),1);                  // baris terisi
    P(g,'#7f8790',x+18,y+6+i*2,5+((i*3)%5),1);                 // angka luas
  }
  if(n===3&&Math.floor(t/215)%2)
    P(g,'rgba(90,176,242,.5)',x+19,y+9,7,4);                   // cap berkedip
  if(Math.floor(t/620)%2)P(g,'#9ad4ff',x+28,y+3,1,1);          // LED papan
}});

/* --- rak arsip: punggung ordner warna acak tapi teredam (seed beda tiap rak) --- */
const ORD2=['#6e6857','#5d6773','#6a6272','#66705c','#77685e','#565f6a','#7d7462','#69737e'];
const arsipPaint=seed=>(g,w,h)=>{
  P(g,'#343945',0,0,w,h-2);P(g,'#414857',0,0,w,1);             // badan rak
  P(g,'#1e222a',0,h-2,w,2);                                    // kaki
  for(let r=0;r<4;r++){                                        // empat tingkat ordner
    const y=3+r*7;
    P(g,'#181c22',2,y,w-4,6);                                  // rongga rak
    for(let x=3,k=0;x<w-4;x+=3,k++)
      P(g,ORD2[(rnd(seed*31+x,r*17+k)>>4)%ORD2.length],x,y+1,2,4);
    P(g,'rgba(215,220,228,.13)',3,y+3,w-7,1);                  // pita label indeks
    P(g,'rgba(0,0,0,.28)',2,y+1,w-4,1);                        // bayangan dalam rak
    P(g,'#2a303a',2,y+6,w-4,1);                                // papan rak
  }
};
/* rak buku terisi rapat — spine warna arsip (coklat/tan/slate) jelas terlihat */
const BUKU=['#8a5a3a','#6e5a44','#5d6773','#3a5a4a','#7a4a52','#6a6272','#b09040','#4a6478'];
const bukuPaint=seed=>(g,w,h)=>{
  P(g,'#343945',0,0,w,h-2);P(g,'#414857',0,0,w,1);             // badan rak
  P(g,'#1e222a',0,h-2,w,2);                                    // kaki
  for(let r=0;r<4;r++){
    const y=3+r*7;
    P(g,'#181c22',2,y,w-4,6);                                  // rongga rak
    for(let x=2;x<w-2;x++){                                    // satu punggung buku per kolom (rapat)
      const c=BUKU[(rnd(seed*97+x*7,r*29+13)>>2)%BUKU.length];
      P(g,c,x,y+1,1,4);                                        // punggung tinggi tetap
    }
    P(g,'rgba(0,0,0,.30)',2,y+1,w-4,1);                        // bayangan atas rongga
    P(g,'rgba(215,220,228,.12)',3,y+3,w-7,1);                  // pita label indeks
    P(g,'#2a303a',2,y+6,w-4,1);                                // papan rak
  }
};
const arsipA=furn({x:8,y:2,w:1,h:1},18,bukuPaint(3));
const arsipB=furn({x:21,y:2,w:2,h:1},18,arsipPaint(11));
FURN.push(arsipA,arsipB);

/* --- mesin pemindai & penggandaan berkas (pengganti meja sortir) --- */
const kopirT=furn({x:7,y:2,w:1,h:1},12,(g,w,h)=>{
  P(g,'#39414f',1,4,w-2,h-6);P(g,'#4a5464',1,4,w-2,1);         // badan mesin
  P(g,'#262c36',1,h-2,w-2,2);                                  // sokle
  P(g,'#2b3039',2,0,w-4,5);P(g,'#3a4250',2,0,w-4,1);           // tutup pemindai
  P(g,'#10151d',3,2,w-6,2);                                    // kaca pemindai (anim menyapu)
  P(g,'#20262e',3,7,7,4);P(g,'#5d6773',4,8,3,1);               // panel kendali
  P(g,'#2e3540',11,7,3,4);                                     // layar kecil
  P(g,'#2a303a',2,13,w-4,3);P(g,'#e8e4d8',4,14,w-8,1);         // baki keluaran + kertas
  P(g,'#434c5e',2,18,w-4,4);P(g,'#8f98a8',6,20,5,1);           // laci kertas
});
FURN.push(kopirT);
anims.push({f:kopirT,fn:(g,t)=>{
  const x=kopirT.px,y=kopirT.py,gw=kopirT.canvas.width-6;
  const cyc=t%4200;
  if(cyc<1600){                                                // berkas lama dipindai
    P(g,'rgba(120,180,220,.16)',x+3,y+2,gw,2);
    P(g,'rgba(186,222,245,.55)',x+3+Math.round(cyc/1600*(gw-2)),y+2,2,2);
  }
  if(Math.floor(t/760)%2)P(g,'#7d8a68',x+4,y+8,1,1);           // LED siap
  if(cyc>1750&&cyc<3200){                                      // lembar hasil menumpuk di baki
    const n=Math.min(2,Math.floor((cyc-1750)/700)+1);
    for(let i=0;i<n;i++)P(g,'#f0ead8',x+4,y+14-i,gw-4,1);
  }
}});

/* --- troli dokumen, diparkir merapat sekat barat --- */
const troliT=furn({x:7,y:6,w:1,h:1},10,(g,w,h)=>{
  P(g,'#e8e4d8',3,0,10,4);P(g,'#cfcabb',3,0,10,1);             // tumpukan berkas atas
  P(g,'#9aa0aa',5,2,6,1);
  P(g,'#39414f',2,4,12,2);P(g,'#4a5464',2,4,12,1);             // papan rak atas
  P(g,'#2e3540',3,6,1,7);P(g,'#2e3540',12,6,1,7);              // tiang
  P(g,'#5a6675',1,5,1,9);                                      // gagang dorong
  P(g,'#d8d2c2',4,9,8,4);P(g,'#c2b8a0',4,9,8,1);               // tumpukan bawah
  P(g,'#39414f',2,13,12,2);                                    // papan rak bawah
  P(g,'#2a303a',3,15,2,3);P(g,'#2a303a',11,15,2,3);            // kaki
  P(g,'#171b21',3,18,2,2);P(g,'#171b21',11,18,2,2);            // roda
});
FURN.push(troliT);

/* --- dispenser & pot merapat dinding timur --- */
const airT=furn({x:23,y:2,w:1,h:1},8,(g,w,h)=>{
  P(g,'#c9d6e0',3,0,10,7);P(g,'#8fb8d0',4,1,8,5);              // galon
  P(g,'#39414f',2,7,12,h-9);P(g,'#4a5464',2,7,12,1);           // badan
  P(g,'#22262f',2,h-2,12,2);
  P(g,'#2ee0ff',5,11,2,2);P(g,'#e07a5a',9,11,2,2);             // kran dingin/panas
});
const potHall=furn({x:23,y:7,w:1,h:1},4,potPaint);
FURN.push(airT,potHall);

/* --- serambi lift: pot & peti kayu di sudut kanan pintu kabin --- */
const potU=furn({x:1,y:5,w:1,h:1},4,potPaint);
const petiU=furn({x:5,y:2,w:1,h:1},6,(g,w,h)=>{
  P(g,'#5a4632',1,2,14,h-4);P(g,'#6b543c',1,2,14,1);           // peti kayu
  P(g,'#3f3222',1,h-2,14,2);
  P(g,'#4a3a28',1,6,14,1);P(g,'#4a3a28',7,2,1,h-4);            // papan silang
});
FURN.push(potU,petiU);

/* --- robot arsiparis: menyusuri lorong depan rak, sesekali menarik ordner ---
   Digambar di lapisan anims (paling atas) supaya lengannya tetap terlihat saat
   menjulur ke dalam rak. Gerak & keadaannya dimajukan arcbotUpdate() di update(). */
const ARC_Y=3*T+8, ARC_X0=8*T+8, ARC_X1=22*T, ARC_STOPS=[8*T+8,22*T];  // ulang-alik antar dua rak buku (arsipA x8 · arsipB x21-22)
const arcbot={x:9*T,dir:1,state:'run',t:0,cool:0,ord:0};
function arcbotUpdate(dt){
  const a=arcbot;
  if(a.cool>0)a.cool=Math.max(0,a.cool-dt);
  if(a.state==='run'){
    a.x+=a.dir*24*dt;
    if(a.x>=ARC_X1){a.x=ARC_X1;a.dir=-1;}
    else if(a.x<=ARC_X0){a.x=ARC_X0;a.dir=1;}
    if(a.cool<=0)for(const st of ARC_STOPS)
      if(Math.abs(a.x-st)<2){a.x=st;a.state='pick';a.t=0;a.ord=(a.ord+1)%ORD2.length;break;}
  }else{
    a.t+=dt;
    if(a.t>3.4){a.state='run';a.t=0;a.cool=4;}                  // jeda sebelum berhenti lagi
  }
}
anims.push({fn:(g,t)=>{                                         // robot arsiparis gaya UFO (piring melayang)
  const a=arcbot,ax=Math.round(a.x),bob=Math.round(3*Math.sin(t/560)),ay=ARC_Y-12+bob; // melayang lebih tinggi
  if(a.state==='pick'){                                         // sinar penarik ke rak (ambil buku)
    const prog=Math.min(1,Math.min(a.t,3.4-a.t)/1.1);
    if(prog>0){
      const bh=Math.round(15*prog);
      for(let i=0;i<bh;i++){const wr=1+Math.round((i/bh)*3);     // kerucut melebar ke arah rak
        P(g,`rgba(150,230,255,${(0.07+0.12*prog).toFixed(3)})`,ax-wr,ay-4-i,wr*2,1);}
      if(a.t>1.4){const desc=Math.max(0,1-(a.t-1.4)/1.3);        // buku melayang turun ke piring
        P(g,BUKU[a.ord%BUKU.length],ax-2,ay-6-Math.round(bh*desc),4,4);}
    }
  }
  P(g,'rgba(0,0,0,.16)',ax-5,ARC_Y+12,10,2);                    // bayangan di lantai (jauh di bawah = mengapung tinggi)
  P(g,'#3a4250',ax-7,ay+1,14,2);P(g,'#2a303a',ax-4,ay+3,8,1);   // badan bawah piring
  P(g,'#5a6675',ax-7,ay-1,14,2);P(g,'#6a7686',ax-5,ay-1,10,1);  // badan atas piring
  P(g,'#7fc8e0',ax-2,ay-5,4,3);P(g,'#bff0ff',ax-1,ay-5,1,2);    // kubah kaca
  for(let k=0;k<3;k++)P(g,(Math.floor(t/240)+k)%3===0?'#c2f24a':'#4d5866',ax-4+k*4,ay+2,1,1); // lampu rim
  P(g,Math.floor(t/500)%2?'#8fd4e8':'#3a4a52',ax,ay+3,1,1);     // emitter tengah
}});

/* --- ambience lantai 2: kilau jendela, cuaca & debu --- */
anims.push({fn:(g,t)=>winShimmer(g,t,WINDOWS2)});
anims.push({fn:(g,t)=>drawWeather(g,t,WINDOWS2,9*T-4)});
anims.push({fn:(g,t)=>{                                        // debu di atas lantai dek
  for(let i=0;i<12;i++){
    const x=(i*151)%(W-48)+24+Math.sin(t/2400+i*1.7)*7;
    const y=((t/26+i*89)%(7*T))+2*T+4;
    const tx=Math.floor(x/T),ty=Math.floor(y/T);
    if(tx<0||ty<0||tx>=COLS||ty>=ROWS||MAP2[ty][tx]!=='.')continue;
    P(g,`rgba(226,214,190,${(.09+.05*Math.sin(t/650+i*1.3)).toFixed(3)})`,
      Math.round(x),Math.round(y),1,1);
  }
}});

/* selesai — simpan set lantai 2 */
FURNS.push(FURN);ANIMS.push(anims);

/* =========================================================================
   AREA LUAR (indeks 2) — sawah & desa poktan di balik pintu utama
   ========================================================================= */
const OUT_PATH=new Set();                                 // jalan tanah: tulang tengah + 2 cabang (asimetris)
for(let y=2;y<=16;y++)OUT_PATH.add('12,'+y);
for(let x=3;x<=12;x++)OUT_PATH.add(x+',10');             // cabang kiri → AREA SAMPLING
for(let x=12;x<=19;x++)OUT_PATH.add(x+',8');             // cabang kanan → tiang COOPERSTOWN
function buildBG3(){
  const g=bg3c;
  P(g,'#1c2f1a',0,0,W,H);                                 // dasar rumput gelap
  /* tanah & sawah (baris 0-1 = fasad, digambar terpisah setelah ini) */
  for(let ty=2;ty<ROWS;ty++)for(let tx=0;tx<COLS;tx++){
    const px=tx*T,py=ty*T,r=rnd(tx,ty)%16,cell=MAP3[ty][tx];
    if(cell==='#'){                                        // gundukan kebun: tanah + sayur + bunga
      P(g,'#5a3f28',px,py,T,T);                                        // tanah
      P(g,'#6e4f34',px,py,T,3);P(g,'#7a5836',px+2,py,T-4,1);          // punggung gundukan tersinari
      P(g,'#4a3018',px,py+T-2,T,2);                                    // dasar gelap
      for(let i=4;i<T;i+=5)P(g,'#4a3320',px,py+i,T,1);                 // alur/furrow
      const gv=rnd(tx,ty+5)%5;
      if(gv<3){P(g,'#3f7a34',px+3,py+4,4,4);P(g,'#59a848',px+4,py+4,2,2);}   // rumpun sayur
      if(gv>1){P(g,'#4a8f3a',px+9,py+8,4,3);P(g,'#6fc04a',px+10,py+8,2,1);}  // sayur ke-2
      const fl=rnd(tx+3,ty)%6, FC=['#f2c94c','#e8607a','#f0ead8','#c98ce0'];
      if(fl<3)P(g,FC[fl%4],px+((2+fl*3)%12)+1,py+2+((fl*5)%8),1,1);    // bunga
      if(fl===0)P(g,'#f2c94c',px+11,py+11,1,1);
    }else if(OUT_PATH.has(tx+','+ty)){
      P(g,'#7a5c3a',px,py,T,T);P(g,'#6e5233',px,py+T-2,T,2);           // jalan tanah
      if(r<4)P(g,'#8a6a44',px+(r%12),py+((r*3)%12),2,1);              // kerikil
    }else{
      const a=(tx+ty)&1;
      P(g,a?'#3f6b39':'#456f3e',px,py,T,T);                            // rumput
      if(r===0)P(g,'#548146',px+4,py+7,3,2);
      if(r===5)P(g,'#2f5230',px+9,py+3,2,3);
      if(r===9)P(g,'#6f9a52',px+2,py+10,2,1);                          // rumpun cerah
    }
  }
  /* pematang: garis tanah terang di batas air ↔ jalan/rumput */
  for(let ty=2;ty<ROWS-1;ty++)for(let tx=1;tx<COLS-1;tx++){
    if(MAP3[ty][tx]!=='#')continue;
    const px=tx*T,py=ty*T;
    if(MAP3[ty-1][tx]==='.')P(g,'#6e5836',px,py,T,2);
    if(MAP3[ty+1][tx]==='.')P(g,'#6e5836',px,py+T-2,T,2);
    if(MAP3[ty][tx-1]==='.')P(g,'#6e5836',px,py,2,T);
    if(MAP3[ty][tx+1]==='.')P(g,'#6e5836',px+T-2,py,2,T);
  }
  /* semak pinggir peta (kiri/kanan/bawah) */
  for(let tx=0;tx<COLS;tx++)P(g,'#25451f',tx*T,17*T,T,6);
  for(let ty=2;ty<18;ty++){P(g,'#25451f',0*T,ty*T,4,T);P(g,'#25451f',24*T-4,ty*T,4,T);}
  /* --- tepi hutan di sepanjang atas (backdrop) --- */
  (function(){
    P(g,'#142c17',0,0,W,22);                                          // massa hutan gelap
    for(let x=-2;x<W;x+=7){const hh=11+((x*13+7)%9);
      P(g,'#1e421f',x,0,5,hh);P(g,'#2a5a2a',x+1,2,3,hh-5);}           // pucuk pohon
    P(g,'#0e2011',0,20,W,3);                                          // bayang dasar hutan
  })();
  /* --- GEDUNG markas modern: berdiri di lapangan (± kolom 8-16) --- */
  (function(){
    const bx=8*T, bw=9*T, right=bx+bw;
    P(g,'rgba(0,0,0,.30)',bx+4,31,bw-2,4);                            // bayang di tanah
    P(g,'#5c6470',bx,4,bw,28);P(g,'#6e7784',bx,4,bw,2);              // badan beton
    P(g,'#474e58',right,5,4,27);P(g,'#3a404a',right,5,4,1);          // sisi kanan (kesan 3D)
    P(g,'#3c424b',bx-2,0,bw+6,5);P(g,'#4c545e',bx-2,0,bw+6,2);P(g,'#2b3038',bx-2,5,bw+6,1); // parapet atap
    const winCol=(x)=>{P(g,'#2b4a63',x,8,10,9);P(g,'#3f6f92',x,8,10,3);P(g,'#8fc0da',x+1,9,3,1);   // pane atas
      P(g,'#2b4a63',x,19,10,9);P(g,'#3f6f92',x,19,10,3);P(g,'#8fc0da',x+1,20,3,1);                 // pane bawah
      P(g,'#454c56',x-2,4,2,28);};                                                                  // mullion
    [bx+4,bx+18,right-28,right-14].forEach(winCol);                  // 2 jendela kiri, 2 kanan
    const dx=11*T, dw=3*T, dm=dx+Math.floor(dw/2);                    // pintu kaca modern tengah
    P(g,'#3a414b',dx-2,4,dw+4,28);P(g,'#1a2a33',dx,10,dw,22);        // portal + kaca gelap
    P(g,'#ffdd9a',dx+2,12,dw-4,18);                                   // cahaya lobi hangat
    for(let x=dx+2;x<dx+dw-2;x+=5)P(g,'rgba(180,210,230,.18)',x,12,1,18);
    P(g,'#2a3a44',dm-1,10,2,22);P(g,'#cfe0ea',dm-4,20,2,3);P(g,'#cfe0ea',dm+3,20,2,3); // pembagi + gagang
    P(g,'#8a929c',dx-4,4,dw+8,3);P(g,'#6e7680',dx-4,7,dw+8,1);       // kanopi beton datar
    P(g,'#8a929c',dx-6,32,dw+12,4);P(g,'#727a86',dx-6,32,dw+12,1);   // teras/apron beton di depan pintu
  })();
}
buildBG3();

/* --- perabot & animasi AREA LUAR --- */
FURN=[];anims=[];
/* AREA SAMPLING — menara pengawas kebakaran (fire lookout): rangka kayu tinggi + kabin kaca */
const ksaT=furn(TOOLS[3].rect,44,(g,w,h)=>{
  const yTop=27, yBot=h-2;
  const lx=y=>Math.round(16-(16-10)*(y-yTop)/(yBot-yTop));    // kaki kiri 16→10
  const rx=y=>Math.round(32+(38-32)*(y-yTop)/(yBot-yTop));    // kaki kanan 32→38
  for(let y=yTop;y<h;y++){const f=(y-yTop)/(h-yTop);          // kawat penambat (guy wires)
    P(g,'rgba(50,42,32,.35)',Math.round(15-15*f),y,1,1);P(g,'rgba(50,42,32,.35)',Math.round(33+14*f),y,1,1);}
  const yb0=yTop,step=(yBot-yb0)/3;                            // X-bracing 3 panel
  for(let p=0;p<3;p++){const ya=Math.round(yb0+p*step),yc=Math.round(yb0+(p+1)*step);
    for(let y=ya;y<=yc;y++){const f=(y-ya)/(yc-ya);
      P(g,'#4a3018',Math.round(lx(ya)+(rx(yc)-lx(ya))*f),y,1,1);
      P(g,'#4a3018',Math.round(rx(ya)+(lx(yc)-rx(ya))*f),y,1,1);}
    P(g,'#573a20',lx(ya),ya,rx(ya)-lx(ya),1);}                 // pengikat mendatar
  for(let y=yTop;y<=yBot;y++){P(g,'#6e4a2a',lx(y),y,2,1);P(g,'#6e4a2a',rx(y),y,2,1);   // kaki utama
    P(g,'#815a36',lx(y),y,1,1);P(g,'#815a36',rx(y),y,1,1);}
  P(g,'#573a20',lx(yBot),yBot-1,rx(yBot)-lx(yBot),2);          // pengikat dasar
  P(g,'#5a3c20',22,yTop,1,yBot-yTop);P(g,'#5a3c20',25,yTop,1,yBot-yTop);              // tangga
  for(let y=yTop+2;y<yBot;y+=3)P(g,'#6e4a2a',22,y,4,1);
  /* --- KABIN di puncak --- */
  P(g,'#7a5330',7,21,34,4);P(g,'#916440',7,21,34,1);P(g,'#4a3018',7,25,34,1);          // catwalk (balkon)
  P(g,'rgba(0,0,0,.3)',9,25,30,2);
  P(g,'#8a6a42',7,17,34,1);for(let x=9;x<40;x+=4)P(g,'#6e4a2a',x,17,1,4);              // railing balkon
  P(g,'#3a3020',12,9,24,9);P(g,'#3f6f92',13,10,22,7);                                   // rangka + kaca
  for(let x=13;x<35;x+=4)P(g,'#2b4a63',x,10,1,7);                                       // mullion
  P(g,'#ffdd9a',14,14,20,3);P(g,'#8fc0da',14,10,3,1);                                   // cahaya kabin + glint
  for(let yy=0;yy<8;yy++){const hw=6+yy*2.2;                                            // atap limas overhang
    P(g,yy<2?'#6e4030':(yy&1?'#5a3324':'#4d2b1e'),Math.round(24-hw),yy,Math.round(hw*2),1);}
  P(g,'#3a2016',6,8,36,1);                                                              // bayang tritisan
  /* --- dasar: kotak alat/generator (di tengah kaki) --- */
  P(g,'#33333d',18,h-11,12,10);P(g,'#454f61',18,h-11,12,2);P(g,'#2a2f38',18,h-1,12,1);
  P(g,'#3a4250',20,h-8,3,3);P(g,'#3a4250',25,h-8,3,3);                                   // panel
});
FURN.push(ksaT);
anims.push({fn:(g,t)=>{                                     // beacon atap + jendela kabin berdenyut
  if(Math.floor(t/600)%2)P(g,'#ff5a4a',ksaT.px+23,ksaT.py-1,2,2);                        // beacon merah puncak
  P(g,`rgba(255,221,150,${(0.22+0.18*Math.sin(t/1400)).toFixed(2)})`,ksaT.px+14,ksaT.py+14,20,3); // jendela
}});
/* COOPERSTOWN — tiang papan-nama jalan (kompak, tiap papan beda warna) */
const navT=furn(TOOLS[5].rect,24,(g,w,h)=>{
  const cxp=24;
  const sign=(cy,dir,label,col,hi)=>{                       // papan panah kecil berwarna
    const bw2=17,tip=4;
    if(dir<0){
      P(g,'#12222a',cxp-bw2-tip-1,cy-1,bw2+tip+2,8);        // outline gelap
      for(let i=0;i<tip;i++){const hh=Math.round((i+1)/tip*3);P(g,col,cxp-bw2-tip+i,cy+3-hh,1,2*hh+1);}
      P(g,col,cxp-bw2,cy,bw2,6);P(g,hi,cxp-bw2,cy,bw2,1);
      drawText(g,label,cxp-bw2+1,cy+1,'#f2fbff');
    }else{
      P(g,'#12222a',cxp-1,cy-1,bw2+tip+2,8);
      for(let i=0;i<tip;i++){const hh=Math.round((tip-i)/tip*3);P(g,col,cxp+bw2+i,cy+3-hh,1,2*hh+1);}
      P(g,col,cxp,cy,bw2,6);P(g,hi,cxp,cy,bw2,1);
      drawText(g,label,cxp+1,cy+1,'#f2fbff');
    }
  };
  P(g,'#173d31',22,4,4,h-6);P(g,'#245a48',22,4,2,h-6);     // tiang
  P(g,'#2e6f5a',20,3,8,2);P(g,'#173d31',21,1,6,2);         // rim + finial
  sign(6, +1,'TOWN','#1f7d86','#2fa1ab');                  // teal
  sign(14,-1,'CAFE','#b5643a','#d1834f');                  // cokelat-oranye
  sign(22,+1,'FARM','#4a8f3a','#67b04c');                  // hijau
  P(g,'#2a2018',20,h-3,8,3);                                // dasar cor
});
FURN.push(navT);
anims.push({fn:(g,t)=>{                                     // lampu surya kecil di puncak tiang
  P(g,`rgba(255,224,150,${(0.5+0.5*(0.5+0.5*Math.sin(t/700))).toFixed(2)})`,navT.px+23,navT.py+2,2,2);
}});
/* orang-orangan sawah (dekor, berdiri di petak sawah tengah-bawah) */
const scarecrow=furn({x:11,y:13,w:1,h:1},14,(g,w,h)=>{
  P(g,'#6e5233',7,10,2,h-10);                              // tiang
  P(g,'#8a6a42',2,13,12,2);                                // lengan
  P(g,'#c9b07a',4,4,8,7);P(g,'#b89a5a',4,4,8,2);           // baju karung
  P(g,'#d8c48a',6,0,4,4);P(g,'#9a7a3a',5,0,6,1);           // kepala + topi
  P(g,'#3a2a18',6,1,1,1);P(g,'#3a2a18',9,1,1,1);           // mata
});
FURN.push(scarecrow);
/* pepohonan mengisi lapangan (furnitur, urut kedalaman) — kanopi menyesuaikan ukuran kanvas */
const treePaint=seed=>(g,w,h)=>{
  const cx=w>>1, tw=Math.max(3,w>>3), ch=h-14;                       // pusat, lebar batang, tinggi kanopi
  P(g,'rgba(0,0,0,.16)',cx-(w>>2),h-3,w>>1,3);                       // bayang akar
  P(g,'#5a3f28',cx-(tw>>1),h-14,tw,14);P(g,'#6e4f34',cx-(tw>>1),h-14,Math.max(1,tw>>1),14); // batang
  P(g,'#1c3f18',2,3,w-4,ch-2);P(g,'#2a5f24',4,2,w-8,ch-6);          // massa daun
  P(g,'#357a2c',6,3,w-12,Math.floor(ch*0.5));P(g,'#4a9640',cx-4,4,8,Math.floor(ch*0.32)); // sorotan
  P(g,'#173015',3,ch-2,w-6,2);                                       // dasar kanopi gelap
  const cols=['#22521e','#2f6a28','#3f8a34','#54a044'];
  for(let k=0;k<(w>>1);k++){const rx=3+((k*97+seed*13)%(w-5)),ry=2+((k*53+seed*7)%(ch-2));
    P(g,cols[(k+seed)%4],rx,ry,2,2);}                                // tekstur daun
};
OUT_TREES.forEach(t=>{                                               // besar: 3-lebar/tinggi · kecil: 2-lebar
  const rect=t.big?{x:t.x-1,y:t.y,w:3,h:1}:{x:t.x,y:t.y,w:2,h:1};
  FURN.push(furn(rect,t.big?42:28,treePaint(t.s)));
});
/* --- ambience: kupu-kupu, kawanan burung, kabut tipis --- */
anims.push({fn:(g,t)=>{                                     // kupu-kupu + kawanan burung
  const CB=[[5,12,'#f2c94c'],[9,14,'#f2a2c9'],[14,12,'#a2d4f2'],[20,13,'#f0ead8']];
  CB.forEach((b,i)=>{const x=b[0]*T+Math.round(18*Math.sin(t/1400+i*2)),
    y=b[1]*T+Math.round(10*Math.sin(t/900+i)),fl=Math.floor(t/120+i)%2;
    P(g,b[2],x,y,1,1);P(g,b[2],x-1,y-(fl?1:0),1,1);P(g,b[2],x+1,y-(fl?1:0),1,1);
    P(g,'#3a2a20',x,y,1,1);});
  const bp=(t%16000)/16000;                                // kawanan burung lewat tiap ~16 dtk
  if(bp<0.5){const bx=Math.round(bp*2*W),by=3*T+Math.round(6*Math.sin(t/600));
    for(let n=0;n<4;n++){const x=bx-n*10;if(x<0||x>=W)continue;const fl=Math.floor(t/160+n)%2;
      P(g,'rgba(20,26,32,.7)',x,by,1,1);P(g,'rgba(20,26,32,.7)',x-1,by-(fl?1:0),1,1);
      P(g,'rgba(20,26,32,.7)',x+1,by-(fl?1:0),1,1);}}
}});
/* kabut area luar digambar di render() (ruang layar, dengan lubang bundar di sekitar dino) */
FURNS.push(FURN);ANIMS.push(anims);

/* kembalikan rujukan aktif ke lantai 1 */
FURN=FURNS[0];anims=ANIMS[0];

/* =========================================================================
   PEMAIN
   ========================================================================= */
const player={x:12.5*T,y:17*T+12,dir:'down',frame:0,animT:0,moving:false,path:null,
              pendTool:null,jumpT:0,sitting:null,pendSeat:null,pendJuke:null,pendLift:false,pendPortal:null};
const SPEED=62, JUMP_DUR=.45;
const cam={x:0,y:0};
const keys=new Set();
const KEYMAP={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',
              w:'up',s:'down',a:'left',d:'right',W:'up',S:'down',A:'left',D:'right'};

/* anak dino peliharaan — berkeliaran acak antar tile bebas */
const pet={x:6*T+8,y:15*T+12,tx:null,ty:null,timer:1,dir:1,frame:0,hopT:0,reactCd:0,
           mode:'wander',followT:0,repathT:0,path:null,moving:false,sleepT:0};
function petUpdate(dt){
  pet.reactCd=Math.max(0,pet.reactCd-dt);
  if(pet.hopT>0)pet.hopT=Math.max(0,pet.hopT-dt);
  pet.moving=false;
  const pdx=player.x-pet.x,pdy=player.y-pet.y,pd2=pdx*pdx+pdy*pdy;
  if(pet.sleepT>0){                                         // sedang tidur (bangun bila pemain dekat)
    if(pd2<40*40)pet.sleepT=0; else{pet.sleepT-=dt;return;}
  }
  /* dino utama mendekat → menyapa, dan sesekali memutuskan ikut berkeliling */
  if(pd2<20*20&&pet.reactCd<=0){
    pet.hopT=.4;pet.reactCd=1.6;
    if(Math.abs(pdx)>2)pet.dir=pdx>0?1:-1;
    beep(1050,.05,.04,'square',.03);beep(1450,.06,.03,'square',.09);
    if(pet.mode==='wander'&&Math.random()<.55){
      pet.mode='follow';pet.followT=10+Math.random()*10;
      pet.path=null;pet.repathT=0;pet.tx=null;
    }
  }
  /* --- mode teman: membuntuti, lalu menunggu saat pemain berhenti --- */
  if(pet.mode==='follow'){
    pet.followT-=dt;
    if(pet.followT<=0){pet.mode='wander';pet.path=null;pet.timer=.6;return;}
    if(pd2<26*26){                     // sudah di samping → berhenti & hadap pemain
      pet.path=null;
      if(Math.abs(pdx)>2)pet.dir=pdx>0?1:-1;
      return;
    }
    pet.repathT-=dt;                   // hitung ulang jalur berkala agar tak nyangkut dinding
    if(pet.repathT<=0||!pet.path||!pet.path.length){
      pet.repathT=.45;
      const [gx0,gy0]=ptile();
      pet.path=pathFrom(Math.floor(pet.x/T),Math.floor(pet.y/T),gx0,gy0);
      if(!pet.path){pet.mode='wander';pet.timer=.8;return;}  // tak terjangkau → jangan membeku
    }
    if(pet.path&&pet.path.length){
      const [gx,gy]=pet.path[0];
      const dx=gx-pet.x,dy=gy-pet.y,m=Math.hypot(dx,dy);
      if(m<1.5)pet.path.shift();
      else{const sp=46*dt;pet.x+=dx/m*sp;pet.y+=dy/m*sp;   // sedikit lebih lambat dari dino utama
        if(Math.abs(dx)>.5)pet.dir=dx>0?1:-1;pet.frame+=dt*7;pet.moving=true;}
    }
    return;
  }
  /* --- mode berkeliaran acak --- */
  if(pet.tx===null){
    pet.timer-=dt;
    if(pet.timer<=0){
      if(Math.random()<0.18){pet.sleepT=3+Math.random()*3;pet.timer=1;return;}  // sesekali tidur (Zzz)
      const ptx=Math.floor(pet.x/T),pty=Math.floor(pet.y/T);
      const opts=[[1,0],[-1,0],[0,1],[0,-1]]
        .map(d=>[ptx+d[0],pty+d[1]])
        .filter(([nx,ny])=>nx>0&&ny>0&&nx<COLS-1&&ny<ROWS-1&&!S(nx,ny));
      if(opts.length){const o=opts[(Math.random()*opts.length)|0];
        pet.tx=o[0]*T+8;pet.ty=o[1]*T+12;}
      else pet.timer=1;
    }
    return;
  }
  const dx=pet.tx-pet.x,dy=pet.ty-pet.y,m=Math.hypot(dx,dy);
  if(m<1){pet.x=pet.tx;pet.y=pet.ty;pet.tx=null;pet.timer=1+Math.random()*2.5;}
  else{const sp=26*dt;pet.x+=dx/m*sp;pet.y+=dy/m*sp;
    if(Math.abs(dx)>.5)pet.dir=dx>0?1:-1;pet.frame+=dt*6;pet.moving=true;}
}

/* robot pembersih — meluncur lurus, belok acak saat menabrak */
const bot={x:12*T+8,y:11*T+8,a:Math.random()*6.28};   // lorong tengah (lantai terbuka)
function botFree(px,py){
  const x0=Math.floor((px-5)/T),y0=Math.floor((py-3)/T),
        x1=Math.floor((px+4)/T),y1=Math.floor((py+2)/T);
  if(x0<0||y0<0||x1>=COLS||y1>=ROWS)return false;
  return !(S(x0,y0)||S(x1,y0)||S(x0,y1)||S(x1,y1));
}
function botUpdate(dt){
  const sp=22*dt;
  const nx=bot.x+Math.cos(bot.a)*sp,ny=bot.y+Math.sin(bot.a)*sp;
  if(botFree(nx,ny)){bot.x=nx;bot.y=ny;}
  else bot.a=Math.random()*6.28;
}

/* --- drone kargo: siklus antar-panen dari rak hidroponik ke pintu keluar ---
   idle → terbang ke rak → panen (peti nyangkut) → antar turun → jatuhkan → balik. */
const drone={x:200,y:128,state:'idle',t:0,crate:0,dz:0,da:0,rest:0,cargo:'panen'};
const DR_HOME=[200,128], DR_RACK=[200,56], DR_DROP=[205,250], DR_PAD=[200,163], DR_SPD=46;
const DR_CARGO=['panen','parts','docs','water'];             // ragam muatan drone
function drawCargo(ctx,x,y,type){
  const box={panen:'#7a5a34',parts:'#4a5566',docs:'#9a7a4a',water:'#3a5a8a'}[type];
  ctx.fillStyle=box;ctx.fillRect(x-3,y,7,5);
  ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(x-3,y,7,1);
  if(type==='panen'){ctx.fillStyle='#5aa84e';ctx.fillRect(x-2,y-1,2,1);ctx.fillRect(x+1,y-1,2,1);}   // sayuran nyembul
  else if(type==='parts'){ctx.fillStyle='#c9a24a';ctx.fillRect(x-1,y+2,3,1);}                        // strip logam
  else if(type==='docs'){ctx.fillStyle='#dfe6ee';ctx.fillRect(x-2,y+1,5,3);ctx.fillStyle='#4cc9e0';ctx.fillRect(x-1,y+2,3,1);} // berkas
  else{ctx.fillStyle='#8fc9e0';ctx.fillRect(x-2,y+1,5,3);}                                           // galon air
}
function droneUpdate(dt){
  const d=drone; d.t+=dt;
  const moveTo=(tx,ty)=>{const dx=tx-d.x,dy=ty-d.y,dist=Math.hypot(dx,dy),step=DR_SPD*dt;
    if(dist<=step){d.x=tx;d.y=ty;return true;} d.x+=dx/dist*step; d.y+=dy/dist*step; return false;};
  switch(d.state){
    case 'idle':    if(d.t>3){d.t=0;d.state=Math.random()<0.4?'landing':'toRack';} break; // sesekali parkir
    case 'landing': if(moveTo(DR_PAD[0],DR_PAD[1])){d.t=0;d.rest=5+Math.random()*4;d.state='parked';} break;
    case 'parked':  if(d.t>d.rest){d.t=0;d.state='takeoff';} break;        // rehat di holo-pad
    case 'takeoff': if(moveTo(DR_HOME[0],DR_HOME[1])){d.t=0;d.state='toRack';} break;
    case 'toRack':  if(moveTo(DR_RACK[0],DR_RACK[1])){d.t=0;d.state='harvest';} break;
    case 'harvest': if(d.t>1.2){d.crate=1;d.cargo=DR_CARGO[(Math.random()*4)|0];d.t=0;d.state='toDrop';} break; // muatan acak
    case 'toDrop':  if(moveTo(DR_DROP[0],DR_DROP[1])){d.crate=0;d.dz=0;d.da=1;d.t=0;d.state='drop';} break;
    case 'drop':    if(d.t>0.8){d.t=0;d.state='return';} break;            // peti dilepas → jatuh
    case 'return':  if(moveTo(DR_HOME[0],DR_HOME[1])){d.t=0;d.state='idle';} break;
  }
  if(d.da>0){d.dz=Math.min(d.dz+46*dt,12); d.da-=dt*0.7;}                   // peti jatuh lalu memudar
}

function boxFree(cxp,cyp){
  const x0=cxp-5,x1=cxp+4,y0=cyp-6,y1=cyp-1;
  for(const [px,py] of [[x0,y0],[x1,y0],[x0,y1],[x1,y1]]){
    const tx=Math.floor(px/T),ty=Math.floor(py/T);
    if(tx<0||ty<0||tx>=COLS||ty>=ROWS||S(tx,ty))return false;
  }
  return true;
}
function tryMove(dx,dy){
  if(dx&&boxFree(player.x+dx,player.y))player.x+=dx;
  if(dy&&boxFree(player.x,player.y+dy))player.y+=dy;
}
const ptile=()=>[Math.floor(player.x/T),Math.floor((player.y-3)/T)];

/* BFS jalur di grid */
function bfs(sx,sy){
  const dist=new Int16Array(COLS*ROWS).fill(-1),prev=new Int16Array(COLS*ROWS).fill(-1);
  const q=[sy*COLS+sx];dist[q[0]]=0;
  for(let i=0;i<q.length;i++){
    const cur=q[i],cxt=cur%COLS,cyt=(cur/COLS)|0;
    for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]]){
      const nx=cxt+dx,ny=cyt+dy;
      if(nx<0||ny<0||nx>=COLS||ny>=ROWS||S(nx,ny))continue;
      const n=ny*COLS+nx;
      if(dist[n]<0){dist[n]=dist[cur]+1;prev[n]=cur;q.push(n);}
    }
  }
  return {dist,prev};
}
function pathTo(tx,ty){
  const [sx,sy]=ptile();
  const {dist,prev}=bfs(sx,sy);
  let n=ty*COLS+tx;
  if(dist[n]<0)return null;
  const out=[];
  while(n!==sy*COLS+sx){out.push([(n%COLS)*T+8,((n/COLS)|0)*T+12]);n=prev[n];}
  return out.reverse();
}
/* jalur dari tile mana pun ke tile tujuan (dipakai peliharaan saat membuntuti) */
function pathFrom(sx,sy,tx,ty){
  if(sx<0||sy<0||sx>=COLS||sy>=ROWS||tx<0||ty<0||tx>=COLS||ty>=ROWS)return null;
  if(S(sx,sy)||S(tx,ty))return null;
  const {dist,prev}=bfs(sx,sy);
  let n=ty*COLS+tx;
  if(dist[n]<0)return null;
  const out=[];
  while(n!==sy*COLS+sx){out.push([(n%COLS)*T+8,((n/COLS)|0)*T+12]);n=prev[n];}
  return out.reverse();
}
function goToTool(tool){
  const [sx,sy]=ptile();
  const {dist}=bfs(sx,sy);
  let best=null,bd=1e9;
  for(const key in zoneOf){
    if(zoneOf[key]!==tool)continue;
    const [zx,zy]=key.split(',').map(Number);
    const d=dist[zy*COLS+zx];
    if(d>=0&&d<bd){bd=d;best=[zx,zy];}
  }
  if(!best)return;
  player.path=pathTo(best[0],best[1]);
  player.pendTool=tool;player.pendSeat=null;player.pendJuke=null;
}

/* ---------- duduk di kursi ---------- */
const seatAtFront=()=>{const [tx,ty]=ptile();return seatFront[tx+','+ty]||null;};
function sitDown(seat){
  player.sitting=seat;player.path=null;player.pendSeat=null;player.pendTool=null;
  player.x=seat.sx;player.y=seat.sy;player.dir=seat.dir||'down';player.moving=false;player.animT=0;
  beep(520,.08,.04);beep(680,.1,.03,'square',.07);
}
function standUp(){
  if(!player.sitting)return;
  const r=player.sitting.rect;player.sitting=null;
  player.x=(r.x+r.w/2)*T;player.y=(r.y-1)*T+12;      // kembali berdiri di tile depan kursi
  beep(430,.06,.03);
}
function goToSeat(seat){
  if(player.sitting)standUp();
  const r=seat.rect,[sx,sy]=ptile(),{dist}=bfs(sx,sy),ty=r.y-1;
  let best=null,bd=1e9;
  for(let x=r.x;x<r.x+r.w;x++){
    if(ty<0||S(x,ty))continue;
    const d=dist[ty*COLS+x];
    if(d>=0&&d<bd){bd=d;best=[x,ty];}
  }
  if(!best)return;
  if(bd===0){sitDown(seat);return;}                  // sudah berdiri tepat di depannya
  player.path=pathTo(best[0],best[1]);player.pendSeat=seat;player.pendTool=null;player.pendJuke=null;
}

/* ---------- jukebox ---------- */
const jukeFront={};
{const r=jukebox.rect,ty=r.y-1;
 for(let x=r.x;x<r.x+r.w;x++)if(ty>=0&&!S(x,ty))jukeFront[x+','+ty]=jukebox;}
const jukeAtFront=()=>{const [tx,ty]=ptile();return jukeFront[tx+','+ty]?jukebox:null;};
function goToJuke(){
  if(player.sitting)standUp();
  const r=jukebox.rect,[sx,sy]=ptile(),{dist}=bfs(sx,sy),ty=r.y-1;
  let best=null,bd=1e9;
  for(let x=r.x;x<r.x+r.w;x++){
    if(ty<0||S(x,ty))continue;const d=dist[ty*COLS+x];
    if(d>=0&&d<bd){bd=d;best=[x,ty];}
  }
  if(!best)return;
  if(bd===0){jukeCycle();return;}
  player.path=pathTo(best[0],best[1]);player.pendJuke=true;player.pendTool=null;player.pendSeat=null;
}

/* =========================================================================
   AUDIO — bip WebAudio kecil
   ========================================================================= */
let AC=null;
function beep(freq,dur=.08,vol=.05,type='square',delay=0){
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const o=AC.createOscillator(),g=AC.createGain();
    o.type=type;o.frequency.value=freq;
    g.gain.setValueAtTime(vol,AC.currentTime+delay);
    g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+delay+dur);
    o.connect(g);g.connect(AC.destination);
    o.start(AC.currentTime+delay);o.stop(AC.currentTime+delay+dur+.02);
  }catch(e){}
}

/* --- JUKEBOX: musik chiptune prosedural (tanpa file, offline) --- */
const HZ=n=>{const M={C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11};
  if(!n||n==='-')return 0;const o=+n.slice(-1),nm=n.slice(0,-1);
  return 440*Math.pow(2,((M[nm]+(o+1)*12)-69)/12);};
const TRACKS=[
  {name:'CHILL', bpm:84, lead:'triangle',
   bass:['A2','-','A2','-','F2','-','F2','-','C3','-','C3','-','G2','-','E2','-'],
   mel :['E4','-','C4','-','F4','-','A4','G4','E4','-','C4','-','D4','-','G4','-'],
   perc:[]},
  {name:'LO-FI', bpm:74, lead:'triangle',
   bass:['D2','-','D2','A2','G2','-','G2','-','C3','-','C3','G2','A2','-','A2','-'],
   mel :['F4','-','A4','-','C5','-','A4','G4','E4','-','G4','-','F4','-','-','-'],
   perc:['k','-','h','-','k','-','h','-','k','-','h','-','k','-','h','-']},
  {name:'UPBEAT',bpm:118,lead:'square',
   bass:['C3','C3','G2','G2','A2','A2','E2','E2','F2','F2','C3','C3','G2','G2','G2','B2'],
   mel :['C5','E5','G5','E5','A4','C5','E5','C5','F4','A4','C5','A4','G4','B4','D5','G5'],
   perc:['k','h','h','h','k','h','h','h','k','h','h','h','k','h','h','h']},
];
const music={on:false,track:0,step:0,next:0,timer:null,visT:0,gain:null};
function ensureAudio(){AC=AC||new (window.AudioContext||window.webkitAudioContext)();
  if(!music.gain){music.gain=AC.createGain();music.gain.gain.value=.5;music.gain.connect(AC.destination);}
  if(AC.state==='suspended')AC.resume();}
function tone(freq,t,dur,type,vol){if(!freq)return;const o=AC.createOscillator(),g=AC.createGain();
  o.type=type;o.frequency.setValueAtTime(freq,t);
  g.gain.setValueAtTime(.0005,t);g.gain.linearRampToValueAtTime(vol,t+.012);
  g.gain.exponentialRampToValueAtTime(.0005,t+dur);
  o.connect(g);g.connect(music.gain);o.start(t);o.stop(t+dur+.03);}
function kick(t){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';
  o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);
  g.gain.setValueAtTime(.16,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);
  o.connect(g);g.connect(music.gain);o.start(t);o.stop(t+.16);}
function hat(t){const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=7400;
  g.gain.setValueAtTime(.03,t);g.gain.exponentialRampToValueAtTime(.001,t+.025);
  o.connect(g);g.connect(music.gain);o.start(t);o.stop(t+.03);}
function musicSched(){const tr=TRACKS[music.track],sd=30/tr.bpm;   // durasi not 1/8
  while(music.next<AC.currentTime+0.15){
    const s=music.step%16,t=music.next;
    tone(HZ(tr.bass[s]),t,sd*.95,'triangle',.06);
    tone(HZ(tr.mel[s]), t,sd*.85,tr.lead,.045);
    const p=tr.perc[s];if(p==='k')kick(t);else if(p==='h')hat(t);
    music.next+=sd;music.step++;
  }}
function musicStart(){music.on=true;music.step=0;music.next=AC.currentTime+.06;
  clearInterval(music.timer);music.timer=setInterval(musicSched,25);musicSched();}
function musicStop(){music.on=false;clearInterval(music.timer);music.timer=null;}
function jukeCycle(){ensureAudio();
  if(!music.on){music.track=0;musicStart();beep(660,.05,.05);}
  else if(music.track<TRACKS.length-1){music.track++;music.step=0;music.next=AC.currentTime+.04;beep(780,.05,.05);}
  else{musicStop();beep(400,.06,.04);}}

/* =========================================================================
   HUD DOM: banner, menu
   ========================================================================= */
const banner=document.getElementById('banner'),
      bName=banner.querySelector('.name'),bDesc=banner.querySelector('.desc'),
      bSw=banner.querySelector('.swatch'),bKey=banner.querySelector('.key'),
      btnOpen=document.getElementById('btnOpen'),floorTag=document.getElementById('floorTag'),
      menu=document.getElementById('menu'),menuList=document.getElementById('menuList');
let activeTool=null,lastZone=null;

function setBanner(tool){
  if(tool===activeTool)return;
  activeTool=tool;
  if(!tool){banner.classList.remove('show');return;}
  bName.textContent=tool.name;bDesc.textContent=tool.desc;
  btnOpen.innerHTML=tool.btn||'BUKA &#9656;';
  bKey.textContent=tool.isLift?'[ENTER] UNTUK BERPINDAH LANTAI':
    tool.isPortal?'[ENTER] UNTUK LEWATI PINTU':'[ENTER] UNTUK MEMBUKA';
  bSw.style.background=tool.color;bSw.style.color=tool.color;
  banner.classList.add('show');
  beep(520,.05,.03);
}
function openTool(tool){
  if(tool.isLift){rideLift(tool.to);return;}
  if(tool.isPortal){startTravel(tool.to,tool.spawn);return;}    // pintu utama ↔ area luar
  beep(880,.07,.06);beep(1320,.1,.06,'square',.08);
  setTimeout(()=>{window.location.href=tool.url;},180);
}
btnOpen.addEventListener('click',()=>{if(activeTool)openTool(activeTool);});

TOOLS.forEach(t=>{
  const a=document.createElement('a');a.href=t.url;
  const sq=document.createElement('span');sq.className='sq';
  sq.style.background=t.color;sq.style.color=t.color;
  const mid=document.createElement('span');
  const nm=document.createElement('span');nm.className='nm';nm.textContent=t.name;
  const ds=document.createElement('span');ds.className='ds';
  ds.textContent=t.desc+['',' · lantai 2',' · area luar'][t.floor||0];
  mid.append(nm,document.createElement('br'),ds);
  const ar=document.createElement('span');ar.className='arrow';ar.textContent='▸';
  a.append(sq,mid,ar);
  a.addEventListener('click',()=>beep(880,.07,.05));
  menuList.appendChild(a);
});
const toggleMenu=(on)=>{menu.classList.toggle('open',on);if(on)beep(660,.05,.04);};
menu.querySelector('.close').addEventListener('click',()=>toggleMenu(false));
menu.addEventListener('click',e=>{if(e.target===menu)toggleMenu(false);});

/* =========================================================================
   LANTAI & LIFT — perpindahan antar denah
   ========================================================================= */
let floor=0;
const FADE_DUR=1.05, FADE_HALF=.5;
const fade={on:false,t:0,to:0,swapped:false,spawn:null};
const floorName=n=>['LANTAI 1 · RUANG KERJA','LANTAI 2 · RUANG ARSIP','LUAR · SAWAH & DESA POKTAN'][n];

/* tukar seluruh rujukan denah ke area n; tempatkan dino di `spawn` (bila ada)
   atau default tepat di depan pintu lift. spawn={x,y,dir} dalam piksel. */
function setFloor(n,spawn){
  floor=n;
  solid=SOLIDS[n];zoneOf=ZONES[n];FURN=FURNS[n];anims=ANIMS[n];ROOMS=ROOMSETS[n];
  ROOMS.forEach(r=>r.a=1);                        // kabut pekat lagi di area baru
  player.path=null;player.pendTool=null;player.pendSeat=null;
  player.pendJuke=null;player.pendLift=false;player.pendPortal=null;player.sitting=null;
  if(spawn){player.x=spawn.x;player.y=spawn.y;player.dir=spawn.dir||'down';}
  else{player.x=(LIFT_RECT.x+LIFT_RECT.w/2)*T;player.y=(LIFT_RECT.y+LIFT_RECT.h)*T+12;player.dir='down';}
  player.moving=false;player.animT=0;
  cam.x=cv.width>=W?(W-cv.width)/2:Math.max(0,Math.min(W-cv.width,player.x-cv.width/2));
  cam.y=cv.height>=H?(H-cv.height)/2:Math.max(0,Math.min(H-cv.height,player.y-8-cv.height/2));
  activeTool=null;lastZone=null;banner.classList.remove('show');
  floorTag.textContent=floorName(n);
}
/* perpindahan berfade umum (lift & pintu). spawn opsional membawa titik-muncul tujuan. */
function startTravel(to,spawn){
  if(fade.on||to===floor)return;
  if(player.sitting)standUp();
  player.path=null;player.pendTool=null;player.pendLift=false;player.pendPortal=null;
  fade.on=true;fade.t=0;fade.to=to;fade.spawn=spawn||null;fade.swapped=false;
  beep(430,.07,.05);beep(660,.08,.05,'square',.1);beep(880,.14,.05,'square',.22);
}
const rideLift=to=>startTravel(to,null);           // lift: spawn default di depan kabin
/* hampiri pintu lift lalu berpindah lantai setibanya di sana */
function goToLift(){
  if(player.sitting)standUp();
  const r=LIFT_RECT,ty=r.y+r.h,[sx,sy]=ptile(),{dist}=bfs(sx,sy);
  let best=null,bd=1e9;
  for(let x=r.x;x<r.x+r.w;x++){
    if(S(x,ty))continue;
    const d=dist[ty*COLS+x];
    if(d>=0&&d<bd){bd=d;best=[x,ty];}
  }
  if(!best)return;
  if(bd===0){rideLift(floor?0:1);return;}
  player.path=pathTo(best[0],best[1]);
  player.pendLift=true;player.pendTool=null;player.pendSeat=null;player.pendJuke=null;
}
/* hampiri ambang pintu utama lalu berpindah area setibanya di sana.
   dy<0: petak depan di atas rect (pintu lt.1) · dy>0: di bawah rect (fasad luar) */
function goToPortal(portal,rect,dy){
  if(player.sitting)standUp();
  const fy=dy<0?rect.y-1:rect.y+rect.h,[sx,sy]=ptile(),{dist}=bfs(sx,sy);
  let best=null,bd=1e9;
  for(let x=rect.x;x<rect.x+rect.w;x++){
    if(fy<0||fy>=ROWS||S(x,fy))continue;
    const d=dist[fy*COLS+x];if(d>=0&&d<bd){bd=d;best=[x,fy];}
  }
  if(!best)return;
  if(bd===0){startTravel(portal.to,portal.spawn);return;}
  player.path=pathTo(best[0],best[1]);
  player.pendPortal=portal;player.pendTool=null;player.pendSeat=null;player.pendJuke=null;player.pendLift=false;
}
/* tirai gelap selama kabin berjalan + papan nama lantai tujuan */
function drawFade(){
  if(!fade.on)return;
  const a=fade.t<FADE_HALF?fade.t/FADE_HALF
                          :Math.max(0,1-(fade.t-FADE_HALF)/(FADE_DUR-FADE_HALF));
  cx.setTransform(1,0,0,1,0,0);
  cx.fillStyle=`rgba(4,6,10,${Math.min(1,a).toFixed(3)})`;
  cx.fillRect(0,0,cv.width,cv.height);
  if(a>.55){
    const s=['1ST FLOOR','2ND FLOOR','OUTSIDE'][fade.to],k=2;
    cx.globalAlpha=Math.min(1,(a-.55)/.35);
    cx.setTransform(k,0,0,k,Math.round((cv.width-textW(s)*k)/2),Math.round(cv.height/2-3*k));
    drawText(cx,s,0,0,'#4ce0ff');
    cx.globalAlpha=1;
  }
  cx.setTransform(1,0,0,1,0,0);
}

/* =========================================================================
   INPUT
   ========================================================================= */
addEventListener('keydown',e=>{
  if(e.key==='Escape'){toggleMenu(false);return;}
  if(e.key==='m'||e.key==='M'){toggleMenu(!menu.classList.contains('open'));return;}
  if(menu.classList.contains('open'))return;
  if(KEYMAP[e.key]){keys.add(KEYMAP[e.key]);player.path=null;player.pendTool=null;
    player.pendSeat=null;e.preventDefault();}
  if(e.key===' '||e.key==='z'||e.key==='Z'){e.preventDefault();doJump();return;}
  if(e.key==='Enter'||e.key==='e'||e.key==='E'){
    e.preventDefault();
    if(player.sitting){standUp();return;}
    if(activeTool){openTool(activeTool);return;}
    const st=seatAtFront();if(st){sitDown(st);return;}   // berdiri di depan kursi → duduk
    if(jukeAtFront()){jukeCycle();return;}               // di depan jukebox → putar/ganti lagu
  }
});
addEventListener('keyup',e=>{if(KEYMAP[e.key])keys.delete(KEYMAP[e.key]);});

/* analog stick sentuh (kanan) — arah dipetakan ke 4 arah (sumbu dominan) */
const joy={on:false,x:0,y:0};
const stick=document.getElementById('stick'),knob=document.getElementById('knob');
let joyId=null,joyT0=0,joyMax=0;
function setKnob(dx,dy){knob.style.left=(36+dx)+'px';knob.style.top=(36+dy)+'px';}
function joyMove(e){
  const r=stick.getBoundingClientRect();
  let dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height/2);
  const m=Math.hypot(dx,dy),max=42;
  joyMax=Math.max(joyMax,m);
  if(m>max){dx*=max/m;dy*=max/m;}
  setKnob(dx,dy);
  if(m<10){joy.on=false;joy.x=joy.y=0;}
  else{joy.on=true;joy.x=dx/max;joy.y=dy/max;}
}
stick.addEventListener('pointerdown',e=>{
  joyId=e.pointerId;joyT0=performance.now();joyMax=0;
  try{stick.setPointerCapture(joyId);}catch(err){}
  player.path=null;player.pendTool=null;player.pendSeat=null;
  joyMove(e);e.preventDefault();
});
stick.addEventListener('pointermove',e=>{if(e.pointerId===joyId)joyMove(e);});
const joyEnd=e=>{
  if(e.pointerId!==joyId)return;
  joyId=null;joy.on=false;joy.x=joy.y=0;setKnob(0,0);
  /* ketukan singkat di analog = interaksi: buka tool, atau duduk/bangkit dari kursi */
  if(performance.now()-joyT0<300&&joyMax<12){
    if(player.sitting)standUp();
    else if(activeTool)openTool(activeTool);
    else{const st=seatAtFront();if(st)sitDown(st);else if(jukeAtFront())jukeCycle();}
  }
};
stick.addEventListener('pointerup',joyEnd);stick.addEventListener('pointercancel',joyEnd);
/* tombol lompat terpisah (kiri) */
document.getElementById('btnJump').addEventListener('pointerdown',e=>{
  e.preventDefault();doJump();
});

/* lompat */
function doJump(){
  if(player.sitting){standUp();return;}
  if(player.jumpT>0)return;
  player.jumpT=JUMP_DUR;
  beep(300,.06,.05);beep(520,.1,.04,'square',.05);
}

/* ketuk kanvas: menuju meja / berjalan ke titik */
cv.addEventListener('pointerdown',e=>{
  const r=cv.getBoundingClientRect();
  const mx=(e.clientX-r.left)/r.width*cv.width+cam.x, my=(e.clientY-r.top)/r.height*cv.height+cam.y;
  const tx=Math.floor(mx/T),ty=Math.floor(my/T);
  /* kena pintu lift? hampiri lalu naik/turun */
  {const rc=LIFT_RECT;
   if(tx>=rc.x&&tx<rc.x+rc.w&&ty>=rc.y-1&&ty<=rc.y+rc.h){
     if(activeTool&&activeTool.isLift){rideLift(activeTool.to);return;}
     goToLift();beep(440,.04,.03);return;}}
  /* kena pintu utama (lt.1) → keluar; atau pintu markas (luar) → masuk */
  if(floor===0&&tx>=PRIME_DOOR.x&&tx<PRIME_DOOR.x+PRIME_DOOR.w&&ty>=PRIME_DOOR.y-2&&ty<=PRIME_DOOR.y){
    if(activeTool&&activeTool.isPortal){startTravel(activeTool.to,activeTool.spawn);return;}
    goToPortal(DOOR_OUT,PRIME_DOOR,-1);beep(440,.04,.03);return;}
  if(floor===2&&tx>=OUT_DOOR.x&&tx<OUT_DOOR.x+OUT_DOOR.w&&ty>=OUT_DOOR.y&&ty<=OUT_DOOR.y+2){
    if(activeTool&&activeTool.isPortal){startTravel(activeTool.to,activeTool.spawn);return;}
    goToPortal(DOOR_IN,OUT_DOOR,1);beep(440,.04,.03);return;}
  /* kena furnitur tool (toleransi 1 tile utk label/overhang)? */
  for(const t of TOOLS){
    if((t.floor||0)!==floor)continue;
    const rc=t.rect;
    if(tx>=rc.x-1&&tx<rc.x+rc.w+1&&ty>=rc.y-2&&ty<rc.y+rc.h+1){
      if(activeTool===t){openTool(t);return;}                   // sudah di dekatnya → buka
      goToTool(t);beep(440,.04,.03);return;
    }
  }
  /* kena kursi? hampiri lalu duduk (perabot lounge hanya ada di lantai 1) */
  if(floor===0)for(const s of SEATS){
    const rc=s.rect;
    if(tx>=rc.x&&tx<rc.x+rc.w&&ty>=rc.y&&ty<rc.y+rc.h){
      goToSeat(s);beep(440,.04,.03);return;
    }
  }
  /* kena jukebox? hampiri lalu putar */
  if(floor===0){const rc=jukebox.rect;
   if(tx>=rc.x-1&&tx<rc.x+rc.w&&ty>=rc.y-1&&ty<rc.y+rc.h){goToJuke();beep(440,.04,.03);return;}}
  if(tx>=0&&ty>=0&&tx<COLS&&ty<ROWS&&!S(tx,ty)){
    const p=pathTo(tx,ty);
    if(p){if(player.sitting)standUp();
      player.path=pathTo(tx,ty);player.pendTool=null;player.pendSeat=null;player.pendJuke=null;beep(330,.03,.02);}
  }
});

/* =========================================================================
   LOOP UTAMA
   ========================================================================= */
function update(dt){
  if(fade.on){                                        // kabin lift berjalan: permainan membeku
    fade.t+=dt;
    if(!fade.swapped&&fade.t>=FADE_HALF){setFloor(fade.to,fade.spawn);fade.swapped=true;}
    if(fade.t>=FADE_DUR)fade.on=false;
    return;
  }
  if(player.sitting&&(keys.size||joy.on))standUp();   // input gerak apa pun = bangkit
  let vx=0,vy=0;
  if(player.sitting){/* diam di kursi */}
  else if(keys.size){
    if(keys.has('left'))vx=-1;else if(keys.has('right'))vx=1;
    if(keys.has('up'))vy=-1;else if(keys.has('down'))vy=1;
    if(vx&&vy)vy=0;                                            // 4 arah klasik, tanpa diagonal
  }else if(joy.on){
    /* analog → sumbu dominan, tetap 4 arah */
    if(Math.abs(joy.x)>=Math.abs(joy.y))vx=Math.sign(joy.x);else vy=Math.sign(joy.y);
  }else if(player.path&&player.path.length){
    const [gx,gy]=player.path[0];
    const dx=gx-player.x,dy=gy-player.y;
    if(Math.abs(dx)<=1.2&&Math.abs(dy)<=1.2){
      player.x=gx;player.y=gy;player.path.shift();
      const arrived=!player.path.length;                       // simpan: rideLift/startTravel bisa nol-kan path
      if(arrived&&player.pendTool){
        const t=player.pendTool,rc=t.rect;                     // hadap ke meja
        const fx=(rc.x+rc.w/2)*T-player.x,fy=(rc.y+rc.h/2)*T-player.y;
        player.dir=Math.abs(fx)>Math.abs(fy)?(fx>0?'right':'left'):(fy>0?'down':'up');
        player.pendTool=null;beep(600,.05,.04);
      }
      if(arrived&&player.pendSeat)sitDown(player.pendSeat);
      if(arrived&&player.pendJuke){player.pendJuke=null;player.dir='up';jukeCycle();}
      if(arrived&&player.pendLift){player.pendLift=false;player.dir='up';rideLift(floor?0:1);}
      if(arrived&&player.pendPortal){const p=player.pendPortal;player.pendPortal=null;
        player.dir=p===DOOR_OUT?'down':'up';startTravel(p.to,p.spawn);}
    }else{
      if(Math.abs(dx)>Math.abs(dy))vx=Math.sign(dx);else vy=Math.sign(dy);
    }
  }
  const mag=Math.hypot(vx,vy);
  player.moving=mag>.15;
  if(player.moving){
    if(Math.abs(vx)>=Math.abs(vy))player.dir=vx<0?'left':'right';
    else player.dir=vy<0?'up':'down';
    const step=SPEED*dt;
    tryMove(vx*step,vy*step);
    player.animT+=dt*Math.min(1.2,mag+.2);
  }else player.animT=0;
  if(player.jumpT>0)player.jumpT=Math.max(0,player.jumpT-dt);
  if(floor===0){petUpdate(dt);botUpdate(dt);droneUpdate(dt);}   // penghuni lt.1
  else if(floor===1)arcbotUpdate(dt);                          // robot arsiparis lt.2
  /* area luar (2): kehidupan lewat anims (kilau air, kupu-kupu, burung) — tanpa update khusus */
  if(music.on){music.visT+=dt;const beat=60/TRACKS[music.track].bpm;   // pet ikut goyang tiap ketukan
    if(music.visT>=beat){music.visT-=beat;if(pet.hopT<=0)pet.hopT=.4;}}

  /* kamera mengikuti dino (rapat saat kanvas lebih kecil dari ruangan) */
  const tcx=cv.width>=W?(W-cv.width)/2:Math.max(0,Math.min(W-cv.width,player.x-cv.width/2));
  const tcy=cv.height>=H?(H-cv.height)/2:Math.max(0,Math.min(H-cv.height,player.y-8-cv.height/2));
  const ck=Math.min(1,dt*8);
  cam.x+=(tcx-cam.x)*ck;cam.y+=(tcy-cam.y)*ck;

  /* zona interaksi */
  const [tx,ty]=ptile();
  const z=zoneOf[tx+','+ty]||null;
  if(z!==lastZone){lastZone=z;setBanner(z);}

  /* kabut perang: petak yang ditempati dino meredup, sisanya menggelap lagi */
  if(fogOn){
    const k=Math.min(1,dt*2.6);                       // ~0,4 dtk transisi
    for(const r of ROOMS){
      const di=tx>=r.x&&tx<r.x+r.w&&ty>=r.y&&ty<r.y+r.h;
      r.a+=((di?0:1)-r.a)*k;
    }
  }
}

function render(t){
  cx.setTransform(1,0,0,1,0,0);
  cx.fillStyle='#080b11';cx.fillRect(0,0,cv.width,cv.height);
  cx.translate(-Math.round(cam.x),-Math.round(cam.y));
  cx.drawImage([bg,bg2,bg3][floor],0,0);
  if(floor===1)drawPeekLife(t);                    // kehidupan di jendela intip lt.1
  if(floor===0){
    /* bayangan drone — mengikuti posisinya (rapat saat parkir), di bawah semua objek */
    cx.fillStyle='rgba(0,0,0,.20)';
    cx.fillRect(Math.round(drone.x)-5,Math.round(drone.y)+(drone.state==='parked'?8:22),10,2);
    /* robot pembersih (rata lantai, di bawah furnitur) */
    const bx=Math.round(bot.x),by=Math.round(bot.y);
    cx.fillStyle='rgba(0,0,0,.25)';cx.fillRect(bx-5,by+3,10,2);
    cx.fillStyle='#26303c';cx.fillRect(bx-5,by-3,10,6);
    cx.fillStyle='#39414f';cx.fillRect(bx-5,by-3,10,2);
    cx.fillStyle=Math.floor(t/400)%2?'#2ee0ff':'#1a7f99';cx.fillRect(bx+2,by-1,2,2);
  }
  /* label nama di atas tiap furnitur */
  for(const tool of TOOLS){
    if((tool.floor||0)!==floor)continue;
    const rc=tool.rect,near=(activeTool===tool);
    const label=tool.short||tool.name,wpx=textW(label)+4;
    let lx=Math.round((rc.x+rc.w/2)*T-wpx/2);
    lx=Math.max(2,Math.min(W-wpx-2,lx));
    const bob=near?(Math.floor(t/280)%2):0;
    /* tinggi overhang tiap stasiun (urut TOOLS) — label duduk tepat di atas artnya */
    const ly=rc.y*T-(tool.lo||12)-9-bob;
    cx.fillStyle=near?'rgba(6,14,20,.92)':'rgba(5,9,14,.62)';
    cx.fillRect(lx,ly,wpx,9);
    if(near){cx.fillStyle=tool.color;cx.fillRect(lx,ly+8,wpx,1);}
    drawText(cx,label,lx+2,ly+2,near?tool.color:'#8fa3b8');
  }
  /* gambar furnitur & pemain urut kedalaman */
  const items=FURN.map(f=>({y:f.baseY,draw:()=>cx.drawImage(f.canvas,f.px,f.py)}));
  items.push({y:player.y,draw:()=>{
    if(player.sitting){
      if(player.sitting.dir==='up'){          // hadap TV: punggung ke kita, badan bawah ketutup sofa
        const spr=SPR.up[0];
        cx.drawImage(spr,Math.round(player.x)-(spr.width>>1),Math.round(player.y)-16);
      }else{                                   // hadap kita: kaki disembunyikan di balik dudukan
        const spr=SPR.down[0];
        cx.drawImage(spr,0,0,spr.width,13,
          Math.round(player.x)-(spr.width>>1),Math.round(player.y)-19,spr.width,13);
      }
      return;
    }
    const jp=player.jumpT>0?Math.sin(Math.PI*(1-player.jumpT/JUMP_DUR))*10:0;
    const sw2=jp>2?6:10;                                       // bayangan mengecil di udara
    cx.fillStyle='rgba(0,0,0,.28)';
    cx.fillRect(Math.round(player.x)-sw2/2,Math.round(player.y)-2,sw2,3);
    const fr=jp>0?0:(player.moving?[1,0,2,0][Math.floor(player.animT*8)%4]:0);
    const spr=SPR[player.dir][fr];
    cx.drawImage(spr,Math.round(player.x)-(spr.width>>1),Math.round(player.y)-16-Math.round(jp));
  }});
  if(floor===0)items.push({y:pet.y,draw:()=>{
    const hop=pet.hopT>0?Math.sin(Math.PI*(1-pet.hopT/.4))*6:0;
    cx.fillStyle='rgba(0,0,0,.25)';
    cx.fillRect(Math.round(pet.x)-(hop>2?2:3),Math.round(pet.y)-1,hop>2?4:6,2);
    const pf=pet.moving?Math.floor(pet.frame)%2:0;
    cx.drawImage(pet.dir>0?PETSPR.r[pf]:PETSPR.l[pf],Math.round(pet.x)-4,Math.round(pet.y)-8-Math.round(hop));
    if(pet.sleepT>0){                                           // Zzz mengambang saat tidur
      const zx=Math.round(pet.x)+3,zy=Math.round(pet.y)-13-(Math.floor(t/500)%2);
      cx.fillStyle='rgba(200,220,240,.85)';
      cx.fillRect(zx,zy,3,1);cx.fillRect(zx+2,zy+1,1,1);cx.fillRect(zx,zy+2,3,1);
    }
  }});
  items.sort((a,b)=>a.y-b.y).forEach(i=>i.draw());
  /* drone kargo antar-panen — digambar setelah pemain (terbang di atas kepala) */
  if(floor===0){
    const d=drone,parked=d.state==='parked';
    const cxp=Math.round(d.x),dy=Math.round(d.y)+(parked?0:Math.round(Math.sin(t/380)*2));
    if(parked){                                                        // baling diam saat parkir
      cx.fillStyle='#4a5666';cx.fillRect(cxp-9,dy-1,5,1);cx.fillRect(cxp+4,dy-1,5,1);
      cx.fillStyle='#26303c';cx.fillRect(cxp-4,dy+4,1,2);cx.fillRect(cxp+3,dy+4,1,2); // kaki pendarat
    }else{
      const rf=Math.floor(t/50)%2;
      cx.fillStyle=rf?'#8fa3b8':'#5a6b7d';cx.fillRect(cxp-9,dy-1,5,1);   // baling kiri
      cx.fillStyle=rf?'#5a6b7d':'#8fa3b8';cx.fillRect(cxp+4,dy-1,5,1);   // baling kanan
    }
    cx.fillStyle='#26303c';cx.fillRect(cxp-5,dy,10,4);                 // badan
    cx.fillStyle='#39414f';cx.fillRect(cxp-5,dy,10,1);
    cx.fillStyle=(parked?Math.floor(t/700)%2:Math.floor(t/300)%2)?'#2ee0ff':'#1a7f99';
    cx.fillRect(cxp-1,dy+1,2,2);                                       // lampu (standby lebih pelan saat parkir)
    if(!parked)cx.fillStyle='#3a4652',cx.fillRect(cxp,dy+4,1,2);       // tali kait (saat terbang)
    if(d.crate)drawCargo(cx,cxp,dy+6,d.cargo);                        // membawa muatan (ragam)
  }
  /* muatan yang dijatuhkan di dekat pintu → mendarat lalu memudar */
  if(floor===0&&drone.da>0){
    cx.globalAlpha=Math.max(0,Math.min(1,drone.da));
    drawCargo(cx,DR_DROP[0],DR_DROP[1]+8+Math.round(drone.dz),drone.cargo);
    cx.globalAlpha=1;
  }
  /* overlay animasi furnitur (layar, api, dll) */
  for(const a of anims)a.fn(cx,t);
  /* penanda zona aktif: panah kecil di atas kepala */
  if(activeTool){
    const jpNow=player.jumpT>0?Math.sin(Math.PI*(1-player.jumpT/JUMP_DUR))*10:0;
    const yy=Math.round(player.y)-22-Math.round(jpNow)+(Math.floor(t/240)%2);
    cx.fillStyle=activeTool.color;
    cx.fillRect(Math.round(player.x)-1,yy,2,2);
  }

  /* suasana interior ikut waktu — grade warna tipis di atas seluruh ruang */
  if(daylight.tint[3]>.003){
    const tn=daylight.tint;
    cx.setTransform(1,0,0,1,0,0);
    cx.fillStyle=`rgba(${tn[0]|0},${tn[1]|0},${tn[2]|0},${tn[3].toFixed(3)})`;
    cx.fillRect(0,0,cv.width,cv.height);
    cx.translate(-Math.round(cam.x),-Math.round(cam.y));
  }
  /* kabut perang paling akhir: petak gelap dilubangi halo di sekitar dino */
  if(fogOn){
    const g=fogCv.getContext('2d'),ox=Math.round(cam.x),oy=Math.round(cam.y);
    g.setTransform(1,0,0,1,0,0);
    g.clearRect(0,0,fogCv.width,fogCv.height);
    g.globalCompositeOperation='source-over';
    for(const r of ROOMS){
      if(r.a<=.004)continue;
      g.fillStyle=`rgba(8,11,17,${r.a.toFixed(3)})`;
      g.fillRect(r.x*T-ox,r.y*T-oy,r.w*T,r.h*T);
    }
    const hx=Math.round(player.x)-ox,hy=Math.round(player.y)-8-oy,R=34;
    const grd=g.createRadialGradient(hx,hy,6,hx,hy,R);   // halo ikut ke mana dino pergi
    grd.addColorStop(0,'rgba(0,0,0,1)');
    grd.addColorStop(1,'rgba(0,0,0,0)');
    g.globalCompositeOperation='destination-out';
    g.fillStyle=grd;g.fillRect(hx-R,hy-R,R*2,R*2);
    cx.setTransform(1,0,0,1,0,0);
    cx.drawImage(fogCv,0,0);
  }
  drawFade();                                    // tirai perpindahan lantai paling atas
}

let last=0, skyBucket=-1, rafId=0;
function tickSky(){
  daylight=daylightAt(curHour());                 // halus tiap frame (untuk grade warna)
  const b=Math.round(curHour()*10);               // langit terpanggang ulang tiap ~6 menit
  if(b!==skyBucket){skyBucket=b;buildBG();buildBG2();buildBG3();}
}
tickSky();
function loop(ts){
  rafId=0;
  const dt=Math.min(.05,(ts-last)/1000)||0;last=ts;
  tickSky();update(dt);render(ts);
  if(!document.hidden)rafId=requestAnimationFrame(loop);   // berhenti saat tab tersembunyi
}
document.addEventListener('visibilitychange',()=>{         // lanjut render saat tab kembali aktif
  if(document.hidden){if(rafId)cancelAnimationFrame(rafId);rafId=0;return;}
  if(!rafId){last=performance.now();rafId=requestAnimationFrame(loop);}
});
rafId=requestAnimationFrame(loop);

/* ---------- skala kanvas ----------
   Desktop : seluruh ruangan tampak, kanvas di-skala ke jendela.
   Mobile  : fullscreen + zoom, kamera mengikuti dino (scene bergeser). */
function isMobile(){
  return matchMedia('(pointer:coarse)').matches||Math.min(innerWidth,innerHeight)<520;
}
function fit(){
  const vw=innerWidth,vh=innerHeight;
  document.body.classList.toggle('mobile',isMobile());
  fogOn=isMobile();                        // kabut perang hanya di layar sentuh/zoom
  if(isMobile()){
    const Z=Math.max(2,Math.round(Math.min(vw,vh)/110));
    cv.width=Math.ceil(vw/Z);cv.height=Math.ceil(vh/Z);
    cv.style.width=vw+'px';cv.style.height=vh+'px';
  }else{
    cv.width=W;cv.height=H;
    let s=Math.min((vw-12)/W,(vh-150)/H);
    s=s>=2?Math.floor(s):Math.max(.8,Math.floor(s*4)/4);
    cv.style.width=(W*s)+'px';cv.style.height=(H*s)+'px';
  }
  fogCv.width=cv.width;fogCv.height=cv.height;   // lapisan kabut seukuran kanvas
  cx.imageSmoothingEnabled=false;
}
addEventListener('resize',fit);fit();

/* akses debug (dipakai pengujian otomatis; hanya di localhost, absen di produksi) */
if(location.hostname==='localhost'||location.hostname==='127.0.0.1'||location.protocol==='file:')
window.HQDBG={player,keys,cam,goToTool,TOOLS,S,ptile,SPR,pet,bot,ROOMS:()=>ROOMS,
              floor:()=>floor,setFloor,rideLift,startTravel,goToLift,LIFT_RECT,MAP2,MAP3,SOLIDS,ZONES,FURNS,fade,arcbot,
              PRIME_DOOR,OUT_DOOR,DOOR_OUT,DOOR_IN,buildBG3,
              fog:()=>fogOn,SEATS,goToSeat,sitDown,standUp,seatAtFront,
              music,jukebox,jukeCycle,jukeAtFront,goToJuke,TRACKS,
              setHour:h=>{forcedHour=h;skyBucket=-1;tickSky();render(performance.now());},
              daylight:()=>daylight,buildBG,weather,WINDOWS,GROW,GROW_DUR,SPECIES,drone,droneUpdate,DR_RACK,DR_DROP,
              render:()=>render(performance.now()),
              step:(n=1,d=1/60)=>{for(let i=0;i<n;i++){update(d);render(performance.now());}}};

/* ---------- service worker (offline / PWA) ---------- */
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'))
  navigator.serviceWorker.register('./sw.js').catch(()=>{});
