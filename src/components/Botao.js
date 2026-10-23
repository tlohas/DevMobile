import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function Botao({
  label,
  onPress,
  tipo = 'number', // 'number' | 'operator' | 'function' | 'equals' | 'memory'
  theme,
  style,
  textStyle,
  disabled = false,
}) {
  // Configuração de cores com base no tipo e no tema
  const getButtonColors = () => {
    switch (tipo) {
      case 'operator':
        return {
          bg: theme.btnOperatorBg,
          border: theme.btnOperatorBorder,
          text: theme.btnOperatorText,
          pressedBg: theme.btnOperatorPressedBg,
          pressedText: '#ffffff',
        };
      case 'equals':
        return {
          bg: theme.btnEqualsBg,
          border: theme.btnEqualsBorder,
          text: theme.btnEqualsText,
          pressedBg: theme.btnPressedBg,
          pressedText: theme.btnPressedText,
        };
      case 'function':
        return {
          bg: theme.btnFunctionBg,
          border: theme.btnFunctionBorder,
          text: theme.btnFunctionText,
          pressedBg: theme.btnPressedBg,
          pressedText: theme.btnPressedText,
        };
      case 'memory':
        return {
          bg: theme.memoryBtnBg,
          border: 'transparent',
          text: theme.memoryBtnText,
          pressedBg: theme.btnPressedBg,
          pressedText: theme.btnPressedText,
        };
      case 'number':
      default:
        return {
          bg: theme.btnNumberBg,
          border: theme.btnNumberBorder,
          text: theme.btnNumberText,
          pressedBg: theme.btnPressedBg,
          pressedText: theme.btnPressedText,
        };
    }
  };

  const colors = getButtonColors();

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onPress && onPress(label)}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: pressed ? colors.pressedBg : colors.bg,
          borderColor: colors.border,
        },
        tipo === 'memory' && styles.memoryBase,
        pressed && styles.pressedScale,
        disabled && styles.disabled,
        style,
      ]}
    >
      {({ pressed }) => (
        <Text
          style={[
            styles.label,
            { color: pressed ? colors.pressedText : colors.text },
            tipo === 'operator' && styles.operatorLabel,
            tipo === 'equals' && styles.equalsLabel,
            tipo === 'memory' && styles.memoryLabel,
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    height: 64,
    margin: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    // Sombra suave para aspecto moderno
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  memoryBase: {
    height: 38,
    borderRadius: 12,
    marginHorizontal: 3,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  pressedScale: {
    transform: [{ scale: 0.93 }],
    elevation: 0,
    shadowOpacity: 0,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  operatorLabel: {
    fontSize: 26,
    fontWeight: '700',
  },
  equalsLabel: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  memoryLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
