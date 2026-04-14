import { Text, View } from 'react-native';
import { IllustrationSticker } from '@/shared/ui/IllustrationSticker';
import { stateStyles as styles } from '@/shared/ui/stateStyles';

interface EmptyStateProps {
  title?: string;
}

export function EmptyState({ title = 'По вашему запросу ничего не найдено' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        <IllustrationSticker />
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
