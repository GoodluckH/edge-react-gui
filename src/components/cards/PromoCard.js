// @flow

import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { useHandler } from '../../hooks/useHandler.js'
import { useWindowSize } from '../../hooks/useWindowSize.js'
import { type Theme, cacheStyles, getTheme } from '../services/ThemeContext.js'
import { EdgeText } from '../themed/EdgeText.js'

type Props = {
  message: string,
  iconUri?: string,
  animationValue: Animated.SharedValue<number>,
  onPress: () => void,
  onClose: () => void
}

export const PromoCard = (props: Props) => {
  const { message, iconUri, onPress, onClose, animationValue } = props
  const theme = getTheme()
  const styles = getStyles(theme)

  const pressed = useSharedValue(0)

  const handlePressIn = useHandler(() => (pressed.value = 1))
  const handlePressOut = useHandler(() => (pressed.value = 0))
  const { width } = useWindowSize()
  const sharedWidth = useSharedValue(width)

  const borderAnimatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(!pressed.value ? theme.defaultBorderColor : theme.cardBorderColor, { duration: 200 }),

      transform: [
        { perspective: 650 },
        { translateX: interpolate(animationValue.value, [-1, 1], [sharedWidth.value / 2, -sharedWidth.value / 2]) },
        { rotateY: `${interpolate(animationValue.value, [-1, 1], [-60, 60])}deg` },
        { translateX: interpolate(animationValue.value, [-1, 1], [-sharedWidth.value / 2, sharedWidth.value / 2]) }
      ]
    }
  })

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(interpolate(animationValue.value, [-1, 0, 1], [0, 1, 0]), { duration: 10 })
    }
  })

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1} onPress={onPress}>
      <Animated.View style={[styles.container, borderAnimatedStyle]}>
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          {iconUri != null ? <FastImage resizeMode="contain" source={{ uri: iconUri }} style={styles.icon} /> : null}
          <EdgeText numberOfLines={0} style={styles.text}>
            {message}
          </EdgeText>
          <TouchableOpacity onPress={onClose}>
            <AntDesignIcon name="close" color={theme.iconTappable} size={theme.rem(1)} style={styles.close} />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: theme.thinLineWidth,
    borderRadius: theme.rem(0.25),
    padding: theme.rem(0.5),
    height: '100%'
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: theme.rem(2),
    height: theme.rem(2),
    margin: theme.rem(0.5)
  },
  text: {
    flex: 1,
    margin: theme.rem(0.5)
  },
  close: {
    padding: theme.rem(0.5)
  }
}))
