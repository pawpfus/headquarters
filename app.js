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
  {x:2,y:9, w:6,h:1},                                          // rak pembibitan: pemisah EVIDENCE (atas) ↔ lounge (bawah), celah di kanan (kolom 8-9)
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
  {x:1,y:8,s:6},{x:2,y:7,sap:1,s:7},{x:1,y:16,s:8},{x:23,y:8,s:9},{x:20,y:6,mangga:1,s:10},{x:23,y:16,s:11},
  {x:6,y:6,mangga:1,s:12},{x:9,y:8,s:13},{x:14,y:11,s:14},{x:22,y:9,s:15},{x:18,y:12,mangga:1,s:16},
  {x:13,y:4,s:17},{x:6,y:13,s:18},
  {x:5,y:5,sap:1,s:19},{x:9,y:11,sap:1,s:20},{x:11,y:17,s:21},{x:16,y:16,sap:1,s:22},{x:4,y:17,s:23},
];
/* papan info poktan — objek yang bisa "dibaca" (banner memutar pesan) */
const NOTICE_RECT={x:14,y:6,w:2,h:1};
const noticeBoard={id:'board',name:'PAPAN INFO POKTAN',color:'#e8c05a',btn:'BACA &#9656;',isBoard:true,idx:0,
  msgs:['JADWAL TANAM SERENTAK PEKAN DEPAN','RAPAT POKTAN JUMAT 15:30 DI BALAI',
        'BANTUAN BENIH PADI SUDAH TERSEDIA','WASPADA WERENG - LAPOR SEGERA','UBINAN KSA BLOK 3 HARI KAMIS']};
noticeBoard.desc=noticeBoard.msgs[0];
/* --- MUSIM: palet dedaunan bergeser tiap hari (semi → kemarau → gugur → peralihan) --- */
const SEASONS=[
  {id:'SEMI',    mass:'#1e4a1c',mid:'#2f6b28',hi:'#3f8a34',hi2:'#5cb04a',
   dots:['#2a5f24','#3f8a34','#57a048','#7cc45c'],
   jungle:['#0f2a14','#183c1a','#245222','#31682e','#43883a','#63ac52'],
   fern:'#33632c',grassA:'#41703a',grassB:'#48753f',floor:'#1e3320',leaf:'#7cc45c',
   wet:0.35,crops:[4,4,0,1,0]},                  // gerimis tipis · bunga & sayuran muda
  {id:'KEMARAU', mass:'#1c3f18',mid:'#2a5f24',hi:'#357a2c',hi2:'#4a9640',
   dots:['#22521e','#2f6a28','#3f8a34','#54a044'],
   jungle:['#0e2412','#163417','#20481f','#2c5e2b','#3a7a34','#57a048'],
   fern:'#2f5a28',grassA:'#3f6b39',grassB:'#456f3e',floor:'#1c2f1a',leaf:'#54a044',
   wet:0,crops:[0,1,2,3,4]},                     // kering · kebun paling beragam
  {id:'GUGUR',   mass:'#4a2a12',mid:'#7a4a18',hi:'#a86a1e',hi2:'#d9922c',
   dots:['#8a4a16','#b06820','#d98a28','#e8b040'],
   jungle:['#241505','#3a220a','#573312','#7a4a18','#a86a1e','#d9a03a'],
   fern:'#7a5218',grassA:'#5d6630',grassB:'#646a34',floor:'#3a3a1c',leaf:'#d9922c',
   wet:0,crops:[3,3,2,2,1]},                     // musim panen · labu & jagung mendominasi
  {id:'PERALIHAN',mass:'#20321c',mid:'#33502a',hi:'#456a34',hi2:'#5c8446',
   dots:['#2a4222','#3b5c2e','#4d7038','#6b9050'],
   jungle:['#101c10','#1a2c18','#26401f','#33522a','#456a34','#5f8a4a'],
   fern:'#2e4826',grassA:'#40603a',grassB:'#46653e',floor:'#182718',leaf:'#6b9050',
   wet:1,crops:[-1,0,-1,4,-1]},                  // musim hujan · banyak bedengan bera (jerami)
];
let forcedSeason=null;                                             // dipakai HQDBG untuk pratinjau
const curSeason=()=>forcedSeason!==null?forcedSeason
                    :Math.floor(Date.now()/864e5)%SEASONS.length;   // bergeser tiap hari
let season=curSeason();
const SN=()=>SEASONS[season];
/* --- kolam kecil di tengah lapangan: pantulan langit + ikan (padat, tak bisa dilewati).
       Dipilih karena terbuka (tak menempel bedengan), sepelemparan dari jalan utama,
       dinaungi pohon (14,11) di tepinya, dan lentera (13,13) memantul di air saat malam. --- */
const POND={x:14,y:12,w:3,h:2};
const PONDIN=[];        // [inset kiri, inset kanan] per baris piksel → tepi tak beraturan
/* Tiang lentera berdiri di tepi jalan. Dulu bisa ditembus karena tak pernah
   masuk peta kepadatan; posisinya diangkat ke sini supaya jadi rujukan bersama
   antara peta kepadatan dan pembuatan furniturnya di bawah. */
