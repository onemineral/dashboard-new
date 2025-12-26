#!/usr/bin/env node

/**
 * Translation Synchronization Script
 *
 * This script synchronizes translations between English (source) and all target
 * language files by identifying missing translations and using OpenAI to generate them.
 *
 * The script automatically discovers and processes all JSON files in the lang directory,
 * excluding en.json which serves as the source language. Adding new language files
 * (e.g., es.json, de.json) will automatically include them in translation runs.
 *
 * Usage:
 *   node translate.js           # Translate only missing strings
 *   node translate.js --force   # Re-translate ALL strings (ignores existing translations)
 *
 * Requirements:
 * - OPENAI_API_KEY in .env file
 * - Node.js v18+ (for native fetch support)
 * - Language files in lang/ directory (en.json + target languages)
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
config();

// Parse command line arguments
const args = process.argv.slice(2);
const FORCE_MODE = args.includes('--force');

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BATCH_SIZE = 100; // Number of translations per API call
const RATE_LIMIT_DELAY = 100; // Delay between API calls (ms)
const LANG_DIR = join(__dirname, 'lang');
const EN_PATH = join(LANG_DIR, 'en.json');

// Language name mapping for better translation context
const LANGUAGE_NAMES = {
  'fr': 'French',
  'es': 'Spanish',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'nl': 'Dutch',
  'ro': 'Romanian',
};

/**
 * Read and parse a JSON file
 */
