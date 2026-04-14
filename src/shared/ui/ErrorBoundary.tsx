import { Component, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IllustrationSticker } from '@/shared/ui/IllustrationSticker';
import { stateStyles } from '@/shared/ui/stateStyles';
import { activeOpacity, colors } from '@/shared/theme';

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
          <View style={stateStyles.illustration}>
            <IllustrationSticker />
          </View>
          <Text style={stateStyles.title}>Что-то пошло не так</Text>
          <TouchableOpacity
            style={stateStyles.button}
            onPress={this.handleRetry}
            activeOpacity={activeOpacity}
            disabled={this.state.isRetrying}
          >
            {this.state.isRetrying ? (
              <ActivityIndicator color={colors.text.inverse} />
            ) : (
              <Text style={stateStyles.buttonLabel}>Повторить</Text>
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
    ...stateStyles.container,
    backgroundColor: colors.background,
  },
});
