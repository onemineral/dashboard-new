import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const YMD_FORMAT = "yyyy-MM-dd";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Merges 2 objects into a single object. Identical keys with non array values will be replaced, array values will be merged
 *
 * @param obj1 object|null|undefined
 * @param obj2 object|null|undefined
 */
export function mergeObjects(obj1: object|null|undefined, obj2: object|null|undefined) {
  if(!obj1) {
    return obj2;
  }

  if(!obj2) {
    return obj1;
  }

  const result: any = {...obj1 || {}};

  Object.keys(obj2 || {}).forEach((key:string) => {
    const value: any = (obj2 as any)[key];

    if(result[key] == undefined) {
      result[key] = value;
    } else if(Array.isArray(result[key]) && Array.isArray(value)) {
      // both values are arrays. we can append obj2 values to obj1 values
      result[key] = [
          ...result[key],
          ...value,
      ];
    } else if(typeof result[key] === "object" && typeof value === "object") {
      result[key] = mergeObjects(result[key], value);
    } else {
      // no way to merge properly. the second object will overwrite the first
      result[key] = value;
    }
  });

  return result;
}

export function translated(text: any, locale?: string) {
    if (!text) {
        return null;
    }

    if (typeof text === 'string') {
        return text;
    }

    if (locale && text[locale]) {
        return text[locale];
    }

    if(text.en) {
        return text.en;
    }

    const values = Object.values(text);
    for(let i = 0; i < values.length; i++) {
        if(values[i]) {
          return values[i];
        }
    }
}

/**
 * Get flag emoji for a language by converting its ISO locale country code to a flag emoji.
 * Uses Unicode Regional Indicator Symbols (same approach as phone component).
 *
 * @param isoLocale - ISO locale string (e.g., "en_US", "es_ES", "fr_FR")
 * @returns Flag emoji for the country code
 */
export function getFlagEmoji(isoLocale: string): string {
    // Extract country code from ISO locale (e.g., "en_US" -> "US")
    const countryCode = isoLocale.split("_")[1];

    if (!countryCode || countryCode.length !== 2) {
        return "🌐"; // Fallback globe emoji
    }

    // Convert country code to flag emoji using Regional Indicator Symbols
    // Each letter is converted to its corresponding Regional Indicator Symbol
    // by adding 127397 to the character code (127462 - 65 = 127397, where 65 is 'A')
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));

    return String.fromCodePoint(...codePoints);
}