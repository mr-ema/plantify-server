export function isValidBookmarkEntityType(entity_type: string): boolean {
  const valid_types = [ "plant"];

  return valid_types.includes(entity_type);
}

export function cleanEntityType(entity_type: string) {
  let cleaned = entity_type.toLowerCase().trim();

  if (cleaned.endsWith("s")) {
    cleaned = entity_type.slice(0, -1);
  }

  return cleaned;
}
