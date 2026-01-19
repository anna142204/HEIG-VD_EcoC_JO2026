import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { existsSync } from 'fs';

const inputDir = './public/images';
const outputDir = './public/images/avif';
const quality = 80;

// Extensions à convertir
const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

async function convertToAvif() {
  try {
    // Créer le dossier de sortie s'il n'existe pas
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    // Lire tous les fichiers du dossier
    const files = await readdir(inputDir);
    
    let convertedCount = 0;
    let skippedCount = 0;

    for (const file of files) {
      const ext = extname(file).toLowerCase();
      
      // Vérifier si c'est une image valide et pas déjà en AVIF
      if (validExtensions.includes(ext)) {
        const inputPath = join(inputDir, file);
        const outputFileName = basename(file, ext) + '.avif';
        const outputPath = join(outputDir, outputFileName);

        try {
          await sharp(inputPath)
            .avif({ quality })
            .toFile(outputPath);
          
          console.log(`✅ Converti: ${file} → ${outputFileName}`);
          convertedCount++;
        } catch (error) {
          console.error(`❌ Erreur pour ${file}:`, error.message);
          skippedCount++;
        }
      } else if (ext === '.avif') {
        console.log(`⏭️  Déjà en AVIF: ${file}`);
        skippedCount++;
      }
    }

    console.log('\n📊 Résumé:');
    console.log(`   ✅ ${convertedCount} images converties`);
    console.log(`   ⏭️  ${skippedCount} images ignorées`);
    console.log(`\n📁 Images AVIF sauvegardées dans: ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

convertToAvif();
