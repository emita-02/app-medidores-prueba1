import { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

export function useSacudida(amplitud = 10) {
  const desplazamiento = useSharedValue(0);

  const estiloSacudida = useAnimatedStyle(() => ({
    transform: [{ translateX: desplazamiento.get() }],
  }));

  function sacudir() {
    desplazamiento.set(
      withSequence(
        withTiming(-amplitud, { duration: 50 }),
        withTiming(amplitud, { duration: 100 }),
        withTiming(-amplitud, { duration: 100 }),
        withTiming(amplitud, { duration: 100 }),
        withTiming(0, { duration: 50 }),
      ),
    );
  }

  return { estiloSacudida, sacudir };
}