function readJsonFile(filepath) {
  try {
    const content = readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filepath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Write JSON to file with consistent formatting
 */
function writeJsonFile(filepath, data) {
  try {
    const content = JSON.stringify(data, null, 2) + '\n';
    writeFileSync(filepath, content, 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filepath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Discover all language files in the lang directory (excluding en.json)
 */
function discoverLanguageFiles() {
  try {
    const files = readdirSync(LANG_DIR);
    const langFiles = files
      .filter(file => file.endsWith('.json') && file !== 'en.json')
      .map(file => ({
        code: basename(file, '.json'),
        filename: file,
        path: join(LANG_DIR, file),
      }));
    return langFiles;
  } catch (error) {
    console.error(`Error reading lang directory:`, error.message);
    process.exit(1);
  }
}

/**
 * Find missing translations by comparing keys
 * In force mode, returns ALL translations to re-translate everything
 */
function findMissingTranslations(enData, targetData) {
  if (FORCE_MODE) {
    // In force mode, return all English data to re-translate everything
    return { ...enData };
  }

  const missing = {};
  const enKeys = Object.keys(enData);
  const targetKeys = new Set(Object.keys(targetData));

  for (const key of enKeys) {
    if (!targetKeys.has(key)) {
      missing[key] = enData[key];
    }
  }

  return missing;
}

/**
 * Find obsolete keys that exist in target but not in source
 */
function findObsoleteKeys(enData, targetData) {
  const obsolete = [];
  const enKeys = new Set(Object.keys(enData));
  const targetKeys = Object.keys(targetData);

  for (const key of targetKeys) {
    if (!enKeys.has(key)) {
      obsolete.push(key);
    }
  }

  return obsolete;
}

/**
 * Batch array into chunks of specified size
 */
function batchArray(array, size) {
  const batches = [];
  for (let i = 0; i < array.length; i += size) {
    batches.push(array.slice(i, i + size));
  }
  return batches;
}

/**
 * Translate a batch of strings using OpenAI API
 */
async function translateBatch(batch, targetLanguage) {
  const languageName = LANGUAGE_NAMES[targetLanguage] || targetLanguage.toUpperCase();
  
  const prompt = `
You are a professional translator specializing in vacation rental property management software. Your goal is to provide natural, contextually appropriate translations for ${languageName} users of a cloud-based property management system.

IMPORTANT TRANSLATION GUIDELINES:
1. DO NOT translate literally word-for-word. Instead, think about what makes sense in the target language for a vacation rental management context.
2. Use the "description" field to understand WHERE and HOW the text is used in the software before translating.
3. Consider the software domain: properties, bookings, guests, check-ins, amenities, calendars, pricing, etc.
4. Use natural, professional language that native ${languageName} speakers would expect in business software.
5. Maintain industry-standard terminology for vacation rentals (e.g., "check-in", "booking", "property" may have specific translations in your language).
6. Keep react-intl formatting intact: preserve variables like {count}, {name}, {date}, etc.
7. Preserve pluralization syntax: {count, plural, one {...} other {...}}
8. Keep HTML tags and special characters unchanged.

Input format:
{
  "key1": {
    "defaultMessage": "English text with {variables}",
    "description": "Context: where this text appears and what it's used for"
  }
}

Output format (translate ONLY the defaultMessage, keep description in English):
{
  "key1": {
    "defaultMessage": "Natural ${languageName} translation with {variables}",
    "description": "Context: where this text appears and what it's used for"
  }
}

Strings to translate:
${JSON.stringify(batch, null, 2)}

Return ONLY the JSON object with natural, context-appropriate ${languageName} translations. No additional text or explanations.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.2',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in vacation rental property management software. You translate English to natural, contextually appropriate ${languageName} for business software users. Always consider the software context and use industry-standard terminology. You return only valid JSON without any markdown formatting or code blocks.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content.trim();
    
    // Parse the JSON response
    const translated = JSON.parse(translatedText);
    return translated;
  } catch (error) {
    console.error('Translation error:', error.message);
    throw error;
  }
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Process translations for a single language file
 */
async function processLanguageFile(langFile, enData) {
  const languageName = LANGUAGE_NAMES[langFile.code] || langFile.code.toUpperCase();
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📝 Processing ${languageName} (${langFile.filename})`);
  if (FORCE_MODE) {
    console.log(`   🔄 FORCE MODE: Re-translating ALL strings`);
  }
  console.log(`${'='.repeat(60)}`);

  // Read target language file
  const targetData = readJsonFile(langFile.path);
  console.log(`   English entries: ${Object.keys(enData).length}`);
  console.log(`   ${languageName} entries: ${Object.keys(targetData).length}`);

  // Find obsolete keys
  const obsoleteKeys = findObsoleteKeys(enData, targetData);
  const obsoleteCount = obsoleteKeys.length;

  if (obsoleteCount > 0) {
    console.log(`\n   🗑️  Found ${obsoleteCount} obsolete key(s) to remove:`);
    obsoleteKeys.slice(0, 5).forEach(key => {
      console.log(`      - ${key}`);
    });
    if (obsoleteCount > 5) {
      console.log(`      ... and ${obsoleteCount - 5} more`);
    }
    
    // Remove obsolete keys from target data
    obsoleteKeys.forEach(key => {
      delete targetData[key];
    });
  }

  // Find missing translations (or all translations in force mode)
  const missing = findMissingTranslations(enData, targetData);
  const missingCount = Object.keys(missing).length;

  if (missingCount === 0 && obsoleteCount === 0) {
    console.log(`   ✅ All translations are up to date for ${languageName}!`);
    return { language: languageName, updated: 0, deleted: 0, total: Object.keys(targetData).length };
  }

  if (missingCount > 0) {
    if (FORCE_MODE) {
      console.log(`\n   🔄 Force re-translating ${missingCount} entry(ies):`);
    } else {
      console.log(`\n   🔍 Found ${missingCount} missing translation(s):`);
    }
    Object.entries(missing).slice(0, 5).forEach(([key, value]) => {
      console.log(`      - ${key}: "${value.defaultMessage}"`);
    });
    if (missingCount > 5) {
      console.log(`      ... and ${missingCount - 5} more`);
    }
  }

  // Handle translations if there are missing entries
  const allTranslations = {};
  let successCount = 0;

  if (missingCount > 0) {
    // Batch the missing translations
    const entries = Object.entries(missing);
    const batches = batchArray(entries, BATCH_SIZE);

    console.log(`\n   🔄 Processing ${batches.length} batch(es)...`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchObject = Object.fromEntries(batch);

      try {
        console.log(`\n      Batch ${i + 1}/${batches.length} (${batch.length} entries)...`);
        
        const translated = await translateBatch(batchObject, langFile.code);
        
        // Merge translations
        Object.assign(allTranslations, translated);
        successCount += Object.keys(translated).length;

        console.log(`      ✅ Successfully translated ${Object.keys(translated).length} entries`);

        // Rate limiting delay (except for last batch)
        if (i < batches.length - 1) {
          console.log(`      ⏳ Waiting ${RATE_LIMIT_DELAY}ms before next batch...`);
          await sleep(RATE_LIMIT_DELAY);
        }
      } catch (error) {
        console.error(`      ❌ Failed to translate batch ${i + 1}:`, error.message);
        console.error(`      Skipping batch and continuing...`);
      }
    }

    if (successCount === 0 && missingCount > 0) {
      console.error(`   ❌ No translations were successful for ${languageName}`);
      return { language: languageName, updated: 0, deleted: obsoleteCount, total: Object.keys(targetData).length, error: true };
    }
  }

  // Merge with existing target language data and sort keys
  console.log('\n   💾 Saving changes...');
  const updatedTargetData = { ...targetData, ...allTranslations };
  
  // Sort keys alphabetically for consistency
  const sortedTargetData = Object.keys(updatedTargetData)
    .sort()
    .reduce((acc, key) => {
      acc[key] = updatedTargetData[key];
      return acc;
    }, {});

  // Write updated target language file
  writeJsonFile(langFile.path, sortedTargetData);

  if (successCount > 0 || obsoleteCount > 0) {
    if (successCount > 0) {
      console.log(`   ✅ Successfully added ${successCount} translation(s)`);
    }
    if (obsoleteCount > 0) {
      console.log(`   🗑️  Successfully removed ${obsoleteCount} obsolete key(s)`);
    }
  }
  console.log(`   📊 Total ${languageName} entries: ${Object.keys(sortedTargetData).length}`);
  
  return { language: languageName, updated: successCount, deleted: obsoleteCount, total: Object.keys(sortedTargetData).length };
}

/**
 * Main execution
 */
async function main() {
  console.log('🌍 Translation Synchronization Script\n');

  // Show mode
  if (FORCE_MODE) {
    console.log('⚠️  FORCE MODE ENABLED: All translations will be re-generated\n');
  }

  // Validate API key
  if (!OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY is not set in .env file');
    console.error('Please add it to your .env file: OPENAI_API_KEY=your_api_key_here');
    process.exit(1);
  }

  // Discover language files
  console.log('🔍 Discovering language files...');
  const languageFiles = discoverLanguageFiles();
  
  if (languageFiles.length === 0) {
    console.log('   ⚠️  No language files found in the lang directory (excluding en.json)');
    console.log('   Please add language files like fr.json, es.json, etc.');
    process.exit(0);
  }

  console.log(`   Found ${languageFiles.length} language file(s):`);
  languageFiles.forEach(file => {
    const langName = LANGUAGE_NAMES[file.code] || file.code.toUpperCase();
    console.log(`   - ${file.filename} (${langName})`);
  });

  // Read English source file
  console.log('\n📖 Reading source language file (en.json)...');
  const enData = readJsonFile(EN_PATH);
  console.log(`   English entries: ${Object.keys(enData).length}`);

  // Process each language file
  const results = [];
  for (let i = 0; i < languageFiles.length; i++) {
    const langFile = languageFiles[i];
    const result = await processLanguageFile(langFile, enData);
    results.push(result);
    
    // Delay between language files (except for last one)
    if (i < languageFiles.length - 1) {
      console.log(`\n⏳ Waiting ${RATE_LIMIT_DELAY}ms before next language...\n`);
      await sleep(RATE_LIMIT_DELAY);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TRANSLATION SUMMARY');
  console.log('='.repeat(60));
  
  let totalUpdated = 0;
  let totalDeleted = 0;
  results.forEach(result => {
    const status = result.error ? '❌' : (result.updated > 0 || result.deleted > 0) ? '✅' : '✓';
    const changes = [];
    if (result.updated > 0) changes.push(`+${result.updated} new`);
    if (result.deleted > 0) changes.push(`-${result.deleted} removed`);
    const changesStr = changes.length > 0 ? ` (${changes.join(', ')})` : '';
    console.log(`${status} ${result.language}: ${result.total} total entries${changesStr}`);
    totalUpdated += result.updated;
    totalDeleted += result.deleted || 0;
  });
  
  console.log('='.repeat(60));
  console.log(`\n🎉 Translation synchronization complete!`);
  if (totalUpdated > 0) {
    console.log(`   ✅ Total new translations: ${totalUpdated}`);
  }
  if (totalDeleted > 0) {
    console.log(`   🗑️  Total obsolete keys removed: ${totalDeleted}`);
  }
  if (totalUpdated === 0 && totalDeleted === 0) {
    console.log(`   ✓ All translations are up to date!`);
  }
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});