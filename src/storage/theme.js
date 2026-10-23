import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@calculator_app_theme';

export async function salvarTema(tema) {
  try {
    await AsyncStorage.setItem(THEME_KEY, tema);
  } catch (error) {
    console.error('Erro ao salvar tema:', error);
  }
}

export async function carregarTema() {
  try {
    const tema = await AsyncStorage.getItem(THEME_KEY);
    return tema === 'light' ? 'light' : 'dark'; // padrão: dark
  } catch (error) {
    console.error('Erro ao carregar tema:', error);
    return 'dark';
  }
}

