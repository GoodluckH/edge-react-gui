// @flow

import type { EdgeLobby } from 'edge-core-js'
import * as React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { isIPhoneX } from 'react-native-safe-area-view'
import { sprintf } from 'sprintf-js'

import { lobbyLogin } from '../../actions/EdgeLoginActions.js'
import s from '../../locales/strings.js'
import { PrimaryButton } from '../../modules/UI/components/Buttons/PrimaryButton.ui.js'
import { SecondaryButton } from '../../modules/UI/components/Buttons/SecondaryButton.ui.js'
import { config } from '../../theme/appConfig.js'
import { THEME } from '../../theme/variables/airbitz'
import { connect } from '../../types/reactRedux.js'
import { type NavigationProp } from '../../types/routerTypes.js'
import { SceneWrapper } from '../common/SceneWrapper.js'
import { MainButton } from '../themed/MainButton.js'
import type { Theme, ThemeProps } from '../services/ThemeContext'
import { cacheStyles, withTheme } from '../services/ThemeContext'


type OwnProps = {
  navigation: NavigationProp<'edgeLogin'>
}
type StateProps = {
  error: string | null,
  isProcessing: boolean,
  lobby: EdgeLobby | null
}

type DispatchProps = {
  accept: () => void
}

type Props = StateProps & DispatchProps & OwnProps & ThemeProps

export class EdgeLoginSceneComponent extends React.PureComponent<Props> {
  renderBody() {

    let message = this.props.error
    const { theme } = this.props
    const styles = getStyles(theme)

    if (!this.props.error) {
      message = sprintf(s.strings.access_wallet_description, config.appName)
    }
    if (!this.props.lobby && !this.props.error) {
      throw new Error('Not normal expected behavior')
    }
    if (this.props.lobby && this.props.lobby.loginRequest && this.props.lobby.loginRequest.appId === '') {
      message = sprintf(s.strings.edge_description_warning, this.props.lobby.loginRequest.displayName)
    }
    return (
      <View style={styles.body}>
        <Text style={styles.bodyText}>{message}</Text>
      </View>
    )
  }

  renderButtons() {
    const { navigation } = this.props
    const handleDecline = () => navigation.goBack()
    const { theme } = this.props
    const styles = getStyles(theme)
    if (this.props.isProcessing) {
      return (
        <View style={styles.buttonsProcessing}>
          <ActivityIndicator color={THEME.COLORS.ACCENT_MINT} />
        </View>
      )
    }
    if (this.props.error) {
      return (
          <View style={styles.buttons}>
            <MainButton label={s.strings.string_cancel_cap} onPress={this.props.accept} type="secondary" onPress={handleDecline}/>
          </View>
      )
    }
    return (
        <View style={styles.buttons}>
          <MainButton marginRem={[1, 0, 1, 0]} label={s.strings.accept_button_text} onPress={this.props.accept} />
          <MainButton label={s.strings.string_cancel_cap} type="secondary" onPress={handleDecline} />
        </View>
    )
  }

  renderImage() {
    const { theme } = this.props
    const styles = getStyles(theme)
    if (this.props.lobby && this.props.lobby.loginRequest && this.props.lobby.loginRequest.displayImageUrl) {
      return <FastImage style={styles.image} resizeMode="contain" source={{ uri: this.props.lobby.loginRequest.displayImageUrl }} />
    }
    return null
  }

  renderHeader() {
    let title = ''
    const { theme } = this.props
    const styles = getStyles(theme)
    if (this.props.lobby && this.props.lobby.loginRequest) {
      title = this.props.lobby.loginRequest.displayName ? this.props.lobby.loginRequest.displayName : ''
    }
    if (this.props.lobby) {
      return (
        <View style={styles.header}>
          <View style={styles.headerTopShim} />
          <View style={styles.headerImageContainer}>{this.renderImage()}</View>
          <View style={styles.headerTopShim} />
          <View style={styles.headerTextRow}>
            <Text style={styles.bodyText}>{title}</Text>
          </View>
          <View style={styles.headerBottomShim} />
        </View>
      )
    }
    return <View style={styles.header} />
  }

  render() {
    const { theme } = this.props
    const styles = getStyles(theme)
    if (!this.props.lobby && !this.props.error) {
      return (
        <SceneWrapper background="theme">
          <View style={styles.spinnerContainer}>
            <Text style={styles.loadingTextBody}>{s.strings.edge_login_fetching}</Text>
            <ActivityIndicator color={THEME.COLORS.ACCENT_MINT} />
          </View>
        </SceneWrapper>
      )
    }
    return (
      <SceneWrapper background="theme">
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderButtons()}
      </SceneWrapper>
    )
  }
}

const getStyles = cacheStyles((theme: Theme) => ({
  header: {
    position: 'relative',
    flex: 3,
    flexDirection: 'column'
  },
  headerTopShim: {
    flex: 2
  },
  headerImageContainer: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  image: {
    width: 80,
    height: 80
  },
  headerTextRow: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  headerBottomShim: {
    flex: 1
  },
  body: {
    position: 'relative',
    flex: 4
  },
  buttonContainer: {
    position: 'relative',
    flex: 3,
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-end'
  },
  buttons: {
    margin: theme.rem(1),
  },
  buttonsProcessing: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spinnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bodyText: {
    marginRight: '5%',
    marginLeft: '5%',
    color: THEME.COLORS.GRAY_1,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: THEME.FONTS.DEFAULT
  },
  loadingTextBody: {
    color: THEME.COLORS.GRAY_1,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: THEME.FONTS.DEFAULT,
    marginBottom: 20
  },
  cancel: {
    flex: 1,
    backgroundColor: THEME.COLORS.GRAY_2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  cancelSolo: {
    flex: 1,
    backgroundColor: THEME.COLORS.GRAY_2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  submit: {
    flex: 1,
    marginLeft: '1.5%',
    backgroundColor: THEME.COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  }
}))

export const EdgeLoginScene = connect<StateProps, DispatchProps, OwnProps>(
  state => ({
    error: state.core.edgeLogin.error,
    isProcessing: state.core.edgeLogin.isProcessing,
    lobby: state.core.edgeLogin.lobby
  }),
  dispatch => ({
    accept() {
      dispatch(lobbyLogin())
    }
  })
)(withTheme(EdgeLoginSceneComponent))
