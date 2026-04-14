import { Component, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IllustrationSticker } from '@/shared/ui/IllustrationSticker';
import { colors, fonts, fontSize, lineHeight, spacing } from '@/shared/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isRetrying: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, isRetrying: false };

  static getDerivedStateFromError(): State {
    return { hasError: true, isRetrying: false };
  }

  handleRetry = () => {
    this.setState({ isRetrying: true });
    setTimeout(() => this.setState({ hasError: false, isRetrying: false }), 600);
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.illustration}>
            <IllustrationSticker />
          </View>
          <Text style={styles.title}>Что-то пошло не так</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleRetry}
            activeOpacity={0.5}
            disabled={this.state.isRetrying}
          >
            {this.state.isRetrying ? (
              <ActivityIndicator color={colors.text.inverse} />
            ) : (
              <Text style={styles.buttonLabel}>Повторить</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing['2xl'],
  },
  illustration: {
    marginBottom: spacing['3xl'],
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.title,
    lineHeight: lineHeight.lg,
    color: colors.text.primary,
    textAlign: 'center',
    fontVariant: ['lining-nums', 'tabular-nums'],
    marginBottom: spacing.lg,
  },
  button: {
    width: 361,
    height: 42,
    backgroundColor: colors.actionButton,
    borderRadius: 14,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontFamily: fonts.semibold,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    color: colors.text.inverse,
    fontVariant: ['lining-nums', 'tabular-nums'],
  },
});
