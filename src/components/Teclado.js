import React from 'react';
import { View, StyleSheet } from 'react-native';
import Botao from './Botao';

const MEMORY_KEYS = ['MC', 'MR', 'M−', 'M+'];

const LINHAS = [
  [
    { label: 'C', tipo: 'function' },
    { label: '⌫', tipo: 'function' },
    { label: '%', tipo: 'function' },
    { label: '÷', tipo: 'operator' },
  ],
  [
    { label: '7', tipo: 'number' },
    { label: '8', tipo: 'number' },
    { label: '9', tipo: 'number' },
    { label: '×', tipo: 'operator' },
  ],
  [
    { label: '4', tipo: 'number' },
    { label: '5', tipo: 'number' },
    { label: '6', tipo: 'number' },
    { label: '−', tipo: 'operator' },
  ],
  [
    { label: '1', tipo: 'number' },
    { label: '2', tipo: 'number' },
    { label: '3', tipo: 'number' },
    { label: '+', tipo: 'operator' },
  ],
  [
    { label: '+/-', tipo: 'function' },
    { label: '0', tipo: 'number' },
    { label: '.', tipo: 'number' },
    { label: '=', tipo: 'equals' },
  ],
];

export default function Teclado({ onPress, onMemoryPress, theme, memoryActive = false }) {
  return (
    <View style={styles.container}>
      {/* Barra de Funções de Memória */}
      <View style={[styles.memoryBar, { backgroundColor: theme.memoryBarBg }]}>
        {MEMORY_KEYS.map((key) => (
          <Botao
            key={key}
            label={key}
            tipo="memory"
            theme={theme}
            onPress={onMemoryPress}
            disabled={key === 'MC' || key === 'MR' ? !memoryActive : false}
          />
        ))}
      </View>

      {/* Grid Principal de Teclas */}
      <View style={styles.grid}>
        {LINHAS.map((linha, indexLinha) => (
          <View key={`linha-${indexLinha}`} style={styles.linha}>
            {linha.map((item) => (
              <Botao
                key={item.label}
                label={item.label}
                tipo={item.tipo}
                theme={theme}
                onPress={onPress}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    width: '100%',
  },
  memoryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 14,
    marginBottom: 6,
    marginHorizontal: 5,
  },
  grid: {
    width: '100%',
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
});
