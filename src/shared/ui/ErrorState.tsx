import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { IllustrationSticker } from '@/shared/ui/IllustrationSticker';
import { stateStyles as styles } from '@/shared/ui/stateStyles';
import { colors } from '@/shared/theme';

interface ErrorStateProps {
  title?: string;
  buttonLabel?: string;
  isLoading?: boolean;
  onPress?: () => void;
}

export function ErrorState({
  title = 'Не удалось загрузить публикацию',
  buttonLabel = 'Повторить',
  isLoading,
  onPress,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        <IllustrationSticker />
      </View>
      <Text style={styles.title}>{title}</Text>
      {onPress && (
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          activeOpacity={0.5}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.text.inverse} />
          ) : (
            <Text style={styles.buttonLabel}>{buttonLabel}</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
