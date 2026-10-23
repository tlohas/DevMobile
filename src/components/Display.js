import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Display({
  expression = '',
  result = '',
  preview = '',
  memoryValue = 0,
  theme,
}) {
  const isError = result === 'Erro' || result === 'Indefinido';
  const hasExpression = Boolean(expression && expression.trim());
  const hasResult = Boolean(result && result.trim());
  const hasPreview = Boolean(preview && preview.trim() && !hasResult && !isError);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.displayBg,
          borderColor: theme.displayBorder,
          shadowColor: theme.statusBarStyle === 'light' ? '#38bdf8' : '#0284c7',
        },
      ]}
    >
      {/* Barra superior do visor (indicador de memória) */}
      <View style={styles.topBar}>
        {memoryValue !== 0 ? (
          <View style={[styles.memoryBadge, { backgroundColor: theme.memoryBadgeBg }]}>
            <Text style={[styles.memoryBadgeText, { color: theme.memoryBadgeText }]}>
              M = {memoryValue}
            </Text>
          </View>
        ) : (
          <View style={styles.memoryPlaceholder} />
        )}
      </View>

      {/* Linha da Expressão */}
      <View style={styles.exprWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={[styles.exprText, { color: theme.exprText }]}>
            {hasExpression ? expression : ' '}
          </Text>
        </ScrollView>
      </View>

      {/* Linha do Resultado / Preview Principal */}
      <View style={styles.resultWrapper}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.4}
          style={[
            styles.resultText,
            { color: theme.resultText },
            isError && { color: theme.errorText },
            hasPreview && { color: theme.previewText, opacity: 0.9 },
          ]}
        >
          {hasResult ? result : hasPreview ? `= ${preview}` : hasExpression ? '' : '0'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    minHeight: 140,
    justifyContent: 'space-between',
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 22,
  },
  memoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },
  memoryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  memoryPlaceholder: {
    height: 14,
  },
  exprWrapper: {
    width: '100%',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  exprText: {
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: 0.5,
    textAlign: 'right',
  },
  resultWrapper: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'right',
  },
});
