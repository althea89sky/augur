import type { Augur, Provider } from '@augurproject/sdk';
import { SubscriptionEventName, TXEventName } from '@augurproject/sdk-lite';
import { ZEROX_STATUSES } from 'modules/common/constants';
import {
  handleMarketMigratedLog,
  handleMarketsUpdatedLog,
  handleNewBlockLog,
  handleReportingStateChanged,
  handleSDKReadyEvent,
  handleTradingProceedsClaimedLog,
  handleTxEvents,
  handleUniverseForkedLog,
  handleSDKReadyEvent,
  handleReportingStateChanged,
  handleWarpSyncHashUpdatedLog,
  handleZeroStatusUpdated,
  handleBulkOrdersLog,
  handleLiquidityPoolUpdatedLog,
} from 'modules/events/actions/log-handlers';
import { wrapLogHandler } from 'modules/events/actions/wrap-log-handler';
import type {
  Augur,
  Provider,
} from '@augurproject/sdk';
import { ZEROX_STATUSES } from 'modules/common/constants';

const START_UP_EVENTS = {
  [SubscriptionEventName.SDKReady]: wrapLogHandler(handleSDKReadyEvent),
  [SubscriptionEventName.MarketsUpdated]: wrapLogHandler(
    handleMarketsUpdatedLog
  ),
  [SubscriptionEventName.ZeroXStatusReady]: wrapLogHandler(() =>
    handleZeroStatusUpdated(ZEROX_STATUSES.READY)
  ),
  [SubscriptionEventName.ZeroXStatusStarted]: wrapLogHandler(() =>
    handleZeroStatusUpdated(ZEROX_STATUSES.STARTED)
  ),
  [SubscriptionEventName.ZeroXStatusRestarting]: wrapLogHandler(() =>
    handleZeroStatusUpdated(ZEROX_STATUSES.RESTARTING)
  ),
  [SubscriptionEventName.ZeroXStatusError]: wrapLogHandler((log: any) =>
    handleZeroStatusUpdated(ZEROX_STATUSES.ERROR, log)
  ),
  [SubscriptionEventName.ZeroXStatusSynced]: wrapLogHandler(() =>
    handleZeroStatusUpdated(ZEROX_STATUSES.SYNCED)
  ),
  [SubscriptionEventName.BulkOrderEvent]: wrapLogHandler(handleBulkOrdersLog),
  [SubscriptionEventName.LiquidityPoolUpdated]: wrapLogHandler(
    handleLiquidityPoolUpdatedLog
  ),
};

const EVENTS = {
  [SubscriptionEventName.NewBlock]: wrapLogHandler(handleNewBlockLog),
  [SubscriptionEventName.MarketMigrated]: wrapLogHandler(
    handleMarketMigratedLog
  ),
  [SubscriptionEventName.TradingProceedsClaimed]: wrapLogHandler(
    handleTradingProceedsClaimedLog
  ),
  [SubscriptionEventName.UniverseForked]: wrapLogHandler(
    handleUniverseForkedLog
  ),
  [SubscriptionEventName.ReportingStateChanged]: wrapLogHandler(
    handleReportingStateChanged
  ),
  [SubscriptionEventName.WarpSyncHashUpdated]: wrapLogHandler(
    handleWarpSyncHashUpdatedLog
  ),
  [TXEventName.AwaitingSigning]: wrapLogHandler(handleTxEvents),
  [TXEventName.Success]: wrapLogHandler(handleTxEvents),
  [TXEventName.Pending]: wrapLogHandler(handleTxEvents),
  [TXEventName.Failure]: wrapLogHandler(handleTxEvents),
  [TXEventName.RelayerDown]: wrapLogHandler(handleTxEvents),
  [TXEventName.FeeTooLow]: wrapLogHandler(handleTxEvents),
};

export const listenToUpdates = (augur: Augur<Provider>) =>
  Object.keys(EVENTS).map((eventName) => {
    const eventCallback = EVENTS[eventName];
    augur.on(eventName, (log) => eventCallback(log));
  });

export const listenForStartUpEvents = (augur: Augur<Provider>) =>
  Object.keys(START_UP_EVENTS).map((eventName) => {
    const eventCallback = START_UP_EVENTS[eventName];
    augur.on(eventName, (log) => eventCallback(log));
  });

export const unListenToEvents = (augur: Augur<Provider>) => {
  Object.keys(EVENTS).map((eventName) => {
    augur.off(eventName);
  });
  Object.keys(START_UP_EVENTS).map((eventName) => {
    augur.off(eventName);
  });
};
