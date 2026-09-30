/** Lê uma preferência salva; null se não existir ou se o navegador bloquear o armazenamento. */
export function readPreference(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Salva uma preferência; se o navegador bloquear o armazenamento, ela vale só para esta visita. */
export function savePreference(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Preferência "${key}" não foi salva:`, error);
  }
}
