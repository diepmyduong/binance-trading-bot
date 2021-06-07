import isEqual from "lodash/isEqual";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { useAlert } from "../../../../../lib/providers/alert-provider";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { SettingGroup, SettingGroupService } from "../../../../../lib/repo/setting-group.repo";
import { Setting, SettingService } from "../../../../../lib/repo/setting.repo";
import { MutableSetting } from "../components/setting-list";
export const SettingsContext = createContext<
  Partial<{
    settingGroups: SettingGroup[];
    settingGroup: SettingGroup;
    loadDone: boolean;
    loadingSettings: boolean;
    settings: Setting[];
    saveSettings: (mutableSettings: MutableSetting[]) => Promise<any>;
    deleteSetting: (setting: Setting) => Promise<any>;
    saveSetting: (id: string, data: Setting) => Promise<any>;
    deleteSettingGroup: (settingGroup: SettingGroup) => Promise<any>;
    saveSettingGroup: (id: string, data: SettingGroup) => Promise<any>;
  }>
>({});

export function SettingsProvider(props) {
  const [settingGroups, setSettingGroups] = useState<SettingGroup[]>(null);
  const [settingGroup, setSettingGroup] = useState<SettingGroup>(null);
  const [loadDone, setLoadDone] = useState<boolean>(false);
  const [loadingSettings, setLoadingSettings] = useState<boolean>(false);
  const [settings, setSettings] = useState<Setting[]>(null);
  const router = useRouter();
  const alert = useAlert();
  const toast = useToast();

  useEffect(() => {
    SettingGroupService.getAll({ query: { limit: 0 } }).then((res) => {
      setSettingGroups([...res.data]);
      setLoadDone(true);
      console.log(res.data);
    });
  }, []);

  useEffect(() => {
    if (loadDone) {
      const { slug } = router.query;
      if (slug) {
        if (!settingGroups.find((x) => x.slug == slug))
          router.replace("/admin/management/settings");
      } else {
        if (settingGroups.length)
          router.replace("/admin/management/settings/" + settingGroups[0].slug);
      }
    }
  }, [loadDone]);

  useEffect(() => {
    if (loadDone) {
      const { slug } = router.query;
      setSettingGroup(slug ? settingGroups.find((x) => x.slug == slug) : null);
    }
  }, [router.query, loadDone]);

  useEffect(() => {
    if (settingGroup) {
      setLoadingSettings(true);
      SettingService.getAll({
        query: { limit: 0, filter: { groupId: settingGroup.id } },
      })
        .then((res) => {
          setSettings([...res.data]);
        })
        .catch((err) => {
          console.error(err);
          setSettings(null);
        })
        .finally(() => {
          setLoadingSettings(false);
        });
    } else {
      setSettings(null);
    }
  }, [settingGroup]);

  const saveSettings = async (mutableSettings: MutableSetting[]) => {
    const filteredSettings = mutableSettings.filter(
      (setting) => !isEqual(setting.value, settings.find((x) => x.id == setting.id).value)
    );
    if (!filteredSettings.length) {
      toast.info("Chưa có dữ liệu nào thay đổi");
      return;
    }

    try {
      await SettingService.mutate({
        mutation: filteredSettings.map((setting) =>
          SettingService.updateQuery({
            id: setting.id,
            data: { value: setting.value },
          })
        ),
      });
      setSettings(
        mutableSettings.map((x) => {
          const { values, ...settings } = x;
          return settings;
        })
      );
      toast.success("Lưu cấu hình thành công");
    } catch (err) {
      toast.error("Lưu cấu hình thất bại. " + err.message);
    }
  };

  const saveSetting = async (id: string, data: Setting) => {
    console.log("asdasd");
    const { type, name, key, isActive, isPrivate, readOnly, value, valueKeys } = data;
    let groupId = settingGroup.id;
    let newValue = undefined;
    if (!id) {
      switch (type) {
        case "string":
        case "image": {
          newValue = "";
          break;
        }
        case "array": {
          newValue = [];
          break;
        }
        case "object": {
          newValue = {};
          valueKeys.forEach((key) => (newValue[key] = ""));
          break;
        }
      }
    } else {
      switch (type) {
        case "object": {
          newValue = {};
          valueKeys.forEach((key) => {
            if (value[key]) newValue[key] = value[key];
            else newValue[key] = "";
          });
          break;
        }
      }
    }
    return await SettingService.createOrUpdate({
      id,
      data: {
        name,
        key,
        isActive,
        isPrivate,
        readOnly,
        groupId,
        value: newValue,
        type: id ? undefined : type,
      },
      toast,
    }).then((res) => {
      if (id) {
        let index = settings.findIndex((x) => x.id == id);
        settings[index] = { ...res };
        setSettings([...settings]);
      } else {
        setSettings([...settings, res]);
      }
    });
  };

  const deleteSetting = async (setting: Setting) => {
    if (!(await alert.danger("Xoá cấu hình", "Bạn có chắc chắn muốn xoá cấu hình này?"))) return;
    return await SettingService.delete({ id: setting.id }).then((res) => {
      settings.splice(
        settings.findIndex((x) => x.id == setting.id),
        1
      );
      setSettings([...settings]);
    });
  };

  const saveSettingGroup = async (id: string, data: SettingGroup) => {
    const { name, desc, slug } = data;
    return await SettingGroupService.createOrUpdate({
      id,
      data: { name, desc, slug: id ? undefined : slug },
      toast,
    }).then((res) => {
      if (id) {
        let index = settingGroups.findIndex((x) => x.id == id);
        settingGroups[index] = { ...res };
        setSettingGroups([...settingGroups]);
      } else {
        setSettingGroups([...settingGroups, res]);
      }
    });
  };

  const deleteSettingGroup = async (settingGroup: SettingGroup) => {
    if (!(await alert.danger("Xoá nhóm cấu hình", "Bạn có chắc chắn muốn xoá nhóm cấu hình này?")))
      return;
    return await SettingGroupService.delete({ id: settingGroup.id }).then((res) => {
      settingGroups.splice(
        settingGroups.findIndex((x) => x.id == settingGroup.id),
        1
      );
      setSettingGroups([...settingGroups]);
      if (settingGroup.slug == router.query["slug"]) {
        router.replace(
          "/admin/management/settings" + (settingGroups.length ? "/" + settingGroups[0].slug : "")
        );
      }
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        settingGroups,
        settingGroup,
        saveSetting,
        deleteSetting,
        saveSettingGroup,
        deleteSettingGroup,
        loadDone,
        loadingSettings,
        settings,
        saveSettings,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  );
}

export const useSettingsContext = () => useContext(SettingsContext);
