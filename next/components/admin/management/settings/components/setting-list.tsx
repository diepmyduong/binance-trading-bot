import cloneDeep from "lodash/cloneDeep";
import { useEffect, useState } from "react";
import { HiCog } from "react-icons/hi";
import { RiAddBoxLine } from "react-icons/ri";
import { Setting, SETTING_TYPES } from "../../../../../lib/repo/setting.repo";
import { Accordion } from "../../../../shared/utilities/accordion/accordion";
import { Button } from "../../../../shared/utilities/form/button";
import { Checkbox } from "../../../../shared/utilities/form/checkbox";
import { Field } from "../../../../shared/utilities/form/field";
import { Form, FormConsumer } from "../../../../shared/utilities/form/form";
import { FormValidator } from "../../../../shared/utilities/form/form-validator";
import { Input } from "../../../../shared/utilities/form/input";
import { Select } from "../../../../shared/utilities/form/select";
import { NotFound } from "../../../../shared/utilities/not-found";
import { Spinner } from "../../../../shared/utilities/spinner";
import { useSettingsContext } from "../providers/settings-provider";
import { SettingItem } from "./setting-item";

export interface MutableSetting extends Setting {
  values: {
    key: string;
    value: string;
  }[];
}

interface PropTypes extends ReactProps {}
export function SettingList(props: PropTypes) {
  const [openSettings, setOpenSettings] = useState(null);
  const {
    loadingSettings,
    saveSettings,
    settings,
    settingGroup,
    saveSetting,
    deleteSetting,
  } = useSettingsContext();

  const [mutableSettings, setMutableSettings] = useState<MutableSetting[]>(null);
  useEffect(() => {
    onInitData();
  }, [settings]);

  const [isStaticSettings, setIsStaticSettings] = useState<boolean>(false);
  useEffect(() => {
    if (settingGroup) {
      if (settingGroup.slug == "TRANG_CHU") {
        setIsStaticSettings(true);
      } else {
        setIsStaticSettings(false);
      }
    }
  }, [settingGroup]);

  const onSettingChanged = (setting: MutableSetting, id: string) => {
    let index = mutableSettings.findIndex((x) => x.id == id);
    if (index >= 0) {
      mutableSettings[index] = setting;
    }
    setMutableSettings([...mutableSettings]);
  };

  const onInitData = () => {
    if (settings) {
      let clonedSettings = cloneDeep(settings) as MutableSetting[];

      for (let setting of clonedSettings) {
        switch (setting.type) {
          case "object": {
            setting.valueKeys = Object.keys(setting?.value || {});
            // setting.values = Object.keys(setting.value).map((key) => ({ key, value: setting.value[key] }));
            break;
          }
        }
      }

      setMutableSettings(clonedSettings);
    } else {
      setMutableSettings(null);
    }
  };

  const AddButton = () => (
    <Button
      className="mt-2"
      outline
      icon={<RiAddBoxLine />}
      text="Thêm cấu hình"
      onClick={() =>
        setOpenSettings({
          type: "string",
          isActive: true,
        })
      }
    />
  );

  return (
    <>
      {loadingSettings ? (
        <Spinner />
      ) : (
        <>
          {!!mutableSettings && (
            <>
              {
                <Form className="bg-white shadow-sm border rounded border-gray-300">
                  <div className="py-3 px-5 font-semibold border-b border-gray-200 text-gray-600">
                    {settingGroup.name}
                  </div>
                  <div
                    className="py-3 px-5 v-scrollbar"
                    style={{ maxHeight: "calc(100vh - 220px)", minHeight: "250px" }}
                  >
                    {!mutableSettings.length ? (
                      <>
                        <NotFound text="Chưa có cấu hình nào" icon={<HiCog />}>
                          <AddButton />
                        </NotFound>
                      </>
                    ) : (
                      <>
                        {isStaticSettings ? (
                          <> {{}[settingGroup.slug]} </>
                        ) : (
                          <>
                            {" "}
                            {mutableSettings.map((setting) => (
                              <SettingItem
                                key={setting.id}
                                setting={setting}
                                onChange={(setting) => onSettingChanged(setting, setting.id)}
                                onEdit={setOpenSettings}
                                onDelete={deleteSetting}
                              />
                            ))}{" "}
                            {/* <AddButton /> */}
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <div className="py-3 px-5 flex justify-end border-t border-gray-200">
                    <Button gray text="Reset dữ liệu" onClick={onInitData} />
                    <Button
                      primary
                      submit
                      className="ml-2"
                      text="Lưu thay đổi"
                      onClick={async () => await saveSettings(mutableSettings)}
                    />
                  </div>
                  <Form
                    dialog
                    grid
                    width="550px"
                    title={`${openSettings ? "Cập nhật" : "Tạo"} cấu hình`}
                    initialData={openSettings}
                    isOpen={!!openSettings}
                    onClose={() => setOpenSettings(null)}
                    onSubmit={async (data) => {
                      await saveSetting(data.id, data).then((res) => {
                        setOpenSettings(null);
                      });
                    }}
                  >
                    <Field name="name" label="Tên cấu hình" cols={6} required>
                      <Input autoFocus />
                    </Field>
                    <Field
                      name="key"
                      label="Mã cấu hình"
                      cols={6}
                      required
                      validate={FormValidator.instance.key().build()}
                    >
                      <Input />
                    </Field>
                    <Field name="type" label="Loại cấu hình" cols={6} required>
                      <Select options={SETTING_TYPES} readonly={openSettings?.id} />
                    </Field>
                    <Field name="isActive" label=" " cols={6}>
                      <Checkbox placeholder="Đang hoạt động" />
                    </Field>
                    <FormConsumer>
                      {({ data }) => (
                        <Accordion className="col-span-12" isOpen={data.type == "object"}>
                          <Field
                            name="valueKeys"
                            label="Nhập tên các trường tuỳ chỉnh"
                            cols={12}
                            validate={FormValidator.instance
                              .required(() => data.type == "object")
                              .build()}
                          >
                            <Input multi />
                          </Field>
                        </Accordion>
                      )}
                    </FormConsumer>
                    <Field name="readOnly" cols={6}>
                      <Checkbox placeholder="Không thể chỉnh sửa" />
                    </Field>
                    <Field name="isPrivate" cols={6}>
                      <Checkbox placeholder="Chế độ riêng tư" />
                    </Field>
                    <Form.Footer>
                      <Form.ButtonGroup
                        submitText={`${openSettings?.id ? "Cập nhật" : "Tạo"} cấu hình`}
                      />
                    </Form.Footer>
                  </Form>
                </Form>
              }
            </>
          )}
        </>
      )}
    </>
  );
}
