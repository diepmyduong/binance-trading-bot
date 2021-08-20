import { useState } from "react";
import { RiAddCircleLine } from "react-icons/ri";
import { SettingGroup } from "../../../../../lib/repo/setting-group.repo";
import { Button } from "../../../../shared/utilities/form/button";
import { Field } from "../../../../shared/utilities/form/field";
import { Form } from "../../../../shared/utilities/form/form";
import { FormValidator } from "../../../../shared/utilities/form/form-validator";
import { Input } from "../../../../shared/utilities/form/input";
import { Textarea } from "../../../../shared/utilities/form/textarea";
import { useSettingsContext } from "../providers/settings-provider";
import { SettingGroupItem } from "./setting-group-item";
interface PropTypes extends ReactProps {}
export function SettingGroupList(props: PropTypes) {
  const [openSettingGroup, setOpenSettingGroup] = useState<Partial<SettingGroup>>(null);
  const { settingGroups, saveSettingGroup, deleteSettingGroup } = useSettingsContext();

  return (
    <div className="border border-gray-300 rounded bg-gray-50">
      {settingGroups.map((settingGroup, index) => (
        <SettingGroupItem
          key={settingGroup.id}
          settingGroup={settingGroup}
          onEdit={setOpenSettingGroup}
          onDelete={deleteSettingGroup}
        />
      ))}
      {/* <Button
        className="w-full"
        icon={<RiAddCircleLine />}
        text="Thêm nhóm cấu hình mới"
        onClick={() => {
          setOpenSettingGroup({ name: "", slug: "", desc: "", readOnly: false });
        }}
      /> */}
      <Form
        title={`${openSettingGroup ? "Cập nhật" : "Tạo"} nhóm cấu hình`}
        dialog
        width="550px"
        grid
        initialData={openSettingGroup}
        isOpen={!!openSettingGroup}
        onClose={() => setOpenSettingGroup(null)}
        onSubmit={async (data) => {
          await saveSettingGroup(data.id, data).then((res) => {
            setOpenSettingGroup(null);
          });
        }}
      >
        <Field label="Tên nhóm cấu hình" name="name" cols={6} required>
          <Input />
        </Field>
        <Field
          label="Slug nhóm cấu hình"
          name="slug"
          cols={6}
          required
          validate={FormValidator.instance.slug().build()}
        >
          <Input readonly={!!openSettingGroup?.id} />
        </Field>
        <Field label="Mô tả nhóm cấu hình" name="desc" cols={12}>
          <Textarea />
        </Field>
        <Form.Footer>
          <Form.ButtonGroup
            submitText={`${openSettingGroup?.id ? "Cập nhật" : "Tạo"} nhóm cấu hình`}
          />
        </Form.Footer>
      </Form>
    </div>
  );
}
