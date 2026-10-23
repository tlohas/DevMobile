import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
  StatusBar as RNStatusBar,
} from 'react-native';
import { carregar, limpar } from '../storage/historico';
import { carregarTema } from '../storage/theme';
import { THEMES } from '../theme/colors';

export default function HistoricoScreen({ route, navigation }) {
  const [lista, setLista] = useState(route.params?.historico || []);
  const [themeMode, setThemeMode] = useState(route.params?.themeMode || 'dark');

  const theme = THEMES[themeMode] || THEMES.dark;

  // Carrega histórico e tema do storage ao entrar
  useEffect(() => {
    carregar().then((dados) => {
      if (Array.isArray(dados)) {
        setLista(dados);
      }
    });

    carregarTema().then((t) => {
      setThemeMode(t);
    });
  }, []);

  // Limpa todo o histórico
  const aoLimpar = async () => {
    await limpar();
    setLista([]);
  };

  // Diálogo de confirmação para limpar
  const confirmarLimpeza = () => {
    if (lista.length === 0) return;

    Alert.alert(
      'Limpar Histórico',
      'Tem certeza de que deseja apagar todos os cálculos salvos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: aoLimpar },
      ]
    );
  };

  // Carrega cálculo de volta para a tela inicial
  const reutilizarConta = (item) => {
    const expr = item.conta || item.expression;
    const res = item.resultado || item.result;
    navigation.navigate('Home', { loadExpression: expr, loadResult: res });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.screenBg }]}>
      <RNStatusBar
        barStyle={theme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.screenBg}
      />

      <View style={styles.container}>
        {lista.length === 0 ? (
          // Estado Vazio
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: theme.surface }]}>
              <Text style={styles.emptyIcon}>📜</Text>
            </View>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              Nenhum cálculo registrado
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Seus cálculos realizados aparecerão aqui e serão mantidos mesmo se você fechar o aplicativo.
            </Text>
          </View>
        ) : (
          // Lista de Histórico com FlatList
          <FlatList
            data={lista}
            keyExtractor={(item) => String(item.id || Math.random())}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const expr = item.conta || item.expression || '0';
              const res = item.resultado || item.result || '0';
              const dataFormatada = item.timestamp
                ? new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';

              return (
                <Pressable
                  onPress={() => reutilizarConta(item)}
                  style={({ pressed }) => [
                    styles.card,
                    {
                      backgroundColor: theme.cardBg,
                      borderColor: theme.cardBorder,
                    },
                    pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTime, { color: theme.cardTime }]}>
                      {dataFormatada ? `Hoje às ${dataFormatada}` : 'Cálculo recente'}
                    </Text>
                    <Text style={[styles.cardAction, { color: theme.headerTint }]}>
                      Tocar para usar ↗
                    </Text>
                  </View>

                  <View style={styles.cardBody}>
                    <Text
                      style={[styles.cardExpr, { color: theme.textSecondary }]}
                      numberOfLines={2}
                    >
                      {expr}
                    </Text>
                    <Text style={[styles.cardRes, { color: theme.headerTint }]} numberOfLines={1}>
                      = {res}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          />
        )}

        {/* Botão de Limpar Histórico */}
        {lista.length > 0 && (
          <Pressable
            onPress={confirmarLimpeza}
            style={({ pressed }) => [
              styles.btnClear,
              {
                backgroundColor: theme.btnClearBg,
                borderColor: theme.btnClearBorder,
              },
              pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] },
            ]}
          >
            <Text style={[styles.btnClearText, { color: theme.btnClearText }]}>
              🗑️ Limpar Histórico
            </Text>
          </Pressable>
        )}
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 18,
    marginVertical: 6,
    borderWidth: 1.2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardAction: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardBody: {
    marginTop: 2,
  },
  cardExpr: {
    fontSize: 17,
    fontWeight: '400',
    marginBottom: 4,
  },
  cardRes: {
    fontSize: 24,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  btnClear: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    marginTop: 8,
  },
  btnClearText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
