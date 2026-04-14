import { useEffect, useRef, useState } from 'react';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const SLIDE = 14;
const DURATION = 160;

export function useCountAnimation(count: number) {
  const [shownCount, setShownCount] = useState(count);
  const [nextCount, setNextCount] = useState(count);
  const pendingCount = useRef(count);
  const isFirst = useRef(true);

  const outY = useSharedValue(0);
  const outOpacity = useSharedValue(1);
  const inY = useSharedValue(SLIDE);
  const inOpacity = useSharedValue(0);

  const finishSlide = () => {
    setShownCount(pendingCount.current);
    outY.value = 0;
    outOpacity.value = 1;
    inY.value = SLIDE;
    inOpacity.value = 0;
  };

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    pendingCount.current = count;
    setNextCount(count);

    outY.value = withTiming(-SLIDE, { duration: DURATION });
    outOpacity.value = withTiming(0, { duration: DURATION });
    inY.value = SLIDE;
    inOpacity.value = 0;
    inY.value = withTiming(0, { duration: DURATION });
    inOpacity.value = withTiming(1, { duration: DURATION }, (done) => {
      if (done) runOnJS(finishSlide)();
    });
  }, [count]);

  const outStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: outY.value }],
    opacity: outOpacity.value,
  }));

  const inStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: inY.value }],
    opacity: inOpacity.value,
  }));

  return { shownCount, nextCount, outStyle, inStyle };
}
