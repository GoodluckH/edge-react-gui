// @flow

import * as React from 'react'
import { Linking } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'

import { hideMessageTweak } from '../../actions/AccountReferralActions.js'
import { linkReferralWithCurrencies } from '../../actions/WalletListActions.js'
import { useWindowSize } from '../../hooks/useWindowSize.js'
import { useCallback, useEffect, useMemo, useState } from '../../types/reactHooks.js'
import { useDispatch, useSelector } from '../../types/reactRedux.js'
import { type AppFlags, type Promotion, getProfile, getPromotions, hasWyreLinkedBank, testProfile } from '../../util/promoHelpers.js'
import { bestOfMessages } from '../../util/ReferralHelpers.js'
import { PromoCard } from '../cards/PromoCard.js'

export const PromoBanner = () => {
  const dispatch = useDispatch()

  const accountMessages = useSelector(state => state.account.referralCache.accountMessages)
  const accountReferral = useSelector(state => state.account.accountReferral)
  const store = useSelector(state => state.core.account.dataStore)

  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [localFlags, setLocalFlags] = useState<AppFlags>({})
  const { width } = useWindowSize()
  // Define user profile
  const profile = useMemo(() => getProfile(), [])

  // Get active promotions
  useEffect(() => {
    let abort = false
    getPromotions().then(promos => {
      if (abort) return
      setPromotions(promos)
    })

    return () => {
      abort = true
    }
  }, [profile])

  // Test for wyreLinkedBank
  useEffect(() => {
    if (localFlags.wyreLinkedBank != null) return
    // let abort = false
    // hasWyreLinkedBank(store).then(bool => {
    //   if (abort) return
    setLocalFlags({ ...localFlags, wyreLinkedBank: true })
    // })
  }, [localFlags])

  // Promo card actions
  const promoCardOnPress = useCallback<(uri: string | void) => void>(uri => {
    if (uri != null) Linking.openURL(uri)
  }, [])
  const promoCardOnClose = useCallback<(id: string) => void>(
    id => {
      setPromotions(promotions.filter(promo => promo.messageId !== id))
    },
    [promotions]
  )

  // Look for active referral promotion
  const referralPromoCard = useMemo(() => {
    const messageSummary = bestOfMessages(accountMessages, accountReferral)
    if (messageSummary == null) return null
    const {
      message: { message, iconUri, uri },
      messageId,
      messageSource
    } = messageSummary

    const referralOnPress = () => {
      if (uri != null) dispatch(linkReferralWithCurrencies(uri))
    }
    const referralOnClose = () => {
      dispatch(hideMessageTweak(messageId, messageSource))
    }

    return { message, iconUri, onPress: referralOnPress, onClose: referralOnClose }
  }, [accountMessages, accountReferral, dispatch])

  // Gather cards
  const promoCards = useMemo(
    () =>
      promotions
        .concat(promotions)
        .filter(promo => Object.keys(promo.appFlags).every(flag => localFlags[flag] === true))
        .filter(promo => promo.message[profile.language] != null)
        .map(promo => {
          console.log('88. promo', promo)
          console.log('89. profile', profile)
          const { imageUrl, body } = promo.message[profile.language]
          return { message: body, iconUri: imageUrl, onPress: () => promoCardOnPress('https://www.edge.app'), onClose: () => promoCardOnClose(promo.messageId) } // TODO: replace website with actual url
        }),
    [localFlags, profile.language, promotions]
  )
  if (referralPromoCard != null) promoCards.push(referralPromoCard)

  // Render
  if (promoCards.length === 0) return null

  // Disable spin and preview if there's only one card to display
  const enabled = promoCards.length !== 1
  const autoFillData = promoCards.length !== 1
  const modeConfig = { parallaxScrollingScale: 0.8, parallaxAdjacentItemScale: 0.75, parallaxScrollingOffset: width / 5 }
  // const modeConfig = { parallaxScrollingScale: 1, parallaxAdjacentItemScale: 0, }

  return (
    <Carousel
      autoPlay={false}
      modeConfig={modeConfig}
      enabled={enabled}
      autoFillData={autoFillData}
      mode="parallax"
      width={width}
      data={promoCards}
      renderItem={({ item, animationValue }) => (
        <PromoCard animationValue={animationValue} message={item.message} iconUri={item.iconUri} onPress={item.onPress} onClose={item.onClose} />
      )}
    />
  )
}
