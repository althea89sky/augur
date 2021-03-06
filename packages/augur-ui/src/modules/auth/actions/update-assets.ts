import { NodeStyleCallback } from 'modules/types';
import {
  getEthBalance,
  getDaiBalance,
  getRepBalance,
  getLegacyRepBalance,
  loadAccountData_exchangeRates,
} from 'modules/contracts/actions/contractCalls';
import { createBigNumber } from 'utils/create-big-number';
import { FIVE, ETHER } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';
import { addedDaiEvent } from 'services/analytics/helpers';
import { addEthIncreaseAlert } from 'modules/alerts/actions/alerts';
import { formatAttoDai } from 'utils/format-number';

export const updateAssets = async (initialLogin: boolean = false,) => {
  const {
    loginAccount: {
      address,
      meta,
      balances: {
        signerBalances: { eth },
      },
    },
  } = AppStatus.get();
  const nonSafeWallet = await meta.signer.getAddress();
  const values = await loadAccountData_exchangeRates(nonSafeWallet);

  updateBalances(address, nonSafeWallet, values, initialLogin);
};

function updateBalances(
  address: string,
  nonSafeWallet: string,
  values: any,
  initialLogin: boolean,
) {
  const {
    loginAccount: { balances },
    universe: { id: universe },
  } = AppStatus.get();

  const {
    attoDAIperREP,
    attoDAIperETH,
    attoDAIperUSDT,
    attoDAIperUSDC,
    signerETH,
    signerDAI,
    signerREP,
    signerUSDT,
    signerUSDC,
    signerLegacyREP,
    walletETH,
    walletDAI,
    walletREP,
    walletLegacyREP,
  } = values;
  const dai2Eth = formatAttoDai(attoDAIperETH);
  AppStatus.actions.setEthToDaiRate(dai2Eth);
  AppStatus.actions.setRepToDaiRate(formatAttoDai(attoDAIperREP));
  AppStatus.actions.setUsdcToDaiRate(formatAttoDai(attoDAIperUSDT));
  AppStatus.actions.setUsdtToDaiRate(formatAttoDai(attoDAIperUSDC));

  const daiBalance = String(createBigNumber(String(signerDAI)).dividedBy(ETHER));
  const signerEthBalance = String(
    createBigNumber(String(signerETH)).dividedBy(ETHER)
  );
  addedDaiEvent(daiBalance);
  AppStatus.actions.updateLoginAccount({
    balances: {
      attoRep: String(signerREP),
      rep: String(createBigNumber(signerREP).dividedBy(ETHER)),
      dai: daiBalance,
      eth: String(createBigNumber(String(signerETH)).dividedBy(ETHER)),
      legacyAttoRep: String(signerLegacyREP),
      legacyRep: String(
        createBigNumber(String(signerLegacyREP)).dividedBy(ETHER)
      ),
      signerBalances: {
        eth: signerEthBalance,
        usdt: String(createBigNumber(String(signerUSDT)).dividedBy(10**6)),
        usdc: String(createBigNumber(String(signerUSDC)).dividedBy(10**6)),
        dai: String(createBigNumber(String(signerDAI)).dividedBy(ETHER)),
        rep: String(createBigNumber(String(signerREP)).dividedBy(ETHER)),
        legacyRep: String(
          createBigNumber(String(signerLegacyREP)).dividedBy(ETHER)
        ),
      },
    },
  });

  addedDaiEvent(daiBalance);
  return {
    rep: String(createBigNumber(signerREP).dividedBy(ETHER)),
    dai: daiBalance,
    eth: String(createBigNumber(String(signerETH)).dividedBy(ETHER))
  };
}
