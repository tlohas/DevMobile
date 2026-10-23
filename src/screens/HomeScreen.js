import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, StatusBar as RNStatusBar } from 'react-native';
import Display from '../components/Display';
import Teclado from '../components/Teclado';
import { THEMES } from '../theme/colors';
import { carregarTema, salvarTema } from '../storage/theme';
import { carregar, salvar } from '../storage/historico';
import {
  getMemory,
  clearMemory,
  addToMemory,
  subtractFromMemory,
} from '../storage/memory';
import {
  calcular,
  calcularPreview,
  inverterSinal,
} from '../engine/calculator';

export default function HomeScreen({ navigation, route }) {
  const [themeMode, setThemeMode] = useState('dark');
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [preview, setPreview] = useState('');
  const [history, setHistory] = useState([]);
  const [memoryValue, setMemoryValue] = useState(0);
  const [justCalculated, setJustCalculated] = useState(false);

  const theme = THEMES[themeMode] || THEMES.dark;

  // Carrega configurações iniciais (tema, histórico, memória)
  useEffect(() => {
    carregarTema().then((t) => setThemeMode(t));
    carregar().then((dados) => {
      if (Array.isArray(dados)) setHistory(dados);
    });
    getMemory().then((m) => setMemoryValue(m));
  }, []);

  // Recarrega dados ao voltar para a tela (ex: após limpar histórico)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregar().then((dados) => {
        if (Array.isArray(dados)) setHistory(dados);
      });
      getMemory().then((m) => setMemoryValue(m));

      // Se o usuário selecionou uma conta do histórico para carregar
      if (route.params?.loadExpression) {
        setExpression(route.params.loadExpression);
        setResult(route.params.loadResult || '');
        setPreview('');
        setJustCalculated(false);
      }
    });
    return unsubscribe;
  }, [navigation, route.params]);

  // Atualiza preview em tempo real ao alterar expressão
  useEffect(() => {
    if (!justCalculated && expression) {
      const p = calcularPreview(expression);
      setPreview(p);
    } else {
      setPreview('');
    }
  }, [expression, justCalculated]);

  // Alternador de tema claro / escuro
  const toggleTheme = useCallback(async () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
    await salvarTema(next);
  }, [themeMode]);

  // Handler de pressionamento de teclas principais
  const handlePress = useCallback(
    async (tecla) => {
      if (tecla === 'C') {
        setExpression('');
        setResult('');
        setPreview('');
        setJustCalculated(false);
        return;
      }

      if (tecla === '⌫') {
        if (justCalculated) {
          setResult('');
          setJustCalculated(false);
          return;
        }
        setExpression((prev) => prev.slice(0, -1));
        return;
      }

      if (tecla === '+/-') {
        setExpression((prev) => inverterSinal(prev));
        setJustCalculated(false);
        return;
      }

      if (tecla === '=') {
        if (!expression.trim()) return;

        const res = calcular(expression);
        setResult(res);
        setPreview('');
        setJustCalculated(true);

        if (res !== 'Erro' && res !== 'Indefinido') {
          const item = {
            id: Date.now().toString(),
            conta: expression,
            resultado: res,
            expression: expression,
            result: res,
            timestamp: new Date().toISOString(),
          };

          const novoHistorico = [item, ...history];
          setHistory(novoHistorico);
          await salvar(novoHistorico);
        }
        return;
      }

      // Se o usuário acabou de calcular
      if (justCalculated) {
        if (['+', '−', '×', '÷', '%'].includes(tecla)) {
          // Continua cálculo usando o resultado anterior
          if (result && result !== 'Erro' && result !== 'Indefinido') {
            setExpression(result + tecla);
            setResult('');
            setJustCalculated(false);
            return;
          }
        } else {
          // Começa nova expressão se digitar número
          setExpression(tecla);
          setResult('');
          setJustCalculated(false);
          return;
        }
      }

      // Evita operadores duplicados seguidos
      if (['+', '−', '×', '÷'].includes(tecla)) {
        setExpression((prev) => {
          if (!prev) return '0' + tecla;
          const ultimo = prev.slice(-1);
          if (['+', '−', '×', '÷'].includes(ultimo)) {
            return prev.slice(0, -1) + tecla;
          }
          return prev + tecla;
        });
        return;
      }

      // Adiciona dígito ou ponto
      setExpression((prev) => prev + tecla);
    },
    [expression, result, justCalculated, history]
  );

  // Handler de operações com memória
  const handleMemoryPress = useCallback(
    async (tecla) => {
      const valorAtual = parseFloat(result || preview || expression || '0') || 0;

      switch (tecla) {
        case 'MC': {
          const zero = await clearMemory();
          setMemoryValue(zero);
          break;
        }
        case 'MR': {
          if (memoryValue !== 0) {
            setExpression((prev) => prev + String(memoryValue));
            setJustCalculated(false);
          }
          break;
        }
        case 'M+': {
          const novo = await addToMemory(valorAtual);
          setMemoryValue(novo);
          break;
        }
        case 'M−': {
          const novo = await subtractFromMemory(valorAtual);
          setMemoryValue(novo);
          break;
        }
        default:
          break;
      }
    },
    [result, preview, expression, memoryValue]
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.screenBg }]}>
      <RNStatusBar
        barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.screenBg}
      />

      <View style={styles.container}>
        {/* Cabeçalho Original e Moderno */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>Calculadora</Text>
            <View style={[styles.dot, { backgroundColor: theme.headerTint }]} />
          </View>

          <View style={styles.headerActions}>
            {/* Botão de Alternar Tema (Claro / Escuro) */}
            <Pressable
              onPress={toggleTheme}
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: theme.surface, borderColor: theme.surfaceBorder },
                pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
              ]}
              accessibilityLabel="Alternar tema claro e escuro"
            >
              <Text style={styles.themeIcon}>{themeMode === 'dark' ? '☀️' : '🌙'}</Text>
            </Pressable>

            {/* Botão de Histórico com Contador */}
            <Pressable
              onPress={() => navigation.navigate('Historico', { historico: history, themeMode })}
              style={({ pressed }) => [
                styles.historyBtn,
                { backgroundColor: theme.surface, borderColor: theme.surfaceBorder },
                pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
              ]}
              accessibilityLabel="Ver histórico de cálculos"
            >
              <Text style={[styles.historyBtnText, { color: theme.headerTint }]}>Histórico</Text>
              {history.length > 0 && (
                <View style={[styles.badge, { backgroundColor: theme.headerTint }]}>
                  <Text style={styles.badgeText}>{history.length}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Visor Original Moderno */}
        <Display
          expression={expression}
          result={result}
          preview={preview}
          memoryValue={memoryValue}
          theme={theme}
        />

        {/* Teclado da Calculadora */}
        <Teclado
          onPress={handlePress}
          onMemoryPress={handleMemoryPress}
          theme={theme}
          memoryActive={memoryValue !== 0}
        />

        {/* Créditos dos Integrantes do Grupo */}
        <View style={styles.footer}>
          <Text style={[styles.footerTitle, { color: theme.textMuted }]}>
            Desenvolvido por:
          </Text>
          <Text style={[styles.footerNames, { color: theme.textSecondary }]}>
            Gabriel Antunes • João Pedro Santos • Luís Gustavo • Rafael • Túlio
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 4,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    fontSize: 16,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.2,
    gap: 6,
  },
  historyBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  footerTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  footerNames: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
});
