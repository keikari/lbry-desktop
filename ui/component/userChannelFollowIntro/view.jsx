// @flow
import React, { useEffect } from 'react';
import ClaimListDiscover from 'component/claimListDiscover';
import * as CS from 'constants/claim_search';
import Nag from 'component/common/nag';
import { parseURI } from 'lbry-redux';
import Button from 'component/button';
import Card from 'component/common/card';
import { AUTO_FOLLOW_CHANNELS, SIMPLE_SITE } from 'config';

type Props = {
  subscribedChannels: Array<Subscription>,
  onContinue: () => void,
  onBack: () => void,
  channelSubscribe: (sub: Subscription) => void,
  homepageData: any,
  prefsReady: boolean,
};

const channelsToSubscribe = AUTO_FOLLOW_CHANNELS.trim()
  .split(' ')
  .filter((x) => x !== '');

function UserChannelFollowIntro(props: Props) {
  const { subscribedChannels, channelSubscribe, onContinue, onBack, homepageData, prefsReady } = props;
  const { PRIMARY_CONTENT_CHANNEL_IDS } = homepageData;
  const followingCount = (subscribedChannels && subscribedChannels.length) || 0;

  // subscribe to lbry
  useEffect(() => {
    if (channelsToSubscribe && channelsToSubscribe.length && prefsReady) {
      const delayedChannelSubscribe = () => {
        channelsToSubscribe.forEach((c) =>
          channelSubscribe({
            channelName: parseURI(c).claimName,
            uri: c,
          })
        );
      };
      setTimeout(delayedChannelSubscribe, 1000);
    }
  }, [prefsReady]);

  return (
    <Card
      title={__('Find channels to follow')}
      subtitle={__(
        'LBRY works better if you find and follow a couple creators you like. You can also block channels you never want to see.'
      )}
      actions={
        <React.Fragment>
          <div className="section__actions--between">
            <Button button="secondary" onClick={onBack} label={__('Back')} />
            <Button
              button={subscribedChannels.length < 1 ? 'alt' : 'primary'}
              onClick={onContinue}
              label={subscribedChannels.length < 1 ? __('Skip') : __('Continue')}
            />
          </div>
          <div className="section__body">
            <ClaimListDiscover
              defaultOrderBy={CS.ORDER_BY_TOP}
              defaultFreshness={CS.FRESH_ALL}
              claimType="channel"
              claimIds={SIMPLE_SITE ? undefined : PRIMARY_CONTENT_CHANNEL_IDS}
              defaultTags={followingCount > 3 ? CS.TAGS_FOLLOWED : undefined}
            />
            {followingCount > 0 && (
              <Nag
                type="helpful"
                message={
                  followingCount === 1
                    ? __('Nice! You are currently following %followingCount% creator', { followingCount })
                    : __('Nice! You are currently following %followingCount% creators', { followingCount })
                }
                actionText={__('Continue')}
                onClick={onContinue}
              />
            )}
          </div>
        </React.Fragment>
      }
    />
  );
}

export default UserChannelFollowIntro;
