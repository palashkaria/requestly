import { onValue } from "firebase/database";
import { getNodeRef } from "../../actions/FirebaseActions";
import { actions } from "../../store";
import APP_CONSTANTS from "config/constants";
import { isLocalStoragePresent } from "utils/AppUtils";
import { checkTimestampAndSync } from "utils/syncing/SyncUtils";
import _ from "lodash";
import Logger from "lib/logger";

export const resetSyncDebounceTimerStart = () =>
  (window.syncDebounceTimerStart = Date.now());
resetSyncDebounceTimerStart();
const waitPeriod = 5000; // allow bulk sync calls in this time

const animateSyncIcon = () => {
  try {
    if (document.getElementById("sync-icon")) {
      document.getElementById("sync-icon").style.animation =
        "1s rotate infinite linear";
      setTimeout(() => {
        document.getElementById("sync-icon").style.removeProperty("animation");
      }, 2500);
    }
  } catch (_e) {
    Logger.error(_e);
  }
};

const doSync = (uid, appMode, dispatch) => {
  checkTimestampAndSync(uid, appMode).then(() => {
    // Refresh Rules
    dispatch(actions.updateRefreshPendingStatus({ type: "rules" }));
    // Refresh Session Recording Config
    dispatch(
      actions.updateRefreshPendingStatus({
        type: "sessionRecordingConfig",
      })
    );
  });
};
const doSyncDebounced = _.debounce(doSync, 5000);

const syncingNodeListener = (dispatch, syncTarget, uid, team_id, appMode) => {
  try {
    let syncNodeRef;
    if (syncTarget === "teamSync") {
      syncNodeRef = getNodeRef([
        syncTarget,
        team_id,
        "metadata",
        APP_CONSTANTS.LAST_SYNC_TIMESTAMP,
      ]);
    } else if (syncTarget === "sync") {
      syncNodeRef = getNodeRef([
        syncTarget,
        uid,
        "metadata",
        APP_CONSTANTS.LAST_SYNC_TIMESTAMP,
      ]);
    } else return;

    return onValue(syncNodeRef, async (snap) => {
      if (window.skipSyncListenerForNextOneTime) {
        window.skipSyncListenerForNextOneTime = false;
        return;
      }
      animateSyncIcon();

      if (!isLocalStoragePresent(appMode)) {
        // Just refresh the rules table in this case
        dispatch(actions.updateRefreshPendingStatus({ type: "rules" }));
        return;
      }
      if (Date.now() - window.syncDebounceTimerStart > waitPeriod) {
        doSyncDebounced(uid, appMode, dispatch);
      } else {
        doSync(uid, appMode, dispatch);
      }
    });
  } catch (e) {
    Logger.log(e);
    return null;
  }
};

export default syncingNodeListener;
