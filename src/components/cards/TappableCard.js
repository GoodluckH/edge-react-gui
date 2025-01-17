// @flow

import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import { memo } from '../../types/reactHooks.js'
import { type Theme, cacheStyles, useTheme } from '../services/ThemeContext.js'
import { Card } from './Card'

/**
 * An (optionally) tappable card that displays its children in up to two left/right
 * sections. If the card is configured to be tappable, a chevron is drawn on the
 * right side of the card.
 */
const TappableCardComponent = ({
  children,
  nonTappable = false,
  onPress
}: {
  children: React.Node,
  nonTappable?: boolean,
  onPress?: any => Promise<void> | void
}) => {
  const theme = useTheme()
  const styles = getStyles(theme)

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Card>
          <View style={styles.cardContainer}>
            <View style={styles.spacedContainer}>{children}</View>
            {nonTappable ? null : <FontAwesome5 name="chevron-right" size={theme.rem(1.25)} color={theme.iconTappable} style={styles.chevron} />}
          </View>
        </Card>
      </TouchableOpacity>
    </View>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  container: {
    margin: theme.rem(0.5)
  },
  cardContainer: {
    flexDirection: 'row'
  },
  spacedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1
  },
  chevron: {
    alignSelf: 'center',
    marginLeft: theme.rem(1.25)
  }
}))

export const TappableCard = memo(TappableCardComponent)
