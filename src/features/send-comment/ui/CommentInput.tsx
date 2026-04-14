import { useRef } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, fontSize, lineHeight, radius, spacing } from '@/shared/theme';

interface CommentInputProps {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  isSending: boolean;
  paddingBottom: number;
}

export function CommentInput({ value, onChange, onSend, isSending, paddingBottom }: CommentInputProps) {
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    onSend();
    inputRef.current?.blur();
  };

  return (
    <View style={[styles.inputBar, { paddingBottom }]}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Ваш комментарий"
        placeholderTextColor={colors.inputPlaceholder}
        value={value}
        onChangeText={onChange}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        editable={!isSending}
      />
      <TouchableOpacity
        style={[styles.sendBtn, (!value.trim() || isSending) && styles.sendBtnDisabled]}
        onPress={handleSend}
        disabled={!value.trim() || isSending}
        activeOpacity={0.5}
      >
        {isSending ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
            <Path
              d="M7.45244 6.64289C6.17802 6.08991 4.92192 7.45954 5.5811 8.68269L8.11894 13.3958C8.28007 13.6998 8.58037 13.9012 8.92094 13.9451L15.3663 14.7508C15.4908 14.7654 15.586 14.8716 15.586 14.9962C15.586 15.1207 15.4908 15.2269 15.3663 15.2415L8.92094 16.0472C8.58037 16.0911 8.28007 16.2962 8.11894 16.5965L5.5811 21.317C4.92192 22.5401 6.17802 23.9097 7.45244 23.3568L23.6353 16.3438C24.8108 15.8348 24.8108 14.1649 23.6353 13.6558L7.45244 6.64289Z"
              fill={colors.primary}
            />
          </Svg>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: colors.background,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    fontFamily: fonts.medium,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: colors.text.primary,
    fontVariant: ['lining-nums', 'tabular-nums'],
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.3,
  },
});
