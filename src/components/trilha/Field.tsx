import React, { forwardRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Trilha } from "@/constants/colors";

interface Props extends TextInputProps {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  hint?: string; // texto à direita do rótulo
  secret?: boolean; // campo de senha com botão de mostrar/ocultar
}

const isWeb = Platform.OS === "web";

// Campo de texto do tema TrilhaRun: rótulo + caixa com ícone (+ olho para senha).
// forwardRef deixa a tela segurar o campo (ex.: senhaRef.current?.focus()).
//
// Aparência:
//  - Web: campo branco com borda clara, para contrastar com o cartão bege do formulário.
//  - Celular: campo bege sobre o fundo creme da tela (design original).
//  - Selecionado (Web e celular): borda verde, fundo branco e ícone verde.
export const Field = forwardRef<TextInput, Props>(function Field(
  { label, icon, hint, secret, onFocus, onBlur, ...input },
  ref
) {
  const [visible, setVisible] = useState(false); // senha visível?
  const [focused, setFocused] = useState(false); // campo selecionado?

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>

      <View style={[styles.box, isWeb && styles.boxWeb, focused && styles.boxFocused]}>
        <Ionicons name={icon} size={18} color={focused ? Trilha.primary : Trilha.muted} />
        <TextInput
          ref={ref}
          placeholderTextColor={Trilha.placeholder}
          {...input}
          // Atualiza o destaque e repassa o evento para quem usa o Field.
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          secureTextEntry={secret ? !visible : input.secureTextEntry}
          style={styles.input}
        />
        {secret ? (
          <Pressable onPress={() => setVisible((v) => !v)} hitSlop={10}>
            <Ionicons
              name={visible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Trilha.muted}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
});

// No navegador, remove o contorno padrão do <input>: o destaque fica na caixa inteira.
const webInputReset = isWeb ? ({ outlineStyle: "none" } as TextStyle) : null;

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  labelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: Trilha.text,
    textTransform: "uppercase",
  },
  hint: { fontSize: 11, color: Trilha.muted, fontStyle: "italic" },
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Trilha.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    // A borda sempre existe (invisível no celular) para o campo não "pular" ao ganhar foco.
    borderWidth: 2,
    borderColor: Trilha.transparent,
  },
  boxWeb: { backgroundColor: Trilha.white, borderColor: Trilha.line },
  boxFocused: { backgroundColor: Trilha.white, borderColor: Trilha.primary },
  input: { flex: 1, fontSize: 14, color: Trilha.text, height: "100%", ...webInputReset },
});
