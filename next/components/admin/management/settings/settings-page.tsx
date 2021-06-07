import { Spinner } from "../../../shared/utilities/spinner";
import { SettingGroupList } from "./components/setting-group-list";
import { SettingList } from "./components/setting-list";
import { SettingsContext, SettingsProvider } from "./providers/settings-provider";

export function SettingsPage() {
  return (
    <SettingsProvider>
      <SettingsContext.Consumer>
        {({ loadDone }) => (
          <>
            {!loadDone ? (
              <Spinner />
            ) : (
              <div className="flex">
                <div className="w-80 flex-shrink-0 flex-grow-0">
                  <SettingGroupList />
                </div>
                <div className="pl-3 min-w-2xl">
                  <SettingList />
                </div>
              </div>
            )}
          </>
        )}
      </SettingsContext.Consumer>
    </SettingsProvider>
  );
}
