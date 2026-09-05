const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'celestial');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const filesToFetch = [
  { filename: 'm87_eht.jpg', title: 'File:Black hole - Messier 87 crop max res.jpg' },
  { filename: 'terra_apollo17.jpg', title: 'File:The Earth seen from Apollo 17.jpg' },
  { filename: 'jupiter_juno.jpg', title: 'File:Jupiter and its shrunken Great Red Spot.jpg' },
  { filename: 'saturno_cassini.jpg', title: 'File:Saturn during Equinox.jpg' },
  { filename: 'marte_osiris.jpg', title: 'File:OSIRIS Mars true color.jpg' },
  { filename: 'sol_sdo.jpg', title: 'File:The Sun by the Atmospheric Imaging Assembly of NASA\'s Solar Dynamics Observatory - 20100819.jpg' },
  { filename: 'mercurio_messenger.jpg', title: 'File:Mercury in true color.jpg' },
  { filename: 'venus_akatsuki.jpg', title: 'File:PIA23791-Venus-RealAndEnhancedContrastViews-20200608 (cropped).jpg' },
  { filename: 'voyager1_model.png', title: 'File:Voyager spacecraft model.png' },
  { filename: 'voyager_golden_record.jpg', title: 'File:The Sounds of Earth Record Cover - GPN-2000-001978.jpg' },
  { filename: 'sombrero_m104.jpg', title: 'File:M104 ngc4594 sombrero galaxy hi-res.jpg' },
  { filename: 'andromeda_m31.jpg', title: 'File:Andromeda Galaxy (with h-alpha).jpg' },
  { filename: 'deepfield_jwst.jpg', title: 'File:Webb\'s First Deep Field.jpg' },
  { filename: 'cygnus_x1.gif', title: 'File:Black Hole Week- Black Hole GIFs (SVS14132 - BHW LMXB Illustration).gif' },
  { filename: 'blackhole_swirl.gif', title: 'File:Black Hole Week- Black Hole GIFs (SVS14132 - BHW Swirling Black Hole).gif' },
  { filename: 'sirius_hubble.jpg', title: 'File:Hubble Heic0516a.jpg' },
  { filename: 'proxima_hubble.jpg', title: 'File:New shot of Proxima Centauri, our nearest neighbour.jpg' }
];

async function run() {
  console.log('Iniciando download de mídia celestial oficial...');

  for (const item of filesToFetch) {
    const dest = path.join(outDir, item.filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`[PULANDO] ${item.filename} já existe (${fs.statSync(dest).size} bytes).`);
      continue;
    }

    try {
      console.log(`[OBTENDO URL] ${item.title}...`);
      const apiUrl = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent(item.title) + '&prop=imageinfo&iiprop=url&format=json';
      const metaRes = await fetch(apiUrl, {
        headers: { 'User-Agent': 'InfiniteHorizonsApp/1.0 (contact: admin@infinitehorizons.space)' }
      });
      const metaData = await metaRes.json();
      const pages = metaData.query?.pages || {};
      const page = Object.values(pages)[0];
      const directUrl = page?.imageinfo?.[0]?.url;

      if (!directUrl) {
        console.warn(`[AVISO] Não encontrou URL para ${item.title}`);
        await sleep(1500);
        continue;
      }

      console.log(`[BAIXANDO] ${item.filename} de ${directUrl.substring(0, 60)}...`);
      const imgRes = await fetch(directUrl, {
        headers: { 'User-Agent': 'InfiniteHorizonsApp/1.0 (contact: admin@infinitehorizons.space)' }
      });
      const buf = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log(`[SUCESSO] Salvo ${item.filename} (${buf.length} bytes).`);
    } catch (err) {
      console.error(`[ERRO] Falha ao baixar ${item.filename}:`, err.message);
    }

    await sleep(1600); // Respeita limite do Wikimedia
  }

  console.log('Download concluído.');
}

run();
