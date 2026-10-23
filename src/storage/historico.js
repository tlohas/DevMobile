import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = 'historico';

export async function salvar(lista) {
  try {
    await AsyncStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch (error) {
    console.error('Erro ao salvar histórico:', error);
  }
}

export async function carregar() {
  try {
    const texto = await AsyncStorage.getItem(CHAVE);
    if (!texto) return [];
    const parsed = JSON.parse(texto);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    return [];
  }
}

export async function limpar() {
  try {
    await AsyncStorage.removeItem(CHAVE);
    return [];
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
    return [];
  }
}
