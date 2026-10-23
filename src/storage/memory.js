import AsyncStorage from '@react-native-async-storage/async-storage';

const MEMORY_KEY = '@calculator_memory_value';

export async function getMemory() {
  try {
    const val = await AsyncStorage.getItem(MEMORY_KEY);
    return val ? parseFloat(val) : 0;
  } catch {
    return 0;
  }
}

export async function setMemory(val) {
  try {
    const num = Number(val) || 0;
    await AsyncStorage.setItem(MEMORY_KEY, String(num));
    return num;
  } catch {
    return 0;
  }
}

export async function clearMemory() {
  try {
    await AsyncStorage.removeItem(MEMORY_KEY);
    return 0;
  } catch {
    return 0;
  }
}

export async function addToMemory(val) {
  const current = await getMemory();
  const next = current + (Number(val) || 0);
  return setMemory(next);
}

export async function subtractFromMemory(val) {
  const current = await getMemory();
  const next = current - (Number(val) || 0);
  return setMemory(next);
}
