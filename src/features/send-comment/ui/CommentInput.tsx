import { useRef } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SendIcon } from '@/shared/ui/icons/PostActionIcons';
import { activeOpacity, colors, fonts, fontSize, lineHeight, radius, spacing } from '@/shared/theme';

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
        activeOpacity={activeOpacity}
      >
        {isSending ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <SendIcon />
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
