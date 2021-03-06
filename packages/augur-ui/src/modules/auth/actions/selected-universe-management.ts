import { windowRef } from "utils/window-ref";
import { getNetworkId } from "modules/contracts/actions/contractCalls";
import { WindowApp } from "modules/types";
import { augurSdk } from "services/augursdk";
import { AppStatus } from "modules/app/store/app-status";

export const setSelectedUniverse = (selectedUniverseId: string | null = null) => {
  const { env, loginAccount: { address } } = AppStatus.get();
  const networkId = getNetworkId();
  const Augur = augurSdk.get();
  const defaultUniverseId =
    env.universe ||
    Augur.contracts.universe.address;
    const windowApp = windowRef as WindowApp;
  if (windowApp && windowApp.localStorage) {
    const { localStorage } = windowApp;
    const localAccount = localStorage.getItem(address) || "{}";
    const accountStorage = JSON.parse(localAccount);
    if (accountStorage) {
      localStorage.setItem(
        address,
        JSON.stringify({
          ...accountStorage,
          selectedUniverse: {
            ...accountStorage.selectedUniverse,
            [networkId]: selectedUniverseId || defaultUniverseId
          }
        })
      );
    }
  }
};
