// @flow

import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { useWindowSize } from '../../hooks/useWindowSize.js'
import { type Theme, cacheStyles, getTheme } from '../services/ThemeContext.js'
import { EdgeText } from './EdgeText.js'

type Props = {
  message: string,
  iconUri?: string,
  animationValue: number,
  onPress: () => void,
  onClose: () => void
}

export const PromoCard = (props: Props) => {
  const { message, iconUri, onPress, onClose, animationValue } = props
  const theme = getTheme()
  const styles = getStyles(theme)
  // const { width } = useWindowSize()
  // const positionX = useSharedValue(animationValue ?? 0)
  // const sharedWidth = useSharedValue(width)

  // const animatedStyle = useAnimatedStyle(() => ({
  //   transform: [
  //     {
  //       perspective: interpolate(positionX.value, [-1, 0, 1], [850, 0, 850], {
  //         extrapolateLeft: Extrapolation.CLAMP,
  //         extrapolateRight: Extrapolation.CLAMP
  //       })
  //     },
  //     { translateX: -sharedWidth.value / 2 },
  //     {
  //       rotateY: interpolate(positionX.value, [-1, 1], [-60, 60], {
  //         extrapolateLeft: Extrapolation.CLAMP,
  //         extrapolateRight: Extrapolation.CLAMP
  //       })
  //     }
  //   ]
  // }))

  return (
    // <Animated.View animatedStyle={animatedStyle}>
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {iconUri != null ? <FastImage resizeMode="contain" source={{ uri: iconUri }} style={styles.icon} /> : null}
      <EdgeText numberOfLines={0} style={styles.text}>
        {message}
      </EdgeText>
      <TouchableOpacity onPress={onClose}>
        <AntDesignIcon name="close" color={theme.iconTappable} size={theme.rem(1)} style={styles.close} />
      </TouchableOpacity>
    </TouchableOpacity>
    // </Animated.View>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.tileBackground,
    borderColor: theme.lineDivider,
    borderWidth: theme.dividerLineHeight,
    borderRadius: 4,
    padding: theme.rem(0.5),
    height: '100%'
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