const LANTERNS=[{x:11,y:4},{x:12,y:9},{x:12,y:14}];
const DECOR3_SOLID=[
  ...OUT_TREES.map(t=>({x:t.x,y:t.y,w:1,h:1})),        // batang pohon = solid
  ...LANTERNS.map(L=>({x:L.x,y:L.y,w:1,h:1})),         // tiang lentera = solid
  {x:NOTICE_RECT.x,y:NOTICE_RECT.y,w:NOTICE_RECT.w,h:NOTICE_RECT.h},   // papan info
  POND,                                                 // air kolam
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
const DOOR_OUT={id:'door-out',name:'MAIN GATE', btn:'KELUAR &#9660;', isPortal:true, to:2,
  spawn:{x:12.5*T,y:2*T+12,dir:'down'}, color:'#7ee06a', desc:''};   // tanpa subtitle
const DOOR_IN ={id:'door-in', name:'MAIN GATE',btn:'MASUK &#9650;',  isPortal:true, to:0,
  spawn:{x:12.5*T,y:17*T+12,dir:'up'},  color:'#4cc9e0', desc:''};   // tanpa subtitle

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
// papan info poktan (luar): petak tepat di bawah papan = zona baca
for(let x=NOTICE_RECT.x;x<NOTICE_RECT.x+NOTICE_RECT.w;x++){const y=NOTICE_RECT.y+NOTICE_RECT.h;
  if(!SOLIDS[2][y*COLS+x])ZONES[2][x+','+y]=noticeBoard;}
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
/* sprite pendar dipanggang sekali — dulu createRadialGradient dialokasikan tiap frame
   (3 lentera + 1 halo kabut ≈ 240 objek/detik → GC sibuk di perangkat lemah) */
const mkGlow=(r,rgb)=>{const c=document.createElement('canvas');c.width=c.height=r*2;
  const g=c.getContext('2d'),gr=g.createRadialGradient(r,r,Math.max(1,r*0.08),r,r,r);
  gr.addColorStop(0,`rgba(${rgb},1)`);gr.addColorStop(1,`rgba(${rgb},0)`);
  g.fillStyle=gr;g.fillRect(0,0,r*2,r*2);return c;};
const LAMP_GLOW=mkGlow(13,'255,206,120');       // pendar lentera
const FOG_HALO=mkGlow(34,'0,0,0');              // lubang halo kabut-perang

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
/* Palet dino. `G` (bayang) digeser ke biru-ungu dan `r` (rim) ke merah muda
   hangat — bukan sekadar versi gelap/terang dari warna badan. `k` ikut jadi
   ungu tua, karena garis luar kecokelatan membuat badan ungu tampak kotor. */
const SPAL={k:'#1a0d2e',g:'#a05ae0',G:'#6a2ab0',l:'#e6cdf8',r:'#c986ee',e:'#160f1f'};
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

/* Pembangun frame untuk dino besar MAUPUN anak dino. Tepi ATAS badan diberi
   rim light dan tepi BAWAH diredupkan secara otomatis, jadi seluruh frame ikut
   bervolume tanpa perlu menyunting satu per satu peta ASCII-nya. */
function frameCanvas(rows,flip){
  const w=rows[0].length;                      // 12 (depan/belakang) atau 14 (samping)
  const c=document.createElement('canvas');c.width=w;c.height=rows.length;
  const g=c.getContext('2d');
  const at=(x,y)=>(rows[y]&&rows[y][x])||'.';
  const body=ch=>ch==='g'||ch==='G'||ch==='l'||ch==='r';
  rows.forEach((row,y)=>{for(let x=0;x<w;x++){
    const ch=row[x];let col=SPAL[ch];if(!col)continue;
    if(ch==='g'){
      if(!body(at(x,y-1)))col=SPAL.r;          // tepi atas menangkap cahaya
      else if(!body(at(x,y+1)))col=SPAL.G;     // tepi bawah membayang
    }
    g.fillStyle=col;g.fillRect(flip?w-1-x:x,y,1,1);
  }});
  return c;
}
const SPR={
  down :LEGS_DOWN.map(l=>frameCanvas([...TOP_DOWN,...l],false)),
  up   :LEGS_UP.map(l=>frameCanvas([...TOP_UP,...l],false)),
  right:LEGS_SIDE.map(l=>frameCanvas([...TOP_SIDE,...l],false)),
  left :LEGS_SIDE.map(l=>frameCanvas([...TOP_SIDE,...l],true)),
};

/* --- anak dino peliharaan: sprite mini 8x8, 2 frame (pakai pembangun yang sama) --- */
const miniCanvas=frameCanvas;
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

/* favicon: potret kepala dino saja (crop wajah sprite depan).
   Dibungkus try KARENA ini murni hiasan: dulu satu elemen <link rel=icon> yang
   hilang — atau toDataURL yang ditolak — melempar di tingkat modul dan
   mematikan SELURUH skrip sebelum permainan sempat dibangun. */
(function(){
  try{
    const c=document.createElement('canvas');c.width=48;c.height=48;
    const g=c.getContext('2d');g.imageSmoothingEnabled=false;
    g.drawImage(SPR.down[0],0,0,12,7,0,10,48,28);           // kepala, skala 4x
    const link=document.querySelector('link[rel=icon]');
    if(link)link.href=c.toDataURL();
  }catch(e){}
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

/* =========================================================================
   ALAT BANTU MUTU GAMBAR
   Yang membedakan objek game 2D dari gambar rata bukan jumlah warnanya, tapi
   enam hal: bayangan kontak, garis luar siluet, tiga bidang (atas/muka/bawah),
   arah cahaya seragam, limpahan cahaya dari benda menyala, dan detail tepi.
   Dibungkus di sini supaya seluruh perabot memakai bahasa yang sama — bukan
   tiap objek menebak sendiri tangga warnanya.
   ========================================================================= */
const _hx=s=>[parseInt(s.slice(1,3),16),parseInt(s.slice(3,5),16),parseInt(s.slice(5,7),16)];
function _toHsl(r,g,b){
  r/=255;g/=255;b/=255;
  const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;
  if(mx===mn)return [0,0,l];
  const d=mx-mn, s=l>.5?d/(2-mx-mn):d/(mx+mn);
  const h=mx===r?((g-b)/d+(g<b?6:0)):mx===g?((b-r)/d+2):((r-g)/d+4);
  return [h*60,s,l];
}
function _toHex(h,s,l){
  h=((h%360)+360)%360/360;
  if(s<=0){const v=Math.round(l*255);return _rgbHex(v,v,v);}
  const q=l<.5?l*(1+s):l+s-l*s, p=2*l-q;
  const f=t=>{t=(t+1)%1;
    return t<1/6?p+(q-p)*6*t:t<1/2?q:t<2/3?p+(q-p)*(2/3-t)*6:p;};
  return _rgbHex(f(h+1/3)*255,f(h)*255,f(h-1/3)*255);
}
const _rgbHex=(r,g,b)=>'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
/* Rona digeser ke arah tetap: sorot condong ke kuning, bayang condong ke biru.
   Tangga yang cuma naik-turun terang — tanpa pergeseran rona — terbaca datar
   seperti plastik; inilah yang dulu membuat seluruh interior terasa mati. */
const _toward=(h,target,amt)=>h+((((target-h+540)%360)-180)*amt);
function ramp(base){
  const [r,g,b]=_hx(base), [H,S,L]=_toHsl(r,g,b);
  return {
    hi :_toHex(_toward(H,50,0.12),  Math.max(0,S*0.92), Math.min(.94,L+0.10)),
    base,
    lo :_toHex(_toward(H,240,0.14), Math.min(1,S*1.22), Math.max(.03,L*0.62)),
    out:_toHex(_toward(H,240,0.20), Math.min(1,S*1.32), Math.max(.02,L*0.34)),
  };
}
/* bayangan kontak dua lapis — tanpa ini perabot tampak mengambang di lantai */
function contact(g,x,y,w,s=1){
  P(g,`rgba(0,0,0,${(.34*s).toFixed(2)})`,x+2,y,Math.max(1,w-4),2);
  P(g,`rgba(0,0,0,${(.17*s).toFixed(2)})`,x,y+1,w,2);
}
/* kotak bermatra: garis luar, permukaan atas kena cahaya, muka depan, bayang bawah */
function box3(g,x,y,w,h,base,top=3){
  const R=ramp(base);
  P(g,R.out,x-1,y-1,w+2,h+2);
  P(g,R.base,x,y,w,h);
  P(g,R.hi,x,y,w,top);
  P(g,R.lo,x,y+h-2,w,2);
  P(g,R.lo,x+w-1,y+top,1,h-top-2);          // sisi kanan membayang
  return R;
}
/* limpahan cahaya benda menyala ke permukaan di bawahnya — sumber cahaya
   harus terasa mengenai sekitarnya, bukan berhenti di tepi bendanya */
function spill(g,x,y,w,h,rgb,a=.13){
  P(g,`rgba(${rgb},${a})`,x,y,w,h);
  P(g,`rgba(${rgb},${(a*.45).toFixed(3)})`,x-3,y,w+6,Math.max(1,h-1));
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
      const sx=gx+((rnd(wd.side==='W'?7:311,wd.ty0*3+i)>>>3)%gwd);
      const sy=gy+((rnd(wd.side==='W'?31:97,wd.ty0*5+i)>>>2)%ght);
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
      const sx=gx+((rnd(wd.side==='W'?7:311,wd.ty0*3+i)>>>3)%gwd);
      const sy=gy+((rnd(wd.side==='W'?31:97,wd.ty0*5+i)>>>2)%ght);
      const br=(0.35+0.6*((rnd(i*13,wd.ty0*7)>>>2)%10)/10).toFixed(2);
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
  /* Susunan ubin TIDAK berubah — yang naik cuma warnanya: tiap zona kini punya
     tangga sorot/bayang yang ronanya bergeser (sorot ke kuning, bayang ke biru),
     bukan sekadar versi lebih terang/gelap dari warna dasarnya. */
  const FZ={L:ramp('#2a313d'),C:ramp('#242a32'),RT:ramp('#262d39'),
            RBa:ramp('#2b2e35'),RBb:ramp('#2f323a')};
  for(let ty=0;ty<ROWS;ty++)for(let tx=0;tx<COLS;tx++){
    if(MAP[ty][tx]!=='.')continue;
    const px=tx*T,py=ty*T,alt=((tx+ty)%2),r=rnd(tx,ty)%14;
    const z=tx<10?'L':tx<15?'C':(ty<9?'RT':'RB');
    if(z==='L'){                                          // panel akses ruang data
      const Z=FZ.L;
      P(g,Z.base,px,py,T,T);
      P(g,Z.hi,px,py,T,1);P(g,Z.hi,px,py,1,T);            // sisi kena cahaya
      P(g,Z.lo,px,py+T-1,T,1);P(g,Z.lo,px+T-1,py,1,T);    // nat membayang
      P(g,'#4a5568',px+1,py+1,1,1);P(g,'#4a5568',px+T-2,py+1,1,1); // sekrup sudut
      P(g,'#4a5568',px+1,py+T-2,1,1);P(g,'#4a5568',px+T-2,py+T-2,1,1);
      if(DATA_VENTS.has(tx+','+ty)){P(g,'#12161d',px+4,py+4,8,8);  // panel berlubang menyala (3 saja)
        for(let a=5;a<12;a+=2)for(let b=5;b<12;b+=2)P(g,'rgba(60,200,255,.4)',px+a,py+b,1,1);
        spill(g,px+3,py+12,10,3,'60,200,255',.10);}                // pendarnya menyentuh ubin
    }else if(z==='C'){                                    // lorong — aspal transit
      const Z=FZ.C;
      P(g,Z.base,px,py,T,T);
      P(g,Z.hi,px,py,T,1);P(g,Z.lo,px,py+T-1,T,1);
      if(r===1)P(g,'#2e3540',px+5,py+9,6,1);                       // goresan halus
    }else if(z==='RT'){                                   // briefing — pelat halus + grid holo
      const Z=FZ.RT;
      P(g,Z.base,px,py,T,T);
      P(g,Z.hi,px,py,T,1);P(g,Z.lo,px,py+T-1,T,1);
      P(g,'rgba(76,201,224,.05)',px,py,T,1);P(g,'rgba(76,201,224,.05)',px,py,1,T);
    }else{                                                // bengkel — pelat bordes
      const Z=alt?FZ.RBa:FZ.RBb;
      P(g,Z.base,px,py,T,T);
      for(const [sx,sy] of [[3,3],[11,11],[11,3],[3,11]]){         // tonjolan bordes bermatra
        P(g,Z.hi,px+sx,py+sy,2,2);
        P(g,Z.lo,px+sx,py+sy+2,2,1);                               // bayang tepat di bawahnya
      }
      P(g,Z.lo,px,py+T-1,T,1);P(g,Z.lo,px+T-1,py,1,T);
      if(r===0)P(g,'rgba(12,8,5,.4)',px+3,py+4,10,7);              // noda oli sesekali
    }
  }
  const WALL0=ramp('#2b3341');                           // dihitung sekali, bukan tiap petak
  /* dinding (tile '#'): muka baja bila ada lantai tepat di bawahnya,
     selain itu pelat gelap berlist — denah kamar & lorong terbaca dari sini */
  for(let ty=0;ty<ROWS;ty++)for(let tx=0;tx<COLS;tx++){
    if(MAP[ty][tx]!=='#')continue;
    const px=tx*T,py=ty*T;
    const face=ty+1<ROWS&&MAP[ty+1][tx]==='.';
    if(face){
      /* Dinding itu bidang TEGAK: kepalanya kena cahaya langit-langit dan
         pangkalnya meredup. Tanpa peredupan bertingkat ini ia terbaca rata dan
         seolah menempel di lantai, bukan berdiri di belakangnya. */
      const R=WALL0;
      P(g,R.base,px,py,T,T);
      P(g,R.hi,px,py,T,2);                               // kepala dinding kena cahaya
      P(g,'#343d4d',px,py+2,T,2);
      P(g,R.lo,px,py+T-8,T,4);                           // pangkal dinding meredup
      for(let x=0;x<T;x+=6){                             // panel tegak bermatra
        P(g,'#3d4757',px+x,py+2,1,T-10);                 // tepi panel kena cahaya
        P(g,'#1b212c',px+x+5,py+2,1,T-10);               // celah panel membayang
      }
      P(g,'#10141c',px,py+T-4,T,4);                      // list bawah dinding
      P(g,'#252d3a',px,py+T-4,T,1);                      // tepi atas list kena cahaya
      /* strip cahaya: warna per-zona · redup siang / terang malam · hazard di ruang panas */
      const wz=tx<10?'L':tx<15?'C':((ty+1)<9?'RT':'RB');
      const br=(0.45+0.55*daylight.lamp).toFixed(2);     // kecerahan ikut jam
      const SC={L:[46,224,255],C:[219,176,63],RT:[110,224,168]};  // data cyan · lorong amber · briefing hijau
      if(wz==='RB'){                                      // forge/bengkel — pita hazard kuning-hitam
        for(let x=0;x<T;x+=6){P(g,`rgba(219,176,63,${br})`,px+x,py+T-5,3,1);
          P(g,'rgba(10,10,12,.85)',px+x+3,py+T-5,3,1);}
      }else{const c=SC[wz];P(g,`rgba(${c[0]},${c[1]},${c[2]},${br})`,px,py+T-5,T,1);}
      P(g,'rgba(0,0,0,.34)',px,py+T,T,2);                // bayangan rapat di kaki dinding
      P(g,'rgba(0,0,0,.16)',px,py+T+2,T,3);              // lalu melunak ke lantai
      const gc=(SC[wz]||[219,176,63]).join(',');
      pool(g,px,py+T+4,T,7,gc,(.05*daylight.lamp+.02).toFixed(3)); // cahaya meleleh ke lantai
    }else{
      P(g,'#141922',px,py,T,T);                          // rongga gelap di luar ruangan
      P(g,'#1c222c',px,py,T,1);                          // tepi atas menangkap sedikit cahaya
      for(let y=4;y<T;y+=8)P(g,'#181e27',px,py+y,T,1);
    }
    if(ty===0)P(g,'#0f131b',px,0,T,3);                   // trim atas
  }
  dindingGaris(g,MAP);                                   // denah diberi tepi
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
  /* (bekas planning bay dikosongkan — kini dipisah rak pembibitan row 9, lihat semaiRak) */
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
/* --- GARIS LUAR SILUET ---------------------------------------------------
   Dikerjakan SETELAH objek dicat: tiap piksel pekat yang bersinggungan dengan
   kekosongan digelapkan ke arah ungu-abu hangat. Inilah cara pixel art
   memisahkan benda dari latarnya, dan mengerjakannya terpusat di sini membuat
   SEMUA perabot dapat perlakuan yang sama. Sebelumnya tiap fungsi cat
   menggambar tepinya sendiri dan hasilnya timpang: pohon 88% tergariskan,
   tungku tempa cuma 13%.
   Warnanya DICAMPUR, bukan ditimpa, supaya warna asli bendanya tetap terbaca.
   Ambang 200 membuat bayangan kontak dan pendar yang memang semi-tembus tidak
   ikut digariskan — yang digariskan hanya badan bendanya. */
function outlineSilhouette(g,w,h,kuat=0.52){
  const img=g.getImageData(0,0,w,h), d=img.data;
  const pekat=(x,y)=>(x<0||y<0||x>=w||y>=h)?0:d[(y*w+x)*4+3];
  const tepi=[];
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=(y*w+x)*4; if(d[i+3]<200)continue;
    if(pekat(x-1,y)<200||pekat(x+1,y)<200||pekat(x,y-1)<200||pekat(x,y+1)<200)tepi.push(i);
  }
  for(const i of tepi){
    d[i]  =Math.round(d[i]  *(1-kuat)+36*kuat);
    d[i+1]=Math.round(d[i+1]*(1-kuat)+31*kuat);
    d[i+2]=Math.round(d[i+2]*(1-kuat)+48*kuat);
  }
  g.putImageData(img,0,0);
}
/* --- GARIS LUAR UNTUK BENDA TIPIS ---------------------------------------
   Saudara outlineSilhouette() untuk sprite yang terlalu tipis untuk
   digariskan dari dalam. Alih-alih mengecat kulitnya, ia mengisi piksel
   KOSONG yang bersinggungan dengan siluet, jadi tak satu pun piksel asli
   tersentuh - diukur 0 berubah, lawan 58-100% yang dicat ulang oleh
   outlineSilhouette pada semai (batang etiolasi selebar 1 px: 100% tepi).
   batasY menahan garis agar tak menetes ke bawah alas benda. */
function halo(g,w,h,warna,alfa,batasY){
  const [rr,gg,bb]=_hx(warna);
  const img=g.getImageData(0,0,w,h), d=img.data;
  const pekat=(x,y)=>(x<0||y<0||x>=w||y>=h)?0:d[(y*w+x)*4+3];
  const sasar=[];
  for(let y=0;y<h;y++){
    if(batasY!==undefined&&y>batasY)break;
    for(let x=0;x<w;x++){
      const i=(y*w+x)*4; if(d[i+3]>=200)continue;
      if(pekat(x-1,y)>=200||pekat(x+1,y)>=200||pekat(x,y-1)>=200||pekat(x,y+1)>=200)
        sasar.push(i);
    }
  }
  const a=Math.round(255*alfa);
  for(const i of sasar){d[i]=rr;d[i+1]=gg;d[i+2]=bb;d[i+3]=a;}
  g.putImageData(img,0,0);
}
/* --- GARIS LUAR DINDING DENAH -------------------------------------------
   Saudara outlineSilhouette() untuk peta, bukan untuk sprite. Alat itu
   membaca tepi dari alfa kanvas; dinding dicat langsung ke latar yang pekat,
   jadi tepinya dibaca dari PETA.
   Garis dicat di sisi LANTAI karena dindingnya sendiri gelap — garis gelap di
   atas dinding gelap tak terlihat. Pola dua pitanya meniru bayangan kaki
   dinding yang sudah ada, supaya keempat tepi bicara dengan bahasa yang sama.
   Tepi bawah dilewati: di sana bayangan itu memang sudah ada. */
function dindingGaris(g,peta){
  const lantai=(x,y)=>x>=0&&y>=0&&x<COLS&&y<ROWS&&peta[y][x]==='.';
  for(let ty=0;ty<ROWS;ty++)for(let tx=0;tx<COLS;tx++){
    if(peta[ty][tx]!=='#')continue;
    const px=tx*T,py=ty*T;
    if(lantai(tx-1,ty)){
      P(g,'rgba(0,0,0,.30)',px-1,py,1,T);
      P(g,'rgba(0,0,0,.14)',px-2,py,1,T);
    }
    if(lantai(tx+1,ty)){
      P(g,'rgba(0,0,0,.30)',px+T,py,1,T);
      P(g,'rgba(0,0,0,.14)',px+T+1,py,1,T);
    }
    if(lantai(tx,ty-1)){
      P(g,'rgba(0,0,0,.22)',px,py-1,T,1);
      P(g,'rgba(0,0,0,.10)',px,py-2,T,1);
    }
  }
}
function furn(rect,oy,paint){
  const c=document.createElement('canvas');
  c.width=rect.w*T;c.height=rect.h*T+oy;
  const g=c.getContext('2d');
  paint(g,c.width,c.height);
  outlineSilhouette(g,c.width,c.height);
  return {rect,oy,canvas:c,px:rect.x*T,py:rect.y*T-oy,baseY:(rect.y+rect.h)*T,paint};
}
/* --- MUSIM DI DALAM GEDUNG --------------------------------------------------
   Kanvas furnitur dipanggang SEKALI, jadi perabot yang warnanya ikut musim
   (pot tanaman di kedua lantai) didaftarkan ke sini dan dicat ulang oleh
   repaintSeasonal() saat tickSky() melihat harinya berganti — pola yang sama
   dengan repaintTrees() di area luar. */
const SEASONAL=[];
const seasonal=f=>{SEASONAL.push(f);return f;};
function repaintSeasonal(){
  for(const f of SEASONAL){
    const c=f.canvas,g=c.getContext('2d');
    g.clearRect(0,0,c.width,c.height);
    f.paint(g,c.width,c.height);
    outlineSilhouette(g,c.width,c.height);
  }
}
let anims=[];     // {fn(g,t)} digambar tiap frame di atas furnitur (ditukar per lantai)
let FURN=[];

/* --- MEJA KOMPUTER : LAPORAN HARIAN V2 --- */
FURN.push(furn(TOOLS[0].rect,18,(g,w,h)=>{
  /* Bayangan kontak — tanpa ini perabot tampak mengambang di atas lantai.
     Dua lapis: inti pekat rapat di kaki, lalu limpahan tipis yang melebar. */
  P(g,'rgba(0,0,0,.34)',5,h-4,w-10,3);
  P(g,'rgba(0,0,0,.18)',3,h-3,w-6,2);
  /* --- MEJA: permukaan atas, muka depan, lalu bayangan bawah.
         Tiga bidang, bukan satu slab — itu yang memberi tebal. --- */
  P(g,'#171b24',1,17,w-2,14);                                  // garis luar siluet
  P(g,'#4d586c',2,18,w-4,3);                                   // permukaan atas (kena cahaya)
  P(g,'#66738d',2,18,w-4,1);                                   // kilau tepi depan
  P(g,'#39414f',2,21,w-4,6);                                   // muka depan
  P(g,'#313949',2,25,w-4,3);                                   // makin ke bawah makin gelap
  P(g,'#242b37',2,28,w-4,2);                                   // bayangan bawah meja
  P(g,'#2a303c',4,30,3,h-31);P(g,'#2a303c',w-7,30,3,h-31);     // kaki
  P(g,'#1b2029',4,30,1,h-31);P(g,'#1b2029',w-7,30,1,h-31);
  /* --- MONITOR: bingkai bermatra + layar berpendar --- */
  P(g,'#15171d',7,1,22,18);                                    // garis luar
  P(g,'#333844',8,2,20,16);                                    // bingkai
  P(g,'#4a5160',8,2,20,1);P(g,'#4a5160',8,2,1,16);             // sisi kena cahaya
  P(g,'#1e212a',8,17,20,1);P(g,'#1e212a',27,2,1,16);           // sisi bayang
  P(g,'#0a1410',10,4,16,11);                                   // kaca layar
  P(g,'#12291a',10,11,16,4);                                   // pendar hijau menumpuk di bawah
  P(g,'#5aa03a',11,12,14,1);
  P(g,'rgba(180,220,255,.07)',11,5,6,9);                        // pantulan miring di kaca
  P(g,'#2f3644',16,18,6,2);P(g,'#3f4858',16,18,6,1);           // leher dudukan
  P(g,'#1e2530',14,20,10,1);                                    // kaki dudukan
  /* limpahan cahaya layar ke permukaan meja — sumber cahaya harus terasa */
  P(g,'rgba(140,212,94,.13)',10,18,16,3);
  P(g,'rgba(140,212,94,.07)',7,18,22,2);
  /* --- KERTAS: dua lembar bertumpuk, ada bayangannya sendiri --- */
  P(g,'rgba(0,0,0,.28)',30,17,11,2);
  P(g,'#9aa0ae',30,12,10,6);P(g,'#c9c9d2',30,12,10,5);         // lembar bawah + atas
  P(g,'#e6e6ee',30,12,10,1);                                    // tepi kena cahaya
  P(g,'#4cc9e0',33,14,4,1);P(g,'#4cc9e0',32,16,6,1);
  /* --- CANGKIR: sisi terang, sisi bayang, bibir, bayangan di meja --- */
  P(g,'rgba(0,0,0,.26)',w-13,17,8,2);
  P(g,'#5a2618',w-12,12,6,6);                                   // sisi bayang
  P(g,'#7a3a2a',w-12,12,4,6);                                   // badan
  P(g,'#9c5038',w-12,12,2,5);                                   // sisi kena cahaya
  P(g,'#c88a68',w-12,12,6,1);                                   // bibir cangkir
  P(g,'#5a2618',w-7,13,2,3);P(g,'#8a4630',w-7,13,1,3);          // telinga
  /* --- KEYBOARD: miring, tuts bertingkat --- */
  P(g,'#171b23',5,21,19,6);
  P(g,'#2f3644',6,22,17,4);P(g,'#414b5c',6,22,17,1);            // badan + tepi atas
  for(let x=7;x<22;x+=2){P(g,'#525d70',x,23,1,1);P(g,'#262d39',x,24,1,1);}  // tuts + bayangnya
  P(g,'#39414f',25,23,4,3);P(g,'#525d70',25,23,4,1);            // tetikus
  P(g,'#1b2029',25,25,4,1);
  /* --- TOWER: panel, kisi ventilasi, LED --- */
  P(g,'#15171d',w-10,18,7,12);
  P(g,'#2b303b',w-9,19,6,11);P(g,'#3a404e',w-9,19,6,1);P(g,'#3a404e',w-9,19,1,11);
  P(g,'#191c23',w-8,21,4,7);
  for(let y=22;y<28;y+=2)P(g,'#333a47',w-7,y,3,1);              // kisi ventilasi
  P(g,'#8fd45e',w-8,20,1,1);P(g,'#4cc9e0',w-6,20,1,1);          // LED
  P(g,'#8fd45e',26,3,1,1);                                      // LED daya monitor
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
  contact(g,1,h-3,w-2);
  const R=ramp('#3a4252');
  P(g,R.out,1,-1,w-2,28);                                      // garis luar papan
  P(g,R.base,2,0,w-4,26);P(g,R.hi,2,0,w-4,2);                  // bingkai
  P(g,R.lo,w-4,2,2,24);
  P(g,'#161b24',4,2,w-8,22);P(g,'#0f1219',4,2,w-8,1);          // gabus gelap + bayang atas
  const ph=[['#7ee06a','#46a14e'],['#e8e0c8','#cf9c6e'],['#4cc9e0','#2a7f95']];
  ph.forEach((p,i)=>{const px=7+i*13;
    P(g,'rgba(0,0,0,.35)',px+1,17,10,2);                       // bayangan foto di gabus
    P(g,'#9aa0ae',px,5,10,12);P(g,'#f0ead8',px,5,10,11);       // tepi kertas + muka foto
    P(g,p[0],px+1,6,8,7);P(g,p[1],px+1,10,8,3);
    P(g,'rgba(255,255,255,.16)',px+1,6,8,1);                   // kilau permukaan
    P(g,'#8a2f22',px+4,4,2,2);P(g,'#c04a3a',px+4,4,2,1);});    // pin merah
  P(g,'#b83a2a',11,6,26,1);P(g,'#7d241a',11,7,26,1);           // benang + bayangnya
  P(g,'#b83a2a',11,6,1,11);P(g,'#b83a2a',37,6,1,9);            // benang turun
  P(g,'#c9b93a',7,18,7,5);P(g,'#e8d84a',7,18,7,4);             // sticky note
  P(g,'#f4ec92',7,18,7,1);P(g,'#3a3a44',10,17,1,2);            // kilau + pin
  const C=ramp('#2f3644');                                     // kamera di ledge
  P(g,C.out,w-16,19,13,9);P(g,C.base,w-15,20,11,7);
  P(g,C.hi,w-15,20,11,1);P(g,C.lo,w-6,21,1,6);
  P(g,'#0b0d12',w-11,22,4,4);P(g,'#4a5568',w-11,22,4,1);       // lensa + rim
  P(g,'#ff5a5a',w-14,21,1,1);                                  // LED rekam
  P(g,'#2a303c',3,26,4,h-27);P(g,'#2a303c',w-7,26,4,h-27);     // kaki
  P(g,'#1b2029',3,26,1,h-27);P(g,'#1b2029',w-7,26,1,h-27);
}));
anims.push({f:FURN[1],fn:(g,t)=>{                              // blitz kamera
  if(t%5200<160){const f=FURN[1];
    P(g,'rgba(255,255,255,.85)',f.px+f.canvas.width-13,f.py+21,7,3);
    P(g,'rgba(255,255,255,.25)',f.px+f.canvas.width-19,f.py+16,17,13);}
}});

/* --- TV SIARAN + TOA : LAPORAN DISEMINASI --- */
FURN.push(furn(TOOLS[2].rect,20,(g,w,h)=>{
  contact(g,1,h-3,w-2);
  const R=ramp('#3d4657');
  P(g,R.out,1,21,w-2,12);
  P(g,R.base,2,22,w-4,10);P(g,R.hi,2,22,w-4,3);P(g,R.lo,2,30,w-4,2);  // kabinet logam
  P(g,R.lo,(w/2)|0,23,1,8);                                    // sekat pintu
  P(g,'#c9c9d2',10,26,3,1);P(g,'#c9c9d2',w-13,26,3,1);         // gagang
  P(g,'#8f98a8',10,27,3,1);P(g,'#8f98a8',w-13,27,3,1);         // bayang gagang
  P(g,'#2a303c',3,32,3,h-33);P(g,'#2a303c',w-6,32,3,h-33);     // kaki
  P(g,'#1b2029',3,32,1,h-33);P(g,'#1b2029',w-6,32,1,h-33);
  const V=ramp('#2f3038');                                     // TV CRT
  P(g,V.out,6,3,26,21);P(g,V.base,7,4,24,19);
  P(g,V.hi,7,4,24,1);P(g,V.hi,7,4,1,19);P(g,V.lo,30,5,1,18);
  P(g,'#0b0d12',9,6,18,13);
  P(g,'rgba(180,220,255,.06)',10,7,6,11);                      // pantulan miring di kaca
  P(g,'#3a3a44',28,8,2,10);P(g,'#8fd45e',28,9,2,2);            // panel + lampu
  P(g,'#55555f',13,0,1,5);P(g,'#55555f',20,0,1,5);             // antena V
  P(g,'#727280',13,0,1,2);P(g,'#727280',20,0,1,2);
  P(g,'#55555f',12,0,3,1);P(g,'#55555f',19,0,3,1);
  spill(g,8,20,20,3,'120,180,230',.10);                        // cahaya TV jatuh ke kabinet
  const H2=ramp('#e8c05a');                                    // toa
  P(g,H2.out,33,11,11,9);P(g,H2.base,34,12,9,7);P(g,H2.hi,34,12,9,2);
  P(g,H2.lo,41,13,3,5);P(g,'#2a303c',36,19,3,3);
  P(g,'#1a1a20',5,23,7,3);P(g,'#2a2a32',5,23,7,1);             // modem
  P(g,'#8fd45e',6,24,1,1);P(g,'#4cc9e0',8,24,1,1);P(g,'#ff5a5a',10,24,1,1);
  P(g,'#2a303c',24,19,1,4);                                    // kabel TV→kabinet
}));
anims.push({f:FURN[2],fn:(g,t)=>{                              // siaran feed medsos
  const x=FURN[2].px+9,y=FURN[2].py+6;
  if(t%9000<420){                                              // sesekali "semut"
    /* rnd() mengembalikan 32-bit TAK BERTANDA. Dengan >> separuh nilainya
       ditafsirkan negatif, jadi (r>>4)%13 terukur 45% negatif sampai -12:
       hampir separuh "semut" digambar DI ATAS bidang layar, di luar bezel TV.
       >>> menjaganya di 0..12, tepat setinggi layarnya. */
    for(let i=0;i<40;i++){const r=rnd(i,Math.floor(t/60));
      P(g,(r%3)?'#5a5a66':'#c9c9d2',x+r%18,y+(r>>>4)%13,1,1);}
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
  contact(g,1,h-3,w-2);
  P(g,'#232833',2,h-5,w-4,4);                                   // alas logam
  P(g,'#333945',2,h-5,w-4,1);                                   // tepi alas kena cahaya
  spill(g,6,h-5,18,3,'255,150,60',.20);                         // bara menyinari lantai di depan tungku
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
  // >>> bukan >>: dengan >> nilainya 40% negatif, dan "my-2-(negatif)" membuat
  // percikan turun ke bawah mulut tungku, padahal bara memercik NAIK.
  if(r%2===0)P(g,'#ffd75e',mx+2+r%12,my-2-(r>>>3)%5,1,1);      // percikan naik
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
    P(g,'#ffd75e',wx+3+(a%9)-4,wy-1-(a>>>3)%5,1,1);}           // >>> : lihat catatan di atas
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
  contact(g,1,h-3,w-2);
  const M=ramp('#3f4859');
  P(g,M.out,1,h-15,w-2,13);
  P(g,M.hi,2,h-14,w-4,3);P(g,M.base,2,h-11,w-4,7);P(g,M.lo,2,h-5,w-4,2);
  P(g,'#2a303c',4,h-3,3,3);P(g,'#2a303c',w-7,h-3,3,3);                  // kaki
  /* ragum (vise) */
  P(g,'#55555f',6,h-18,8,5);P(g,'#3a3a42',8,h-19,4,2);
  /* suku cadang di meja */
  P(g,'#7a7f88',20,h-16,6,3);P(g,'#9aa0aa',20,h-16,6,1);               // balok logam
  P(g,'#c9a24a',28,h-15,4,2);                                          // baut kuningan
  P(g,'#5f6670',34,h-17,5,4);P(g,'#787f8a',35,h-16,3,1);               // roda gigi
  /* lampu kerja menggantung */
  P(g,'#2a303c',w-11,0,2,3);P(g,'#3a3a42',w-14,3,8,3);P(g,'#4d4d57',w-14,3,8,1);
  P(g,'#ffe6a0',w-13,5,6,1);
  spill(g,w-17,6,14,5,'255,214,140',.16);                               // lampu kerja menyinari meja
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
  const R=ramp('#2b3341');
  contact(g,1,17,14);
  P(g,R.out,2,0,12,20);                                        // garis luar siluet
  P(g,R.base,3,0,10,19);
  P(g,R.hi,3,0,10,2);                                          // tutup atas kena cahaya
  P(g,R.lo,11,2,2,17);                                         // sisi kanan membayang
  for(const y of [4,9,14]){                                    // tiga modul server
    P(g,'#0b0f16',5,y,6,3);                                    // rongga gelap
    P(g,'#171d27',5,y,6,1);                                    // bibir atas
    P(g,'#3f4a5d',5,y+3,6,1);                                  // bibir bawah kena cahaya
  }
  P(g,'#525e73',4,3,1,15);                                     // rel sisi
  P(g,'#8fd45e',10,5,1,1);P(g,'#4cc9e0',10,10,1,1);P(g,'#e8c05a',10,15,1,1);};
const rackA=furn({x:1,y:2,w:1,h:1},4,g=>{rackPaint(g);});
const rackB=furn({x:23,y:2,w:1,h:1},4,g=>{rackPaint(g);});
const crates=furn({x:19,y:15,w:2,h:1},8,(g,w,h)=>{
  contact(g,1,h-3,30);
  const A=ramp('#333b4a'), B=ramp('#3f4859');
  P(g,A.out,1,7,15,16);P(g,A.base,2,8,13,14);                  // peti kiri
  P(g,A.hi,2,8,13,2);P(g,A.lo,2,20,13,2);P(g,A.lo,14,10,1,12);
  P(g,'#e8c05a',3,15,4,2);P(g,'#a87c28',3,17,4,1);             // label + bayangnya
  P(g,'#252c38',8,12,5,4);P(g,A.hi,8,12,5,1);                  // pegangan cekung
  P(g,B.out,15,11,15,12);P(g,B.base,16,12,13,10);              // peti kanan
  P(g,B.hi,16,12,13,2);P(g,B.lo,16,20,13,2);P(g,B.lo,28,14,1,8);
  P(g,'#e8c05a',18,16,6,2);P(g,'#a87c28',18,18,6,1);});
FURN.push(rackA,rackB,crates);

/* --- dekor pengisi ruangan: pot, bangku, drum, kabinet, rak alat, tong --- */
/* daun pot ikut palet musim yang sedang berjalan di luar — di dalam gedung pun
   terasa musimnya bergeser (dicat ulang lewat SEASONAL saat harinya berganti) */
const potPaint=g=>{
  const S=SN();
  const R=ramp('#7a3a2a');
  contact(g,2,17,12,.8);
  P(g,R.out,3,12,10,8);                                                      // garis luar pot
  P(g,R.base,4,13,8,6);P(g,R.hi,4,13,8,2);                                   // badan + bibir kena cahaya
  P(g,R.lo,10,15,2,4);P(g,'#2a1610',5,13,6,1);                               // sisi bayang + tanah
  P(g,S.mid,7,7,2,6);                                                        // batang
  P(g,S.hi,3,4,4,4);P(g,S.hi,9,3,4,4);P(g,S.mid,6,2,4,3);                    // daun
  P(g,S.leaf,7,4,2,2);P(g,S.leaf,4,5,2,1);
  P(g,S.mass,3,7,4,1);P(g,S.mass,9,6,4,1);                                   // bawah rumpun membayang
  if(season===2){P(g,S.hi2,2,10,1,1);P(g,S.hi,12,11,1,1);}                   // gugur: sehelai daun luruh
  if(season===3){P(g,S.hi2,5,2,1,1);P(g,S.hi2,11,5,1,1);}                    // peralihan: pucuk basah baru
};
const potA=seasonal(furn({x:7, y:2, w:1,h:1},4,potPaint));
const potB=seasonal(furn({x:1, y:7, w:1,h:1},4,potPaint));
const potC=seasonal(furn({x:19,y:2, w:1,h:1},4,potPaint));
const bench=furn({x:8,y:16,w:2,h:1},6,(g,w,h)=>{
  contact(g,1,h-3,w-2);
  const R=ramp('#3d4657');
  P(g,R.out,1,7,w-2,7);
  P(g,R.base,2,8,w-4,5);P(g,R.hi,2,8,w-4,2);P(g,R.lo,2,12,w-4,1);            // dudukan logam
  for(let x=6;x<w-5;x+=6)P(g,R.lo,x,9,1,3);                                  // sela bilah
  P(g,'#2a303c',3,13,3,h-15);P(g,'#2a303c',w-6,13,3,h-15);                   // kaki
  P(g,'#1b2029',3,13,1,h-15);P(g,'#1b2029',w-6,13,1,h-15);
});
const drum=furn({x:9,y:11,w:1,h:1},6,(g,w,h)=>{
  contact(g,1,h-3,14);
  const R=ramp('#3a5a8a');
  P(g,R.out,2,3,12,18);
  P(g,R.base,3,4,10,17);P(g,R.hi,3,4,10,2);                                  // drum baja + tutup atas
  P(g,R.lo,11,6,2,15);P(g,'#6f96c4',4,6,1,13);                               // sisi bayang + kilau
  P(g,R.lo,3,10,10,2);P(g,R.lo,3,16,10,2);                                   // gelang penguat
  P(g,R.hi,3,10,10,1);P(g,R.hi,3,16,10,1);
});
const kabinet=furn({x:15,y:2,w:1,h:1},10,(g,w,h)=>{
  contact(g,1,h-3,14);
  const R=ramp('#455063');
  P(g,R.out,2,1,12,24);
  P(g,R.base,3,2,10,23);P(g,R.hi,3,2,10,2);P(g,R.lo,11,4,2,21);              // kabinet arsip
  for(const y of [6,12,18]){
    P(g,'#232a36',4,y,8,4);P(g,'#2f3644',4,y,8,1);                           // muka laci + tepi atas
    P(g,'#171c25',4,y+4,8,1);                                                // celah bawah laci
    P(g,'#e8c05a',7,y+1,2,1);P(g,'#a87c28',7,y+2,2,1);                       // pegangan + bayangnya
  }
});
const toolRack=furn({x:20,y:9,w:1,h:1},12,(g,w,h)=>{
  contact(g,1,h-3,14);
  const R=ramp('#3d4657');
  P(g,R.out,1,1,14,18);
  P(g,'#20262f',3,3,10,14);P(g,'#171c24',3,3,10,1);                          // papan berlubang
  P(g,R.hi,2,2,12,1);P(g,R.base,2,2,1,16);
  for(let y=5;y<16;y+=3)for(let x=4;x<12;x+=3)P(g,'#161b23',x,y,1,1);        // lubang papan
  P(g,'#8a6a42',5,5,1,6);P(g,'#6b4f30',5,10,1,1);                            // gagang palu
  P(g,'#5d6773',4,3,3,3);P(g,'#7c8794',4,3,3,1);                             // kepala palu
  P(g,'#8a6a42',10,5,1,7);P(g,'#c9c9d2',9,3,3,2);P(g,'#e6e6ee',9,3,3,1);     // kunci
  P(g,R.out,1,17,14,10);P(g,R.base,2,18,12,8);                               // meja bawah
  P(g,R.hi,2,18,12,2);P(g,R.lo,2,25,12,1);
});
/* lampu lantai — penyatu pojok santai + aksen hangat di kamar kanan */
const lampPaint=(g,w,h)=>{
  contact(g,3,h-3,10,.7);
  P(g,'#a87c28',4,2,8,1);P(g,'#c89a3a',4,3,8,1);                              // rim kap
  P(g,'#ffe6a0',3,4,10,6);P(g,'#fff6d2',4,4,8,3);                             // kap + inti cahaya
  P(g,'#e8c878',3,9,10,1);                                                    // bibir bawah kap
  spill(g,2,10,12,3,'255,214,140',.18);                                       // cahaya tumpah ke bawah
  P(g,'#3a3a42',7,10,2,h-14);P(g,'#54545e',7,10,1,h-14);                      // tiang + kilau
  P(g,'#3a3a42',5,h-4,6,2);P(g,'#4a4a54',5,h-4,6,1);P(g,'#22222a',4,h-2,8,2); // dasar
};
const lamp=furn({x:7,y:16,w:1,h:1},20,lampPaint);
/* dispenser air (pengisi dinding kiri, bawah rak server) */
const cooler=furn({x:1,y:4,w:1,h:1},6,(g,w,h)=>{
  contact(g,2,h-3,12,.8);
  P(g,'#2b4468',5,1,6,6);                                                     // garis luar galon
  P(g,'#3a5a8a',5,2,6,5);P(g,'#8fc9e0',6,2,4,4);P(g,'#c8ecf8',6,2,2,2);       // galon + kilau air
  const R=ramp('#dfe6ee');
  P(g,R.out,3,6,10,h-8);
  P(g,R.base,4,7,8,h-9);P(g,R.hi,4,7,8,2);P(g,R.lo,10,9,2,h-12);              // badan dispenser
  P(g,'#2a303c',6,12,4,2);P(g,'#4cc9e0',7,12,1,1);                            // keran
  P(g,'#9aa4b0',4,h-3,8,2);P(g,'#7e8894',4,h-2,8,1);                          // dasar
});
/* tumpukan peti kayu (pengisi dinding kiri bawah) */
const boxes=furn({x:1,y:12,w:1,h:1},7,(g,w,h)=>{
  contact(g,1,h-3,14,.9);
  const A=ramp('#6e4a2a'), B=ramp('#7a5330');
  P(g,A.out,1,5,13,12);P(g,A.base,2,6,11,10);                                 // peti bawah
  P(g,A.hi,2,6,11,2);P(g,A.lo,2,14,11,2);P(g,A.lo,12,8,1,8);
  P(g,A.lo,7,6,1,10);P(g,A.hi,8,6,1,10);                                      // papan silang
  P(g,B.out,3,-1,10,8);P(g,B.base,4,0,8,6);                                   // peti atas
  P(g,B.hi,4,0,8,2);P(g,B.lo,4,5,8,1);P(g,B.lo,11,2,1,4);
  P(g,'#e8c05a',6,2,4,1);P(g,'#a87c28',6,3,4,1);                              // label + bayangnya
});
/* loker dua pintu (pengisi dinding pembatas, dekat AREA SAMPLING) */
const locker=furn({x:9,y:6,w:1,h:1},8,(g,w,h)=>{
  contact(g,1,h-3,14);
  const R=ramp('#455063');
  P(g,R.out,2,1,12,h-4);
  P(g,R.base,3,2,10,h-5);P(g,R.hi,3,2,10,2);P(g,R.lo,11,4,2,h-8);             // badan loker
  P(g,'#242b37',4,4,4,h-9);P(g,'#242b37',9,4,3,h-9);                          // dua pintu
  P(g,'#2f3745',4,4,4,1);P(g,'#2f3745',9,4,3,1);                              // tepi atas pintu
  P(g,'#171c25',8,4,1,h-9);                                                   // celah antar pintu
  for(let y=6;y<10;y+=2){P(g,'#12161d',4,y,4,1);P(g,'#12161d',9,y,3,1);}      // ventilasi
  P(g,'#c9c9d2',6,11,1,2);P(g,'#c9c9d2',10,11,1,2);                           // gagang
  P(g,'#6d727c',6,13,1,1);P(g,'#6d727c',10,13,1,1);
});
/* LIFT — elevator menempel dinding di samping EVIDENCE; kabinnya menghubungkan
   lantai 1 (ruang kerja) dengan lantai 2 (ruang arsip). Posisi sama di kedua denah.
   Pintu KACA semi-transparan yang menggeser buka-tutup; interior kabin terlihat. */
const liftPaint=(g,w,h)=>{
  /* interior kabin (di dalam bukaan — tampak lewat kaca / saat pintu terbuka) */
  P(g,'#0f131a',5,6,w-10,h-6);                                 // rongga
  P(g,'#20272f',6,8,w-12,h-11);                                // dinding belakang
  P(g,'#2b333d',6,8,w-12,1);                                   // kepala dinding kabin kena cahaya
  P(g,'#262e38',7,11,w-14,1);P(g,'#262e38',7,17,w-14,1);       // garis panel
  P(g,'#171e26',7,12,w-14,1);P(g,'#171e26',7,18,w-14,1);       // bayang tepat di bawah garis
  P(g,'#12161c',6,h-3,w-12,3);P(g,'#1c232b',6,h-3,w-12,1);     // lantai kabin
  P(g,'#3a4450',w-10,12,3,8);P(g,'#4d5866',w-10,12,3,1);       // panel kendali
  P(g,'#5ee8c8',w-9,13,1,1);P(g,'#e8c05a',w-9,16,1,1);         // LED
  P(g,'rgba(150,210,235,.12)',6,8,w-12,4);                     // cahaya plafon
  spill(g,6,h-6,w-12,3,'150,210,235',.10);                     // pantulannya di lantai kabin
  /* rangka baja flush dinding: lintel + jamb (tanpa sill, menempel) */
  const R=ramp('#2b3039');
  P(g,R.base,0,0,w,6);P(g,R.hi,0,0,w,1);P(g,R.lo,0,5,w,1);     // lintel
  P(g,R.base,0,0,5,h);P(g,R.base,w-5,0,5,h);                   // jamb kiri/kanan
  P(g,R.hi,0,0,1,h);P(g,R.lo,w-6,0,1,h);                       // sisi terang & bayang jamb
  P(g,'#0d1117',5,6,1,h-6);P(g,'#0d1117',w-6,6,1,h-6);         // bayangan dalam bukaan
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
const partPaint=(g,w,h)=>{
  const yt=4, yb=h-3;                                          // atas & dasar partisi (naik ~6px di atas ubin)
  P(g,'rgba(0,0,0,.22)',1,yb+2,w-2,3);                         // bayangan kontak di lantai
  P(g,'rgba(120,170,200,.16)',1,yt+3,w-2,yb-yt-5);             // panel kaca beku
  P(g,'rgba(190,220,238,.13)',1,yt+3,w-2,3);                   // kilau atas kaca
  P(g,'rgba(120,170,200,.10)',1,yb-4,w-2,3);                   // kaca menebal mendekati rel bawah
  const R=ramp('#3a4453');
  P(g,R.lo,0,yt,w,3);P(g,R.hi,0,yt,w,1);                       // rel atas logam
  P(g,'#4cc9e0',0,yt+1,w,1);                                   // garis neon cyan
  P(g,'rgba(76,201,224,.10)',0,yt+3,w,3);                      // pendar neon turun ke kaca
  P(g,'#2b3340',0,yb,w,3);P(g,'#3e4959',0,yb,w,1);             // rel bawah + tepi kena cahaya
  P(g,'#161b23',0,yb+2,w,1);
  for(let x=0;x<w;x+=15){                                      // tiang tiap ubin
    P(g,'#455063',x,yt,3,yb-yt+3);
    P(g,'#5f6b7e',x,yt,1,yb-yt+3);P(g,'#232a35',x+2,yt,1,yb-yt+3);
  }
};
const divider=furn({x:4,y:13,w:4,h:1},10,partPaint);
FURN.push(divider);
/* --- RAK PEMBIBITAN (baris 9) --------------------------------------------
   Dulu di sini berdiri partisi kaca kedua. Masalahnya bukan bentuknya: ia
   memisahkan dua ruang yang SAMA-SAMA KOSONG, jadi terbaca sebagai bidang
   menggantung tanpa pekerjaan. Bangku semai memikul tugas yang persis sama —
   jejak padatnya tidak berubah sedikit pun, celah lewat tetap di kolom 8-9 —
   tapi ia perabot yang punya alasan berdiri, dan tepat untuk kantor penyuluh.

   Dibuat berbeda dari rak hidroponik di lorong dengan sengaja: hidroponik itu
   rak TEGAK, empat tanaman berbeda yang tumbuh sendiri-sendiri dan dianimasi.
   Ini bangku MENDATAR, puluhan semai seragam dalam tray sel. Dua benda yang
   tak akan tertukar walau sekilas.

   Tiga tray lalu satu karung media: pengulangan membangun polanya, satu
   patahan di ujung menghidupkannya. Didaftarkan lewat seasonal(), jadi isinya
   bercerita sepanjang tahun. */
const TRAYX=[8,30,52];                                        // tiga tray, lebar 20
/* tinggi semai & kerapatannya per musim — urut SEASONS */
const SEMAI=[{t:3,penuh:1},   // SEMI      : tunas muda sudah serempak
             {t:5,penuh:1},   // KEMARAU   : siap tanam, paling rimbun
             {t:4,penuh:0},   // GUGUR     : sebagian sudah diangkat ke lapangan
             {t:1,penuh:1}];  // PERALIHAN : baru disemai, hampir semua masih tanah
const semaiPaint=(g,w,h)=>{
  const S=SN(), M=SEMAI[season], Rk=ramp('#3d4657'), Tr=ramp('#262a33');
  contact(g,2,h-3,w-4);

  /* --- batang lampu tumbuh, digantung pada dua tiang --- */
  P(g,Rk.out,2,0,w-4,4);
  P(g,Rk.base,3,1,w-6,2);P(g,Rk.hi,3,1,w-6,1);                // rangka + tepi atas kena cahaya
  P(g,'#c9a0f0',4,3,w-8,1);                                   // muka lampu menyala
  for(const px of [4,w-6]){
    P(g,Rk.base,px,4,2,12);P(g,Rk.hi,px,4,1,12);              // tiang turun ke papan
  }

  /* --- kolong: kaki + tray kosong ditumpuk di lantai --- */
  for(const lx of [5,46,w-8]){
    P(g,Rk.lo,lx,19,3,8);P(g,'#1b2029',lx,19,1,8);            // kaki + sisi membayang
  }
  for(const sx of [16,58]){                                   // tiga tray kosong, dilihat dari sisinya
    for(let k=0;k<3;k++){const yy=21+k*2;
      P(g,Tr.base,sx,yy,14,2);P(g,Tr.hi,sx,yy,14,1);P(g,Tr.lo,sx,yy+1,14,1);}
  }

  /* --- papan bangku --- */
  P(g,Rk.out,1,15,w-2,4);
  P(g,Rk.base,2,16,w-4,2);P(g,Rk.hi,2,16,w-4,1);P(g,Rk.lo,2,18,w-4,1);

  /* --- tray sel + semainya --- */
  for(const tx of TRAYX){
    P(g,Tr.out,tx,11,20,5);                                   // badan tray
    P(g,Tr.base,tx+1,12,18,3);P(g,Tr.hi,tx+1,12,18,1);
    P(g,'#2a1c12',tx+2,13,16,2);P(g,'#3a2817',tx+2,13,16,1);  // media semai + permukaannya
    P(g,Tr.lo,tx+1,15,18,1);
    for(let c=0;c<4;c++){
      const cx=tx+3+c*4;                                      // satu semai per sel, rumpunnya 2 px
      P(g,Tr.lo,cx-1,12,1,3);                                 // sekat sel
      if(!M.penuh&&(rnd(tx+c*13,season*7+3)>>>2)%3===0)continue;  // gugur: sel yang sudah diangkat
      const th=M.t+((rnd(tx+c*7,season*11)>>>3)%2);
      P(g,S.mid,cx,13-th,2,th);                               // rumpun
      P(g,S.hi,cx,13-th,2,1);                                 // pucuk kena cahaya
      if(th>=5)P(g,S.hi2,cx,13-th,2,1);                       // paling tinggi: pucuknya paling muda
      if(th>=3){P(g,S.hi,cx-1,14-th,1,2);P(g,S.hi,cx+2,15-th,1,2);} // sepasang daun
    }
  }

  /* --- karung media tanam di ujung kanan: satu patahan dari pola tray --- */
  /* Terang-gelapnya dipasang TEGAK, bukan sebagai pita mendatar. Pita mendatar
     terbaca sebagai bilah peti; sisi terang-bayang yang tegak membuatnya
     terbaca sebagai karung yang menggembung. Mulutnya dibuat lebih sempit
     dari badannya, karena itulah yang membedakan karung terbuka dari kotak. */
  const Kr=ramp('#8a7448');
  P(g,Kr.out,75,7,12,9);
  P(g,Kr.base,76,8,10,7);P(g,Kr.hi,76,8,3,7);P(g,Kr.lo,84,9,2,6);
  P(g,Kr.out,78,7,6,2);P(g,Kr.hi,79,7,4,1);                   // bibir mulut karung
  P(g,'#2a1c12',79,8,4,1);                                    // media tanam kelihatan di dalamnya
  P(g,Kr.lo,76,14,10,1);                                      // dasar menapak papan

  /* Pendar lampu: dua pita yang melebar sambil memudar, bukan satu hamparan
     rata — hamparan beralfa tunggal punya tepi bawah lurus selebar benda, dan
     itu terbaca sebagai PANEL ungu, bukan cahaya yang jatuh.
     Pitanya BERHENTI di udara kosong dan tidak menyelimuti semai, tray, atau
     karungnya. Alasannya terukur: tiap pita tembus pandang melahirkan satu
     warna campuran BARU untuk setiap warna yang dilewatinya, dan versi
     bertiga-pita-selebar-benda membengkak jadi 55 warna — padahal partisi kaca
     di sebelahnya 17 dan rak hidroponik 21. Cahaya yang jatuh ke tanaman
     DICAT (pucuk S.hi / S.hi2 di atas), tidak ditimpakan. */
  P(g,'rgba(160,90,224,.17)',5,4,w-10,2);
  P(g,'rgba(160,90,224,.10)',4,6,w-8,2);
};
const semaiRak=seasonal(furn({x:2,y:9,w:6,h:1},14,semaiPaint));
FURN.push(semaiRak);
/* Raknya memisahkan dua ruang, jadi zonanya dipasang di KEDUA sisi: dari
   lorong EVIDENCE di atas dan dari lounge di bawah. Petak yang sudah punya
   zona lain tidak ditimpa — aturan yang sama dipakai zona kolam. */
const semaiTool={id:'semai',name:'PEMBIBITAN',short:'SEMAI',color:'#7fd46a',
                 btn:'LIHAT &#9656;',isSemai:true,desc:''};
for(const zy of [8,10])for(let zx=2;zx<=7;zx++){
  const k=zx+','+zy;
  if(SOLIDS[0][zy*COLS+zx]||ZONES[0][k])continue;
  ZONES[0][k]=semaiTool;
}
/* --- pengisi kamar kanan-atas (pelaporan) --- */
const rackC=furn({x:23,y:4,w:1,h:1},4,g=>{rackPaint(g);});   // rak data (dinding kanan)
const potRA=seasonal(furn({x:17,y:7,w:1,h:1},4,potPaint));             // tanaman sudut
/* --- pengisi kamar kanan-bawah (bengkel) --- */
const shelfR=furn({x:23,y:10,w:1,h:1},8,(g,w,h)=>{           // rak besi suku cadang
  contact(g,1,h-3,14);
  const R=ramp('#3a4250');
  P(g,R.out,1,1,14,h-4);
  P(g,R.base,2,2,12,h-5);P(g,R.hi,2,2,12,2);P(g,R.lo,12,4,2,h-8); // rangka
  P(g,'#161b23',3,4,10,3);P(g,'#161b23',3,10,10,3);            // rongga rak
  P(g,'#161b23',3,16,10,2);
  P(g,R.hi,3,7,10,1);P(g,R.hi,3,13,10,1);                      // ambalan kena cahaya
  P(g,'#262d38',3,8,10,1);P(g,'#262d38',3,14,10,1);            // bayang di bawah ambalan
  P(g,'#7a7f88',4,4,3,3);P(g,'#9aa0aa',4,4,3,1);               // balok logam
  P(g,'#5f6670',9,4,3,3);P(g,'#787f8a',9,4,3,1);
  P(g,'#c9a24a',5,10,2,3);P(g,'#e0bd68',5,10,2,1);             // baut kuningan
  P(g,'#5f6670',9,10,3,3);P(g,'#787f8a',9,10,3,1);             // roda gigi
  P(g,'#8a6a42',4,16,6,2);P(g,'#a38154',4,16,6,1);             // kayu
});
const gasCyl=furn({x:15,y:10,w:1,h:1},8,(g,w,h)=>{           // tabung gas
  contact(g,2,h-3,12,.9);
  P(g,'#2a2a32',6,0,4,6);P(g,'#55555f',6,1,4,5);P(g,'#75757f',6,1,2,4); // katup
  const R=ramp('#b5482f');
  P(g,R.out,3,4,10,h-7);
  P(g,R.base,4,5,8,h-8);P(g,R.hi,4,5,8,2);                     // tabung + bahu kena cahaya
  P(g,R.hi,5,7,1,h-12);                                        // kilau vertikal
  P(g,R.lo,10,7,2,h-11);                                       // sisi kanan membayang
  P(g,'#e8c05a',5,11,6,1);P(g,'#a87c28',5,12,6,1);             // strip label + bayangnya
  P(g,'#151a22',4,h-3,8,1);                                    // dasar
});
const tires=furn({x:15,y:16,w:1,h:1},6,(g,w,h)=>{           // tumpukan ban
  contact(g,1,h-3,14,.9);
  for(let i=0;i<2;i++){const yy=h-6-i*6;
    P(g,'#0d0d11',2,yy,12,5);                                 // karet gelap
    P(g,'#25252d',2,yy,12,1);                                 // punggung kena cahaya
    P(g,'#1a1a1f',3,yy+1,10,3);
    P(g,'#08080b',4,yy+2,8,2);P(g,'#33333c',4,yy+2,8,1);      // lubang velg
    for(let x=3;x<12;x+=3)P(g,'#2e2e37',x,yy,2,1);}           // kembang ban (2 px, bukan bintik)
});
/* --- jukebox (lounge, samping sofa) --- */
const jukebox=furn({x:4,y:16,w:1,h:1},14,(g,w,h)=>{          // h=30
  contact(g,1,h-3,14);
  const R=ramp('#6e4a2a');
  P(g,R.out,1,4,14,h-5);
  P(g,R.base,2,5,12,h-7);P(g,R.hi,2,5,12,2);                  // badan kayu + puncak kena cahaya
  P(g,R.lo,12,7,2,h-10);P(g,R.hi,3,7,1,h-11);                 // sisi bayang & sisi terang
  P(g,'#e07ad0',3,2,10,2);P(g,'#4cc9e0',4,1,8,1);             // busur neon
  spill(g,2,4,12,3,'224,122,208',.16);                        // neon menyinari puncak kayu
  P(g,'#08131c',4,6,8,4);P(g,'#0e2130',4,6,8,1);              // layar (diisi anim)
  P(g,'#1a0f09',4,13,8,7);                                    // rongga speaker
  for(let y=14;y<20;y+=2){P(g,'#0d0805',5,y,6,1);P(g,'#3a2616',5,y+1,6,1);} // kisi + bibir kena cahaya
  P(g,'#e8c05a',5,22,2,2);P(g,'#a87c28',5,24,2,1);            // tombol + bayangnya
  P(g,'#7ee06a',8,22,2,2);P(g,'#4a8f3a',8,24,2,1);
  P(g,'#4cc9e0',11,22,1,2);P(g,'#2a7f95',11,24,1,1);
  P(g,'#2a1810',2,h-3,12,3);P(g,'#3d2718',2,h-3,12,1);        // dasar
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
  contact(g,2,h-3,w-4);
  const R=ramp('#3d4657');
  P(g,R.out,1,-1,4,h-2);P(g,R.out,w-5,-1,4,h-2);
  P(g,R.base,2,0,2,h-4);P(g,R.base,w-4,0,2,h-4);                // tiang rangka
  P(g,R.hi,2,0,1,h-4);P(g,R.hi,w-4,0,1,h-4);                    // sisi tiang kena cahaya
  for(const y of [4,14]){                                       // dua ambalan
    P(g,R.out,1,y-1,w-2,4);
    P(g,R.base,2,y,w-4,2);P(g,R.hi,2,y,w-4,1);                  // papan + tepi kena cahaya
    P(g,'#241a10',5,y-2,w-10,2);P(g,'#3a2a18',5,y-2,w-10,1);    // media tanam + permukaannya
    P(g,'rgba(160,90,224,.14)',3,y+2,w-6,3);                    // lampu tumbuh menyinari ke bawah
  }
  const T2=ramp('#3a5a8a');                                     // tandon air
  P(g,'#10141c',2,h-8,w-4,6);P(g,'#1c222c',2,h-8,w-4,1);
  P(g,T2.base,4,h-6,w-8,3);P(g,T2.hi,4,h-6,w-8,1);              // air + kilau permukaan
  P(g,T2.lo,4,h-4,w-8,1);
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
  contact(g,2,h-3,w-4);
  const M=ramp('#3d4657');
  P(g,M.out,1,15,w-2,8);
  P(g,M.base,2,16,w-4,6);P(g,M.hi,2,16,w-4,2);P(g,M.lo,2,21,w-4,1); // meja rendah
  const V=ramp('#2f3038');
  P(g,V.out,3,1,w-6,16);P(g,V.base,4,2,w-8,14);
  P(g,V.hi,4,2,w-8,1);P(g,V.hi,4,2,1,14);P(g,V.lo,w-5,3,1,13);   // TV CRT
  P(g,'#0b0d12',6,4,w-12,9);                                     // layar (diisi anim)
  P(g,'#55555f',11,0,1,3);P(g,'#55555f',19,0,1,3);               // antena
  P(g,'#727280',11,0,1,1);P(g,'#727280',19,0,1,1);
  spill(g,5,14,w-10,3,'120,160,220',.12);                        // cahaya TV jatuh ke meja
});
anims.push({fn:(g,t)=>{                                          // layar TV berganti warna
  const x=tvset.px+6,y=tvset.py+4;
  P(g,'#101014',x,y,20,9);
  P(g,['#3a5a8a','#46a14e','#e07ad0'][Math.floor(t/600)%3],x+2,y+2,16,5);
  P(g,'rgba(255,255,255,.15)',x+2,y+2+(Math.floor(t/120)%5),16,1);
}});
const sofa=furn({x:5,y:16,w:2,h:1},10,(g,w,h)=>{                 // sofa menghadap UTARA (ke TV), tampak dari belakang
  const A=ramp('#6b36a8'), B=ramp('#8548c8');
  P(g,'rgba(0,0,0,.30)',1,23,w-2,3);                             // bayangan kontak di lantai
  P(g,A.out,-1,5,w+2,20);                                        // garis luar siluet
  P(g,A.base,0,6,6,18);P(g,A.base,w-6,6,6,18);                   // bantalan lengan kiri & kanan
  P(g,A.hi,0,6,6,3);P(g,A.hi,w-6,6,6,3);                         // punggung lengan kena cahaya
  P(g,A.lo,0,21,6,3);P(g,A.lo,w-6,21,6,3);                       // bayangan bawah lengan
  P(g,A.lo,5,8,1,14);P(g,A.lo,w-6,8,1,14);                       // lipatan tempat lengan bertemu sandaran
  P(g,B.base,6,13,w-12,12);                                      // sandaran punggung (menghadap kita)
  P(g,B.hi,6,13,w-12,3);                                         // kilau atas sandaran
  P(g,A.base,6,22,w-12,3);                                       // dasar sandaran
  P(g,A.lo,6,15,w-12,1);P(g,B.hi,6,16,w-12,1);                   // pipa jahitan + kilaunya
  P(g,A.lo,(w>>1)-1,17,1,7);                                     // jahitan pemisah dua bantal
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
  contact(g,4,h-3,w-8);
  const R=ramp('#3d4657');
  P(g,R.out,2,6,w-4,h-9);
  P(g,R.hi,3,7,w-6,2);P(g,R.base,3,9,w-6,h-14);                // permukaan + tebal meja
  P(g,R.lo,3,h-5,w-6,1);
  P(g,'#2a303c',6,h-4,3,4);P(g,'#2a303c',w-9,h-4,3,4);         // kaki
  P(g,'#1b2029',6,h-4,1,4);P(g,'#1b2029',w-9,h-4,1,4);
  const Pj=ramp('#2f3644');                                    // proyektor
  P(g,Pj.out,(w>>1)-5,1,10,7);P(g,Pj.base,(w>>1)-4,2,8,5);
  P(g,Pj.hi,(w>>1)-4,2,8,1);P(g,Pj.lo,(w>>1)+3,3,1,4);
  P(g,'#0b0d12',(w>>1)-3,3,6,2);
  P(g,'#2ee0ff',(w>>1)-1,2,2,1);
  spill(g,(w>>1)-7,7,14,3,'46,224,255',.14);                   // pendar holo jatuh ke meja
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

const DECKA=ramp('#2a313d'), DECKB=ramp('#262c37');            // dua nada pelat lantai dek
const WALL1=ramp('#2f3542');                                   // dinding lambung, dihitung sekali
function buildBG2(){
  const g=bg2c;
  P(g,'#05070b',0,0,W,H);                                      // rongga gelap di luar dek
  /* lantai: serambi lift = pelat beton · aula arsip = papan kayu hangat */
  for(let ty=0;ty<ROWS;ty++)for(let tx=0;tx<COLS;tx++){
    if(MAP2[ty][tx]!=='.')continue;
    const px=tx*T,py=ty*T,r=rnd(tx,ty)%14;
    const alt=(tx+ty)&1;                                       // pelat lambung — timbul (bervolume)
    const Z=alt?DECKA:DECKB;
    P(g,Z.base,px,py,T,T);
    P(g,Z.hi,px,py,T,1);P(g,Z.hi,px,py,1,T);                   // highlight atas+kiri (terangkat)
    P(g,Z.lo,px,py+T-1,T,1);P(g,Z.lo,px+T-1,py,1,T);           // bayang bawah+kanan (nat dalam)
    P(g,'rgba(0,0,0,.16)',px+1,py+T-2,T-2,1);                  // ambient occlusion bawah
    P(g,'rgba(120,140,165,.05)',px+1,py+1,T-2,1);              // sheen halus atas
    P(g,'#3a4452',px+2,py+2,1,1);P(g,'#3a4452',px+T-3,py+2,1,1);   // rivet sudut
    P(g,'#3a4452',px+2,py+T-3,1,1);P(g,'#3a4452',px+T-3,py+T-3,1,1);
    if(r===3)P(g,'#313a48',px+4,py+7,8,1);                     // goresan pelat
    if(r===9)P(g,'rgba(76,201,224,.045)',px+3,py+3,T-6,T-6);   // panel berpendar sesekali
  }
  /* dinding — muka baja bila ada lantai di bawahnya, sisanya rongga */
  for(let ty=0;ty<ROWS;ty++)for(let tx=0;tx<COLS;tx++){
    if(MAP2[ty][tx]!=='#')continue;
    const px=tx*T,py=ty*T;
    if(ty+1<ROWS&&MAP2[ty+1][tx]==='.'){
      const R=WALL1;                                            // dinding lambung: kepala terang, pangkal redup
      P(g,R.base,px,py,T,T);
      P(g,R.hi,px,py,T,2);
      P(g,R.lo,px,py+T-8,T,4);
      for(let x=0;x<T;x+=6){                                    // panel tegak bermatra
        P(g,'#3f4857',px+x,py+2,1,T-10);
        P(g,'#1e232d',px+x+5,py+2,1,T-10);
      }
      P(g,'#14181f',px,py+T-4,T,4);                             // list bawah dinding
      P(g,'#272f3c',px,py+T-4,T,1);
      const br=(0.45+0.55*daylight.lamp).toFixed(2);
      const c=tx<7?[76,201,224]:[90,176,242];                   // strip lampu kapal (cyan · biru)
      P(g,`rgba(${c[0]},${c[1]},${c[2]},${br})`,px,py+T-5,T,1);
      P(g,'rgba(0,0,0,.34)',px,py+T,T,2);                       // bayangan rapat di kaki dinding
      P(g,'rgba(0,0,0,.16)',px,py+T+2,T,3);
      pool(g,px,py+T+4,T,7,c.join(','),(.05*daylight.lamp+.02).toFixed(3));
    }else{
      P(g,'#10141a',px,py,T,T);
      P(g,'#171c24',px,py,T,1);
      for(let y=4;y<T;y+=8)P(g,'#151a21',px,py+y,T,1);
    }
  }
  dindingGaris(g,MAP2);                                  // denah diberi tepi
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
  /* railing tepi dek: pagar logam bervolume di atas rongga lantai bawah */
  for(let tx=0;tx<COLS;tx++){
    if(MAP2[8][tx]!=='.')continue;
    const px=tx*T,py=9*T;
    P(g,'rgba(0,0,0,.5)',px,py,T,3);                            // bayang tepi lantai (kuat)
    for(let x=2;x<T;x+=7){                                       // tiang bulat (sisi terang/gelap)
      P(g,'#2c3340',px+x,py-9,3,9);
      P(g,'#4e5868',px+x,py-9,1,9);                              // sisi kena cahaya (kiri)
      P(g,'#151a21',px+x+2,py-9,1,9);                            // sisi bayang (kanan)
    }
    P(g,'#616d7e',px,py-12,T,1);                                 // rel atas — highlight
    P(g,'#485265',px,py-11,T,2);                                 // rel atas — badan bulat
    P(g,'#1e232c',px,py-9,T,1);                                  // rel atas — bayang bawah
    P(g,'#3a4453',px,py-5,T,1);P(g,'#22272f',px,py-4,T,1);       // rel tengah
    P(g,'#414b5b',px,py-1,T,2);P(g,'#535e6f',px,py-1,T,1);       // kick bawah + highlight
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

/* railing dek digambar ULANG di depan pemain (render) supaya dino tampak BERDIRI
   DI BALIK pagar saat di tepi dek — versi terpanggang di bg2 tetap ada untuk sela. */
function drawDeckRail(g){
  for(let tx=0;tx<COLS;tx++){
    if(MAP2[8][tx]!=='.')continue;
    const px=tx*T,py=9*T;
    for(let x=2;x<T;x+=7){                                       // tiang bulat
      P(g,'#2c3340',px+x,py-9,3,9);P(g,'#4e5868',px+x,py-9,1,9);P(g,'#151a21',px+x+2,py-9,1,9);
    }
    P(g,'#616d7e',px,py-12,T,1);P(g,'#485265',px,py-11,T,2);P(g,'#1e232c',px,py-9,T,1); // rel atas
    P(g,'#3a4453',px,py-5,T,1);P(g,'#22272f',px,py-4,T,1);       // rel tengah
    P(g,'#414b5b',px,py-1,T,2);P(g,'#535e6f',px,py-1,T,1);       // kick bawah
  }
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

  /* robot pembersih lt.1 dilihat dari atas — GAYA SAMA dgn lt.1 (badan pipih +
     bayangan menempel lantai, tanpa halo) supaya tak tampak mengambang */
  const span=PEEK_AX1-PEEK_AX0-24;
  const bx=Math.round(PEEK_AX0+12+(0.5+0.5*Math.sin(t/3400))*span);
  const by=y0+Math.round(hh*0.44);
  const dk=1-(by-y0)/hh*0.35;                       // makin dalam makin redup (halus)
  const C=(r,gg,b)=>`rgb(${Math.round(r*dk)},${Math.round(gg*dk)},${Math.round(b*dk)})`;
  cx.fillStyle='rgba(0,0,0,.26)';cx.fillRect(bx-5,by+3,10,2);   // bayangan di lantai
  cx.fillStyle=C(38,48,60);cx.fillRect(bx-5,by-3,10,6);         // badan
  cx.fillStyle=C(57,65,79);cx.fillRect(bx-5,by-3,10,2);         // kilap atas
  cx.fillStyle=Math.floor(t/400)%2?C(46,224,255):C(26,127,153);
  cx.fillRect(bx+2,by-1,2,2);                                   // lampu kedip cyan (sama lt.1)

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
mkLift(false);   // kabin lift lantai 2 (furnitur di-push di dalam mkLift)

/* --- MEJA ARSIP e-RDKK : PROJEKT-FER (satu ruangan dgn forge & bengkel) --- */
const rdkkT=furn(TOOLS[7].rect,14,(g,w,h)=>{
  contact(g,2,h-3,w-4);
  /* meja arsip */
  const M=ramp('#4a5468');
  P(g,M.out,1,14,w-2,h-15);
  P(g,M.hi,2,15,w-4,2);P(g,M.base,2,17,w-4,2);                 // permukaan + tebalnya
  P(g,'#39414f',4,19,w-8,h-22);P(g,'#252b36',4,19,w-8,1);      // badan laci
  P(g,'#2a303c',4,h-3,w-8,3);                                  // sokle
  for(let i=0;i<2;i++){                                        // dua laci + gagang
    P(g,'#434c5e',7,21+i*5,w-14,3);P(g,'#4f5a6e',7,21+i*5,w-14,1);
    P(g,'#232a35',7,24+i*5,w-14,1);                            // celah bawah laci
    P(g,'#8f98a8',20,22+i*5,8,1);P(g,'#5e6675',20,23+i*5,8,1);
  }
  /* monitor lembar kerja, ramping supaya meja tetap seukuran meja lain */
  const S2=ramp('#2b3038');
  P(g,S2.out,9,-1,30,17);P(g,S2.base,10,0,28,15);
  P(g,S2.hi,10,0,28,1);P(g,S2.hi,10,0,1,15);P(g,S2.lo,37,1,1,14);
  P(g,'#0d1218',12,2,24,11);                                   // kaca
  P(g,'#1e2830',12,2,24,2);                                    // baris judul kolom
  for(let x=18;x<36;x+=8)P(g,'#1e2830',x,2,1,11);              // garis kolom
  P(g,'rgba(180,220,255,.06)',13,3,5,9);                       // pantulan miring di kaca
  P(g,'#c2f24a',35,3,1,1);                                     // LED daya
  spill(g,11,14,26,3,'194,242,74',.11);                        // layar menyinari permukaan meja
  /* tumpukan formulir di kiri, karung pupuk di kanan */
  P(g,'rgba(0,0,0,.26)',2,14,9,2);
  P(g,'#b3ab90',2,10,8,5);P(g,'#e8e4d8',2,10,8,4);
  P(g,'#f4f1e8',2,10,8,1);P(g,'#9fb8d0',4,12,4,1);
  P(g,'rgba(0,0,0,.26)',39,14,8,2);
  P(g,'#a39a80',39,8,7,7);P(g,'#c9c2a8',39,8,7,6);
  P(g,'#ddd6bc',39,8,7,1);
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

/* badan meja arsip dipakai dua stasiun (ROPS & CPCLs) — satu bahasa bentuk,
   jadi keduanya tidak menebak sendiri tebal meja & kedalaman lacinya */
function arsipDesk(g,w,h){
  contact(g,2,h-3,w-4);
  const M=ramp('#4a5468');
  P(g,M.out,0,13,w,h-14);
  P(g,M.hi,1,14,w-2,2);P(g,M.base,1,16,w-2,2);                 // permukaan + tebalnya
  P(g,'#39414f',3,18,w-6,9);P(g,'#252b36',3,18,w-6,1);         // badan
  P(g,'#2a303c',3,27,w-6,2);                                   // sokle
  P(g,'#2a303c',4,29,3,3);P(g,'#2a303c',w-7,29,3,3);           // kaki
  P(g,'#1b2029',4,29,1,3);P(g,'#1b2029',w-7,29,1,3);
  for(let i=0;i<2;i++){                                        // dua laci
    const y=19+i*4;
    P(g,'#434c5e',6,y,w-12,3);P(g,'#4f5a6e',6,y,w-12,1);
    P(g,'#232a35',6,y+3,w-12,1);                               // celah bawah laci
    P(g,'#8f98a8',18,y+1,12,1);P(g,'#5e6675',18,y+2,12,1);     // gagang + bayangnya
  }
}

/* --- MEJA PROPOSAL & PENJILIDAN : PROJECT ROPS --- */
const ropsT=furn(TOOLS[8].rect,16,(g,w,h)=>{
  /* mesin cetak proposal berdiri di belakang meja */
  const Pm=ramp('#2b3038');
  P(g,Pm.out,5,-1,26,16);P(g,Pm.base,6,0,24,14);
  P(g,Pm.hi,6,0,24,1);P(g,Pm.hi,6,0,1,14);P(g,Pm.lo,29,1,1,13);
  P(g,'#10141c',9,3,18,6);P(g,'#1a2230',9,3,18,1);             // panel kaca
  P(g,'rgba(180,220,255,.06)',10,4,4,5);                       // pantulan miring di kaca
  P(g,'#0d1218',9,11,18,2);                                    // celah keluar kertas
  P(g,'#454f61',6,13,24,1);P(g,'#a78bfa',27,2,1,1);            // ambang bawah + LED daya
  spill(g,7,14,22,2,'167,139,250',.10);                        // pendar mesin ke permukaan meja
  /* cap & bantalan tinta di ujung kiri meja */
  P(g,'#5a3a2a',1,8,4,2);P(g,'#8a5a3a',1,8,4,1);               // gagang cap
  P(g,'#5a3a2a',2,10,2,3);
  P(g,'#1b1b22',0,12,6,3);P(g,'#26262e',0,12,6,1);             // bantalan tinta
  P(g,'#b83a2a',1,13,4,1);P(g,'#8a2a1e',1,14,4,1);
  /* tumpukan proposal terjilid di ujung kanan */
  P(g,'rgba(0,0,0,.26)',33,13,13,2);                           // bayangannya di meja
  P(g,'#b3ab90',33,7,13,7);P(g,'#e8e4d8',33,7,13,6);           // berkas
  P(g,'#f4f1e8',33,7,13,1);
  P(g,'#a78bfa',33,7,2,7);P(g,'#c3b0ff',33,7,2,1);             // punggung jilid
  P(g,'#9aa0aa',38,10,6,1);P(g,'#9aa0aa',38,12,4,1);           // baris teks sampul
  arsipDesk(g,w,h);                                            // badan meja arsip (dipakai dua stasiun)
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
  const Pb=ramp('#2b3038');
  P(g,Pb.out,3,-1,28,16);P(g,Pb.base,4,0,26,14);
  P(g,Pb.hi,4,0,26,1);P(g,Pb.hi,4,0,1,14);P(g,Pb.lo,29,1,1,13);
  P(g,'#b3ab90',6,2,22,11);P(g,'#e8e4d8',6,2,22,10);           // lembar daftar
  P(g,'#5ab0f2',6,2,22,2);P(g,'#8fcdfa',6,2,22,1);             // kepala tabel
  P(g,'#cfcabb',16,4,1,9);                                     // garis pemisah kolom
  P(g,'#b9bec6',8,6,7,1);P(g,'#b9bec6',18,6,7,1);              // baris nama & luas
  P(g,'#b9bec6',8,8,8,1);P(g,'#b9bec6',18,8,6,1);
  P(g,'#b9bec6',8,10,6,1);P(g,'#b9bec6',18,10,8,1);
  P(g,'#454f61',4,13,26,1);                                    // ambang bawah papan
  /* karung benih & pupuk bertumpuk di ujung kanan meja */
  P(g,'rgba(0,0,0,.26)',33,13,13,2);                           // bayangannya di meja
  P(g,'#a3946c',33,5,13,9);P(g,'#c9b98f',33,5,13,8);           // karung besar
  P(g,'#ddcfa6',33,5,13,1);
  P(g,'#8d7f5c',33,9,13,1);P(g,'#5ab0f2',36,11,7,1);           // jahitan & label
  P(g,'#94855f',35,1,9,4);P(g,'#b3a37c',35,1,9,3);             // karung kecil di atasnya
  P(g,'#c9b98f',35,1,9,1);
  /* timbangan di ujung kiri meja */
  P(g,'#2a303c',0,10,4,4);P(g,'#39414f',0,10,4,1);
  P(g,'#b9c0cb',0,9,4,1);
  arsipDesk(g,w,h);                                            // badan meja arsip (dipakai dua stasiun)
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
  const R=ramp('#343945');
  contact(g,0,h-3,w);
  P(g,R.out,-1,-1,w+2,h);
  P(g,R.base,0,0,w,h-2);P(g,R.hi,0,0,w,1);P(g,R.lo,w-1,1,1,h-3); // badan rak
  P(g,'#1e222a',0,h-2,w,2);                                    // kaki
  for(let r=0;r<4;r++){                                        // empat tingkat ordner
    const y=3+r*7;
    P(g,'#14171d',2,y,w-4,6);                                  // rongga rak
    for(let x=3,k=0;x<w-4;x+=3,k++){
      const c=ORD2[(rnd(seed*31+x,r*17+k)>>>4)%ORD2.length], C=ramp(c);
      /* Kaki punggung dibuat selebar 2 px. Dulu 1x1 dan berdiri sendiri di
         antara warna lain, jadi terbaca sebagai kotoran, bukan bentuk. */
      P(g,C.base,x,y+1,2,4);P(g,C.hi,x,y+1,1,4);P(g,C.lo,x,y+4,2,1);   // punggung + sisi terang
    }
    P(g,'rgba(215,220,228,.13)',3,y+3,w-7,1);                  // pita label indeks
    P(g,'rgba(0,0,0,.40)',2,y,w-4,1);                          // bayangan dalam rongga
    P(g,'#2a303a',2,y+6,w-4,1);P(g,'#3b4350',2,y+6,w-4,1);     // papan rak kena cahaya
    P(g,'#171b22',2,y+7,w-4,1);                                // bayang di bawah papan
  }
};
/* rak buku terisi rapat — spine warna arsip (coklat/tan/slate) jelas terlihat */
const BUKU=['#8a5a3a','#6e5a44','#5d6773','#3a5a4a','#7a4a52','#6a6272','#b09040','#4a6478'];
const bukuPaint=seed=>(g,w,h)=>{
  const R=ramp('#343945');
  contact(g,0,h-3,w);
  P(g,R.out,-1,-1,w+2,h);
  P(g,R.base,0,0,w,h-2);P(g,R.hi,0,0,w,1);P(g,R.lo,w-1,1,1,h-3); // badan rak
  P(g,'#1e222a',0,h-2,w,2);                                    // kaki
  for(let r=0;r<4;r++){
    const y=3+r*7;
    P(g,'#14171d',2,y,w-4,6);                                  // rongga rak
    /* Punggung buku dibuat 2 px. Selebar 1 px, tiap piksel berbeda dari kedua
       tetangganya dan rak ini terukur 27% piksel yatim — terbaca sebagai derau,
       bukan deretan buku. 2 px memberinya sisi terang dan sisi bayang. */
    for(let x=2;x<w-3;x+=2){
      const c=BUKU[(rnd(seed*97+x*7,r*29+13)>>>2)%BUKU.length], C=ramp(c);
      const tall=(rnd(seed*13+x,r*7)>>>3)%3;                     // tinggi buku sedikit beragam
      const top=y+1+(tall===0?1:0), hh=4-(tall===0?1:0);
      P(g,C.base,x,top,2,hh);
      P(g,C.hi,x,top,1,hh);                                      // sisi kiri kena cahaya
      P(g,C.lo,x+1,top,1,hh);                                    // sisi kanan membayang
      P(g,C.hi,x,top,2,1);                                       // kepala punggung
    }
    P(g,'rgba(0,0,0,.40)',2,y,w-4,1);                          // bayangan atas rongga
    P(g,'rgba(215,220,228,.12)',3,y+3,w-7,1);                  // pita label indeks
    P(g,'#2a303a',2,y+6,w-4,1);P(g,'#3b4350',2,y+6,w-4,1);     // papan rak kena cahaya
    P(g,'#171b22',2,y+7,w-4,1);                                // bayang di bawah papan
  }
};
const arsipA=furn({x:8,y:2,w:1,h:1},18,bukuPaint(3));
const arsipB=furn({x:21,y:2,w:2,h:1},18,arsipPaint(11));
FURN.push(arsipA,arsipB);

/* --- mesin pemindai & penggandaan berkas (pengganti meja sortir) --- */
const kopirT=furn({x:7,y:2,w:1,h:1},12,(g,w,h)=>{
  contact(g,1,h-3,w-2);
  const R=ramp('#3d4657');
  P(g,R.out,0,3,w,h-5);
  P(g,R.base,1,4,w-2,h-6);P(g,R.hi,1,4,w-2,1);P(g,R.lo,w-3,6,2,h-10); // badan mesin
  P(g,'#262c36',1,h-2,w-2,2);                                  // sokle
  const L=ramp('#2b3039');                                     // tutup pemindai
  P(g,L.out,1,-1,w-2,7);P(g,L.base,2,0,w-4,5);P(g,L.hi,2,0,w-4,1);
  P(g,'#10151d',3,2,w-6,2);                                    // kaca pemindai (anim menyapu)
  P(g,'#20262e',3,7,7,4);P(g,'#161b23',3,7,7,1);               // panel kendali
  P(g,'#5d6773',4,8,3,1);
  P(g,'#2e3540',11,7,3,4);P(g,'#3d4653',11,7,3,1);             // layar kecil
  P(g,'#2a303a',2,13,w-4,3);P(g,'#363e4b',2,13,w-4,1);         // baki keluaran
  P(g,'#e8e4d8',4,14,w-8,1);
  P(g,'#434c5e',2,18,w-4,4);P(g,'#4f5a6a',2,18,w-4,1);         // laci kertas
  P(g,'#232a35',2,21,w-4,1);P(g,'#8f98a8',6,20,5,1);
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
  contact(g,2,h-3,12,.8);
  P(g,'#b3ab90',3,0,10,4);P(g,'#e8e4d8',3,0,10,3);             // tumpukan berkas atas
  P(g,'#f4f1e8',3,0,10,1);P(g,'#9aa0aa',5,2,6,1);
  const R=ramp('#3d4657');
  P(g,R.base,2,4,12,2);P(g,R.hi,2,4,12,1);                     // papan rak atas
  P(g,'#2e3540',3,6,1,7);P(g,'#2e3540',12,6,1,7);              // tiang
  P(g,'#434d5d',3,6,1,7);
  P(g,'#5a6675',1,5,1,9);P(g,'#727f90',1,5,1,3);               // gagang dorong
  P(g,'#a89e88',4,9,8,4);P(g,'#d8d2c2',4,9,8,3);               // tumpukan bawah
  P(g,'#ebe6d8',4,9,8,1);
  P(g,R.base,2,13,12,2);P(g,R.hi,2,13,12,1);                   // papan rak bawah
  P(g,'#2a303a',3,15,2,3);P(g,'#2a303a',11,15,2,3);            // kaki
  P(g,'#171b21',3,18,2,2);P(g,'#171b21',11,18,2,2);            // roda
  P(g,'#3a424f',3,18,2,1);P(g,'#3a424f',11,18,2,1);
});
FURN.push(troliT);

/* --- dispenser & pot merapat dinding timur --- */
const airT=furn({x:23,y:2,w:1,h:1},8,(g,w,h)=>{
  contact(g,2,h-3,12,.8);
  P(g,'#6e8496',3,-1,10,9);                                    // garis luar galon
  P(g,'#c9d6e0',3,0,10,7);P(g,'#8fb8d0',4,1,8,5);              // galon
  P(g,'#c8ecf8',4,1,3,3);                                      // kilau air
  const R=ramp('#3d4657');
  P(g,R.out,1,6,14,h-8);
  P(g,R.base,2,7,12,h-9);P(g,R.hi,2,7,12,1);P(g,R.lo,12,9,2,h-12); // badan
  P(g,'#22262f',2,h-2,12,2);
  P(g,'#1b2029',4,10,8,4);                                     // ceruk keran
  P(g,'#2ee0ff',5,11,2,2);P(g,'#e07a5a',9,11,2,2);             // kran dingin/panas
});
const potHall=seasonal(furn({x:23,y:7,w:1,h:1},4,potPaint));
FURN.push(airT,potHall);

/* --- serambi lift: pot & peti kayu di sudut kanan pintu kabin --- */
const potU=seasonal(furn({x:1,y:5,w:1,h:1},4,potPaint));
const petiU=furn({x:5,y:2,w:1,h:1},6,(g,w,h)=>{
  contact(g,1,h-3,14,.9);
  const R=ramp('#5a4632');
  P(g,R.out,0,1,16,h-3);
  P(g,R.base,1,2,14,h-5);P(g,R.hi,1,2,14,2);P(g,R.lo,13,4,2,h-8); // peti kayu
  P(g,R.lo,1,6,14,1);P(g,R.hi,1,7,14,1);                       // papan silang mendatar
  P(g,R.lo,7,2,1,h-5);P(g,R.hi,8,2,1,h-5);                     // papan silang tegak
  P(g,'#3f3222',1,h-3,14,2);
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

/* --- ambience lantai 2: kilau jendela & debu (tanpa cuaca bumi — jendela ke
   luar angkasa, jadi hujan/burung/kabut drawWeather tak dipakai di sini) --- */
anims.push({fn:(g,t)=>winShimmer(g,t,WINDOWS2)});
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
/* Jalan tanah BERKELOK — dulu tiga garis lurus sempurna sehingga terasa kaku.
   OUT_PATH murni kosmetik (dipakai untuk menggambar & jenis bunyi langkah, bukan
   petak padat), jadi kelokan ini tidak mengubah keterjangkauan peta sama sekali. */
const OUT_PATH=new Set(), SPINE={}, BR_L={}, BR_R={};
const addP=(x,y)=>OUT_PATH.add(x+','+y);
let pv=null;
for(let y=2;y<=16;y++){                                   // tulang tengah: meliuk antar kolom 11-13
  const ease=Math.min(1,(y-2)/3);                         // berangkat LURUS dari pintu, baru meliuk
  const x=12+Math.round(1.4*ease*Math.sin(y*0.55+0.7));
  SPINE[y]=x; addP(x,y);
  if(pv!==null&&x!==pv)for(let i=Math.min(x,pv);i<=Math.max(x,pv);i++)addP(i,y); // sambung saat bergeser
  pv=x;
}
pv=null;
for(let x=3;x<=12;x++){                                   // cabang kiri → AREA SAMPLING
  const y=10+Math.round(1.1*Math.sin(x*0.62+2.1));
  BR_L[x]=y; addP(x,y);
  if(pv!==null&&y!==pv)for(let j=Math.min(y,pv);j<=Math.max(y,pv);j++)addP(x,j);
  pv=y;
}
pv=null;
for(let x=12;x<=19;x++){                                  // cabang kanan → tiang COOPERSTOWN
  const y=8+Math.round(1.1*Math.sin(x*0.5-1.2));
  BR_R[x]=y; addP(x,y);
  if(pv!==null&&y!==pv)for(let j=Math.min(y,pv);j<=Math.max(y,pv);j++)addP(x,j);
  pv=y;
}
function buildBG3(){
  const g=bg3c, SS=SN();                                  // SS = palet musim aktif
  P(g,SS.floor,0,0,W,H);                                  // dasar rumput gelap
  /* tanah & sawah (baris 0-1 = fasad, digambar terpisah setelah ini) */
  for(let ty=2;ty<ROWS;ty++)for(let tx=0;tx<COLS;tx++){
    const px=tx*T,py=ty*T,r=rnd(tx,ty)%16,cell=MAP3[ty][tx];
    if(cell==='#'&&(tx===0||tx===COLS-1||ty>=ROWS-1)){     // PINGGIR peta = PAGAR KAYU (menghadap ke dalam)
      const PD='#4a3018',PB='#6b4a2e',PR='#7a5636',PH='#9a7550';
      P(g,SS.floor,px,py,T,T);                                         // tanah gelap di luar pagar
      if(ty>=ROWS-1){                                                  // BAWAH: rel mendatar, sorot di sisi ATAS
        P(g,PD,px,py+3,T,4);P(g,PR,px,py+2,T,4);P(g,PH,px,py+2,T,1);
        P(g,PD,px,py+10,T,4);P(g,PR,px,py+9,T,4);P(g,PH,px,py+9,T,1);
        if(tx%2===0){P(g,PD,px+5,py,4,T);P(g,PB,px+5,py,3,T);P(g,PH,px+5,py,1,T);}   // tiang
      }else if(tx===0){        // KIRI: pagar membujur → dari atas hanya SATU rel tipis; muka kanan (ke lapangan) membayang
        P(g,PD,px+8,py,5,T);                                           // massa rel (tipis, 5px)
        P(g,PH,px+8,py,1,T);                                           // kilau tepi luar
        P(g,'#8d6a44',px+9,py,2,T);                                    // permukaan atas kena cahaya
        P(g,'#5f4128',px+11,py,2,T);                                   // muka menghadap lapangan (membelakangi cahaya)
        if(ty%2===0){                                                  // tiang: tutup atas sedikit lebih lebar
          P(g,PD,px+7,py+4,7,8);P(g,PB,px+8,py+4,4,7);
          P(g,PH,px+8,py+4,4,1);P(g,'#5f4128',px+11,py+5,2,6);}
      }else{                   // KANAN: cermin — muka kiri (ke lapangan) justru kena cahaya, sisi luar gelap
        P(g,PD,px+3,py,5,T);                                           // massa rel (tipis, 5px)
        P(g,'#7a5636',px+3,py,2,T);                                    // muka menghadap lapangan (kena cahaya)
        P(g,'#8d6a44',px+5,py,2,T);P(g,PH,px+5,py,1,T);                // permukaan atas
        P(g,'#3a2817',px+7,py,1,T);                                    // sisi luar gelap
        if(ty%2===0){
          P(g,PD,px+2,py+4,7,8);P(g,PB,px+5,py+4,3,7);
          P(g,'#7a5636',px+3,py+4,2,7);P(g,PH,px+4,py+4,4,1);}
      }
    }else if(cell==='#'){                                  // bedengan: tanah dibajak & disiram (tanaman = animasi di atasnya)
      P(g,'#6b4a2e',px,py,T,T);                                        // tanah lembap
      P(g,'#8d6a44',px,py,T,1);                                        // bibir tersinari
      P(g,'#3a2817',px,py+T-1,T,1);                                    // dasar gelap
      P(g,'#4f351f',px,py+5,T,1);P(g,'#4f351f',px,py+11,T,1);          // alur bajakan
      P(g,'#7a5636',px,py+6,T,1);P(g,'#7a5636',px,py+12,T,1);
      const rr=(tx*13+ty*7)>>>0;
      P(g,'#8d6a44',px+2+(rr%11),py+2+((rr>>2)%3),1,1);                // butiran tanah
      P(g,'#3a2817',px+3+((rr>>3)%10),py+8+((rr>>1)%3),1,1);
      P(g,'#6f7f7a',px+4+((rr>>4)%8),py+3,1,1);P(g,'#6f7f7a',px+9+((rr>>5)%5),py+9,1,1); // kilau air
    }else if(OUT_PATH.has(tx+','+ty)){
      /* Jalan yang sering dilewati punya LAJUR terpadatkan di tengah (sedikit
         lebih terang, tanahnya mampat) dan TEPI yang lebih gelap karena rumput
         di sisinya menaunginya. Tanpa dua hal itu jalan terbaca sebagai pita
         warna rata memanjang. Arah lajur ikut arah jalannya. */
      P(g,'#7a5c3a',px,py,T,T);P(g,'#6e5233',px,py+T-2,T,2);           // jalan tanah
      const pv=OUT_PATH.has(tx+','+(ty-1))||OUT_PATH.has(tx+','+(ty+1));
      const ph2=OUT_PATH.has((tx-1)+','+ty)||OUT_PATH.has((tx+1)+','+ty);
      if(pv)P(g,'#886847',px+4,py,T-8,T);                              // lajur terpadatkan (membujur)
      if(ph2)P(g,'#886847',px,py+4,T,T-8);                             // lajur terpadatkan (melintang)
      if(r<4)P(g,'#96744c',px+(r%12),py+((r*3)%12),2,1);               // kerikil kena cahaya
      if(r===6)P(g,'#654b2d',px+2+((r*5)%9),py+4+((r*3)%8),4,1);       // cekungan bekas roda
      if(r===11)P(g,'#8f6f49',px+5+((r*3)%6),py+2+((r*7)%11),1,2);     // butiran pasir
      if(!OUT_PATH.has((tx-1)+','+ty))P(g,'#62482b',px,py,2,T);        // tepi ternaungi rumput
      if(!OUT_PATH.has((tx+1)+','+ty))P(g,'#62482b',px+T-2,py,2,T);
      if(!OUT_PATH.has(tx+','+(ty-1)))P(g,'#62482b',px,py,T,2);
      if(!OUT_PATH.has(tx+','+(ty+1)))P(g,'#62482b',px,py+T-2,T,2);
      // batu pijakan PIPIH tertanam rata (flush) di tanah — pijakan, bukan penghalang.
      // Kontrasnya sengaja DITAHAN tetap rendah: begitu batunya menonjol, ia
      // langsung terbaca sebagai penghalang, bukan pijakan.
      const sn=rnd(tx+7,ty+2)%16;
      const stone=(sx,sy)=>{P(g,'#664f35',sx,sy+3,6,1);              // seam tanah bawah (tertanam)
        P(g,'#9a938a',sx,sy,6,3);                                     // permukaan datar
        P(g,'#a69d92',sx+1,sy,4,1);                                   // sorot atas tipis
        P(g,'#837c74',sx,sy+2,6,1);P(g,'#8d867e',sx+5,sy,1,3);};      // sisi bawah/kanan datar
      if(sn<9){stone(px+4+(sn%3),py+5);                               // pijakan utama (di tengah lajur)
        if(sn<4)stone(px+7+(sn%2),py+10);}                            // pijakan ke-2
      /* tepi jalan BERGERIGI: rumput menjorok masuk di sisi yang berbatasan rumput */
      const gc=((tx+ty)&1)?SS.grassA:SS.grassB;
      const nz=(a,b)=>{let h=(a*374761393+b*668265263)>>>0;           // hash: acak, TIDAK periodik
        h=Math.imul(h^(h>>>13),1274126177)>>>0; return ((h^(h>>>16))>>>0)%3;};
      if(!OUT_PATH.has((tx-1)+','+ty))for(let j=0;j<T;j++){const n=nz(tx,py+j);
        if(n)P(g,gc,px,py+j,n,1);}
      if(!OUT_PATH.has((tx+1)+','+ty))for(let j=0;j<T;j++){const n=nz(tx+9,py+j);
        if(n)P(g,gc,px+T-n,py+j,n,1);}
      if(!OUT_PATH.has(tx+','+(ty-1)))for(let i=0;i<T;i++){const n=nz(px+i,ty+3);
        if(n)P(g,gc,px+i,py,1,n);}
      if(!OUT_PATH.has(tx+','+(ty+1)))for(let i=0;i<T;i++){const n=nz(px+i,ty+7);
        if(n)P(g,gc,px+i,py+T-n,1,n);}
    }else{
      const a=(tx+ty)&1;
      P(g,a?SS.grassA:SS.grassB,px,py,T,T);                            // rumput (ikut musim)
      /* helai rumput: pangkal gelap, ujung tersorot — arah cahayanya sama
         dengan seluruh permainan, supaya hamparan tidak terbaca sebagai
         bidang warna rata. Sebarannya dijaga JARANG (1 dari 6 petak, satu helai
         saja): separuh petak dulu membuat lapangan terlihat berbintik. */
      const gr=((tx*2654435761)^(ty*40503))>>>0;
      if(gr%6===0){
        const bx2=px+3+(gr%10), by2=py+5+((gr>>>4)%8);
        P(g,SS.mass,bx2,by2,1,3);P(g,SS.dots[2],bx2,by2-1,1,1);
      }
      if(r===0)P(g,SS.dots[2],px+4,py+7,3,2);
      if(r===5)P(g,SS.mass,px+9,py+3,2,3);
      if(r===9)P(g,SS.dots[3],px+2,py+10,2,1);                         // rumpun cerah
      // dekor tepi jalur: batu kecil acak + jamur mungil (hanya petak bersebelahan jalan)
      if(OUT_PATH.has((tx-1)+','+ty)||OUT_PATH.has((tx+1)+','+ty)||
         OUT_PATH.has(tx+','+(ty-1))||OUT_PATH.has(tx+','+(ty+1))){
        const d=rnd(tx+2,ty+9)%12;
        if(d<3){                                                       // batu kecil bulat
          const sx=px+3+((d*4)%9),sy=py+7+((d*3)%6);
          P(g,'#43403a',sx,sy+3,3,1);P(g,'#787e84',sx,sy+1,3,2);
          P(g,'#787e84',sx+1,sy,1,1);P(g,'#9aa0a5',sx,sy+1,1,1);P(g,'#565c62',sx,sy+2,3,1);
        }else if(d<5){                                                 // jamur mungil
          const sx=px+4+((d*5)%8),sy=py+5+((d*2)%8);
          P(g,'#25321d',sx,sy+3,3,1);                                  // bayang
          P(g,'#efe7d2',sx+1,sy+2,1,2);                                // batang
          P(g,'#b7362a',sx,sy,3,2);P(g,'#df5648',sx,sy,3,1);          // tudung merah
          P(g,'#f0ead8',sx+1,sy,1,1);                                  // bintik putih
        }
      }
    }
  }
  /* pematang: garis tanah terang di batas gundukan ↔ jalan/rumput */
  for(let ty=2;ty<ROWS-1;ty++)for(let tx=1;tx<COLS-1;tx++){
    if(MAP3[ty][tx]!=='#')continue;
    const px=tx*T,py=ty*T;
    if(MAP3[ty-1][tx]==='.')P(g,'#6e5836',px,py,T,2);
    if(MAP3[ty+1][tx]==='.')P(g,'#6e5836',px,py+T-2,T,2);
    if(MAP3[ty][tx-1]==='.')P(g,'#6e5836',px,py,2,T);
    if(MAP3[ty][tx+1]==='.')P(g,'#6e5836',px+T-2,py,2,T);
  }
  /* --- KOLAM: tepian membulat TAK BERATURAN (bukan segi empat).
         Lebar tiap baris = profil oval + deviasi acak deterministik. --- */
  (function(){
    const px=POND.x*T, py=POND.y*T, pw=POND.w*T, ph=POND.h*T;
    const cxp=(pw-1)/2, cyp=(ph-1)/2;
    /* radius berubah menurut SUDUT → tepi bergelombang di seluruh keliling,
       bukan sekadar persegi yang dibulatkan sudutnya */
    const wob=a=>1+0.13*Math.sin(a*3+1.3)+0.08*Math.sin(a*5-0.6)+0.05*Math.sin(a*7+2.1);
    const rel=(x,y)=>{const dx=(x-cxp)/(pw/2), dy=(y-cyp)/(ph/2);
      return Math.hypot(dx,dy)/wob(Math.atan2(dy,dx));};
    const spanAt=(j,lim)=>{let l=-1,r=-1;
      for(let i=0;i<pw;i++)if(rel(i,j)<=lim){if(l<0)l=i;r=i;}
      return l<0?null:[l,r-l+1];};
    const layer=(lim,col)=>{for(let j=0;j<ph;j++){const s=spanAt(j,lim);
      if(s)P(g,col,px+s[0],py+j,s[1],1);}};
    layer(1.16,'#4a3a26');                                              // tanah basah tepian
    layer(1.00,'#16333f');                                              // tepi air gelap
    layer(0.90,'#1d4657');
    layer(0.76,'#255a6e');
    layer(0.52,'#2e7186');                                              // dangkal / terang
    PONDIN.length=0;                                                    // buildBG3 bisa dipanggil ulang
    for(let j=0;j<ph;j++)PONDIN.push(spanAt(j,0.94));                    // batas air utk ikan & pantulan
    for(let a=0;a<6.28;a+=0.44){                                         // batu mengelilingi tepi berlekuk
      const w=wob(a)*1.05;
      const ex=Math.round(cxp+Math.cos(a)*w*(pw/2)), ey=Math.round(cyp+Math.sin(a)*w*(ph/2));
      P(g,'#6f757b',px+ex-2,py+ey-1,4,3);P(g,'#4a4f55',px+ex-2,py+ey+1,4,1);}
    const reed=(rx,ry)=>{for(let i=0;i<3;i++){const o=(i*7+rx)%3;        // alang-alang tepi
      P(g,'#2f6b30',rx+i*2,ry-5-o,1,6+o);P(g,'#4a8f3a',rx+i*2,ry-6-o,1,2);}};
    reed(px+4,py+7);reed(px+pw-9,py+9);reed(px+9,py+ph-1);reed(px+pw-13,py+ph-2);
    P(g,'#2f6b30',px+13,py+11,6,4);P(g,'#3f8a3c',px+14,py+11,4,2);       // daun teratai
    P(g,'#2f6b30',px+29,py+18,5,3);P(g,'#3f8a3c',px+30,py+18,3,2);
    P(g,'#e8607a',px+15,py+10,2,2);P(g,'#f2a2c9',px+15,py+10,1,1);       // bunga teratai
  })();
  /* kaki pagar: bayangan tipis ke arah lapangan + rumput liar, agar pagar membumi */
  for(let tx=1;tx<COLS-1;tx++){
    P(g,'rgba(0,0,0,.18)',tx*T,(ROWS-1)*T-2,T,2);                     // bayang pagar bawah
    if(tx%3===0)P(g,SS.dots[1],tx*T+3+((tx*5)%8),(ROWS-1)*T-4,3,3);   // rumput liar
    if(tx%4===1)P(g,SS.dots[2],tx*T+7+((tx*3)%5),(ROWS-1)*T-3,2,2);}
  for(let ty=2;ty<ROWS-1;ty++){
    P(g,'rgba(0,0,0,.18)',T,ty*T,2,T);                                // bayang pagar kiri
    P(g,'rgba(0,0,0,.18)',(COLS-1)*T-2,ty*T,2,T);                     // bayang pagar kanan
    if(ty%3===0){P(g,SS.dots[1],T+1,ty*T+5+((ty*3)%6),3,3);
                 P(g,SS.dots[1],(COLS-1)*T-4,ty*T+4+((ty*5)%7),3,3);}}
  /* --- tepi HUTAN HUJAN di sepanjang atas (backdrop berlapis) --- */
  (function(){
    const J=SS.jungle;
    P(g,J[0],0,0,W,26);                                               // massa hutan gelap (tinggi)
    for(let x=-3;x<W;x+=9){const hh=14+((x*13+7)%10);P(g,J[1],x,0,7,hh);}         // lapis belakang
    for(let x=-2;x<W;x+=7){const hh=11+((x*17+5)%9);
      P(g,J[2],x,0,5,hh);P(g,J[3],x+1,2,3,Math.max(1,hh-5));}                     // lapis tengah
    for(let x=2;x<W;x+=13){const hh=8+((x*7)%6);
      P(g,J[4],x,1,3,hh);P(g,J[5],x+1,1,1,Math.max(1,hh-3));}                     // pucuk tersorot
    for(let x=10;x<W;x+=46)P(g,J[1],x,20,1,8);                        // sulur menggantung
    P(g,J[0],0,24,W,3);                                               // bayang dasar hutan
  })();
  /* --- GEDUNG markas modern: berdiri di lapangan (± kolom 8-16) --- */
  (function(){
    const bx=8*T, bw=9*T, right=bx+bw;
    P(g,'rgba(0,0,0,.32)',bx+4,31,bw-2,3);                            // bayang rapat di kaki gedung
    P(g,'rgba(0,0,0,.15)',bx+1,34,bw+4,3);                            // lalu melunak ke tanah
    const B=ramp('#5c6470');
    P(g,B.base,bx,4,bw,28);P(g,B.hi,bx,4,bw,2);                      // badan beton
    P(g,B.lo,bx,29,bw,3);                                            // kaki gedung meredup
    P(g,'#474e58',right,5,4,27);P(g,'#3a404a',right,5,4,1);          // sisi kanan (kesan 3D)
    P(g,'#2f353d',right+3,6,1,26);                                   // tepi terjauh
    P(g,'#3c424b',bx-2,0,bw+6,5);P(g,'#4c545e',bx-2,0,bw+6,2);P(g,'#2b3038',bx-2,5,bw+6,1); // parapet atap
    const winCol=(x)=>{P(g,'#2b4a63',x,8,10,9);P(g,'#3f6f92',x,8,10,3);P(g,'#8fc0da',x+1,9,3,1);   // pane atas
      P(g,'#2b4a63',x,19,10,9);P(g,'#3f6f92',x,19,10,3);P(g,'#8fc0da',x+1,20,3,1);                 // pane bawah
      P(g,'#454c56',x-2,4,2,28);};                                                                  // mullion
    [bx+4,bx+18,right-28,right-14].forEach(winCol);                  // 2 jendela kiri, 2 kanan
    const dx=11*T, dw=3*T, dm=dx+Math.floor(dw/2);                    // pintu kaca modern tengah
    P(g,'#3a414b',dx-2,4,dw+4,28);P(g,'#23272e',dx,10,dw,22);        // portal + kaca abu gelap
    P(g,'rgba(88,98,110,0.30)',dx+2,12,dw-4,18);                     // pantulan kaca abu transparan (bukan lampu terang)
    for(let x=dx+2;x<dx+dw-2;x+=5)P(g,'rgba(150,170,190,.10)',x,12,1,18);
    P(g,'#20242b',dm-1,10,2,22);P(g,'#8f9aa8',dm-4,20,2,3);P(g,'#8f9aa8',dm+3,20,2,3); // pembagi + gagang abu
    P(g,'#9aa2ac',dx-4,4,dw+8,2);P(g,'#8a929c',dx-4,6,dw+8,1);       // kanopi beton datar
    P(g,'#6e7680',dx-4,7,dw+8,1);
    P(g,'rgba(0,0,0,.28)',dx-3,8,dw+6,2);                            // kanopi menaungi pintu
    P(g,'#8a929c',dx-6,32,dw+12,4);P(g,'#9aa2ac',dx-6,32,dw+12,1);   // teras/apron beton
    P(g,'#5f666f',dx-6,35,dw+12,1);
  })();
}
buildBG3();

/* --- perabot & animasi AREA LUAR --- */
FURN=[];anims=[];
/* AREA SAMPLING — menara pengawas kebakaran (fire lookout): rangka kayu tinggi + kabin kaca */
const ksaT=furn(TOOLS[3].rect,44,(g,w,h)=>{
  const yTop=27, yBot=h-2;
  contact(g,8,h-3,28);
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
  spill(g,10,18,28,4,'255,221,150',.14);                                                // cahayanya jatuh ke catwalk
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
  P(g,'rgba(0,0,0,.28)',19,h-3,10,2);                      // bayangan kontak
  const Po=ramp('#245a48');
  P(g,Po.out,21,3,6,h-5);
  P(g,Po.base,22,4,4,h-6);P(g,Po.hi,22,4,2,h-6);P(g,Po.lo,25,6,1,h-9); // tiang
  P(g,'#2e6f5a',20,3,8,2);P(g,'#3f8a6e',20,3,8,1);         // rim
  P(g,'#173d31',21,1,6,2);                                 // finial
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
  contact(g,4,h-3,8,.8);
  const Po=ramp('#6e5233');
  P(g,Po.base,7,10,2,h-11);P(g,Po.hi,7,10,1,h-11);         // tiang
  const A=ramp('#8a6a42');
  P(g,A.base,2,13,12,2);P(g,A.hi,2,13,12,1);               // lengan
  const S2=ramp('#c9b07a');
  P(g,S2.out,3,3,10,9);
  P(g,S2.base,4,4,8,7);P(g,S2.hi,4,4,8,2);                 // baju karung
  P(g,S2.lo,10,6,2,5);P(g,S2.lo,4,10,8,1);                 // sisi & bawah membayang
  const Hd=ramp('#d8c48a');
  P(g,Hd.out,5,-1,6,6);
  P(g,Hd.base,6,0,4,4);P(g,Hd.hi,6,0,4,1);                 // kepala
  P(g,'#b8924a',5,0,6,1);P(g,'#7a5c28',5,1,6,1);           // topi + bayang tepinya
  P(g,'#3a2a18',6,2,1,1);P(g,'#3a2a18',9,2,1,1);           // mata
});
FURN.push(scarecrow);
/* pepohonan mengisi lapangan (furnitur, urut kedalaman) — kanopi menyesuaikan ukuran kanvas */
const treePaint=(seed,opt)=>(g,w,h)=>{
  const S=SN(), o=opt||{};                                           // palet ikut musim
  const th=o.trunk||14;                                              // tinggi batang (anakan lebih pendek)
  const cx=w>>1, ch=h-th;
  /* BATANG bervariasi: lebar beda, sedikit miring, berakar mencuat */
  const tw=Math.max(2,(w>>3)+((seed>>1)%3)-1);
  const lean=(((seed%5)-2)*0.22);                                    // pangkal bergeser, puncak tetap di kanopi
  P(g,'rgba(0,0,0,.16)',cx-(w>>2),h-3,w>>1,3);                       // bayang akar
  for(let j=0;j<th;j++){const off=Math.round(lean*j), yy=h-th+j;
    P(g,'#5a3f28',cx-(tw>>1)+off,yy,tw,1);
    P(g,'#6e4f34',cx-(tw>>1)+off,yy,Math.max(1,tw>>1),1);}
  const bo=Math.round(lean*(th-1));                                  // akar mencuat di pangkal
  P(g,'#5a3f28',cx-(tw>>1)+bo-2,h-2,2,2);P(g,'#5a3f28',cx+(tw>>1)+bo,h-2,2,2);
  P(g,'#4a3320',cx-(tw>>1)+bo-2,h-1,tw+4,1);
  /* KANOPI: radius berubah menurut sudut, fase diambil dari seed → tiap pohon
     bersiluet membulat tak beraturan dan berbeda satu sama lain (dulu tumpukan persegi) */
  const kx=(w-1)/2, ky=ch/2, phs=seed*1.7;
  const wob=a=>{const v=1+0.15*Math.sin(a*3+phs)+0.09*Math.sin(a*5-phs*0.7)+0.06*Math.sin(a*7+phs*1.3);
    return v>1?1+(v-1)*0.15:v;};   // tonjolan keluar ditekan (agar tak terpotong tepi kanvas),
                                   // cekungan ke dalam dibiarkan penuh supaya bentuknya tetap organik
  const rel=(x,y,ox,oy)=>{const dx=(x-kx-ox)/(w/2), dy=(y-ky-oy)/(ch/2);
    return Math.hypot(dx,dy)/wob(Math.atan2(dy,dx));};
  const fill=(lim,col,ox,oy,j0)=>{for(let j=j0||0;j<ch;j++){
    let l=-1,r=-1;
    for(let i=0;i<w;i++)if(rel(i,j,ox,oy)<=lim){if(l<0)l=i;r=i;}
    if(l>=0)P(g,col,l,j,r-l+1,1);}};
  fill(1.00,S.mass,0,0);                                             // massa daun gelap
  fill(0.86,S.mid,-1,-1);                                            // isi
  fill(0.58,S.hi,-2,-3);                                             // sisi kena cahaya (kiri-atas)
  fill(0.28,S.hi2,-3,-4);                                            // sorot puncak
  fill(0.86,S.mass,-1,-1,Math.floor(ch*0.74));                       // bawah kanopi membayang
  const cols=S.dots;
  for(let k=0;k<(w>>1);k++){                                         // tekstur daun, tetap di dalam siluet
    const rx=2+((k*97+seed*13)%(w-4)), ry=2+((k*53+seed*7)%(ch-3));
    if(rel(rx,ry,0,0)>0.90)continue;
    P(g,cols[(k+seed)%4],rx,ry,2,2);}
  /* MANGGA berbuah saat kemarau & musim panen (di luar itu hanya berdaun) */
  if(o.mangga&&(season===1||season===2)){
    for(let k=0;k<6;k++){
      const rx=3+((k*61+seed*29)%(w-6)), ry=4+((k*41+seed*17)%(ch-7));
      if(rel(rx,ry,0,0)>0.78)continue;
      P(g,'#2f5a1e',rx+1,ry-1,1,1);                                  // tangkai
      P(g,'#b4791f',rx,ry,3,4);P(g,'#dda63a',rx,ry,2,3);            // buah
      P(g,'#f0cf72',rx,ry,1,1);P(g,'#8a5a16',rx+2,ry+3,1,1);}       // kilau + ujung
  }
};
const TREEF=[];
OUT_TREES.forEach(t=>{                    // besar: 3 petak · biasa: 2 petak · anakan: 1 petak & pendek
  const rect=t.sap?{x:t.x,y:t.y,w:1,h:1}
            :t.big?{x:t.x-1,y:t.y,w:3,h:1}:{x:t.x,y:t.y,w:2,h:1};
  const oy=t.sap?14:t.big?42:28;
  const opt={trunk:t.sap?8:14, mangga:!!t.mangga};
  const f=furn(rect,oy,treePaint(t.s,opt));
  FURN.push(f);TREEF.push({f,s:t.s,opt});
});
function repaintTrees(){                                             // gambar ulang kanopi saat musim berganti
  for(const T of TREEF){const c=T.f.canvas,g=c.getContext('2d');
    g.clearRect(0,0,c.width,c.height);treePaint(T.s,T.opt)(g,c.width,c.height);
    outlineSilhouette(g,c.width,c.height);}
}
/* --- F: goyangan angin. Pohon dipanggang ke kanvas (statis), jadi kilau daun
       digambar per-frame di atasnya supaya kanopi terasa bergerak. --- */
function drawTreeShimmer(g,t){
  const S=SN();
  for(const T of TREEF){
    const f=T.f, w=f.canvas.width, ch=f.canvas.height-(T.opt.trunk||14);
    if(ch<8)continue;
    const sw=Math.round(1.4*Math.sin(t/1500+T.s));                   // hembusan pelan
    for(let k=0;k<3;k++){
      const a=0.14+0.16*Math.sin(t/760+k*2.1+T.s); if(a<0.18)continue;
      const rx=f.px+3+((k*37+T.s*11)%Math.max(1,w-7));
      const ry=f.py+3+((k*53+T.s*7)%Math.max(1,ch-6));
      g.globalAlpha=a;P(g,S.hi2,rx+sw,ry,2,1);g.globalAlpha=1;
    }
  }
}
/* lentera jalan — menyala saat gelap (glow di anims) */
const lanternPaint=(g,w,h)=>{
  contact(g,4,h-3,8,.8);
  const R=ramp('#2a2f38');
  P(g,R.out,5,5,5,h-5);
  P(g,R.base,6,6,3,h-7);P(g,R.hi,6,6,1,h-7);P(g,R.lo,8,8,1,h-9);     // tiang
  P(g,R.base,4,4,7,1);P(g,R.hi,4,4,7,1);                             // lengan gantung
  P(g,'#1a1d24',4,5,7,1);                                            // bayang di bawah lengan
  const K=ramp('#4a4a3a');
  P(g,K.out,2,-1,8,7);
  P(g,K.base,3,0,6,5);P(g,K.hi,3,0,6,1);P(g,K.lo,8,1,1,4);           // rangka lampu
  P(g,'#151a10',2,0,8,1);                                            // atap lampu
  P(g,'#26261c',4,1,4,3);P(g,'#34342a',4,1,4,1);                     // kaca (padam siang)
};
/* Lampu jalan HARUS bersisian dengan jalur, tidak di atasnya. Kelokan jalan
   sempat menaruh (13,13) tepat di tengah jalan dan membuat (13,9) terlantar. */
const lanterns=LANTERNS.map(L=>{
  const f=furn({x:L.x,y:L.y,w:1,h:1},14,lanternPaint);FURN.push(f);return f;});
/* papan info poktan (bisa dibaca — banner memutar pesan) */
const boardF=furn(NOTICE_RECT,14,(g,w,h)=>{
  contact(g,3,h-3,w-6,.9);
  const T2=ramp('#5a3c20');
  P(g,T2.base,4,h-10,2,10);P(g,T2.base,w-6,h-10,2,10);               // dua tiang
  P(g,T2.hi,4,h-10,1,10);P(g,T2.hi,w-6,h-10,1,10);
  const B=ramp('#6e4a2a');
  P(g,B.out,-1,1,w+2,h-12);
  P(g,B.base,0,2,w,h-14);P(g,B.hi,0,2,w,2);P(g,B.lo,0,h-13,w,1);     // papan kayu
  for(let x=4;x<w-2;x+=7)P(g,B.lo,x,4,1,h-17);                       // sela antar papan
  P(g,'rgba(0,0,0,.25)',4,12,11,1);                                  // bayangan kertas
  P(g,'#c2bca8',4,5,11,8);P(g,'#e8e2d0',4,5,11,7);                   // kertas pengumuman
  P(g,'#f5f1e4',4,5,11,1);                                           // tepi atas kena cahaya
  for(let i=0;i<4;i++)P(g,'#8a8470',5,7+i*2,8,1);                    // baris teks
  P(g,'#b6bfc9',w-13,6,9,6);P(g,'#dfe6ee',w-13,6,9,5);               // kertas ke-2
  P(g,'#4cc9e0',w-12,7,7,1);
  P(g,'#8a2f22',7,4,1,2);P(g,'#c04a3a',7,4,1,1);                     // pin + bayangnya
  P(g,'#8a2f22',w-9,5,1,2);P(g,'#c04a3a',w-9,5,1,1);
  P(g,'#2f5a3a',1,0,4,2);P(g,'#3f7a4e',1,0,4,1);                     // atap kecil hijau
});
FURN.push(boardF);
/* ayam mematuk dekat gerbang gedung */
const CHICK=[{x0:8,y0:6,c:'#f0ead8'},{x0:10,y0:6,c:'#e8d8b0'},{x0:6,y0:9,c:'#d8c0a0'}]; // rumput terbuka (jauh dari gundukan/pohon)
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
anims.push({fn:(g,t)=>{                                     // berkas sinar matahari menembus pohon (siang)
  const day=1-daylight.lamp; if(day<0.15)return;
  for(let i=0;i<4;i++){const x0=36+i*92+Math.round(6*Math.sin(t/4200+i));
    const a=(0.045*day*(0.7+0.3*Math.sin(t/2600+i))).toFixed(3);
    g.fillStyle=`rgba(255,246,205,${a})`;
    for(let yy=0;yy<110;yy+=2)g.fillRect(x0+Math.round(yy*0.55),yy,9,2);}
}});
anims.push({fn:(g,t)=>{                                     // daun & kelopak melayang turun
  const LC=['#6fae52','#c9a24a','#e88fb0','#d8c48a'];
  for(let i=0;i<9;i++){const sp=8+(i%4)*3, y=(t/1000*sp+i*61)%(H+20)-10;
    const x=((i*137)%W)+Math.round(11*Math.sin(t/700+i));
    g.fillStyle=LC[i%4];g.fillRect(Math.round(x),Math.round(y),2,1);
    g.fillRect(Math.round(x)+(Math.floor(t/200+i)%2?1:0),Math.round(y)-1,1,1);}
}});
anims.push({fn:(g,t)=>{                                     // kunang-kunang saat senja/malam
  const night=Math.min(1,daylight.lamp*1.1); if(night<0.2)return;
  for(let i=0;i<12;i++){
    const x=((i*89)%(W-40))+20+Math.round(16*Math.sin(t/1300+i*1.7));
    const y=5*T+Math.round(5*T*(0.5+0.5*Math.sin(t/900+i)))+Math.round(4*Math.sin(t/400+i));
    const a=night*(0.5+0.5*Math.sin(t/300+i*2)); if(a<0.06)continue;
    g.fillStyle=`rgba(190,240,120,${(0.9*a).toFixed(3)})`;g.fillRect(Math.round(x),Math.round(y),1,1);
    g.fillStyle=`rgba(190,240,120,${(0.28*a).toFixed(3)})`;
    g.fillRect(Math.round(x)-1,Math.round(y),3,1);g.fillRect(Math.round(x),Math.round(y)-1,1,3);}
}});
/* ayam mematuk & mengais — digambar di render() SEBELUM furnitur (di BALIK pohon/objek) */
/* tanaman tumbuh di bedengan: siklus tumbuh→matang→tanam ulang, daun bertambah, pucuk & buah goyang */
const BED=[];
for(let by=2;by<ROWS-1;by++)for(let bx=1;bx<COLS-1;bx++)
  if(MAP3[by][bx]==='#'){const s=rnd(bx+1,by+3),per=45000+(s%30000);
    BED.push({x:bx*T,y:by*T,tx:bx,ty:by,s,per,t0:-((s*97)%per)});}   // t0 digeser saat dipanen
/* Tumbuh SEKALI lalu TETAP matang sampai dipanen — tanpa modulo, supaya tanaman
   matang tidak lenyap sendiri saat siklus habis. Hanya panen yang menggeser t0. */
const bedGrow=(b,t)=>Math.min(1,Math.max(0,(t-b.t0)/(b.per*0.45)));
const bedKind=b=>{const CS=SN().crops;return CS[b.s%CS.length];};    // jenis tanaman ikut musim (-1 = bera)

/* --- PANEN interaktif: berdiri di sisi bedengan matang lalu tekan aksi --- */
const BED_AT={};for(const b of BED)BED_AT[b.tx+','+b.ty]=b;
const bedTool={id:'bed',name:'THE FIELD',short:'THE FIELD',color:'#7cc45c',btn:'PANEN &#9656;',
               isBed:true,desc:''};                                  // tanpa subtitle
const eggTool={id:'egg',name:'TELUR AYAM',short:'TELUR',color:'#efe7d2',btn:'AMBIL &#9656;',
               isEgg:true,desc:''};
for(const b of BED)for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ // petak di sisi bedengan
  const nx=b.tx+dx,ny=b.ty+dy,k=nx+','+ny;
  if(nx<1||ny<2||nx>=COLS-1||ny>=ROWS-1)continue;
  if(SOLIDS[2][ny*COLS+nx])continue;
  if(!ZONES[2][k])ZONES[2][k]=bedTool;                               // jangan timpa zona pintu/papan/alat
}
function harvestNear(){
  let best=null;
  const now=performance.now();     // aksi pemain pakai waktu SEKARANG, bukan stempel frame
  const [ptx,pty]=ptile();         // terakhir (`last` beku saat loop berhenti, mis. tab tersembunyi)
  for(const [dx,dy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){
    const b=BED_AT[(ptx+dx)+','+(pty+dy)];if(!b)continue;
    const kind=bedKind(b);if(kind<0)continue;                        // petak bera: tak ada yang dipanen
    const gr=bedGrow(b,now);if(gr<0.9)continue;
    if(!best||gr>best.gr)best={b,gr,kind};
  }
  if(!best){beep(220,.09,.045,'sine');return;}                       // belum matang: nada rendah saja
  const bx=best.b.x+8, by=best.b.y+7;
  const fx=bx-player.x, fy=by-player.y;                              // dino menoleh ke bedengan
  player.dir=Math.abs(fx)>Math.abs(fy)?(fx>0?'right':'left'):(fy>0?'down':'up');
  player.pick={kind:best.kind,t0:now,fx:bx,fy:by};                   // mulai gerakan memetik
  best.b.t0=now;                                                     // tanam ulang: siklus balik ke tunas
  stepFx.push({x:Math.round(player.x)-3,y:Math.round(player.y)+2,t0:now,c:'#8d6a44',s:'tanah'},
              {x:Math.round(player.x)+3,y:Math.round(player.y)+2,t0:now,c:'#8d6a44',s:'tanah'});
  beep(880,.06,.05);beep(1320,.09,.05,'square',.07);
}
/* sprite hasil panen yang dijinjing dino (6x6-an, dipusatkan di x,y) */
/* =========================================================================
   IKAN — satu sumber kebenaran untuk bentuk, warna, dan watak tiap jenis.
   Dipakai di DUA tempat: berenang di minigame bawah air, dan terangkat di
   atas kepala dino setelah berhasil ditarik. Satu fungsi gambar untuk
   keduanya, jadi ikan yang dikejar di dalam air PERSIS ikan yang didapat —
   kalau digambar dua kali, cepat atau lambat keduanya melenceng.

   hb  = setengah tinggi badan per kolom, dari pangkal ekor ke kepala. Profil
         meruncing inilah yang membuat badan terbaca sebagai ikan; lebar
         seragam terbaca sebagai balok.
   langka  = peluang muncul (dijumlahkan 1,00)
   malu    = makin tinggi, makin jarang ia mau mendekati umpan
   jendela = lebar jendela tarik (ms); makin berharga ikannya, makin sempit
   lawan   = berapa kali zona hijau harus kena sebelum ia menyerah.
   ========================================================================= */
const IKAN=[
  {nm:'WADER', hb:[1,2,2,2,2,1,1],       c:'#9ec4d4',d:'#44707f',p:'#e8f2f6',
   laju:40,dalam:[0.06,0.34],malu:0.26,jendela:1000,langka:0.34,lawan:5},
  {nm:'NILA',  hb:[1,2,3,3,3,2,2,1],     c:'#a3ad72',d:'#55602f',p:'#e6e2bc',
   laju:30,dalam:[0.24,0.58],malu:0.44,jendela:880, langka:0.26,lawan:5},
  {nm:'LELE',  hb:[2,3,3,3,3,3,2,2,2,1], c:'#6a605c',d:'#2b2625',p:'#c3b4a6',
   laju:17,dalam:[0.70,0.95],malu:0.24,jendela:920, langka:0.20,lawan:6,sungut:1},
  {nm:'GURAME',hb:[2,4,5,5,5,4,3,2],     c:'#c08a4a',d:'#70461c',p:'#f2d6a8',
   laju:21,dalam:[0.34,0.68],malu:0.64,jendela:760, langka:0.13,lawan:6},
  {nm:'MAS',   hb:[1,3,4,4,4,4,3,2],     c:'#e0a53a',d:'#8e5a0c',p:'#ffe9a8',
   laju:26,dalam:[0.42,0.82],malu:0.82,jendela:640, langka:0.07,lawan:7},
];
IKAN.forEach(sp=>{sp.hi=ramp(sp.c).hi;sp.tinggi=Math.max(...sp.hb);});
/* Kibasan dikerjakan dengan MENGGESER ekor 1 px, badannya diam. Itu cukup
   untuk terbaca sebagai berenang, dan jauh lebih murah daripada menyiapkan
   beberapa frame sprite untuk lima jenis ikan. */
function ikanCat(g,cx,cy,sp,dir,kib){
  const hb=sp.hb, n=hb.length, sg=dir<0?-1:1;
  /* +1,5 kolom: ekor digambar di indeks -3..-1, jadi tanpa geseran ini titik
     tengah jatuh di tengah BADAN, bukan di tengah siluet — ikannya terlihat
     melenceng ke kanan dan ekornya mepet tepi panel tangkapan. */
  const col=i=>Math.round(cx+sg*(i-(n-1)/2+1.5));
  const seg=(i0,i1,y,h,c)=>{const a=col(i0),b=col(i1);
    P(g,c,Math.min(a,b),y,Math.abs(b-a)+1,h);};
  for(let k=1;k<=3;k++){                                   // ekor mengembang di belakang pangkal
    const hh=hb[0]+k;
    P(g,sp.d,col(-k),Math.round(cy-hh+kib*k/3),1,hh*2);
  }
  const fa=Math.max(1,Math.round(n*0.30)), fb=Math.max(fa+1,Math.round(n*0.64));
  seg(fa,fb,cy-hb[fa]-2,2,sp.d);                           // sirip punggung
  seg(fa+1,fb,cy+hb[fa]+1,2,sp.d);                         // sirip perut
  for(let i=0;i<n;i++){
    const hh=hb[i], x=col(i);
    P(g,sp.d,x,cy-hh,1,hh*2);                              // garis luar gelap
    if(hh>1){
      P(g,sp.c,x,cy-hh+1,1,hh*2-2);                        // isi badan
      P(g,sp.hi,x,cy-hh+1,1,1);                            // punggung kena cahaya dari permukaan
      P(g,sp.p,x,cy+hh-2,1,1);                             // perut pucat
    }
  }
  if(sp.sungut){                                           // sungut lele, dua pasang
    P(g,sp.d,col(n-1)+sg,cy+1,1,1);P(g,sp.d,col(n-1)+sg*2,cy+2,1,1);
    P(g,sp.d,col(n-1)+sg,cy-1,1,1);P(g,sp.d,col(n-1)+sg*2,cy-2,1,1);
  }
  P(g,'#0e1a22',col(n-2),cy-1,1,1);P(g,'#eaf2f7',col(n-2),cy-2,1,1);  // mata + kilaunya
}
/* Empat fase kibasan, dipanggang sekali lalu disimpan. 5 jenis x 2 arah x 4
   fase = 40 kanvas kecil, semuanya di bawah 24x24 — dibangun saat pertama
   dipakai, bukan saat muat halaman. */
const KIBAS=[0,1.5,0,-1.5];
const IKAN_SPR=new Map();
/* Piksel TERATAS tiap kolom dicerahkan ke arah biru pucat: cahaya datang dari
   permukaan. Tanpa ini ikan cuma punya cincin gelap di atas air gelap, dan di
   pita terdalam lele praktis lenyap — diuji berdampingan, garis luar saja
   tidak memisahkan apa-apa. Teknik yang sama dipakai sprite dino sejak v1.77.0. */
/* Rona bawaan biru pucat: cahaya bawah air. Pemanggil lain boleh memberi rona
   sendiri — semai disinari lampu tumbuh ungu, dan rim yang tak sewarna sumber
   cahayanya terbaca sebagai salah cetak, bukan sebagai cahaya. */
function rimAtas(g,w,h,rr=170,gg=214,bb=232,k=0.52){
  const img=g.getImageData(0,0,w,h), d=img.data;
  for(let x=0;x<w;x++)for(let y=0;y<h;y++){
    const i=(y*w+x)*4;
    if(d[i+3]<200)continue;
    d[i]  =Math.round(d[i]  *(1-k)+rr*k);
    d[i+1]=Math.round(d[i+1]*(1-k)+gg*k);
    d[i+2]=Math.round(d[i+2]*(1-k)+bb*k);
    break;
  }
  g.putImageData(img,0,0);
}
function ikanSprite(sp,dir,fr){
  const kunci=sp.nm+(dir<0?'L':'R')+fr;
  let c=IKAN_SPR.get(kunci); if(c)return c;
  const w=sp.hb.length+12, h=sp.tinggi*2+12;
  c=document.createElement('canvas');c.width=w;c.height=h;
  const g=c.getContext('2d');
  ikanCat(g,w>>1,h>>1,sp,dir,KIBAS[fr]);
  outlineSilhouette(g,w,h,0.34);        // alat yang sama dengan seluruh perabot
  rimAtas(g,w,h);                       // lalu tepi atasnya menangkap cahaya
  IKAN_SPR.set(kunci,c);
  return c;
}
function drawIkan(g,cx,cy,sp,dir,fase){
  const fr=fase===undefined?0:((Math.floor(fase/1.5708)%4)+4)%4;
  const c=ikanSprite(sp,dir<0?-1:1,fr);
  g.drawImage(c,Math.round(cx-c.width/2),Math.round(cy-c.height/2));
}
function drawProduce(g,x,y,kind){
  P(g,'rgba(0,0,0,.18)',x-3,y+3,6,1);
  if(kind===0){        P(g,'#3f7a34',x-4,y+1,8,2);P(g,'#c9cdaa',x-3,y-2,6,4);   // kembang kol
                       P(g,'#eaeed2',x-3,y-3,5,3);P(g,'#fbfde9',x-2,y-3,2,1);}
  else if(kind===1){   P(g,'#3f7a34',x-1,y-5,2,2);P(g,'#5a1410',x-3,y-3,6,6);   // tomat
                       P(g,'#b0271d',x-3,y-3,5,5);P(g,'#e0453a',x-2,y-2,3,3);
                       P(g,'#ff9070',x-2,y-2,1,1);}
  else if(kind===2){   P(g,'#357a2c',x-3,y-4,2,7);P(g,'#c9a03a',x-2,y-4,4,7);   // jagung
                       P(g,'#e8c94a',x-2,y-4,3,6);P(g,'#f7e37a',x-1,y-3,1,4);}
  else if(kind===3){   P(g,'#8a3f14',x-4,y-3,8,6);P(g,'#d97a28',x-3,y-3,6,5);   // labu
                       P(g,'#f0973a',x-3,y-3,5,3);P(g,'#ffc46a',x-2,y-2,2,1);
                       P(g,'#5a3f24',x-1,y-5,2,2);P(g,'#4fa03c',x+1,y-5,1,1);}
  else if(kind===4){   P(g,'#357a2c',x,y-1,1,4);P(g,'#4a6fca',x-2,y-3,5,1);     // bunga Blue Jazz
                       P(g,'#4a6fca',x,y-5,1,5);P(g,'#88a6ef',x-1,y-3,1,1);
                       P(g,'#f2d24a',x,y-3,1,1);}
  else if(kind===5){   P(g,'#c2b697',x-2,y-4,5,7);P(g,'#efe7d2',x-2,y-4,4,6);   // telur ayam
                       P(g,'#fbf7ea',x-1,y-4,2,2);P(g,'#d8cdb2',x+1,y,2,2);}
  else if(kind===11){ P(g,'#1c2028',x-5,y-2,10,5);P(g,'#2f3540',x-4,y-2,8,4);    // tray semai lolos sortir
                      P(g,'#2a1c12',x-3,y-1,6,2);
                      for(let i=0;i<3;i++){P(g,'#3f8a34',x-3+i*3,y-5,1,4);
                                           P(g,'#7cc45c',x-3+i*3,y-5,1,1);
                                           P(g,'#5cb04a',x-4+i*3,y-4,1,1);
                                           P(g,'#5cb04a',x-2+i*3,y-3,1,1);} }
  else{                                                                          // ikan hasil pancingan
    /* Bentuknya diambil dari tabel IKAN, bukan digambar ulang di sini: yang
       terangkat di atas kepala dino harus jenis yang persis sama dengan yang
       barusan digiring umpannya di bawah air. */
    drawIkan(g,x,y,IKAN[Math.max(0,Math.min(IKAN.length-1,kind-6))],1);
  }
}
/* gerakan panen: tanaman melengkung dari bedengan ke tangan dino, lalu diangkat di atas kepala */
const PICK_DUR=1150;
function drawPick(g,t){
  const p=player.pick; if(!p)return;
  /* Durasi dan perbesaran boleh dibawa oleh pick-nya sendiri. Tanpa bidang
     itu nilainya persis seperti semula, jadi panen bedengan dan telur ayam
     tidak tersentuh sama sekali. */
  const dur=p.lama||PICK_DUR, bsr=p.besar||1;
  const a=(t-p.t0)/dur;
  if(!(a>=0&&a<1)){player.pick=null;return;}
  /* Hadiah yang diperbesar diangkat lebih tinggi: pada 2x ia setinggi ~24 px
     dan dengan titik angkat lama ia menimpa kepala dinonya sendiri. */
  const hx=Math.round(player.x), hy=Math.round(player.y)-21-(bsr>1?9:0);
  let x,y;
  if(a<0.3){                                                         // fase 1: dipetik, melengkung naik
    const k=a/0.3;
    x=p.fx+(hx-p.fx)*k;
    y=p.fy+(hy-p.fy)*k-Math.sin(k*Math.PI)*9;
  }else{                                                             // fase 2: diangkat, sedikit memantul
    const k=(a-0.3)/0.7;
    x=hx; y=hy-Math.round(2*Math.sin(k*Math.PI*3));
    /* Pudar ditunda sampai 82% untuk hadiah yang diperbesar: dengan 72% ia
       sudah mulai lenyap sebelum mata sempat berpindah dari kolam ke dino. */
    const pud=bsr>1?0.82:0.72;
    if(k>pud)g.globalAlpha=1-(k-pud)/(1-pud);
  }
  if(bsr>1){                                                         // hadiah minigame: digambar besar
    g.save();
    g.imageSmoothingEnabled=false;                                   // tetap tajam, bukan diburamkan
    g.translate(Math.round(x),Math.round(y));
    g.scale(bsr,bsr);
    drawProduce(g,0,0,p.kind);
    g.restore();
  }else drawProduce(g,Math.round(x),Math.round(y),p.kind);
  if(a>=0.3&&a<0.55){                                                // kilau "dapat!" sesaat
    const s=(a-0.3)/0.25;g.globalAlpha=(1-s)*0.9;
    P(g,'#fff3b0',hx-6,hy-1,1,1);P(g,'#fff3b0',hx+6,hy-2,1,1);P(g,'#fff3b0',hx,hy-8,1,1);
  }
  g.globalAlpha=1;
}
/* --- sprite tanaman gaya "farm-sim" (outline selektif + shading 4-tingkat) --- */
const GO='#1f3d1a',GD='#357a2c',GM='#4fa03c',GL='#79c94f',GH='#a6e46a';
function pShadow(g,ax,ay,w){P(g,'rgba(30,18,8,.28)',ax-(w>>1),ay,w,2);P(g,'rgba(30,18,8,.16)',ax-(w>>1)-1,ay+1,w+2,1);}
function cropCauli(g,ax,ay,sway,gr){                               // kembang kol: rosette daun + curd krem
  pShadow(g,ax,ay,11);
  const lw=2+Math.round(gr*4);
  P(g,GO,ax-lw-1,ay-2,2*lw+3,3);
  P(g,GD,ax-lw,ay-6,2*lw+1,5);
  P(g,GM,ax-lw+1,ay-7,2*lw-1,3);
  P(g,GL,ax-lw+1,ay-8,2,2);P(g,GL,ax+lw-2,ay-8,2,2);
  P(g,GO,ax-lw-1,ay-5,1,4);P(g,GO,ax+lw+1,ay-5,1,4);
  if(gr>0.55){const cw=Math.round((gr-0.4)*10);
    P(g,'#c9cdaa',ax-(cw>>1)-1,ay-8,cw+2,5);
    P(g,'#eaeed2',ax-(cw>>1)+sway,ay-10,cw,4);
    P(g,'#fbfde9',ax-(cw>>1)+1+sway,ay-10,2,1);
    P(g,'#d3d8b4',ax+(cw>>1)-2+sway,ay-7,1,1);}
}
function cropTomato(g,ax,ay,sway,gr){                              // tomat: berpancang + buah merah bertahap
  pShadow(g,ax,ay,11);
  const sh=Math.round(4+gr*10);
  P(g,'#6b4a2e',ax+4,ay-sh,1,sh);P(g,'#8d6a44',ax+4,ay-sh,1,1);
  const bh=Math.round(3+gr*7);
  P(g,GO,ax-5,ay-3,11,3);
  P(g,GD,ax-5,ay-3-bh,11,bh+1);
  P(g,GM,ax-4+sway,ay-4-bh,9,bh);
  P(g,GL,ax-3+sway,ay-4-bh,2,1);P(g,GH,ax+2+sway,ay-3-bh,1,1);
  if(gr>0.6){const fr=(fx,fy)=>{P(g,'#5a1410',fx-1,fy-1,4,4);P(g,'#b0271d',fx-1,fy-1,3,3);P(g,'#e0453a',fx,fy,2,2);P(g,'#ff9070',fx,fy,1,1);};
    fr(ax-3,ay-4);fr(ax+1,ay-7);}
}
function cropCorn(g,ax,ay,sway,gr){                               // jagung: batang tinggi, daun pita, tongkol, malai
  pShadow(g,ax,ay,9);
  const H=Math.round(6+gr*11);
  P(g,'#357a2c',ax,ay-H,2,H);P(g,'#4fa03c',ax,ay-H,1,H);
  for(let i=0;i<3;i++){const ly=ay-4-i*4,dir=i&1?1:-1;
    P(g,GD,ax+(dir>0?2:-1),ly,1,1);P(g,GM,ax+dir*2,ly-1,1,1);P(g,GL,ax+dir*3+(i===2?sway:0),ly-1,1,1);}
  if(gr>0.6){P(g,'#c9a03a',ax+1,ay-Math.round(8+gr*4),2,5);
    P(g,'#e8c94a',ax+1,ay-Math.round(9+gr*4),2,4);
    P(g,'#f7e37a',ax+1,ay-Math.round(9+gr*4),1,2);}
  if(gr>0.5){P(g,'#d9c26a',ax+sway,ay-H-1,1,2);P(g,'#b89a48',ax-1+sway,ay-H,1,1);P(g,'#b89a48',ax+2+sway,ay-H,1,1);}
}
function cropPumpkin(g,ax,ay,sway,gr){                            // labu: daun merambat + buah oranye berusuk
  pShadow(g,ax,ay,13);
  P(g,GO,ax-7,ay-3,4,3);P(g,GD,ax-7,ay-4,4,2);P(g,GO,ax+4,ay-3,4,3);P(g,GD,ax+4,ay-4,4,2);
  if(gr<0.55){P(g,GM,ax-1+sway,ay-5,2,2);return;}
  const w=Math.round(5+(gr-0.4)*8), h=Math.round(4+(gr-0.4)*6), hw=w>>1, top=ay-h;
  P(g,'#8a3f14',ax-hw,top-1,w,h+1);                                // badan + puncak membulat
  P(g,'#8a3f14',ax-hw-1,top+1,1,h-2);P(g,'#8a3f14',ax+hw,top+1,1,h-2); // sisi menonjol (bulat)
  P(g,'#d97a28',ax-hw,top,w,h-1);
  P(g,'#f0973a',ax-hw+1,top,w-2,Math.max(2,h-3));
  for(let rx=-hw+2;rx<hw;rx+=3)P(g,'#c9691f',ax+rx,top,1,h-1);     // rusuk
  P(g,'#ffc46a',ax-hw+1,top+1,2,2);                                // kilau
  P(g,'#5a3f24',ax-1+sway,top-2,2,2);P(g,'#4fa03c',ax+1+sway,top-2,1,1); // tangkai
}
function cropJazz(g,ax,ay,sway,gr){                               // Blue Jazz: bunga bintang biru + putik kuning
  pShadow(g,ax,ay,7);
  const H=Math.round(3+gr*5);
  P(g,'#357a2c',ax,ay-H,1,H);P(g,GM,ax-1,ay-2,1,1);P(g,GM,ax+1,ay-4,1,1);
  if(gr<0.55)return;
  const flor=(fx,fy)=>{P(g,'#4a6fca',fx-1,fy,3,1);P(g,'#4a6fca',fx,fy-1,1,3);P(g,'#88a6ef',fx,fy,1,1);P(g,'#f2d24a',fx,fy,1,1);};
  flor(ax+sway,ay-H-1);flor(ax-2+sway,ay-H+1);flor(ax+2+sway,ay-H);
}
const CROPS=[cropCauli,cropTomato,cropCorn,cropPumpkin,cropJazz];
function drawFallow(g,ax,ay,seed){                                // bedengan bera: tertutup jerami
  const st=['#b9a068','#a88f57','#cbb47c'];
  for(let i=0;i<5;i++){const o=(seed>>(i*2))&7;
    P(g,st[i%3],ax-6+((o*3)%11),ay-1-((o*2)%6),5,1);}
  P(g,'#8f7a45',ax-6,ay+1,12,1);
}
function drawGardenPlants(g,t){                                   // 1 tanaman per petak, jenis ikut musim
  for(const b of BED){
    const ax=b.x+8, ay=b.y+14, kind=bedKind(b);
    if(kind<0){drawFallow(g,ax,ay,b.s);continue;}
    const gr=bedGrow(b,t);
    const sway=Math.round(gr*Math.sin(t/900+b.s));
    CROPS[kind](g,ax,ay,sway,gr);
  }
  /* penanda SIAP PANEN: bintang berkedip, digambar setelah semua tanaman agar tak tertutup */
  for(const b of BED){
    if(bedKind(b)<0||bedGrow(b,t)<0.9)continue;
    const sx=b.x+13, sy=b.y+3;                                    // pojok kanan-atas petak
    const ph=(b.s%997)/997, k=((t/1600)+ph)%1;                     // berkedip berkala, fase per petak
    if(k>0.40)continue;                                            // padam 60% siklus → tidak ramai
    const s=Math.sin((k/0.40)*Math.PI);                            // 0→1→0
    g.globalAlpha=0.5+0.5*s;
    P(g,'#fff6c0',sx,sy,1,1);                                     // inti
    if(s>0.30){P(g,'#ffe98a',sx-1,sy,1,1);P(g,'#ffe98a',sx+1,sy,1,1);
               P(g,'#ffe98a',sx,sy-1,1,1);P(g,'#ffe98a',sx,sy+1,1,1);}   // 4 arah
    if(s>0.70){P(g,'#fff6c0',sx-2,sy,1,1);P(g,'#fff6c0',sx+2,sy,1,1);
               P(g,'#fff6c0',sx,sy-2,1,1);P(g,'#fff6c0',sx,sy+2,1,1);}   // puncak kilau
    g.globalAlpha=1;
  }
}
/* --- KOLAM: pantulan langit ikut waktu, kilau, ikan berenang, riak melingkar --- */
function drawPond(g,t){
  const px=POND.x*T, py=POND.y*T, pw=POND.w*T, ph=POND.h*T;
  const lamp=daylight.lamp;                                    // 0 siang .. 1 malam
  const sky=a=>`rgba(${Math.round(158-78*lamp)},${Math.round(205-125*lamp)},${Math.round(238-120*lamp)},${a.toFixed(3)})`;
  /* batas air per baris — ikut tepi tak beraturan, bukan kotak */
  const air=(j,pad)=>{const p=PONDIN[Math.max(0,Math.min(PONDIN.length-1,j))];
    if(!p)return null;
    const w=p[1]-pad*2; return w>0?[px+p[0]+pad,w]:null;};
  for(let i=0;i<3;i++){                                        // pita pantulan langit bergoyang
    const j=6+i*7+Math.round(1.5*Math.sin(t/1100+i*2));
    const s=air(j,4+i*2); if(!s||s[1]<8)continue;
    g.fillStyle=sky(0.13+0.05*Math.sin(t/700+i*2));
    g.fillRect(s[0]+Math.round(2*Math.sin(t/900+i)),py+j,s[1]-4,1);
  }
  for(let i=0;i<6;i++){                                        // kilau titik di permukaan
    const a=0.08+0.16*Math.sin(t/500+i*1.9); if(a<0.13)continue;
    const j=5+((i*7)%(ph-10)), s=air(j,3); if(!s||s[1]<2)continue;
    g.fillStyle=sky(a);g.fillRect(s[0]+((i*11)%s[1]),py+j,1,1);
  }
  /* ikan buyar saat dino mendekat: terdorong menjauh + ekor mengibas lebih cepat */
  const ccx=px+pw/2, ccy=py+ph/2;
  const ddx=player.x-ccx, ddy=player.y-ccy, dd=Math.hypot(ddx,ddy);
  const flee=floor===2?Math.max(0,Math.min(1,(58-dd)/40)):0;
  const ux=dd>1?ddx/dd:0, uy=dd>1?ddy/dd:1;
  const FC=['#d9762c','#c94f3a','#c9a03a'];
  for(let i=0;i<3;i++){                                        // ikan kecil hilir-mudik
    const per=9000+i*2600, k=((t+i*3000)%per)/per, dir=i%2?1:-1;
    const push=flee*9;
    const j=Math.max(3,Math.min(ph-4,9+i*6+Math.round(2*Math.sin(t/600+i*2)-uy*push)));
    const s=air(j,3)||air(Math.round(ph/2),3);                 // ikan tetap di dalam air, ikut lekuk
    const aw=Math.max(2,s[1]-3);
    const fx=Math.max(s[0],Math.min(s[0]+aw,
              s[0]+Math.round(aw*(dir>0?k:1-k)-ux*push)));
    const fy=py+j;
    const wig=Math.sin(t/(180-flee*110)+i)>0?1:0;
    P(g,'rgba(10,30,40,.35)',fx-1,fy+2,5,1);                   // bayang di air
    P(g,FC[i],fx,fy,3,2);P(g,FC[i],fx-dir,fy+wig,1,1);         // badan + ekor
    P(g,'rgba(255,255,255,.55)',fx+(dir>0?1:1),fy,1,1);        // kilau punggung
  }
  const rp=6500, rt=(t%rp)/rp;                                 // riak melingkar sesekali
  if(rt<0.5){const r=1+rt*13, a=0.34*(1-rt/0.5);
    const cxp=px+Math.round(pw*0.62), cyp=py+Math.round(ph*0.45);
    g.fillStyle=`rgba(205,238,248,${a.toFixed(3)})`;
    for(let k=0;k<10;k++){const an=k/10*6.283;
      g.fillRect(Math.round(cxp+Math.cos(an)*r),Math.round(cyp+Math.sin(an)*r*0.5),1,1);}}
}
/* --- CUACA MUSIMAN: genangan di jalur batu (lapisan tanah) + gerimis (lapisan depan) --- */
/* genangan mengikuti jalur yang berkelok (bukan kolom tetap), pada petak yang tak tertutup sprite */
const PUDDLE=[[SPINE[4],4],[SPINE[9],9],[SPINE[12],12],[SPINE[14],14],
              [5,BR_L[5]],[7,BR_L[7]],[11,BR_L[11]],[15,BR_R[15]]];
function drawPuddles(g,t){
  const w=SN().wet; if(!w)return;
  for(const [ptx,pty] of PUDDLE){
    const x=ptx*T+3,y=pty*T+7;
    P(g,`rgba(70,95,115,${(0.30*w).toFixed(3)})`,x,y,10,4);          // cekungan basah
    P(g,`rgba(150,190,220,${(0.22*w).toFixed(3)})`,x+1,y+1,8,2);     // air
    const sh=0.10+0.12*Math.sin(t/520+ptx*2);                        // pantulan langit bergoyang
    P(g,`rgba(215,238,255,${(sh*w).toFixed(3)})`,x+2,y+1,6,1);
  }
}
function drawRain(g,t){
  const w=SN().wet; if(!w)return;
  const n=Math.round(40*w);
  g.fillStyle=`rgba(190,215,235,${(0.15+0.10*w).toFixed(3)})`;
  for(let i=0;i<n;i++){                                              // garis gerimis miring tipis
    const sp=0.34+((i*7)%5)*0.04;
    const x=((i*53)%(W+30))-15+Math.round(((t*sp/9)%20));
    const y=(((i*89)+t*sp)%(H+26))-13;
    g.fillRect(x|0,y|0,1,4);
  }
  for(let i=0;i<Math.round(12*w);i++){                               // percik saat menyentuh tanah
    const k=((t/300+i*0.83)%1);
    if(k>=0.4)continue;
    const x=(i*97+31)%W, y=(i*61+17)%H, r=1+Math.round(k*5);
    g.fillStyle=`rgba(205,230,250,${(0.24*(1-k/0.4)).toFixed(3)})`;
    g.fillRect(x-r,y,r*2,1);
  }
}
/* --- JEJAK LANGKAH: debu/percik berbeda per permukaan --- */
const stepFx=[];let stepDist=0;
const STEP_C={batu:'#bdb7aa',tanah:'#8d6a44',rumput:'#6f9a52',lantai:'#8f9aa8'};
function surfaceAt(tx,ty){
  if(floor!==2)return 'lantai';
  if(OUT_PATH.has(tx+','+ty))return 'batu';
  if(MAP3[ty]&&MAP3[ty][tx]==='#')return 'tanah';
  return 'rumput';
}
function emitStep(){
  const [tx,ty]=ptile(), s=surfaceAt(tx,ty);
  stepFx.push({x:Math.round(player.x)+((stepDist|0)%2?-3:3),y:Math.round(player.y)+2,
               t0:performance.now(),c:STEP_C[s],s});
  if(AC){                                                            // bunyi hanya bila audio sudah hidup
    if(s==='batu')beep(1500,.025,.012,'square');
    else if(s==='tanah')beep(180,.05,.016,'sine');
    else if(s==='rumput')beep(2600,.018,.008,'square');
    else beep(900,.025,.010,'square');
  }
}
function drawStepFx(g,t){
  for(let i=stepFx.length-1;i>=0;i--){const p=stepFx[i],a=(t-p.t0)/520;
    if(!(a>=0&&a<1)){stepFx.splice(i,1);continue;}
    g.globalAlpha=(1-a)*0.55;
    if(p.s==='rumput')P(g,p.c,p.x,p.y-Math.round(a*3),1,2);          // helai rumput tersibak
    else{const r=1+Math.round(a*2);P(g,p.c,p.x-(r>>1),p.y-Math.round(a*2),r,1);} // debu memuai
    g.globalAlpha=1;}
}
const chickAt=(ch,i,t)=>({x:ch.x0*T+Math.round(5*Math.sin(t/2600+i*2)),
                          y:ch.y0*T+Math.round(3*Math.sin(t/3100+i))});
/* --- TELUR: tiap ayam bertelur berkala di tempat ia berdiri, dan BISA DIPUNGUT.
       Posisi tetap deterministik dari waktu bertelur; hanya status "sudah diambil"
       yang disimpan, dipangkas sendiri setelah telurnya kedaluwarsa. --- */
const EGG_LIFE=25000;
const eggTaken=new Map();
function eggsNow(t){
  for(const [k,v] of eggTaken)if(t-v>EGG_LIFE+2000)eggTaken.delete(k);
  const out=[];
  CHICK.forEach((ch,i)=>{
    const per=26000+i*7000, cyc=Math.floor(t/per), lay=cyc*per, age=t-lay;
    if(age>=EGG_LIFE)return;
    const id=i+':'+cyc; if(eggTaken.has(id))return;
    const e=chickAt(ch,i,lay);
    out.push({id,x:e.x-1,y:e.y+5,age});
  });
  return out;
}
function eggNear(t){                                           // telur terdekat dalam jangkauan dino
  let best=null;
  for(const e of eggsNow(t)){
    const d2=(e.x+1-player.x)**2+(e.y+2-player.y)**2;
    if(d2<=18*18&&(!best||d2<best.d2))best={e,d2};
  }
  return best&&best.e;
}
function pickEggNear(){
  const now=performance.now(), e=eggNear(now);
  if(!e)return false;
  eggTaken.set(e.id,now);
  const fx=e.x-player.x, fy=e.y-player.y;                      // dino menoleh ke telur
  player.dir=Math.abs(fx)>Math.abs(fy)?(fx>0?'right':'left'):(fy>0?'down':'up');
  player.pick={kind:5,t0:now,fx:e.x+1,fy:e.y+2};
  beep(990,.05,.05);beep(1480,.08,.05,'square',.06);
  return true;
}

/* =========================================================================
   MEMANCING — lempar umpan, lalu MENYELAM ke minigame bawah air
   Petak di tepi kolam jadi zona pancing (petak yang sudah jadi zona bedengan
   atau pintu dibiarkan). Dulu menunggu di permukaan: lama penantian diundi,
   lalu satu tarikan tepat waktu. Sekarang begitu umpan menyentuh air, layar
   pindah KE DALAM KOLAM — pemain melihat ikannya dan menuntun umpan sendiri.
   Bagian di bawah ini hanya mengurus lemparannya; minigamenya ada di bab
   BAWAH AIR setelah ini.
   ========================================================================= */
const fishTool={id:'fish',name:'KOLAM',short:'KOLAM',color:'#5ab0f2',
                btn:'PANCING &#9656;',isFish:true,desc:''};
for(let y=POND.y-1;y<=POND.y+POND.h;y++)for(let x=POND.x-1;x<=POND.x+POND.w;x++){
  if(x<1||y<2||x>=COLS-1||y>=ROWS-1)continue;
  const k=x+','+y;
  if(SOLIDS[2][y*COLS+x]||ZONES[2][k])continue;                 // jangan timpa zona bedengan/pintu
  ZONES[2][k]=fishTool;
}
const CAST_DUR=520, FISH_END=760;
function fishStart(){
  if(dive.on||player.fish)return;
  const now=performance.now();
  const cx0=POND.x*T+POND.w*T/2, cy0=POND.y*T+POND.h*T/2;
  const dx=cx0-player.x, dy=cy0-player.y;
  player.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
  player.fish={t0:now, bx:Math.round(cx0-dx*0.16), by:Math.round(cy0-dy*0.16),
               done:0, endT:0, menyelam:false};
  beep(300,.07,.045,'sine');beep(460,.09,.035,'sine',.06);
}
/* Namanya dipertahankan: tombol BUKA, tombol ENTER, dan uji otomatis sama-sama
   memanggil fishHook(). Di alur baru ia cuma meneruskan tarikan ke minigame. */
function fishHook(){ if(dive.on)diveTarik(); }
/* umpan & joran digambar sebidang dengan drawPick (di depan dino) */
function drawFishing(g,t){
  const f=player.fish; if(!f)return;
  const el=t-f.t0, px=Math.round(player.x), py=Math.round(player.y);
  const side=f.bx>=px?1:-1;
  const hx=px+side*4, hy=py-10;                                 // tangan dino
  const tipx=hx+side*7, tipy=hy-8;                              // ujung joran
  for(let i=0;i<=7;i++){                                        // joran bambu (pangkal gelap, ujung pucat)
    const k=i/7;
    P(g,i>5?'#d8c48a':'#8a6a3a',hx+Math.round(side*7*k),hy-Math.round(8*k),1,1);
  }
  let bx,by;
  if(el<CAST_DUR){                                              // umpan melayang ke air
    const k=el/CAST_DUR;
    bx=Math.round(tipx+(f.bx-tipx)*k);
    by=Math.round(tipy+(f.by-tipy)*k-Math.sin(k*Math.PI)*14);
  }else{bx=f.bx;by=f.by+Math.round(Math.sin(t/620));}           // mengapung — sambarannya di bawah air
  if(f.done!==1){                                               // senar dari ujung joran ke umpan
    const n=Math.max(1,Math.round(Math.hypot(bx-tipx,by-tipy)/3));
    g.globalAlpha=0.55;
    for(let i=1;i<n;i++){const k=i/n;
      P(g,'#cfe0ee',Math.round(tipx+(bx-tipx)*k),Math.round(tipy+(by-tipy)*k+Math.sin(k*Math.PI)*3),1,1);}
    g.globalAlpha=1;
    P(g,'#1b2b33',bx-1,by-1,3,3);                               // pelampung
    P(g,'#e04a3a',bx-1,by-1,3,1);P(g,'#f7f2e4',bx-1,by,3,1);
  }
  if(el>=CAST_DUR&&!f.done){                                    // riak di tempat umpan mendarat
    const r=1+((el-CAST_DUR)/150)%3;
    g.fillStyle='rgba(205,238,248,.28)';
    for(let k=0;k<8;k++){const an=k/8*6.283;
      g.fillRect(Math.round(bx+Math.cos(an)*r),Math.round(by+2+Math.sin(an)*r*0.5),1,1);}
  }
  if(f.done===-1){                                              // percik kecil: ikan lepas
    const k=Math.min(1,(t-f.endT)/380);
    g.globalAlpha=(1-k)*0.7;
    const r=2+k*7;
    g.fillStyle='rgba(190,225,240,1)';
    for(let i=0;i<8;i++){const an=i/8*6.283;
      g.fillRect(Math.round(f.bx+Math.cos(an)*r),Math.round(f.by+Math.sin(an)*r*0.5),1,1);}
    g.globalAlpha=1;
  }
}

/* =========================================================================
   BAWAH AIR — minigame memancing
   Begitu umpan menyentuh air, dunia atas DIBEKUKAN (tidak di-update, tidak
   digambar) dan layar berpindah ke penampang kolam. Pemain menuntun umpan
   dengan arah yang sama seperti berjalan; ikan punya watak sendiri.

   Aturannya tiga, dan ketiganya bisa dipelajari pemain tanpa dijelaskan:
   1. Tiap jenis punya kedalaman jelajah sendiri. Mau lele, turun ke dasar;
      wader selalu di permukaan.
   2. Umpan yang DIAM menarik minat dua setengah kali lebih cepat daripada
      umpan yang sedang digerakkan — jadi menuntun lalu berhenti itu siasat,
      bukan sekadar menunggu.
   3. Begitu ikan menggigit, umpan tidak boleh digerakkan sama sekali. Satu
      sentakan dan ia lepas. Yang ditekan hanya tombol tarik.
   Menarik saat tak ada yang menggigit memboroskan umpan DAN mengagetkan ikan
   di sekitarnya, jadi menekan tombol terus-menerus bukan siasat.
   ========================================================================= */
const DIVE_SISA=34, DIVE_DENDA=6;          // detik umpan bertahan · denda tiap tarikan kosong
const UMPAN_VX=54, UMPAN_VY=42;            // laju umpan dituntun, piksel/detik
/* Tujuh pita, bukan gradien halus: sama seperti lantai digambar di seluruh
   permainan, dan paletnya tetap rapat. */
const AIR=['#2f6d86','#27607a','#20536a','#1a465a','#14394b','#0e2d3c','#09212d'];
/* --- LAWAN ---------------------------------------------------------------
   Menyambar bukan lagi akhir cerita. Begitu kail menancap, ikannya dilawan:
   penanda menyapu bar merah, dan tiap kali ditekan tepat di zona hijau di
   tengah, zona itu MENYEMPIT dan sapuannya mempercepat. Lima sampai tujuh kena
   menurut jenisnya; tiga meleset dan ia lepas kembali ke kolam.
   Lebarnya 34% bar di kena pertama, 11% di kena terakhir — jadi pukulan
   terakhir melawan MAS benar-benar sempit, dan itu disengaja. */
/* Angka ini DIHITUNG, bukan dikira. Jendela tekan = lebar zona / laju sapuan.
   Versi pertama memakai H1=0,11 DAN sapuan yang ikut mempercepat tiap kena:
   pukulan terakhir melawan MAS jadi 57 ms — di bawah waktu reaksi manusia
   (~200 ms), jadi mustahil, bukan sulit. Sekarang sapuan TETAP sepanjang satu
   pertarungan dan hanya zonanya yang menyempit, persis seperti yang diminta.
   Jendela terukur: kena ke-1 ~290 ms, kena terakhir ~132-155 ms. */
const LAWAN_H0=0.34, LAWAN_H1=0.14;     // lebar zona hijau: awal -> akhir
const LAWAN_LUPUT=3;                    // meleset sebanyak ini, ikan lepas
const dive={on:false,fase:'',ft:0,t:0,bx:0,by:0,laju:0,
            ikan:[],sisa:0,pesan:'',kedipT:0,dapat:null,gigit:null,lawan:null};
/* Tinggi kanvas berubah antara desktop dan layar sentuh, jadi batas permukaan
   dan dasar dihitung ulang tiap frame alih-alih dipaku. */
const diveRuang=()=>{
  const W2=Math.max(1,cv.width), H2=cv.height;
  const SURF=Math.max(18,Math.round(H2*0.12));
  /* BED dijaga SELALU di bawah SURF. Saat panel peramban tersembunyi,
     innerWidth jadi 0, fit() memberi kanvas 0x0, dan tanpa penjaga ini dasar
     kolam jatuh di ATAS permukaan — ruang terbalik. Diukur: aritmetikanya
     kebetulan masih terhingga, tapi itu kebetulan, bukan jaminan. */
  return {W2,H2,SURF,BED:Math.max(SURF+24,H2-Math.max(13,Math.round(H2*0.10)))};};

function diveIkanBaru(){
  const {W2,SURF,BED}=diveRuang();
  let r=Math.random(), sp=IKAN[IKAN.length-1];
  for(const k of IKAN){if(r<k.langka){sp=k;break;}r-=k.langka;}
  const d=sp.dalam[0]+Math.random()*(sp.dalam[1]-sp.dalam[0]);
  return {sp,x:Math.random()*W2,y:SURF+d*(BED-SURF),
          dir:Math.random()<0.5?-1:1,fase:Math.random()*6.283,
          mode:'jelajah',waspadaT:0,gigitT:0};
}
function diveStart(){
  const {W2,SURF,BED}=diveRuang();
  dive.on=true;dive.fase='masuk';dive.ft=0;dive.t=0;
  dive.bx=Math.round(W2*0.5);dive.by=Math.round(SURF+(BED-SURF)*0.32);
  dive.laju=0;dive.sisa=DIVE_SISA;dive.dapat=null;dive.gigit=null;
  dive.pesan='';dive.kedipT=0;
  dive.lawan=null;
  dive.ikan=[];for(let i=0;i<9;i++)dive.ikan.push(diveIkanBaru());
  keys.clear();banner.classList.remove('show');
  diveTombol('ROLL');diveAnalog(true);
  beep(520,.09,.05,'sine');beep(330,.16,.05,'sine',.08);
}
/* Tombol kiri berganti tugas selama menyelam. Dicari saat dipakai, bukan
   disimpan: kalau elemennya tidak ada, permainan tetap jalan. */
function diveTombol(teks){
  const b=document.getElementById('btnJump');
  if(b)b.textContent=teks;
}
/* Analog dipadamkan selama battle: ia tak dipakai di sana, dan di layar kecil
   ia menutupi bar-nya. display='' mengembalikannya ke aturan CSS, bukan
   memaksanya tampil — di desktop ia memang harus tetap tersembunyi. */
function diveAnalog(tampak){
  const st=document.getElementById('stick');
  if(st)st.style.display=tampak?'':'none';
}
function diveKabur(f,pesan){
  f.mode='kabur';f.waspadaT=3.0;
  if(dive.gigit===f)dive.gigit=null;
  if(pesan){dive.pesan=pesan;beep(200,.12,.045,'sine');}   // pesan cuma dicatat, tak ditampilkan
}
/* Lebar zona hijau pada hitungan kena ke-n. Dipakai saat menggambar DAN saat
   memeriksa tekanan, supaya yang dilihat pemain persis yang dihitung. */
const lawanLebar=L=>LAWAN_H0+(LAWAN_H1-LAWAN_H0)*(L.kena/L.perlu);
/* Letak zona hijau diundi ulang tiap kali kena. Dijaga dua hal: tepinya tidak
   menempel ujung bar (di ujung penanda berbalik arah, jadi waktu yang dihabiskan
   di sana tidak sama dengan di tengah), dan pusat barunya melompat minimal
   seperempat bar dari yang lama — tanpa itu undian sering jatuh dekat tempat
   semula dan perpindahannya tak terasa. */
function lawanUndi(L){
  const lb=lawanLebar(L), tepi=lb/2+0.05, lama=L.pusat;
  for(let c=0;c<24;c++){
    const u=tepi+Math.random()*(1-tepi*2);
    if(lama===undefined||Math.abs(u-lama)>=0.25){L.pusat=u;return;}
  }
  L.pusat=lama===undefined?0.5:(lama<0.5?1-tepi:tepi);
}
function diveLawanMulai(f){
  dive.fase='lawan';dive.ft=0;
  diveTombol('HIT');diveAnalog(false);        // analog menutupi bar di layar kecil
  dive.lawan={sp:f.sp,ikan:f,perlu:f.sp.lawan,kena:0,luput:0,
              laju:0.86+0.06*f.sp.lawan,          // jenis yang lebih berharga menyapu lebih cepat
              pos:0.5,arah:Math.random()<0.5?-1:1,kilatT:0,gagalT:0,pusat:undefined};
  lawanUndi(dive.lawan);
  beep(620,.07,.05,'square');beep(420,.1,.045,'square',.06);
}
function diveLawanTekan(){
  const L=dive.lawan; if(!L)return;
  if(Math.abs(L.pos-L.pusat)<=lawanLebar(L)/2){
    L.kena++;L.kilatT=0.22;
    beep(720+L.kena*120,.05,.045,'square');
    if(L.kena>=L.perlu){diveAngkatMulai(L.sp,L.ikan);return;}
    lawanUndi(L);                                 // zona pindah tiap kali kena
  }else{
    L.luput++;L.gagalT=0.30;
    beep(170,.12,.05,'sine');
    if(L.luput>=LAWAN_LUPUT){                     // senar kendur, ikan lepas
      const f=L.ikan;dive.lawan=null;dive.fase='main';dive.ft=0;dive.gigit=null;
      diveTombol('ROLL');diveAnalog(true);
      diveKabur(f,'LEPAS');
    }
  }
}
/* --- ANGKAT: ikan diseret ke permukaan di ujung senar --------------------
   Dulu battle yang dimenangkan langsung disambut tirai, jadi hadiahnya baru
   terlihat setelah layar berganti. Fase ini mengisi jarak itu.
   Dua ketukan, bukan satu laju. Versi 1,0 detik berakhir PERSIS saat ikan
   menyentuh permukaan, jadi tak ada bingkai yang memperlihatkan ikan sudah
   terangkat — hadiahnya cuma lewat. NAIK menyeretnya dari kedalaman; TAHAN
   menggantungnya di ujung joran, berayun dan meniriskan air. Ketukan kedua
   itulah yang terbaca sebagai memancing yang SELESAI. */
const ANGKAT_NAIK=1.15, ANGKAT_TAHAN=0.95, ANGKAT_DUR=ANGKAT_NAIK+ANGKAT_TAHAN;
function diveAngkatMulai(sp,f){
  dive.fase='angkat';dive.ft=0;
  dive.lawan=null;dive.gigit=null;
  dive.angkat={sp:sp,x0:dive.bx,y0:dive.by};
  diveTombol('ROLL');diveAnalog(true);
  for(const o of dive.ikan)                       // yang lain kabur dari keriuhan
    if(o!==f&&Math.hypot(dive.bx-o.x,dive.by-o.y)<64)o.mode='kabur';
  beep(300,.09,.05,'sine');beep(420,.09,.05,'sine',.07);beep(560,.12,.05,'sine',.15);
  /* Byur dijadwalkan lewat parameter delay beep(), supaya ia jatuh tepat di
     bingkai permukaan pecah tanpa perlu penjadwal bunyi tersendiri. */
  const dp=ANGKAT_NAIK-0.06;
  beep(1500,.05,.030,'square',dp);     beep(900, .07,.035,'sine',    dp+.03);
  beep(1900,.04,.022,'square',dp+.07); beep(1150,.14,.030,'triangle',dp+.10);
}
function diveTarik(){
  if(!dive.on)return;
  if(dive.fase==='lawan'){diveLawanTekan();return;}
  if(dive.fase!=='main')return;
  const f=dive.gigit;
  if(f&&f.mode==='gigit'){diveLawanMulai(f);return;}
  /* Tarikan kosong tidak gratis: umpan berkurang DAN ikan di sekitarnya kaget.
     Tanpa ini pemain cukup menekan tombol terus-menerus. */
  dive.sisa=Math.max(0,dive.sisa-DIVE_DENDA);
  for(const o of dive.ikan)
    if(o.mode!=='kabur'&&Math.hypot(dive.bx-o.x,dive.by-o.y)<40)diveKabur(o,'');
  dive.pesan='TERLALU CEPAT';dive.kedipT=0.55;             // bilah umpan berkedip: 6 detik hangus
  beep(160,.14,.05,'sine');
}
function diveSelesai(sp,pesan){
  if(!dive.on||dive.fase==='keluar')return;
  dive.lawan=null;
  dive.dapat=sp||null;dive.pesan=pesan||'';
  dive.fase='keluar';dive.ft=0;
  if(sp){beep(880,.06,.05);beep(1320,.09,.05,'square',.07);beep(1760,.1,.04,'square',.15);}
  else beep(240,.16,.05,'sine');
}
function diveUpdate(dt){
  const {W2,SURF,BED}=diveRuang();
  dive.t+=dt;dive.ft+=dt;
  if(dive.fase==='masuk'){if(dive.ft>=0.45){dive.fase='main';dive.ft=0;}return;}
  if(dive.fase==='keluar'){
    if(dive.ft<0.50)return;
    dive.on=false;
    const f=player.fish, now=performance.now();
    if(f){
      f.endT=now;
      if(dive.dapat){f.done=1;
        /* Hadiah minigame, bukan pungutan di tepi jalan: diangkat 2x dan
           ditahan 2 detik, bukan 1,15. */
        player.pick={kind:6+IKAN.indexOf(dive.dapat),t0:now,fx:f.bx,fy:f.by,
                     lama:2000,besar:2};}
      else f.done=-1;
    }
    /* Banner dilupakan supaya pemeriksaan zona di update() memunculkannya lagi;
       tanpa menihilkan activeTool, setBanner() keluar lebih awal dan ajakan
       "[ENTER] UNTUK MEMANCING" tak pernah kembali. */
    activeTool=null;lastZone=null;keys.clear();
    diveTombol('JUMP');diveAnalog(true);
    return;
  }
  if(dive.fase==='angkat'){
    const A=dive.angkat;
    if(!A){diveSelesai(null,'');return;}
    for(const f of dive.ikan){                    // kolam tetap hidup
      f.fase+=dt*5;
      f.x+=f.dir*f.sp.laju*(f.mode==='kabur'?2.2:1)*dt;
      if(f.mode!=='kabur'){
        f.y+=Math.sin(dive.t*1.5+f.fase)*6*dt;
        if(f.x<8){f.x=8;f.dir=1;}else if(f.x>W2-8){f.x=W2-8;f.dir=-1;}
      }
    }
    if(dive.kedipT>0)dive.kedipT-=dt;
    if(dive.ft>=ANGKAT_DUR)diveSelesai(A.sp,'DAPAT');
    return;
  }
  if(dive.fase==='lawan'){
    const L=dive.lawan;
    if(!L){dive.fase='main';return;}               // tak mungkin, tapi jangan menggantung
    L.pos+=L.arah*L.laju*dt;                     // laju tetap; yang berubah lebar zonanya
    if(L.pos>1){L.pos=1;L.arah=-1;}else if(L.pos<0){L.pos=0;L.arah=1;}
    if(L.kilatT>0)L.kilatT-=dt;
    if(L.gagalT>0)L.gagalT-=dt;
    /* Ikan lain TETAP berenang. Membekukan seluruh kolam selama battle membuat
       layarnya terbaca macet, bukan tegang. */
    for(const f of dive.ikan){
      f.fase+=dt*(f===L.ikan?16:5);
      if(f===L.ikan)continue;
      if(f.mode==='gigit'||f.mode==='tertarik')f.mode='jelajah';
      f.x+=f.dir*f.sp.laju*(f.mode==='kabur'?2.2:1)*dt;
      if(f.mode!=='kabur'){
        f.y+=Math.sin(dive.t*1.5+f.fase)*6*dt;
        if(f.x<8){f.x=8;f.dir=1;}else if(f.x>W2-8){f.x=W2-8;f.dir=-1;}
      }
    }
    if(dive.kedipT>0)dive.kedipT-=dt;
    return;                                        // umpan tak dituntun, waktu tak berkurang
  }
  /* --- umpan dituntun --- */
  let ax=0,ay=0;
  if(keys.has('left'))ax=-1;else if(keys.has('right'))ax=1;
  if(keys.has('up'))ay=-1;else if(keys.has('down'))ay=1;
  if(!ax&&!ay&&joy.on){
    if(Math.abs(joy.x)>0.3)ax=Math.sign(joy.x);
    if(Math.abs(joy.y)>0.3)ay=Math.sign(joy.y);
  }
  const nx=Math.max(6,Math.min(W2-6,dive.bx+ax*UMPAN_VX*dt));
  const ny=Math.max(SURF+8,Math.min(BED-4,dive.by+ay*UMPAN_VY*dt));
  dive.laju=Math.hypot(nx-dive.bx,ny-dive.by)/Math.max(dt,1e-4);
  dive.bx=nx;dive.by=ny;
  /* --- ikan --- */
  const now=performance.now();
  for(const f of dive.ikan){
    f.fase+=dt*(f.mode==='jelajah'?5:9);
    if(f.waspadaT>0)f.waspadaT-=dt;
    const jar=Math.hypot(dive.bx-f.x,dive.by-f.y);
    if(f.mode==='gigit'){
      /* Inilah tempat aturan "jangan disentak" benar-benar menggigit: saat ikan
         sudah di mata kail. Menaruhnya di fase mendekat membuat seluruh
         permainan jadi menunggu, karena arah digital tak punya "pelan". */
      if(dive.laju>8)diveKabur(f,'LEPAS');
      else if(now-f.gigitT>f.sp.jendela)diveKabur(f,'LEPAS');
      continue;                                        // menggigit: diam di tempat
    }
    if(f.mode==='kabur'){
      f.x+=f.dir*f.sp.laju*2.2*dt;
      if(f.x<-30||f.x>W2+30){const b=diveIkanBaru();b.waspadaT=2.2;Object.assign(f,b);}
      continue;
    }
    if(f.mode==='tertarik'){
      const dx=dive.bx-f.x,dy=dive.by-f.y,m=Math.max(1,Math.hypot(dx,dy));
      f.dir=dx>=0?1:-1;
      const v=f.sp.laju*0.95*dt;
      f.x+=dx/m*v;f.y+=dy/m*v;
      if(m<5){f.mode='gigit';f.gigitT=now;dive.gigit=f;
        beep(1180,.05,.04,'square');beep(880,.08,.04,'square',.05);}
      else if(jar>60)f.mode='jelajah';
      continue;
    }
    /* jelajah */
    f.x+=f.dir*f.sp.laju*dt;
    f.y+=Math.sin(dive.t*1.5+f.fase)*6*dt;
    if(f.x<8){f.x=8;f.dir=1;}else if(f.x>W2-8){f.x=W2-8;f.dir=-1;}
    f.y=Math.max(SURF+6,Math.min(BED-3,f.y));
    /* Laju 2,4/dtk dan radius 42 membuat tangkapan pertama jatuh dalam 1,5-3
       detik — diukur dengan bot, bukan dikira. Angka ini memberi 6-15 detik
       per tangkapan, dan jenis yang pemalu benar-benar terasa pemalu. */
    if(f.waspadaT<=0&&jar<34&&
       Math.random()<(1-f.sp.malu)*dt*0.9*(dive.laju<8?1:0.4))f.mode='tertarik';
  }
  dive.sisa-=dt;
  if(dive.kedipT>0)dive.kedipT-=dt;
  if(dive.sisa<=0)diveSelesai(null,'UMPAN HABIS');
}
/* --- LATAR TERPANGGANG ---------------------------------------------------
   Tujuh pita air dengan tepi yang DI-DITHER, bukan dibiarkan lurus. Tepi lurus
   selebar layar terbaca sebagai garis-garis kain; tiga baris berselang-seling
   di tiap batas membuatnya terbaca sebagai air yang menggelap perlahan.
   Di atas dasar ada satu lapis siluet jauh — gundukan batu dan hamparan rumput
   dalam warna yang hampir setua air terdalam. Itulah yang memberi kedalaman:
   mata membaca "ada sesuatu di belakang sana", bukan sekadar dinding. */
const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
let diveBG=null, diveBGKunci='';
function diveLatar(W2,H2,SURF,BED){
  const kunci=W2+'x'+H2+'x'+SURF+'x'+BED;
  if(diveBG&&diveBGKunci===kunci)return diveBG;
  const span=BED-SURF;
  const c=document.createElement('canvas');c.width=W2;c.height=H2;
  const g=c.getContext('2d');
  for(let i=0;i<AIR.length;i++){
    const y0=Math.round(SURF+span*i/AIR.length);
    const y1=Math.round(SURF+span*(i+1)/AIR.length);
    g.fillStyle=AIR[i];g.fillRect(0,y0,W2,y1-y0+1);
  }
  /* Dither terurut Bayer 4x4 di tiap batas. Pola buatan sendiri yang berulang
     tiap 4 piksel terbaca sebagai renda yang menempel di garis; matriks Bayer
     menyebar ambangnya dua arah, jadi yang terbaca peralihan, bukan motif. */
  for(let i=1;i<AIR.length;i++){
    const yb=Math.round(SURF+span*i/AIR.length), dh=7;
    g.fillStyle=AIR[i];
    /* Seluruh jendela di ATAS batas. Versi pertama mengangkangi batas, dan
       separuh bawahnya sudah berwarna pita baru — menimpanya tak berpengaruh,
       jadi yang tersisa cuma tiga baris renggang yang terbaca sebagai garis. */
    for(let r=0;r<dh;r++){
      const y=yb-dh+r, amb=(r+1)/(dh+1)*16;    // 2/16 menanjak ke 14/16
      if(y<SURF||y>=BED)continue;
      for(let x=0;x<W2;x++)if(BAYER[((y&3)<<2)|(x&3)]<amb)g.fillRect(x,y,1,1);
    }
  }
  /* Gundukan batu jauh. Warnanya harus JELAS lebih gelap dari air terdalam,
     bukan sekadar sedikit berbeda — versi pertama #0c2029 di atas #09212d
     membuat ketiganya tak terlihat sama sekali. Bibir atasnya dibuat lebih
     terang supaya siluetnya terbaca sebagai benda, bukan noda. */
  for(const [fx,fw,fh] of [[0.16,0.17,0.075],[0.54,0.23,0.055],[0.86,0.14,0.065]]){
    const rw=Math.max(8,Math.round(W2*fw)), rh=Math.max(5,Math.round(H2*fh));
    const rx=Math.round(W2*fx)-(rw>>1);
    let lbSeb=-1;
    for(let y=0;y<rh;y++){
      const lb=Math.round(rw*(0.35+0.65*y/rh)), x0=rx+((rw-lb)>>1);
      g.fillStyle='#071820';g.fillRect(x0,BED-rh+y,lb,1);
      if(lb>lbSeb){g.fillStyle='#12333e';g.fillRect(x0,BED-rh+y,lb,1);   // bibir tersinari
                   g.fillStyle='#071820';g.fillRect(x0+1,BED-rh+y+1,Math.max(0,lb-2),1);}
      lbSeb=lb;
    }
  }
  /* hamparan rumput jauh — siluet bergerigi di atas lumpur */
  g.fillStyle='#08191f';
  for(let x=0;x<W2;x+=3){const r=rnd(x,77);g.fillRect(x,BED-(5+(r>>>3)%13),3,20);}
  /* dasar: lumpur, bibir tersinari, kerikil, kayu tenggelam */
  g.fillStyle='#3a2e22';g.fillRect(0,BED,W2,H2-BED);
  g.fillStyle='#4a3c2c';g.fillRect(0,BED,W2,2);
  g.fillStyle='#2a2118';g.fillRect(0,BED+5,W2,1);
  for(let i=0;i<W2;i+=7){const r=rnd(i,3);
    if(r%3===0){g.fillStyle='#55473a';g.fillRect(i+(r>>>3)%4,BED+2,3,2);}}
  {const lx=Math.round(W2*0.62), lw=Math.max(18,Math.round(W2*0.16));
   g.fillStyle='#2e2317';g.fillRect(lx-2,BED-5,lw+4,6);
   g.fillStyle='#4a3a26';g.fillRect(lx,BED-4,lw,4);
   g.fillStyle='#5d4a31';g.fillRect(lx,BED-4,lw,1);
   g.fillStyle='#2f5c34';g.fillRect(lx+3,BED-6,2,2);
   g.fillStyle='#4e8a4a';g.fillRect(lx+lw-6,BED-6,2,2);}
  diveBG=c;diveBGKunci=kunci;return c;
}
/* Kaustik: jaring cahaya yang bergoyang di sepertiga atas. Dibuat dari garis
   pendek yang terang-redup sendiri-sendiri, bukan satu hamparan beralfa —
   hamparan rata selalu terbaca sebagai kaca, bukan cahaya. */
function diveKaustik(g,t,W2,SURF,span){
  for(let i=0;i<70;i++){
    const r=rnd(i,11);
    const d=(r%100)/100;
    const ph=(r%628)/100;
    const a=Math.sin(t/900+ph);
    if(a<0.25)continue;
    const bx=(r>>>5)%W2, lb=2+((r>>>9)&3);
    const dx=Math.round(Math.sin(t/1700+ph)*3);
    g.fillStyle='rgba(190,238,250,'+(0.11*((a-0.25)/0.75)*(1-d)).toFixed(3)+')';
    g.fillRect(bx+dx,Math.round(SURF+2+d*span*0.44),lb,1);
  }
}
function diveDraw(g,t){
  const {W2,H2,SURF,BED}=diveRuang(), span=BED-SURF;
  g.setTransform(1,0,0,1,0,0);
  g.globalAlpha=1;
  g.drawImage(diveLatar(W2,H2,SURF,BED),0,0);
  diveKaustik(g,t,W2,SURF,span);
  /* Berkas cahaya memudar menurut kedalaman. Beralfa rata ia terbaca sebagai
     BILAH miring yang memotong pita air — bukan cahaya yang menembus. */
  for(let k=0;k<3;k++){
    const x0=Math.round(W2*(0.17+k*0.32)+Math.sin(t/2600+k)*7);
    const lb=6-k*2;
    for(let y=0;y<span;y+=2){
      const sisa=Math.max(0,1-y/(span*0.78));
      if(sisa<=0.02)break;
      g.fillStyle='rgba(185,232,246,'+(0.050*sisa*sisa).toFixed(4)+')';
      g.fillRect(x0+Math.round(y*0.40),SURF+y,Math.max(2,lb),2);
    }
  }
  for(let i=2;i<W2;i+=11){                                     // rumput tengah, ikut arus
    const r=rnd(i,9), hgt=5+(r>>>2)%7, sw=Math.sin(t/1100+i)*1.8;
    for(let k=0;k<hgt;k++){
      g.fillStyle=k>hgt-3?'#4e8a4a':'#2f5c34';
      g.fillRect(Math.round(i+sw*k/hgt),BED-k,1,1);
    }
  }
  g.fillStyle='rgba(205,238,248,.32)';                         // gelembung naik
  for(let i=0;i<14;i++){
    const r=rnd(i,21), bx=(r>>>4)%Math.max(1,W2), per=2600+(r%1800);
    const by=BED-((t/per*span*1.3+(r%span))%span);
    if(by>SURF+3)g.fillRect(bx,Math.round(by),1,1);
  }
  /* permukaan, langit, dan siluet dino yang sedang memegang joran */
  /* Langit dibuat jelas lebih terang dari siluetnya. Versi pertama memakai
     #050a10 di atas #070d14 — dua warna yang praktis sama, jadi dino yang
     sedang memancing hilang sama sekali dari layar. */
  g.fillStyle='#1b2a38';g.fillRect(0,0,W2,SURF);
  g.fillStyle='#24384a';g.fillRect(0,SURF-6,W2,6);             // tepian kolam, lebih dekat
  g.fillStyle='#8fd4e8';
  for(let x=0;x<W2;x++)g.fillRect(x,SURF+Math.round(Math.sin(x/9+t/700)*1.2),1,1);
  g.fillStyle='rgba(143,212,232,.26)';g.fillRect(0,SURF+2,W2,2);
  const dx0=Math.round(W2*0.17);
  g.fillStyle='#070c12';
  g.fillRect(dx0-6,SURF-11,11,11);g.fillRect(dx0-1,SURF-15,7,5); // badan + kepala
  g.fillRect(dx0-9,SURF-4,4,4);                                  // ekor menjuntai
  for(let i=0;i<=8;i++)g.fillRect(dx0+5+i,SURF-14-Math.round(i*0.62),1,1);  // joran
  for(let i=0;i<W2;i+=23){                                       // rumpun alang di tepi
    const r=rnd(i,5), hgt=4+(r>>>3)%5;
    g.fillStyle='#0d1620';
    for(let k=0;k<hgt;k++)g.fillRect(i+(r>>>5)%3,SURF-1-k,1,1);
  }
  const tx0=dx0+13, ty0=SURF-19;
  /* --- ikan --- */
  for(const f of dive.ikan){
    const dep=Math.max(0,Math.min(1,(f.y-SURF)/span));
    g.globalAlpha=0.70+0.30*(1-dep);                           // makin dalam makin samar
    /* Yang sedang dilawan digoyang 2 px tiap sumbu: ia meronta di ujung senar. */
    const dilawan=dive.fase==='lawan'&&dive.lawan&&f===dive.lawan.ikan;
    const ox=dilawan?Math.round(Math.sin(t/55)*2):0;
    const oy=dilawan?Math.round(Math.cos(t/41)*2):0;
    drawIkan(g,Math.round(f.x)+ox,Math.round(f.y)+oy,f.sp,f.dir,f.fase);
    g.globalAlpha=1;
    /* Tanpa penanda apa pun untuk 'tertarik': ikan yang berminat berbalik dan
       berenang lurus ke umpan, dan itu sudah terbaca. Tanda seru disimpan
       khusus untuk saat yang benar-benar menuntut tindakan. */
    if(f.mode==='gigit'&&dive.fase==='main'){
      const ey=Math.round(f.y)-f.sp.tinggi-12-(Math.floor(t/110)%2);
      P(g,'#101820',Math.round(f.x)-2,ey-1,5,10);
      P(g,'#ffd23a',Math.round(f.x)-1,ey,3,5);P(g,'#ffd23a',Math.round(f.x)-1,ey+7,3,2);
      const r=1+((t-f.gigitT)/110)%4;
      g.fillStyle='rgba(205,238,248,.45)';
      for(let k=0;k<8;k++){const an=k/8*6.283;
        g.fillRect(Math.round(dive.bx+Math.cos(an)*r),Math.round(dive.by+Math.sin(an)*r*0.6),1,1);}
    }
  }
  /* --- senar & umpan. Selama fase angkat keduanya dilewati: senar dan ikan
     digambar oleh blok ANGKAT di bawah, dan dua senar sekaligus di layar
     terbaca sebagai kesalahan gambar. --- */
  const bx=Math.round(dive.bx), by=Math.round(dive.by);
  if(dive.fase!=='angkat'){
  const nseg=Math.max(2,Math.round(Math.hypot(bx-tx0,by-ty0)/3));
  g.globalAlpha=.5;g.fillStyle='#cfe0ee';
  for(let i=1;i<nseg;i++){const k=i/nseg;
    g.fillRect(Math.round(tx0+(bx-tx0)*k),Math.round(ty0+(by-ty0)*k),1,1);}
  g.globalAlpha=1;
  /* Umpan dibuat lebih besar dan diberi kerlip melingkar. Versi pertama cuma
     3 px merah tua: inilah benda yang dituntun pemain, dan di antara tujuh pita
     air yang gelap ia hilang. Kerlipnya sekaligus menandai jangkauan yang
     menarik ikan. Dibuat sebagai CINCIN TITIK, bukan kotak beralfa: kotak
     beralfa di atas air gelap terbaca sebagai peti abu-abu, bukan pendar —
     galat yang sama persis dengan lampu rak pembibitan. */
  const rr=5+Math.sin(t/420);
  g.fillStyle='rgba(255,214,140,.32)';
  for(let k=0;k<10;k++){const an=k/10*6.283+t/900;
    g.fillRect(Math.round(bx+Math.cos(an)*rr),Math.round(by+Math.sin(an)*rr*0.8),1,1);}
  P(g,'#c3cfdb',bx+1,by-5,1,5);P(g,'#c3cfdb',bx,by,2,1);       // batang & lengkung kail
  P(g,'#7d8794',bx+1,by-5,1,1);
  P(g,'#7a2414',bx-4,by-3,5,5);                                // garis luar cacing
  P(g,'#d4512f',bx-4,by-3,4,4);P(g,'#f2855f',bx-4,by-3,2,2);   // badan + sisi tersinari
  P(g,'#ffd0b0',bx-4,by-3,1,1);
  }
  /* --- RUMPUT DEPAN: digambar SETELAH ikan, jadi ikan bisa lewat di
     belakangnya. Satu lapis di depan kamera inilah yang mengubah layar dari
     "gambar datar" jadi "ruang yang punya jarak". --- */
  for(let i=5;i<W2;i+=17){
    const r=rnd(i,33), hgt=9+(r>>>2)%10, sw=Math.sin(t/900+i)*2.4;
    for(let k=0;k<hgt;k++){
      g.fillStyle=k>hgt-3?'#1f4a28':'#132c19';
      g.fillRect(Math.round(i+sw*k/hgt),BED+1-k,2,1);
    }
  }
  for(let k=0;k<8;k++){                                        // vinyet tepi
    g.fillStyle='rgba(2,10,16,'+(0.085*(1-k/8)).toFixed(3)+')';
    g.fillRect(k,SURF,1,H2-SURF);g.fillRect(W2-1-k,SURF,1,H2-SURF);
  }
  /* --- bilah umpan: satu-satunya HUD yang tersisa, dan ia tanpa kata ---
     Berkedip kuning sesaat setiap tarikan kosong menghanguskan 6 detik. Dulu
     itu diumumkan lewat tulisan; tanpa penggantinya denda jadi tak kasatmata. */
  const barW=Math.max(20,W2-16), k2=Math.max(0,dive.sisa/DIVE_SISA);
  const kedip=dive.kedipT>0&&Math.floor(dive.kedipT*14)%2===0;
  if(kedip){g.fillStyle='#ffd23a';g.fillRect(7,3,barW+2,7);}
  g.fillStyle='rgba(6,12,18,.78)';g.fillRect(8,4,barW,5);
  g.fillStyle=kedip?'#ffd23a':(k2<0.25?'#e0552f':'#4ce0ff');
  g.fillRect(9,5,Math.round((barW-2)*k2),3);
  /* --- IKAN DIANGKAT ---------------------------------------------------- */
  if(dive.fase==='angkat'&&dive.angkat){
    const A=dive.angkat;
    const k=Math.min(1,dive.ft/ANGKAT_NAIK);                   // ketukan NAIK saja
    const e=k*k*(3-2*k);                                       // pelan-cepat-pelan
    const th=Math.max(0,Math.min(1,(dive.ft-ANGKAT_NAIK)/ANGKAT_TAHAN));
    /* Selama TAHAN ikan BERAYUN DI SEKITAR UJUNG JORAN, bukan bergeser lurus:
       benda yang tergantung pada senar adalah bandul, dan senarnya ikut
       miring. Simpangannya ditambahkan pada posisi lerp, bukan menggantinya,
       supaya tak ada lompatan di perbatasan dua ketukan — amplitudonya nol
       sampai e=0,85 lalu menanjak, jadi di titik sambung keduanya sama. */
    const tali=(SURF-7)-ty0;                                   // panjang senar saat tergantung
    const amp=Math.max(0,(e-0.85)/0.15)*Math.pow(1-th,0.6);
    const sw=Math.sin(dive.ft*5.2)*0.30*amp;
    const fx=Math.round(A.x0+(tx0-A.x0)*e+Math.sin(sw)*tali);
    const fy=Math.round(A.y0+((SURF-7)-A.y0)*e-(1-Math.cos(sw))*tali);
    const nk=Math.max(2,Math.round(Math.hypot(fx-tx0,fy-ty0)/3));
    g.globalAlpha=.55;g.fillStyle='#cfe0ee';                   // senar ikut memendek
    for(let i=1;i<nk;i++){const q=i/nk;
      g.fillRect(Math.round(tx0+(fx-tx0)*q),Math.round(ty0+(fy-ty0)*q),1,1);}
    g.globalAlpha=1;
    for(let i=0;i<5;i++){                                      // jejak gelembung di bawahnya
      const q=(i+1)/6, by2=fy+Math.round((A.y0-fy)*q*0.8);
      if(by2>SURF+2){g.fillStyle='rgba(205,238,248,'+(0.30*(1-q)).toFixed(2)+')';
        g.fillRect(fx+((i%2)?2:-2),by2,1,1);}
    }
    if(th>0){                                                  // air menitik dari ikan
      for(let i=0;i<4;i++){
        const r=rnd(i,91), q=(dive.ft*1.7+((r>>>4)%100)/100)%1;
        const ty2=fy+4+Math.round(q*Math.max(4,SURF+5-fy));
        g.fillStyle='rgba(205,238,248,'+(0.55*(1-q)).toFixed(2)+')';
        g.fillRect(fx-4+((r>>>9)%9),ty2,1,2);
      }
    }
    /* meronta: digoyang, dimiringkan moncong ke atas, lalu ikut arah ayunan.
       Goyangannya diredam separuh selama TAHAN — kalau getar 2 px dan ayunan
       3 px jalan sekencang-kencangnya bersamaan, yang terbaca cuma ribut. */
    g.setTransform(1,0,0,1,0,0);
    g.translate(fx+Math.round(Math.sin(t/38)*2*(1-th*0.5)),fy);
    g.rotate(-0.62*e+sw);
    drawIkan(g,0,0,A.sp,1,dive.ft*16);
    g.setTransform(1,0,0,1,0,0);
    /* Cincin permukaan dihitung dari WAKTU, bukan dari jarak ikan ke
       permukaan. Rumus jarak dulu memaku radiusnya begitu ikan berhenti di
       permukaan; dengan fase yang kini hampir dua kali lebih panjang, cincin
       diam sedetik akan terbaca sebagai lingkaran yang digambar, bukan air
       yang pecah. Sekarang ia melebar lalu pudar habis. */
    const pk=(dive.ft-(ANGKAT_NAIK-0.10))/0.60;
    if(pk>0&&pk<1){
      const r=3+pk*28;
      g.fillStyle='rgba(225,245,252,'+(0.55*(1-pk)).toFixed(2)+')';
      for(let i=0;i<14;i++){const an=i/14*6.283;
        g.fillRect(Math.round(tx0+Math.cos(an)*r),Math.round(SURF+Math.sin(an)*r*0.33),1,1);}
    }
  }
  /* --- BAR LAWAN ---------------------------------------------------------
     Panel hasil tangkapan dulu berdiri di sini. Dibuang: ia menutupi persis
     momen yang jadi hadiahnya — ikan yang terangkat di atas kepala dino begitu
     dino muncul lagi di tepi kolam. Satu hadiah, bukan dua. */
  if(dive.fase==='lawan'&&dive.lawan){
    const L=dive.lawan;
    const bw=Math.min(W2-24,150), bh=9;
    const bx0=Math.round((W2-bw)/2), by0=Math.round(H2*0.74);
    P(g,'#0a0e14',bx0-2,by0-3,bw+4,bh+6);                      // bingkai
    P(g,'#7a2420',bx0,by0,bw,bh);P(g,'#a33228',bx0,by0,bw,1);  // bidang merah
    P(g,'#541715',bx0,by0+bh-1,bw,1);
    const gw=Math.max(3,Math.round(bw*lawanLebar(L)));         // zona hijau menyempit
    const gx=Math.round(bx0+(L.pusat-lawanLebar(L)/2)*bw);     // ...dan berpindah tiap kena
    P(g,'#1d6a2e',gx,by0,gw,bh);
    P(g,'#4fd468',gx,by0,gw,1);P(g,'#35a84a',gx,by0+1,gw,1);
    P(g,'#144a20',gx,by0+bh-1,gw,1);
    const mx=Math.round(bx0+L.pos*(bw-2));                     // penanda menyapu
    P(g,'#0a0e14',mx-1,by0-3,4,bh+6);
    P(g,L.kilatT>0?'#ffffff':'#ffe9a8',mx,by0-2,2,bh+4);
    for(let i=0;i<L.perlu;i++){                                // kemajuan: satu titik per kena
      const px=bx0+Math.round(i*(bw-3)/Math.max(1,L.perlu-1));
      P(g,i<L.kena?'#4fd468':'#2a3340',px,by0+bh+3,3,3);
    }
    for(let i=0;i<LAWAN_LUPUT;i++){                            // sisa kesempatan
      P(g,i<LAWAN_LUPUT-L.luput?'#e0552f':'#32282a',bx0+bw-3-i*5,by0-9,3,3);
    }
    if(L.kilatT>0){g.fillStyle='rgba(120,255,160,'+(L.kilatT*0.45).toFixed(3)+')';g.fillRect(0,0,W2,H2);}
    if(L.gagalT>0){g.fillStyle='rgba(255,70,50,'+(L.gagalT*0.40).toFixed(3)+')';g.fillRect(0,0,W2,H2);}
  }
  /* Tirai HANYA untuk dua fase yang memang berpindah layar. Dulu syaratnya
     fase!=='main', dan 'lawan' ikut tertangkap: begitu battle dimulai dive.ft
     dinolkan lalu menanjak, jadi tirai keluar membesar sampai pekat dan
     SELURUH LAYAR BATTLE menghitam 0,5 detik setelah ikan tersambar.
     Diukur: warna rata-rata layar jatuh dari (32,67,81) ke (4,10,16). */
  if(dive.fase==='masuk'||dive.fase==='keluar'){
    const kk=Math.min(1,dive.ft/(dive.fase==='masuk'?0.45:0.50));
    const a=dive.fase==='masuk'?1-kk:kk;
    g.fillStyle='rgba(4,10,16,'+a.toFixed(3)+')';g.fillRect(0,0,W2,H2);
  }
}

function drawChickens(g,t){
  for(const e of eggsNow(t)){                                  // telur yang belum dipungut
    const ex=e.x, ey=e.y;
    g.globalAlpha=e.age>EGG_LIFE-2000?(EGG_LIFE-e.age)/2000:1;
    P(g,'rgba(0,0,0,.22)',ex-1,ey+4,5,1);                      // bayangan
    P(g,'#efe7d2',ex,ey,3,4);P(g,'#efe7d2',ex+1,ey-1,1,1);     // cangkang (puncak membulat)
    P(g,'#fbf7ea',ex,ey,2,2);P(g,'#d8cdb2',ex+2,ey+2,1,2);     // sorot + sisi gelap
    g.globalAlpha=1;
    if(e.age<700){P(g,'#fff3b0',ex+1,ey-3,1,1);                // kilau sesaat saat baru bertelur
      P(g,'#fff3b0',ex-2,ey-1,1,1);P(g,'#fff3b0',ex+4,ey-1,1,1);}
    const s=Math.sin(t/430+ex);                                 // kerlip halus: tanda bisa dipungut
    if(s>0.55){g.globalAlpha=0.35+0.4*s;P(g,'#fff6c0',ex+4,ey-2,1,1);g.globalAlpha=1;}
  }
  CHICK.forEach((ch,i)=>{
    const p=chickAt(ch,i,t), x=p.x, y=p.y, pk=Math.sin(t/500+i*3)>0.6?2:0;
    const C=ch.R||(ch.R=ramp(ch.c));                        // tangga warna dihitung sekali per ayam
    P(g,'rgba(0,0,0,.26)',x-2,y+3,5,1);                     // bayangan kontak
    P(g,C.out,x-3,y-1,7,6);                                 // garis luar badan
    P(g,C.base,x-2,y,5,4);P(g,C.hi,x-2,y,5,1);              // badan + punggung kena cahaya
    P(g,C.lo,x-2,y+3,5,1);                                  // perut membayang
    P(g,C.lo,x-1,y+1,2,2);P(g,C.hi,x-1,y+1,2,1);            // sayap terlipat
    P(g,C.out,x+1,y-3+pk,4,5);                              // garis luar leher & kepala
    P(g,C.base,x+2,y-2+pk,2,3);P(g,C.hi,x+2,y-2+pk,1,3);    // leher & kepala
    P(g,'#e8a030',x+4,y-1+pk,1,1);P(g,'#b87418',x+4,y+pk,1,1);   // paruh + bayangnya
    P(g,'#c0342a',x+2,y-3+pk,2,1);P(g,'#e8564a',x+2,y-3+pk,1,1); // jengger
    P(g,'#16110a',x+2,y-2+pk,1,1);                          // mata
    P(g,'#c9902a',x-1,y+4,1,1);P(g,'#c9902a',x+1,y+4,1,1);  // kaki
  });
}
anims.push({fn:(g,t)=>{                                     // pendar lentera saat gelap
  const lamp=daylight.lamp; if(lamp<0.08)return;
  for(const f of lanterns){const cx0=f.px+7,cy0=f.py+2,fl=0.85+0.15*Math.sin(t/300+cx0);
    g.globalAlpha=Math.min(1,0.5*lamp*fl);g.drawImage(LAMP_GLOW,cx0-13,cy0-12);g.globalAlpha=1;
    g.fillStyle=`rgba(255,224,150,${(0.9*lamp).toFixed(3)})`;g.fillRect(cx0-2,cy0-1,4,4); // bola cahaya
    g.fillStyle=`rgba(255,214,140,${(0.10*lamp).toFixed(3)})`;g.fillRect(f.px+1,f.py+13,13,6);} // kolam cahaya
}});
FURNS.push(FURN);ANIMS.push(anims);

/* kembalikan rujukan aktif ke lantai 1 */
FURN=FURNS[0];anims=ANIMS[0];

/* =========================================================================
   PEMAIN
   ========================================================================= */
const player={x:12.5*T,y:17*T+12,dir:'down',frame:0,animT:0,moving:false,path:null,
              pendTool:null,jumpT:0,sitting:null,pendSeat:null,pendJuke:null,pendLift:false,pendPortal:null,
              pick:null,                                    // hasil panen yang sedang dijinjing
              fish:null};                                   // keadaan pancing (umpan di air)
const SPEED=62, JUMP_DUR=.45;
const cam={x:0,y:0};
const keys=new Set();
const KEYMAP={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',
              w:'up',s:'down',a:'left',d:'right',W:'up',S:'down',A:'left',D:'right'};

/* anak dino peliharaan — berkeliaran acak antar tile bebas.
   `floor` menandai ia sedang di lantai mana: ia ikut berpindah bila kebetulan
   berada di dekat dino utama saat pintu/lift dipakai (lihat petArrive). */
const pet={x:6*T+8,y:15*T+12,floor:0,tx:null,ty:null,timer:1,dir:1,frame:0,hopT:0,reactCd:0,
           mode:'wander',followT:0,repathT:0,path:null,moving:false,sleepT:0};
/* dipanggil tepat setelah setFloor(): taruh anak dino di petak kosong terdekat
   dari titik-muncul dino utama, lalu paksa mode membuntuti sebentar supaya ia
   tidak langsung berkeliaran ke sudut asing. */
function petArrive(){
  const px=Math.floor(player.x/T), py=Math.floor(player.y/T);
  let spot=null;
  for(const [dx,dy] of [[0,1],[-1,0],[1,0],[0,0],[-1,1],[1,1],[0,2],[-1,2],[1,2]]){
    const nx=px+dx,ny=py+dy;
    if(nx<1||ny<1||nx>=COLS-1||ny>=ROWS-1||S(nx,ny))continue;
    spot=[nx,ny];break;
  }
  if(!spot)spot=[px,py];
  pet.floor=floor;
  pet.x=spot[0]*T+8;pet.y=spot[1]*T+12;
  pet.tx=null;pet.ty=null;pet.path=null;pet.repathT=0;pet.sleepT=0;
  pet.hopT=.4;pet.mode='follow';pet.followT=9;pet.timer=1;
  beep(1180,.05,.035,'square',.02);beep(1560,.07,.03,'square',.08);
}
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
/* Dipasang di sini, bukan di dekat ensureAudio(): beep() ikut memakainya dan
   dideklarasikan lebih dulu. Saat peramban memblokir audio, dulu beep() mencoba
   membangun AudioContext LAGI pada tiap langkah kaki — satu lemparan per langkah
   di jalur terpanas permainan. Sekarang gagal sekali, lalu diam. */
let audioMati=false;
function beep(freq,dur=.08,vol=.05,type='square',delay=0){
  if(audioMati)return;
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    const o=AC.createOscillator(),g=AC.createGain();
    o.type=type;o.frequency.value=freq;
    g.gain.setValueAtTime(vol,AC.currentTime+delay);
    g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+delay+dur);
    o.connect(g);g.connect(AC.destination);
    o.start(AC.currentTime+delay);o.stop(AC.currentTime+delay+dur+.02);
  }catch(e){ if(!AC)audioMati=true; }     // gagal MEMBANGUN → berhenti mencoba
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
/* Audio bisa TIDAK TERSEDIA: sebagian WebView tak punya AudioContext sama
   sekali, dan sebagian peramban memblokirnya lewat kebijakan. Dulu jukeCycle()
   memanggil ini tanpa penjaga, jadi satu ketukan jukebox bisa melempar dari
   dalam handler peristiwa. Sekarang kegagalan dikembalikan sebagai `false`,
   ditandai sekali supaya tak dicoba terus, dan pemanggilnya berhenti diam-diam:
   permainan tetap jalan, hanya tanpa suara. Kancingnya (audioMati) diumumkan
   di blok AUDIO di atas, bersama AC, karena beep() juga memakainya. */
function ensureAudio(){
  if(audioMati)return false;
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    if(!music.gain){music.gain=AC.createGain();music.gain.gain.value=.5;music.gain.connect(AC.destination);}
    if(AC.state==='suspended')AC.resume().catch(()=>{});     // resume() bisa menolak → jangan jadi unhandledrejection
    return true;
  }catch(e){ audioMati=true; AC=null; music.gain=null; return false; }
}
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
function musicSched(){if(!AC||!music.on)return;
  const tr=TRACKS[music.track],sd=30/tr.bpm;                      // durasi not 1/8
  if(music.next<AC.currentTime)music.next=AC.currentTime+.03;     // jangan kejar ketertinggalan (burst not)
  while(music.next<AC.currentTime+0.15){
    const s=music.step%16,t=music.next;
    tone(HZ(tr.bass[s]),t,sd*.95,'triangle',.06);
    tone(HZ(tr.mel[s]), t,sd*.85,tr.lead,.045);
    const p=tr.perc[s];if(p==='k')kick(t);else if(p==='h')hat(t);
    music.next+=sd;music.step++;
  }}
function musicStart(){if(!AC)return;
  music.on=true;music.step=0;music.next=AC.currentTime+.06;
  clearInterval(music.timer);music.timer=setInterval(musicSched,25);musicSched();}
function musicStop(){music.on=false;clearInterval(music.timer);music.timer=null;}
/* jeda hanya penjadwalnya — status music.on (dan tampilan HUD) tidak berubah */
function musicPause(){if(music.timer){clearInterval(music.timer);music.timer=null;}}
function musicResume(){if(!music.on||music.timer||!AC)return;
  ensureAudio();music.next=AC.currentTime+.06;
  music.timer=setInterval(musicSched,25);musicSched();}
function jukeCycle(){
  if(!ensureAudio())return;                                  // tanpa audio: jukebox diam, bukan melempar
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
  bName.textContent=tool.name;
  bDesc.textContent=tool.desc||'';
  bDesc.style.display=tool.desc?'':'none';           // tanpa subtitle → barisnya ikut hilang
  btnOpen.innerHTML=tool.btn||'BUKA &#9656;';
  bKey.textContent=tool.isLift?'[ENTER] UNTUK BERPINDAH LANTAI':
    tool.isPortal?'[ENTER] UNTUK LEWATI PINTU':
    tool.isBoard?'[ENTER] BACA PENGUMUMAN BERIKUTNYA':
    tool.isBed?'[ENTER] UNTUK MEMANEN':
    tool.isFish?'[ENTER] UNTUK MEMANCING':
    tool.isSemai?'[ENTER] UNTUK MELIHAT':
    tool.isEgg?'[ENTER] UNTUK MENGAMBIL':'[ENTER] UNTUK MEMBUKA';
  bSw.style.background=tool.color;bSw.style.color=tool.color;
  banner.classList.add('show');
  beep(520,.05,.03);
}
function openTool(tool){
  if(tool.isLift){rideLift(tool.to);return;}
  if(tool.isPortal){startTravel(tool.to,tool.spawn);return;}    // pintu utama ↔ area luar
  if(tool.isBoard){tool.idx=(tool.idx+1)%tool.msgs.length;tool.desc=tool.msgs[tool.idx]; // baca pengumuman berikutnya
    bDesc.textContent=tool.desc;beep(680,.05,.04);return;}
  if(tool.isBed){harvestNear();return;}                                                  // panen bedengan terdekat
  if(tool.isEgg){pickEggNear();return;}                                                  // pungut telur ayam
  if(tool.isFish){player.fish?fishHook():fishStart();return;}   // lempar umpan, lalu tarik saat menyambar
  if(tool.isSemai){bibitMasuk();return;}                        // layar dekat rak pembibitan
  beep(880,.07,.06);beep(1320,.1,.06,'square',.08);
  setTimeout(()=>{window.location.href=tool.url;},180);
}
btnOpen.addEventListener('click',()=>{
  if(bibit.on){bibitTekan();return;}
  if(dive.on){diveTarik();return;}
  if(activeTool)openTool(activeTool);});

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
const floorName=n=>['LANTAI 1 · RUANG KERJA','',''][n];   // lt.2 & area luar tanpa sub-judul

/* tukar seluruh rujukan denah ke area n; tempatkan dino di `spawn` (bila ada)
   atau default tepat di depan pintu lift. spawn={x,y,dir} dalam piksel. */
function setFloor(n,spawn){
  floor=n;
  syncFloorBG(n);                                 // latar lantai ini mungkin tertinggal (dibangun malas)
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
  /* Label lantai milik kerangka HTML, bukan permainan. Tanpa penjaga ini satu
     elemen HUD yang tidak ada mematikan SELURUH permainan di langkah pertama
     (terbukti: setFloor melempar "Cannot set properties of null"). Permainan
     harus tetap jalan walau HUD-nya tidak lengkap. */
  if(floorTag)floorTag.textContent=floorName(n);
}
/* perpindahan berfade umum (lift & pintu). spawn opsional membawa titik-muncul tujuan. */
function startTravel(to,spawn){
  if(fade.on||to===floor)return;
  if(player.sitting)standUp();
  player.fish=null;                                  // pancing dibereskan dulu
  player.path=null;player.pendTool=null;player.pendLift=false;player.pendPortal=null;
  /* anak dino ikut kalau kebetulan sedang menempel saat pintu dibuka */
  fade.petGo=pet.floor===floor&&Math.hypot(pet.x-player.x,pet.y-player.y)<58;
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
   PEMBIBITAN — LAYAR DEKAT & SORTIR BIBIT
   =========================================================================
   Dua layar dalam satu modul, sengaja berpasangan:
     LIHAT  — rak dilihat dari dekat. Di bawahnya berjajar empat contoh:
              sehat, layu, kerdil, berjamur. Inilah yang MENGAJARKAN aturannya.
     SORTIR — tray berjalan melintas, pemain mengafkir yang sakit. Inilah yang
              MENGUJINYA.
   Tak ada satu kalimat petunjuk pun: layar pertama sudah memperlihatkan apa
   yang dicari, jadi layar kedua tidak perlu menjelaskannya.

   Tiga cacatnya dibedakan lewat BENTUK dan TEKSTUR, bukan warna saja —
   layu merunduk, kerdil pendek, berjamur berbintik. Warnanya memang ikut
   berubah, tapi tak pernah jadi satu-satunya pembeda: di layar kecil, dan
   bagi mata yang sulit membedakan warna, bentuklah yang selalu terbaca. */
/* Campur dua warna heks. Dipakai supaya rona cacat MENIMPA SEBAGIAN rona
   varietas, bukan menggantinya. */
const _bl=(a,b,k)=>{const A=_hx(a),B=_hx(b);
  return '#'+[0,1,2].map(i=>Math.round(A[i]+(B[i]-A[i])*k)
    .toString(16).padStart(2,'0')).join('');};
/* tg = tinggi dasar relatif; bk = bentuk daun; ruas = letak daun di batang
   (pecahan tinggi); bt = warna batang bila beda dari daunnya.
   Warnanya disebar dari hijau tua sampai hijau kekuningan: versi pertama
   memakai enam hijau sedang yang terbentang sempit dan tak satu pun terbedakan. */
/* lb = lebar helai (piksel, tiap sisi), tb2 = tebalnya. Dua angka itulah yang
   membedakan varietas, bersama tinggi dan letak ruasnya — bukan susunan titik.
   Terbaca sebagai perawakan: kubis berhelai lebar & rendah, cabai sempit &
   tinggi, sawi jangkung bertangkai. */
/* lb = lebar helai tiap sisi, tb2 = tebalnya, nk = berapa baris helai mencuat
   dari batang, mr = helainya menyerong atau mendatar. Empat angka itu plus
   tinggi dan warna yang membedakan varietas — BUKAN susunan titik di dalam
   helai. Tiga menyerong, tiga mendatar: siluetnya jadi dua keluarga, bukan
   satu barisan tiang yang seragam. */
const BENIH=[
  {nm:'TOMAT', tg:1.00, bk:'majemuk', ruas:[0.52,0.86], lb:4, tb2:1, nk:1, mr:1, c:'#3f7a34'},
  {nm:'CABAI', tg:0.84, bk:'lanset',  ruas:[0.60,0.86], lb:3, tb2:1, nk:2, mr:1, c:'#1f5a28'},
  {nm:'TERONG',tg:0.92, bk:'lebar',   ruas:[0.42,0.80], lb:6, tb2:2, nk:1, mr:0, c:'#4a6f55', bt:'#6b5490'},
  {nm:'SAWI',  tg:1.14, bk:'sendok',  ruas:[0.58,0.88], lb:5, tb2:2, nk:1, mr:1, c:'#6cc04e'},
  {nm:'KUBIS', tg:0.78, bk:'bulat',   ruas:[0.30,0.60], lb:7, tb2:2, nk:0, mr:0, c:'#4f8f84'},
  {nm:'SELADA',tg:0.86, bk:'keriting',ruas:[0.44,0.76], lb:5, tb2:1, nk:1, mr:0, c:'#93cf57'},
];
BENIH.forEach(b=>{const Rp=ramp(b.c);
  b.W={m:Rp.base,h:Rp.hi,t:_bl(Rp.hi,'#f2ffe4',0.42),bt:b.bt||Rp.base};});
/* Rona tiap cacat, dan seberapa kuat ia mencampuri warna varietas. */
const CACAT_RONA={layu:['#b9a84a',0.58],jamur:['#9fae98',0.46],
                  busuk:['#46543e',0.40],etiolasi:['#d8ecb4',0.52]};
const _ronaCache=new Map();
function benihRona(sp,bad){
  const kunci=sp.nm+'|'+bad;
  let W=_ronaCache.get(kunci); if(W)return W;
  const r=CACAT_RONA[bad];
  W=r?{m:_bl(sp.W.m,r[0],r[1]),h:_bl(sp.W.h,r[0],r[1]),
       t:_bl(sp.W.t,r[0],r[1]),bt:_bl(sp.W.bt,r[0],r[1])}
     :sp.W;
  _ronaCache.set(kunci,W);
  return W;
}
/* Urutannya SENGAJA: tiga pertama cacat dasar, lalu etiolasi (menyimpang ke
   tinggi), lalu busuk (menyimpang di pangkal). Tingkat membuka jenis ke-n
   pertama dari daftar ini, jadi urutan = urutan pelajaran. */
const CACAT=['layu','kerdil','jamur','etiolasi','busuk'];
const CACAT_NM={layu:'LAYU',kerdil:'KERDIL',jamur:'JAMUR',
                etiolasi:'ETIOLASI',busuk:'BUSUK'};
const TINGKAT=[{tray:5,jenis:3,laju:52,naik:7},
               {tray:6,jenis:4,laju:58,naik:8},
               {tray:7,jenis:5,laju:64,naik:9},
               {tray:8,jenis:5,laju:72,naik:10}];
const BIBIT_SEL=4;                       // sel per tray
const BIBIT_DENDA=0.17;                  // mutu yang hilang tiap kesalahan
/* tingkat BERTAHAN antar kunjungan: ia milik pemain, bukan milik satu babak. */
const bibit={on:false,fase:'',ft:0,t:0,rak:[],baris:[],stok:[],antre:0,tingkat:0,
             kurX:0,mutu:1,benar:0,salah:0,kilat:[],laju:0,lulus:false};
const bibitLv=()=>TINGKAT[Math.min(bibit.tingkat,TINGKAT.length-1)];
const bibitRuang=()=>{
  const W2=Math.max(1,cv.width), H2=cv.height;
  /* tb = tinggi semai sehat. Diikat ke tinggi kanvas, bukan angka tetap:
     inilah yang membuat layar ini terbaca sebagai "dari dekat" di ukuran
     layar mana pun, bukan cuma di 400x304. */
  const tb=Math.max(8,Math.round(H2*0.072));
  /* Tiga tray berjajar butuh dua belas sel selebar layar. Di bawah 14 px per
     sel itu berhenti terbaca, jadi raknya ganti BERTINGKAT dan lebar selnya
     diambil dari satu tray. Batas atasnya diikat ke tb supaya di layar
     menengah selnya tidak menggembung jadi petak kosong. */
  const lebar=Math.floor((W2-30)/13), tegak=lebar<14;
  const sw=tegak?Math.max(10,Math.min(Math.round(tb*1.6),Math.floor((W2-22)/BIBIT_SEL)))
                :lebar;
  return {W2,H2,sw,tegak,tw:sw*BIBIT_SEL+6,tb,
          lampu:Math.max(9,Math.round(H2*0.085)),
          rak2:Math.round(H2*0.40),                // rak jauh di belakang
          meja:Math.round(H2*0.70)};
};
function bibitSel(bad,tinggi,kosong,sp){
  return {bad:bad||'',h:tinggi,kosong:!!kosong,seed:Math.random()*6.283,
          sp:sp||BENIH[0],diangkat:false,tandaT:0,tanda:0};
}
/* Tinggi satu sel: dasar varietas untuk tray itu, digoyang +-7% saja. Goyangan
   yang lebih besar membuat semai sehat yang kebetulan jangkung bertabrakan
   dengan etiolasi — diukur 17% beda di aturan lama, praktis tak terbaca. */
const bibitTinggi=(tb,sp)=>Math.max(4,Math.round(tb*sp.tg*(0.93+Math.random()*0.14)));
/* Isi rak mengikuti musim, dan DITURUNKAN DARI BENIH YANG SAMA dengan sprite
   raknya (rnd + season), supaya yang dilihat dari dekat benar-benar isi rak
   yang barusan dilewati — bukan rak lain yang kebetulan mirip. */
function bibitRakIsi(){
  const M=SEMAI[season], out=[], {tb}=bibitRuang();
  /* Varietas tiap tray diundi dari benih musim, jadi rak yang sama terlihat
     sama setiap kali dibuka pada hari yang sama — dan berganti saat musimnya
     berganti, seperti pembibitan sungguhan. Ketiganya dibuat BERBEDA: rak
     yang tiga traynya satu varietas membuang kesempatan memperlihatkan ragam. */
  /* Pengocokan acak-berbenih TIDAK menjamin sebaran: diukur, CABAI muncul di
     4 dari 4 musim dan SAWI bisa terlewat sama sekali. Diganti pembagian
     berlangkah dua: keenam varietas terbelah jadi dua kelompok bertiga yang
     bergantian tiap musim, lalu digeser. Hasilnya pasti tiga varietas BERBEDA,
     dan sepanjang tahun keenamnya kebagian sama rata, 2 musim masing-masing. */
  const nB=BENIH.length, kel=season%2, geser=Math.floor(season/2)%3;
  const pilih=[0,1,2].map(k=>BENIH[((k*2+kel)+geser*2)%nB]);
  for(let ti=0;ti<3;ti++){
    const tx=TRAYX[ti], sp=pilih[ti], sel=[];
    const dasar=Math.round(tb*sp.tg*(0.44+M.t*0.10));
    for(let c=0;c<BIBIT_SEL;c++){
      const kosong=!M.penuh&&(rnd(tx+c*13,season*7+3)>>>2)%3===0;
      const r=rnd(tx*3+c*29,season*17+5);
      const bad=(r>>>6)%5===0?CACAT[(r>>>11)%bibitLv().jenis]:'';
      const goyang=1+(((r>>>17)%15)-7)/100;             // +-7%, sepola babak sortir
      sel.push(bibitSel(kosong?'':bad,Math.max(4,Math.round(dasar*goyang)),kosong,sp));
    }
    out.push({sel,sp});
  }
  return out;
}
/* --- satu semai, digambar besar ----------------------------------------- */
/* Sepasang daun di satu ruas. x = tepi kiri batang; arah -1 menengadah,
   +1 merunduk (layu). Bentuknya yang membedakan varietas — warna cuma
   menguatkan, tak pernah menjadi satu-satunya pembeda. */
function semaiDaun(g,x,y,arah,bk,W,kecil,sp){
  const a=arah;                                 // -1 menengadah, +1 merunduk
  /* cermin: tiap helai digambar sekali lalu dipantulkan, jadi kiri-kanan
     pasti sebangun dan kodenya tak perlu ditulis dua kali. */
  const K=(w,xx,yy,ww,hh)=>{P(g,w,x+xx,y+yy,ww,hh);P(g,w,x+1-xx-ww+1,y+yy,ww,hh);};
  if(kecil){                                    // etiolasi: helai belum sempat jadi
    K(W.h,-2,a,2,2);
    return;
  }
  /* SATU BALOK PEJAL per helai, menempel batang (xx = -lb, tak pernah lain),
     lalu satu baris terang di sisi yang menghadap lampu dan satu piksel pucat
     di ujungnya. Itu saja. Pola di DALAM helai sengaja tidak ada: motif
     sebesar 2-3 px tidak terbaca sebagai motif, cuma sebagai kotor. */
  const lb=sp?sp.lb:4, tb2=sp?sp.tb2:2, mr=sp?sp.mr:0;
  const naik=a*(sp?sp.nk:1);                         // cabai mencuat, kubis mendatar
  /* Menyerong: separuh LUAR helai digeser satu baris ke arah cahaya. Tetap
     satu massa pejal yang menempel batang — yang berubah siluetnya, bukan
     keutuhannya. */
  const luar=mr?Math.max(1,lb>>1):0, dalam=lb-luar;
  const ySisi=naik+(a<0?0:tb2-1);
  /* Badan helai W.m, bukan W.h. Mengecat seluruh lebar helai dengan warna
     paling terang membuatnya terbaca sebagai palang menyala, bukan daun —
     dan itulah yang membuat semai tampak tebal. Baris terang hanya dipasang
     bila helainya masih setebal 2 baris; helai setebal 1 baris tak punya
     sisi untuk disinari. */
  K(W.m,-lb+luar,naik,dalam,tb2);
  if(tb2>1)K(W.h,-lb+luar,ySisi,dalam,1);
  if(luar){
    /* Separuh luar MENINDIH satu kolom dengan separuh dalam. Tanpa itu, pada
       helai setebal 1 baris kedua separuh hanya bersentuhan menyilang dan
       helainya tercerai jadi dua kepingan — diukur, TOMAT dan SAWI pecah
       jadi 6 kepingan begitu helainya ditipiskan. */
    K(W.m,-lb,naik+a,luar+1,tb2);
    if(tb2>1)K(W.h,-lb,ySisi+a,luar+1,1);
  }
  K(W.t,-lb,ySisi+(mr?a:0),1,1);                     // ujung helai paling pucat
  /* Tangkai SAWI harus sebaris dengan separuh LUAR helainya. Dengan baris
     naik+(tb2>>1) ia hanya bersentuhan menyilang dan tangkainya tercerai —
     diukur, SAWI pecah jadi 6 kepingan. */
  if(bk==='sendok')K(W.m,-lb-2,naik+(luar?a:0),2,1);   // SAWI: helai duduk di tangkai
  if(bk==='keriting')                                // SELADA: gerigi tepi, satu baris
    for(let i=1;i<lb;i+=2)K(W.h,-lb+i,a<0?naik-1:naik+tb2,1,1);
  /* Helai yang menyerong naik satu baris lebih tinggi dari batang di ruas
     teratas; satu piksel penyambung menjaganya tetap bertemu batang. */
  if(luar)K(W.m,-1,naik,1,tb2);
}
/* Tiga nilai goyangan, dikitari empat langkah — pola yang sama dengan empat
   fase kibasan ekor ikan. Dengan goyangan menerus tiap sel butuh sprite
   sendiri tiap bingkai, dan memanggang jadi mustahil. */
const GOYANG=[0,1,0,-1];
const SEMAI_SPR=new Map();
const SEMAI_SPR_MAX=420;
function semaiSprite(sp,bad,h,gy,sisi){
  const kunci=sp.nm+'|'+bad+'|'+h+'|'+gy+'|'+sisi;
  let c=SEMAI_SPR.get(kunci); if(c)return c;
  const tg=Math.max(3,bad==='kerdil'?Math.round(h*0.42)
                     :bad==='etiolasi'?Math.round(h*1.70):h);
  const W2=32, H2=tg+16, ax=15, ay=H2-6;
  c=document.createElement('canvas');c.width=W2;c.height=H2;
  const q=c.getContext('2d');
  semaiCat(q,ax,ay,sp,bad,tg,gy,sisi);
  /* Garis luar GELAP — garis luar klasik pixel art: ia menyatukan bentuk jadi
     satu massa dan tidak menyala. Yang lavender tadi bersaing dengan
     tanamannya; pada model lama yang bertabur titik 1 px ia melingkari tiap
     titik satu per satu, jadi yang terbaca taburan remah berkilau.
     Cahaya dari atas tidak lagi ditempelkan sebagai lapisan tersendiri: ia
     sudah DICAT di dalam sprite-nya. */
  halo(q,W2,H2,'#171320',0.62,ay);
  c.ax=ax;c.ay=ay;
  if(SEMAI_SPR.size>=SEMAI_SPR_MAX)SEMAI_SPR.clear();  // ganti musim/ukuran: mulai lagi
  SEMAI_SPR.set(kunci,c);
  return c;
}
function semaiBesar(g,cx,yb,c,t,sw){
  if(c.kosong||c.diangkat)return;
  const sp=c.sp||BENIH[0];
  const gy=GOYANG[((Math.floor((t/700+c.seed)/1.5708)%4)+4)%4];
  const sisi=c.bad==='busuk'?(c.seed>3.14?1:0):0;
  const spr=semaiSprite(sp,c.bad,c.h,gy,sisi);
  /* Bayangan kontak di media: tanpa ini semai tampak mengambang, cacat yang
     sama yang dibereskan contact() untuk tiap perabot. */
  P(g,'rgba(12,7,3,.34)',cx-3,yb,6,1);
  P(g,'rgba(12,7,3,.18)',cx-4,yb+1,8,1);
  g.drawImage(spr,cx-spr.ax,yb-spr.ay);
  if(c.bad==='jamur'){                              // bintik putih di permukaan media
    for(let i=0;i<8;i++){
      const r=rnd(i*17+3,c.h*37+sp.nm.length);
      P(g,'#e6ecdf',cx-(sw>>1)+3+((r>>>3)%Math.max(1,sw-6)),yb-1-((r>>>9)%3),1,1);
    }
  }
}
/* Pencat mentah: menggambar ke kanvas panggangan, bukan ke layar. */
function semaiCat(g,cx,yb,sp,bad,tg,ayun,sisi){
  /* layu MELENGKUNG (q kuadrat: pucuknya yang jatuh), busuk MIRING LURUS
     (q pangkat satu: seluruh tanaman rebah dari pangkal). Dua gerakan yang
     berbeda, jadi keduanya tak pernah tertukar walau sekilas. */
  const tunduk=bad==='layu'?tg*0.38:0;
  const rebah=bad==='busuk'?tg*0.34*(sisi?-1:1):0;
  const W=benihRona(sp,bad);
  const bw=2;   // seragam: batang 1 px lenyap di balik garis luarnya sendiri
  /* Ujung batang meruncing jadi 1 px. Hanya DI ATAS ruas daun tertinggi:
     di bawah itu helai bersandar pada batang selebar 2 px, dan menipiskannya
     akan melepaskan daunnya dari batang. */
  const ujung=Math.max(2,tg-3);
  for(let k=0;k<tg;k++){
    const q=k/Math.max(1,tg-1), dx=Math.round(tunduk*q*q+rebah*q+ayun*q);
    if(bad==='busuk'&&k<3){                               // pangkal mengecil & menghitam
      P(g,k?'#3a2a1c':'#2a1b11',cx+dx,yb-1-k,1,1);continue;
    }
    P(g,k>tg-3?W.h:W.bt,cx+dx,yb-1-k,k>=ujung?1:bw,1);
  }
  const arah=bad==='layu'?1:-1;                           // daun: naik, atau merunduk
  /* Etiolasi cuma punya SEPASANG daun kecil dan letaknya tinggi: itulah
     tanaman yang memanjang mengejar cahaya dan melewatkan daun di bawah. */
  /* Letak ruas daun ikut varietas: kubis berdaun RENDAH, cabai berdaun
     tinggi. Itu pembeda kedua di luar bentuk helainya, dan ia terbaca bahkan
     saat helainya sendiri terpotong tepi sel. */
  /* Helai yang mencuat nk baris ke atas harus tetap BERTEMU batang: kalau
     k+nk melewati ujung batang, helainya menggantung di udara. Diukur,
     CABAI pecah jadi 3 kepingan karena ini. */
  const nk=sp.nk||0;
  for(const dq of (bad==='etiolasi'?[0.84]:sp.ruas)){
    const k=Math.min(tg-1-nk,Math.round(tg*dq)), q=k/Math.max(1,tg-1);
    const dx=Math.round(tunduk*q*q+rebah*q+ayun*q);
    semaiDaun(g,cx+dx,yb-1-k,arah,sp.bk,W,bad==='etiolasi',sp);
  }
  if(tg>7&&bad!=='busuk'){                                // daun lembaga di pangkal
    P(g,W.m,cx-2,yb-4,2,1);P(g,W.m,cx+2,yb-4,2,1);
  }
  P(g,W.t,cx+Math.round(tunduk+rebah+ayun),yb-tg,bw,1);   // pucuk
  if(bad==='jamur')P(g,'rgba(228,238,226,.30)',cx-3,yb-6,8,6);   // kabut pucat di pangkal
}
/* --- satu sel: badan tray, media, semainya, lalu tandanya ---------------- */
function bibitSelGambar(g,x,yb,sw,c,t,sorot){
  const Tr=ramp('#262a33');
  P(g,Tr.out,x,yb-1,sw,7);
  P(g,Tr.base,x+1,yb,sw-2,5);P(g,Tr.hi,x+1,yb,sw-2,1);P(g,Tr.lo,x+1,yb+4,sw-2,1);
  P(g,'#2a1c12',x+2,yb-1,sw-4,4);P(g,'#3a2817',x+2,yb-1,sw-4,1);
  if(c.diangkat){P(g,'#1a110a',x+3,yb-1,sw-6,3);}          // lubang bekas semai diangkat
  semaiBesar(g,x+(sw>>1)-1,yb-1,c,t,sw);
  if(sorot){                                               // kursor: sudut, bukan kotak penuh
    /* Kotaknya diukur dari tinggi semai dewasa, bukan angka tetap: versi
       pertama menjulang jauh di atas tanamannya dan terbaca sebagai bingkai
       yang mengambang, bukan sebagai penunjuk sel. */
    const tb=bibitRuang().tb, y0=yb-Math.round(tb*1.75)-4, h0=Math.round(tb*1.75)+12;
    for(const [ox,oy,dw,dh] of [[0,0,4,1],[0,0,1,4],[sw-4,0,4,1],[sw-1,0,1,4],
                                [0,h0-1,4,1],[0,h0-4,1,4],[sw-4,h0-1,4,1],[sw-1,h0-4,1,4]])
      P(g,'#ffd23a',x+ox,y0+oy,dw,dh);
  }
  if(c.tandaT>0){                                          // centang hijau / silang merah
    const a=Math.min(1,c.tandaT/0.30), cxm=x+(sw>>1)-1, cym=yb-8;
    g.globalAlpha=a;
    if(c.tanda>0){P(g,'#6ef08a',cxm-3,cym+1,2,2);P(g,'#6ef08a',cxm-1,cym+3,2,2);
                  P(g,'#6ef08a',cxm+1,cym+1,2,2);P(g,'#6ef08a',cxm+3,cym-1,2,2);
                  P(g,'#6ef08a',cxm+5,cym-3,2,2);}
    else{for(let i=0;i<5;i++){P(g,'#ff6a4a',cxm-4+i*2,cym-4+i*2,2,2);
                              P(g,'#ff6a4a',cxm+4-i*2,cym-4+i*2,2,2);}}
    g.globalAlpha=1;
  }
}
/* Nama varietas ditempel di MUKA tray, digambar setelah selnya — persis
   tempat label ditempel di tray sungguhan, dan satu-satunya bidang mendatar
   yang tidak ditempati tanaman. */
function bibitLabel(g,x0,yb,tw,sp){
  if(!sp)return;
  const w=textW(sp.nm);
  if(w>tw-6)return;
  drawText(g,sp.nm,x0+Math.round((tw-w)/2),yb+1,'#8798ad');
}
/* --- latar ruang pembibitan: lampu tumbuh, papan bangku, kolong ---------- */
/* Rak jauh: satu baris tray dalam siluet gelap, setingkat lebih tinggi dan
   lebih kecil. Warnanya harus JELAS lebih gelap dari dindingnya, bukan sekadar
   sedikit berbeda — kesalahan itu sudah dibayar dua kali di proyek ini (siluet
   dino, lalu batu dasar kolam). Inilah yang mengisi tengah bingkai. */
function bibitRakJauh(g,W2,y,t){
  const lebar=Math.max(10,Math.round(W2*0.085)), sela=Math.round(lebar*0.42);
  P(g,'#0b111a',0,y+5,W2,3);                               // papan rak jauh
  P(g,'#141c28',0,y+5,W2,1);
  for(let x=sela;x<W2-4;x+=lebar+sela){
    const w=Math.min(lebar,W2-4-x);
    P(g,'#0d141e',x,y,w,5);                                // badan tray
    P(g,'#131c27',x,y,w,1);
    for(let c=0;c<3;c++){                                  // tunas: tiga goresan tegak
      const cxm=x+Math.round(w*(c+0.5)/3);
      P(g,'#122b19',cxm,y-4,1,4);
      P(g,'#1b3d22',cxm,y-4,1,1);
    }
  }
  for(let x=Math.round(W2*0.2);x<W2;x+=Math.round(W2*0.34)){   // tiang penopang
    P(g,'#0a1019',x,y+8,2,40);
  }
}
/* Kolong bangku: kaki, dua tumpukan tray kosong, satu karung media. Benda yang
   sama persis dengan yang ada di sprite raknya di dunia atas — kolong yang
   kosong membuat bangkunya tampak melayang. */
function bibitKolong(g,W2,H2,meja,t){
  const Rk=ramp('#3d4657'), Tr=ramp('#262a33');
  for(const fx of [0.07,0.5,0.93]){
    const lx=Math.round(W2*fx)-2;
    P(g,Rk.lo,lx,meja+11,4,H2-meja-11);
    P(g,'#1b2029',lx,meja+11,1,H2-meja-11);
  }
  for(const fx of [0.22,0.68]){                            // tumpukan tray kosong dari sisinya
    const sx=Math.round(W2*fx), w=Math.max(12,Math.round(W2*0.16));
    for(let k=0;k<4;k++){const yy=H2-6-k*4;
      P(g,Tr.base,sx,yy,w,3);P(g,Tr.hi,sx,yy,w,1);P(g,Tr.lo,sx,yy+2,w,1);}
  }
  {const Kr=ramp('#8a7448');                               // karung media
   const kx=Math.round(W2*0.80), kw=Math.max(10,Math.round(W2*0.11));
         /* Karung dibuat lebih pendek supaya bibirnya tak pernah menyembul di
      atas bilah contoh di layar LIHAT — diukur: dengan 0,42 ia naik 3 px ke
      dalam baris contoh dan terbaca sebagai kotak cokelat nyasar. */
   const kh=Math.max(9,Math.round((H2-meja)*0.27)), ky=H2-kh-2;
   P(g,Kr.out,kx,ky,kw,kh);
   P(g,Kr.base,kx+1,ky+1,kw-2,kh-2);P(g,Kr.hi,kx+1,ky+1,Math.max(2,kw>>2),kh-2);
   P(g,Kr.lo,kx+kw-3,ky+2,2,kh-4);
   P(g,Kr.out,kx+2,ky-1,kw-4,2);P(g,Kr.hi,kx+3,ky-1,kw-6,1);
   P(g,'#2a1c12',kx+3,ky,kw-6,1);}
}
function bibitLatar(g,W2,H2,lampu,meja,rak2,t){
  g.fillStyle='#10141c';g.fillRect(0,0,W2,H2);
  for(let i=0;i<7;i++){                                    // dinding menggelap ke bawah
    g.fillStyle=['#1b2230','#19202c','#171d28','#151a24','#131720','#11141c','#0f1218'][i];
    g.fillRect(0,Math.round(H2*i/7),W2,Math.ceil(H2/7)+1);
  }
  bibitRakJauh(g,W2,rak2,t);
  const Rk=ramp('#3d4657');
  P(g,Rk.out,6,lampu-7,W2-12,6);                           // batang lampu
  P(g,Rk.base,7,lampu-6,W2-14,3);P(g,Rk.hi,7,lampu-6,W2-14,1);
  const nyala=0.86+0.14*Math.sin(t/1400);
  g.globalAlpha=nyala;P(g,'#c9a0f0',9,lampu-3,W2-18,2);g.globalAlpha=1;
  for(let i=0;i<7;i++){                                    // pendar: pita melebar lalu pudar
    g.fillStyle='rgba(160,90,224,'+(0.12*(1-i/7)*nyala).toFixed(3)+')';
    g.fillRect(8-i*2,lampu-1+i*4,W2-16+i*4,4);
  }
  for(const fx of [0.05,0.95]){                            // kawat gantungan lampu
    const px=Math.round(W2*fx);
    P(g,'#2a3242',px,0,1,lampu-7);
  }
  P(g,Rk.out,0,meja+5,W2,6);                               // papan bangku
  P(g,Rk.base,0,meja+6,W2,3);P(g,Rk.hi,0,meja+6,W2,1);P(g,Rk.lo,0,meja+9,W2,1);
  bibitKolong(g,W2,H2,meja,t);
  for(let i=0;i<8;i++){                                    // kolong tetap menggelap ke bawah
    g.fillStyle='rgba(4,6,10,'+(0.05*i).toFixed(3)+')';
    const hh=Math.max(1,Math.round((H2-meja-11)/8));
    g.fillRect(0,meja+11+i*hh,W2,hh+1);
  }
  for(let k=0;k<8;k++){                                    // vinyet tepi
    g.fillStyle='rgba(2,6,10,'+(0.08*(1-k/8)).toFixed(3)+')';
    g.fillRect(k,0,1,H2);g.fillRect(W2-1-k,0,1,H2);
  }
}
/* --- MASUK / KELUAR ------------------------------------------------------ */
function bibitMasuk(){
  if(bibit.on||dive.on)return;
  bibit.on=true;bibit.fase='lihat';bibit.ft=0;bibit.t=0;
  bibit.rak=bibitRakIsi();
  bibit.baris=[];bibit.antre=0;bibit.benar=0;bibit.salah=0;
  bibit.mutu=1;bibit.kilat=[];bibit.lulus=false;
  keys.clear();banner.classList.remove('show');
  /* Tombol kiri: START membuka babak, SORT mengafkir satu semai. Keduanya
     TIDAK boleh berupa kata yang mirip — 'SORTIR' lalu 'SORT' beda satu huruf
     dan letaknya di tombol yang sama, jadi pemain tak punya cara membedakan
     mana yang baru saja ia tekan. */
  diveTombol('START');diveAnalog(true);
  beep(560,.07,.045,'sine');beep(760,.1,.045,'sine',.06);
}
function bibitKeluar(){
  if(!bibit.on)return;
  bibit.on=false;bibit.fase='';
  if(bibit.lulus){
    const now=performance.now();
    /* Hadiah minigame juga, jadi perlakuannya disamakan dengan ikan:
       diangkat 2x dan ditahan 2 detik. Dua babak yang sama beratnya tidak
       boleh dihargai dengan dua ukuran. */
    player.pick={kind:11,t0:now,fx:player.x,fy:player.y-8,lama:2000,besar:2};
  }
  activeTool=null;lastZone=null;keys.clear();
  diveTombol('JUMP');diveAnalog(true);
}
/* --- SORTIR -------------------------------------------------------------- */
/* Seluruh babak disusun DI MUKA dengan jatah cacat yang dipatok, lalu tray-nya
   dilepas satu per satu ke ban berjalan. Mengundi tiap sel sendiri-sendiri
   membuat jumlah yang sakit berayun 2 sampai 13 dari 20 - babak yang nyaris
   kosong dan babak yang berdesakan, dari aturan yang sama. */
function bibitSusunBabak(){
  const L=bibitLv(), {tb}=bibitRuang(), nSel=L.tray*BIBIT_SEL;
  let sisa=Math.max(2,Math.round(nSel*0.38)+((Math.random()*3)|0)-1);
  /* Jatah disebar dengan batas 3 per tray: tray yang keempat selnya sakit
     tidak lagi menuntut keputusan, cuma menuntut empat ketukan. */
  const slot=[];
  for(let i=0;i<L.tray;i++)for(let k=0;k<3;k++)slot.push(i);
  for(let i=slot.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;
    [slot[i],slot[j]]=[slot[j],slot[i]];}
  const jatah=new Array(L.tray).fill(0);
  for(let i=0;i<slot.length&&sisa>0;i++){jatah[slot[i]]++;sisa--;}
  const stok=[];
  for(let i=0;i<L.tray;i++){
    const idx=[0,1,2,3];
    for(let k=idx.length-1;k>0;k--){const j=(Math.random()*(k+1))|0;
      [idx[k],idx[j]]=[idx[j],idx[k]];}
    const sakit=new Set(idx.slice(0,jatah[i]));
    const sp=BENIH[(Math.random()*BENIH.length)|0];      // satu tray, satu varietas
    const sel=[];
    for(let c=0;c<BIBIT_SEL;c++){
      const bad=sakit.has(c)?CACAT[(Math.random()*L.jenis)|0]:'';
      sel.push(bibitSel(bad,bibitTinggi(tb,sp),false,sp));
    }
    stok.push({sel,sp,cacat:jatah[i]});
  }
  return stok;
}
function bibitSortirMulai(){
  const L=bibitLv();
  bibit.fase='sortir';bibit.ft=0;
  bibit.baris=[];bibit.stok=bibitSusunBabak();bibit.antre=L.tray;
  bibit.benar=0;bibit.salah=0;bibit.mutu=1;bibit.kilat=[];
  bibit.laju=L.laju;bibit.kurX=Math.round(bibitRuang().W2*0.5);
  diveTombol('SORT');
  beep(620,.06,.045,'square');beep(880,.09,.045,'square',.06);
}
function bibitTrayBaru(){
  const {W2}=bibitRuang(), tr=bibit.stok.shift();
  if(!tr)return null;
  tr.x=W2+4;return tr;
}
/* Daftar sel yang sedang terlihat, urut dari kiri. Kursor bekerja di atas
   daftar ini, bukan di atas indeks tray — dengan begitu tray yang keluar layar
   tidak pernah membuat kursornya menunjuk sesuatu yang sudah tak ada. */
function bibitTampak(){
  const {W2,sw}=bibitRuang(), out=[];
  for(const tr of bibit.baris)for(let c=0;c<BIBIT_SEL;c++){
    const x=Math.round(tr.x+3+c*sw);
    if(x+sw<2||x>W2-2)continue;
    out.push({tr,c,x,sel:tr.sel[c]});
  }
  return out.sort((a,b)=>a.x-b.x);
}
const bibitDekat=()=>{
  const v=bibitTampak(); if(!v.length)return null;
  const {sw}=bibitRuang();
  let best=v[0],bd=1e9;
  for(const it of v){const d=Math.abs(it.x+sw/2-bibit.kurX);if(d<bd){bd=d;best=it;}}
  return best;
};
function bibitGeser(arah){
  const v=bibitTampak(); if(!v.length)return;
  const {sw}=bibitRuang(), kini=bibitDekat();
  let i=v.indexOf(kini);
  i=Math.max(0,Math.min(v.length-1,i+arah));
  bibit.kurX=v[i].x+sw/2;
  beep(420,.03,.025,'square');
}
function bibitSalah(x,y){
  bibit.salah++;bibit.mutu=Math.max(0,bibit.mutu-BIBIT_DENDA);
  bibit.kilat.push({x,y,t:0,ok:0});
  beep(180,.13,.05,'sine');
}
function bibitAfkir(it){
  if(!it)return;
  const c=it.sel;
  if(c.diangkat||c.kosong)return;
  c.diangkat=true;c.tandaT=0.45;
  const {sw}=bibitRuang();
  if(c.bad){
    c.tanda=1;bibit.benar++;
    bibit.kilat.push({x:it.x+sw/2,y:0,t:0,ok:1});
    beep(700+bibit.benar*60,.05,.045,'square');
  }else{
    c.tanda=-1;bibitSalah(it.x+sw/2,0);     // bibit sehat ikut terbuang
  }
}
function bibitUpdate(dt){
  bibit.t+=dt*1000;bibit.ft+=dt;
  for(const k of bibit.kilat)k.t+=dt;
  bibit.kilat=bibit.kilat.filter(k=>k.t<0.45);
  if(bibit.fase==='lihat'){
    for(const tr of bibit.rak)for(const c of tr.sel)if(c.tandaT>0)c.tandaT-=dt;
    return;
  }
  if(bibit.fase==='hasil'){
    if(bibit.ft>=1.6)bibitKeluar();
    return;
  }
  if(bibit.fase!=='sortir')return;
  const {W2,tw,sw}=bibitRuang();
  /* kursor ikut arah yang ditahan, dengan jeda ulang supaya tak meluncur */
  bibit.ulang=(bibit.ulang||0)-dt;
  const kiri=keys.has('left')||joy.x<-0.45, kanan=keys.has('right')||joy.x>0.45;
  if((kiri||kanan)&&bibit.ulang<=0){bibitGeser(kiri?-1:1);bibit.ulang=0.17;}
  /* tray berjalan; yang lolos dari tepi kiri dihitung */
  for(const tr of bibit.baris){tr.x-=bibit.laju*dt;}
  const lewat=bibit.baris.filter(tr=>tr.x+tw<-2);
  for(const tr of lewat)
    for(const c of tr.sel)
      if(c.bad&&!c.diangkat&&!c.kosong)bibitSalah(6,0);    // yang sakit lolos: itu kesalahan juga
  bibit.baris=bibit.baris.filter(tr=>tr.x+tw>=-2);
  for(const tr of bibit.baris)for(const c of tr.sel)if(c.tandaT>0)c.tandaT-=dt;
  /* tray berikutnya menyusul setelah yang terakhir cukup masuk */
  /* Sela dibatasi sepersebelas layar. Dengan sela tetap sw*1,1 di layar
     sempit, tray berikutnya baru dipanggil setelah yang sekarang HAMPIR
     seluruhnya keluar — menyisakan jeda kosong yang panjang di tengah babak. */
  const sela=Math.min(Math.round(sw*1.1),Math.round(W2*0.09));
  const akhir=bibit.baris.length?bibit.baris[bibit.baris.length-1]:null;
  if(bibit.antre>0&&(!akhir||akhir.x<=W2-tw-sela)){
    const tr=bibitTrayBaru();
    if(tr){bibit.baris.push(tr);bibit.antre--;bibit.laju+=bibitLv().naik;}
    else bibit.antre=0;                                    // stok habis: jangan menggantung
  }
  if(bibit.mutu<=0||(bibit.antre===0&&!bibit.baris.length)){
    bibit.lulus=bibit.mutu>0.34;
    /* Menang membuka tingkat berikutnya; kalah TIDAK menurunkannya. Yang ingin
       dihukum kecerobohan dalam satu babak, bukan keberanian mencoba yang
       lebih sulit - menurunkan tingkat membuat kekalahan dibayar dua kali. */
    if(bibit.lulus)bibit.tingkat=Math.min(TINGKAT.length-1,bibit.tingkat+1);
    bibit.fase='hasil';bibit.ft=0;
    if(bibit.lulus){beep(880,.06,.05);beep(1320,.09,.05,'square',.07);
                    beep(1760,.11,.04,'square',.15);}
    else beep(240,.18,.05,'sine');
  }
}
/* --- GAMBAR -------------------------------------------------------------- */
function bibitDraw(g,t){
  const {W2,H2,sw,tw,tb,lampu,rak2,meja}=bibitRuang();
  g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;
  bibitLatar(g,W2,H2,lampu,meja,rak2,t);

  if(bibit.fase==='lihat'){
    const tegak=bibitRuang().tegak;
    const tingkat=Math.max(tb+10,Math.round((meja-rak2)/2.6));
    const sela=tegak?Math.max(2,(W2-tw)>>1):Math.max(2,Math.floor((W2-3*tw)/4));
    for(let i=0;i<3;i++){
      /* Bertingkat: tray paling bawah paling dekat, jadi ia digambar TERAKHIR
         dan menutupi yang di belakangnya — urutannya dibalik di bawah. */
      const x0=tegak?sela:sela+i*(tw+sela);
      const y0=tegak?meja-(2-i)*tingkat:meja;
      if(tegak){P(g,ramp('#3d4657').out,0,y0+5,W2,5);      // papan tiap tingkat
                P(g,ramp('#3d4657').base,0,y0+6,W2,2);
                P(g,ramp('#3d4657').hi,0,y0+6,W2,1);}
      P(g,ramp('#262a33').out,x0,y0-2,tw,9);               // badan tray
      for(let c=0;c<BIBIT_SEL;c++)
        bibitSelGambar(g,x0+3+c*sw,y0,sw,bibit.rak[i].sel[c],t,false);
      bibitLabel(g,x0,y0,tw,bibit.rak[i].sp);
    }
    drawText(g,SN().id,6,4,'#8fa3b8');
    const hidup=bibit.rak.reduce((n,tr)=>n+tr.sel.filter(c=>!c.kosong).length,0);
    drawText(g,hidup+' SEMAI',W2-textW(hidup+' SEMAI')-6,4,'#8fa3b8');
    const lv='LV'+(bibit.tingkat+1);
    drawText(g,lv,(W2-textW(lv))>>1,4,bibit.tingkat?'#ffd23a':'#8fa3b8');
    /* --- empat contoh: inilah yang mengajarkan aturannya --- */
    /* Enam contoh berdiri di atas papan sendiri di kolong, jadi ia terbaca
       sebagai rak contoh — bukan deretan ikon yang melayang di tepi layar.
       Di layar sempit enam tak muat sebaris: label 'ETIOLASI' saja 31 px,
       sedangkan satu kolom cuma 20 px. Jadi di sana ia jadi dua baris bertiga,
       dan kolong memang ditukar dengan pelajarannya — di ponsel yang kedua
       jauh lebih berharga.
       Jenis yang belum terbuka di tingkat ini digambar redup: pemain melihat
       apa yang MENUNGGU, tanpa mengira ia ada di babak yang sedang berjalan. */
    const lb=['SEHAT',...CACAT.map(k=>CACAT_NM[k])];
    const kol=tegak?3:6, bar=Math.ceil(lb.length/kol);
    /* Tinggi baris diukur dari contoh TERTINGGI, yaitu etiolasi pada 155%.
       Diukur dari semai normal, batang etiolasi menembus 5 px ke baris di
       atasnya dan menimpa labelnya — justru contoh yang paling perlu terbaca
       utuh, karena ia satu-satunya yang menyimpang ke arah tinggi. */
    const hEx=Math.round(tb*0.56);
    const hBar=Math.round(hEx*1.55)+18, cw=Math.floor(W2/kol);
    const y0b=H2-bar*hBar-2;
    g.fillStyle='#090e15';g.fillRect(0,y0b,W2,H2-y0b);
    P(g,'#2a3242',0,y0b,W2,1);
    const buka=bibitLv().jenis;
    for(let i=0;i<lb.length;i++){
      const cxm=Math.round(cw*((i%kol)+0.5));
      const yC=y0b+Math.floor(i/kol)*hBar+hBar-8, yb=yC-7;
      /* Semua contoh memakai TOMAT. Yang diajarkan baris ini keadaannya,
         bukan varietasnya; mengganti dua hal sekaligus membuat pembaca tak
         tahu yang mana yang jadi pembeda. */
      const c={bad:i?CACAT[i-1]:'',h:hEx,seed:i*1.7,sp:BENIH[0],
               kosong:false,diangkat:false,tandaT:0};
      g.globalAlpha=(i===0||i-1<buka)?1:0.32;
      P(g,'#1f242e',cxm-8,yb-1,16,4);
      P(g,'#2a1c12',cxm-7,yb-1,14,2);P(g,'#3a2817',cxm-7,yb-1,14,1);
      semaiBesar(g,cxm-1,yb-1,c,t,14);
      P(g,i?'#ff6a4a':'#6ef08a',cxm-1,yb+4,2,2);
      drawText(g,lb[i],cxm-Math.round(textW(lb[i])/2),yC,i?'#d08a74':'#86c98f');
      g.globalAlpha=1;
    }
    /* Hanya di layar lebar. Di layar bertingkat tray terbawah menempel bilah
       contoh -- tak ada celah yang tersisa, dan di mana pun panah itu ditaruh
       ia menimpa sesuatu. Di sana tombol kiri sudah berbunyi START, jadi
       ajakannya memang tidak hilang. */
    if(!tegak&&Math.floor(t/420)%2===0){                   // ajakan: satu segitiga, tanpa kata
      /* Duduk tepat DI ATAS bilah contoh, bukan pada jarak tetap dari bangku:
         dengan jarak tetap ia jatuh ke dalam bilah dan menimpa salah satu
         contohnya, justru di layar sempit tempat bilahnya paling tinggi. */
      const ax=W2-12, ay=y0b-9;
      for(let k=0;k<6;k++)P(g,'#ffd23a',ax+k,ay-5+k,1,Math.max(1,11-k*2));
    }
    return;
  }

  /* --- SORTIR --- */
  const sorot=bibit.fase==='sortir'?bibitDekat():null;
  for(const tr of bibit.baris){
    const x0=Math.round(tr.x);
    P(g,ramp('#262a33').out,x0,meja-2,tw,9);
    for(let c=0;c<BIBIT_SEL;c++)
      bibitSelGambar(g,x0+3+c*sw,meja,sw,tr.sel[c],t,!!sorot&&sorot.tr===tr&&sorot.c===c);
    bibitLabel(g,x0,meja,tw,tr.sp);
  }
  for(const k of bibit.kilat){                             // kilat benar/salah di tepi atas
    const a=1-k.t/0.45;
    g.fillStyle=(k.ok?'rgba(110,240,138,':'rgba(255,106,74,')+(a*0.5).toFixed(2)+')';
    g.fillRect(0,0,W2,2);
    if(!k.ok)g.fillRect(0,0,3,H2);
  }
  /* bilah mutu: satu-satunya HUD, dan ia tanpa kata — sepola bilah umpan
     di minigame kolam, jadi pemain sudah tahu membacanya. */
  const barW=Math.max(20,W2-16);
  g.fillStyle='rgba(6,12,18,.78)';g.fillRect(8,4,barW,5);
  g.fillStyle=bibit.mutu<0.34?'#e0552f':'#7fd46a';
  g.fillRect(9,5,Math.round((barW-2)*bibit.mutu),3);
  const nT=bibitLv().tray;
  for(let i=1;i<nT;i++){                                   // berapa tray dalam babak ini
    const px=9+Math.round((barW-2)*i/nT);
    P(g,'rgba(6,12,18,.6)',px,5,1,3);
  }
  if(bibit.fase==='hasil'){
    const a=Math.min(1,bibit.ft/0.3);
    g.fillStyle='rgba(6,10,16,'+(a*0.80).toFixed(2)+')';g.fillRect(0,0,W2,H2);
    const cxm=W2>>1, cym=Math.round(H2*0.46), S2=Math.round(Math.min(W2,H2)*0.11);
    /* Goresannya 4 px, bukan 2: di versi pertama tanda ini terbaca sebagai
       garis tipis yang nyasar, bukan sebagai jawaban atas satu babak penuh. */
    g.globalAlpha=a;
    if(bibit.lulus)
      for(let i=0;i<S2;i++){P(g,'#6ef08a',cxm-Math.round(S2*0.7)+i,cym+i,4,4);
                            P(g,'#6ef08a',cxm+i,cym+Math.round(S2*0.7)-i*2,4,4);}
    else
      for(let i=0;i<S2*2;i++){P(g,'#ff6a4a',cxm-S2+i,cym-S2+i,4,4);
                              P(g,'#ff6a4a',cxm+S2-i,cym-S2+i,4,4);}
    g.globalAlpha=1;
  }
}
/* satu ketukan/tekan: di LIHAT ia memulai sortir, di SORTIR ia mengafkir */
function bibitTekan(){
  if(!bibit.on)return;
  if(bibit.fase==='lihat'){bibitSortirMulai();return;}
  if(bibit.fase==='sortir')bibitAfkir(bibitDekat());
}
function bibitKetuk(mx,my){
  if(bibit.fase!=='sortir'){bibitTekan();return;}
  const {sw}=bibitRuang(), v=bibitTampak();
  let best=null,bd=1e9;
  for(const it of v){const d=Math.abs(it.x+sw/2-mx);if(d<bd){bd=d;best=it;}}
  if(best&&bd<=sw){bibit.kurX=best.x+sw/2;bibitAfkir(best);}
}

/* =========================================================================
   INPUT
   ========================================================================= */
addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(bibit.on){bibitKeluar();return;}
    if(dive.on){diveSelesai(null,'DIGULUNG');return;}
    toggleMenu(false);return;}
  if(e.key==='m'||e.key==='M'){toggleMenu(!menu.classList.contains('open'));return;}
  if(menu.classList.contains('open'))return;
  /* Di layar pembibitan hanya ada dua perintah: geser kursor, dan afkir.
     Arahnya tetap masuk ke `keys` supaya bibitUpdate() bisa membaca tombol
     yang DITAHAN — kursor yang hanya bergerak saat keydown terasa patah. */
  if(bibit.on){
    if(KEYMAP[e.key]){keys.add(KEYMAP[e.key]);e.preventDefault();}
    if(e.key==='Enter'||e.key==='e'||e.key==='E'||e.key===' '||e.key==='z'||e.key==='Z'){
      e.preventDefault();bibitTekan();}
    return;
  }
  /* Selama menyelam hanya ada dua perintah: tuntun umpan, dan tarik. Dibalas
     di sini supaya ENTER tidak nyasar ke openTool() dan membuka tool. */
  if(dive.on){
    if(KEYMAP[e.key]){keys.add(KEYMAP[e.key]);e.preventDefault();}
    if(e.key==='Enter'||e.key==='e'||e.key==='E'||e.key===' '||e.key==='z'||e.key==='Z'){
      e.preventDefault();diveTarik();}
    return;
  }
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
    if(bibit.on){bibitTekan();return;}
    if(dive.on){diveTarik();return;}
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
  /* Tombol kiri berganti tugas tiga kali: LOMPAT di dunia atas, ROLL saat
     menuntun umpan (tanpa itu pemain ponsel terkunci sampai umpannya habis,
     karena ESC tak ada di sana), dan HIT saat battle.
     HIT, bukan ROLL, karena ibu jari menekan cepat di dekat tombol itu dan
     menggulung senar tak sengaja di tengah pertarungan berarti ikannya hilang. */
  if(bibit.on){bibitTekan();return;}                    // START, lalu SORT
  if(dive.on){
    if(dive.fase==='lawan')diveTarik();
    else diveSelesai(null,'DIGULUNG');
    return;
  }
  if(player.sitting){standUp();return;}
  if(player.jumpT>0)return;
  player.jumpT=JUMP_DUR;
  beep(300,.06,.05);beep(520,.1,.04,'square',.05);
}

/* ketuk kanvas: menuju meja / berjalan ke titik */
cv.addEventListener('pointerdown',e=>{
  if(dive.on){e.preventDefault();diveTarik();return;}   // ketuk air = tarik/pukul
  if(bibit.on){                                         // ketuk sel = afkir sel itu
    e.preventDefault();
    const rb=cv.getBoundingClientRect();
    bibitKetuk((e.clientX-rb.left)/rb.width*cv.width,
               (e.clientY-rb.top)/rb.height*cv.height);
    return;
  }
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
    if(!fade.swapped&&fade.t>=FADE_HALF){setFloor(fade.to,fade.spawn);
      if(fade.petGo)petArrive();                     // anak dino menyusul lewat pintu yang sama
      fade.swapped=true;}
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
  if(player.moving&&player.fish&&!player.fish.done)player.fish=null;  // melangkah = umpan digulung
  if(player.moving){
    if(Math.abs(vx)>=Math.abs(vy))player.dir=vx<0?'left':'right';
    else player.dir=vy<0?'up':'down';
    const step=SPEED*dt;
    const sx0=player.x,sy0=player.y;
    tryMove(vx*step,vy*step);
    stepDist+=Math.hypot(player.x-sx0,player.y-sy0);   // jejak dari perpindahan NYATA (tak jalan saat mentok)
    if(stepDist>=16){stepDist-=16;emitStep();}
    player.animT+=dt*Math.min(1.2,mag+.2);
  }else player.animT=0;
  if(player.jumpT>0)player.jumpT=Math.max(0,player.jumpT-dt);
  if(pet.floor===floor)petUpdate(dt);                          // anak dino: ikut ke mana pun ia dibawa
  if(floor===0){botUpdate(dt);droneUpdate(dt);}                // penghuni lt.1
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
  let z=zoneOf[tx+','+ty]||null;
  if(!z&&floor===2&&eggNear(performance.now()))z=eggTool;   // telur di rumput: tak punya zona tetap
  if(z!==lastZone){lastZone=z;setBanner(z);}

  /* pancing: umpan hangus kalau tak ditarik, lalu ajakan di banner ikut berubah
     saat ikan menyambar — tanpa itu pemain tak tahu kapan harus menekan */
  /* Umpan menyentuh air -> turun ke minigame. Hasilnya dibawa pulang ke sini
     oleh diveUpdate(): f.done=1 berikut player.pick, atau f.done=-1. */
  if(player.fish){
    const f=player.fish, now=performance.now(), el=now-f.t0;
    if(f.done){if(now-f.endT>FISH_END)player.fish=null;}
    else if(!f.menyelam&&el>=CAST_DUR){f.menyelam=true;diveStart();}
  }

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
  if(floor===2){drawPuddles(cx,t);                 // genangan musim hujan (paling bawah)
    drawPond(cx,t);                                 // riak/ikan kolam (layer tanah)
    drawGardenPlants(cx,t);                         // tanaman tumbuh di bedengan
    drawChickens(cx,t);}                            // ayam + telur di BALIK furnitur (pohon/objek menutupinya)
  drawStepFx(cx,t);                                 // jejak langkah di semua lantai
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
  if(pet.floor===floor)items.push({y:pet.y,draw:()=>{
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
  if(floor===2)drawTreeShimmer(cx,t);            // kilau daun tertiup angin
  if(floor===2)drawFishing(cx,t);                // joran, senar & umpan di kolam
  drawPick(cx,t);                                // hasil panen di tangan/atas kepala dino
  if(floor===1)drawDeckRail(cx);                 // railing di depan pemain (dino di balik pagar)
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
  if(floor===2)drawRain(cx,t);                      // gerimis musiman, di depan semua objek
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
  /* kabut perang (mobile) hanya untuk ruang tertutup lt.1 & lt.2 — area luar (lapangan
     terbuka) dibiarkan terang penuh; fog ala-ruangan bikin petak gelap kaku di sana */
  if(fogOn&&floor!==2){
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
    g.globalCompositeOperation='destination-out';        // halo ikut ke mana dino pergi
    g.drawImage(FOG_HALO,hx-R,hy-R);
    cx.setTransform(1,0,0,1,0,0);
    cx.drawImage(fogCv,0,0);
  }
  drawFade();                                    // tirai perpindahan lantai paling atas
}

let last=0, skyBucket=-1, rafId=0;
/* Latar dipanggang ulang MALAS: hanya lantai yang sedang terlihat dibangun saat
   bucket langit berganti; dua lainnya ditandai kotor dan dibangun saat dikunjungi.
   (Dulu ketiganya dibangun sekaligus → hitch 3× repaint 400x304 dalam satu frame.) */
const bgBuild=[()=>buildBG(),()=>buildBG2(),()=>buildBG3()];
const bgDirty=[false,false,false];
function buildFloorBG(n){bgBuild[n]();bgDirty[n]=false;}
function syncFloorBG(n){if(bgDirty[n])buildFloorBG(n);}
function tickSky(){
  daylight=daylightAt(curHour());                 // halus tiap frame (untuk grade warna)
  const sNow=curSeason();                         // musim bergeser tiap hari → kanopi dicat ulang
  if(sNow!==season){season=sNow;repaintTrees();repaintSeasonal();skyBucket=-1;}
  const b=Math.round(curHour()*10);               // langit terpanggang ulang tiap ~6 menit
  if(b!==skyBucket){skyBucket=b;
    bgDirty[0]=bgDirty[1]=bgDirty[2]=true;
    buildFloorBG(floor);}                         // sisanya menyusul saat lantainya dibuka
}
tickSky();
let frameErrs=0;
function loop(ts){
  rafId=0;
  const dt=Math.min(.05,(ts-last)/1000)||0;last=ts;
  /* Satu frame gagal TIDAK boleh mematikan halaman: dulu exception di sini membuat
     baris penjadwalan di bawah tak pernah tercapai → rafId tetap 0 → layar beku permanen. */
  /* Satu percabangan di sini, bukan penjaga bertebaran di dalam update() dan
     render(): selama menyelam, dunia atas tidak di-update DAN tidak digambar.
     Pada frame terakhir diveUpdate() memadamkan dive.on, dan frame itu juga
     langsung dipakai dunia atas supaya tidak ada satu frame kosong. */
  try{
    tickSky();
    if(bibit.on){bibitUpdate(dt);bibitDraw(cx,ts);}
    else{
      if(dive.on)diveUpdate(dt);
      if(dive.on)diveDraw(cx,ts); else {update(dt);render(ts);}
    }
    frameErrs=0;
  }
  catch(err){ if(++frameErrs<=3)console.error('[HQ] frame gagal, loop tetap jalan:',err); }
  if(!document.hidden)rafId=requestAnimationFrame(loop);   // SELALU dijadwalkan ulang
}
function kickLoop(){                                       // hidupkan lagi bila loop sempat berhenti
  if(!rafId&&!document.hidden){last=performance.now();rafId=requestAnimationFrame(loop);}
}
document.addEventListener('visibilitychange',()=>{         // lanjut render saat tab kembali aktif
  if(document.hidden){
    if(rafId)cancelAnimationFrame(rafId);rafId=0;
    musicPause();                                          // penjadwal musik ikut berhenti
    return;}
  musicResume();                                           // AudioContext bisa tersuspensi saat tersembunyi
  kickLoop();
});
addEventListener('error',e=>{console.error('[HQ] galat:',e.error||e.message);kickLoop();});
addEventListener('unhandledrejection',e=>{console.error('[HQ] promise ditolak:',e.reason);});
setInterval(kickLoop,2000);                                // pengawas: loop tak pernah mati diam-diam
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
              setSeason:n=>{forcedSeason=n===null?null:((n%SEASONS.length)+SEASONS.length)%SEASONS.length;
                            skyBucket=-1;tickSky();render(performance.now());},
              season:()=>season,SEASONS,POND,PONDIN,
              BED,bedTool,bedGrow,bedKind,harvestNear,stepFx,
              eggsNow,eggNear,pickEggNear,eggTool,TREEF,
              fishTool,fishStart,fishHook,petArrive,
              dive,diveStart,diveTarik,diveSelesai,diveUpdate,diveRuang,IKAN,drawIkan,
              diveLawanMulai,diveLawanTekan,lawanLebar,LAWAN_LUPUT,
              ikanCat,outlineSilhouette,rimAtas,ikanSprite,IKAN_SPR,diveLatar,diveDraw,
              bibit,bibitMasuk,bibitKeluar,bibitSortirMulai,bibitTekan,bibitKetuk,
              bibitUpdate,bibitDraw,bibitRuang,bibitTampak,bibitDekat,bibitAfkir,
              bibitGeser,bibitRakIsi,bibitTrayBaru,semaiBesar,semaiTool,CACAT,
              BIBIT_SEL,BIBIT_DENDA,TINGKAT,CACAT_NM,bibitLv,bibitSusunBabak,
              BENIH,benihRona,semaiDaun,bibitTinggi,bibitLabel,_bl,
              semaiCat,semaiSprite,SEMAI_SPR,GOYANG,dindingGaris,MAP,
              bingkai:(dt=1/60)=>{const ts=performance.now();   // tiruan setia loop()
                tickSky();
                if(bibit.on){bibitUpdate(dt);bibitDraw(cx,ts);}
                else{
                  if(dive.on)diveUpdate(dt);
                  if(dive.on)diveDraw(cx,ts); else {update(dt);render(ts);}
                }},
              diveStep:(n=1,d=1/60)=>{for(let i=0;i<n;i++){diveUpdate(d);if(dive.on)diveDraw(cx,performance.now());}},
              SEASONAL,repaintSeasonal,
              daylight:()=>daylight,buildBG,weather,WINDOWS,GROW,GROW_DUR,SPECIES,drone,droneUpdate,DR_RACK,DR_DROP,
              render:tt=>render(tt===undefined?performance.now():tt),
              step:(n=1,d=1/60)=>{for(let i=0;i<n;i++){update(d);render(performance.now());}}};

/* ---------- service worker (offline / PWA) ---------- */
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'))
  navigator.serviceWorker.register('./sw.js').catch(()=>{});
