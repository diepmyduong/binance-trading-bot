import { useEffect, useState } from "react";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import DatePicker from "react-mobile-datepicker";
import { Button } from "../../../shared/utilities/form/button";
import { FaAngleDown } from "react-icons/fa";
import { usePaymentContext } from "../providers/payment-provider";
import { format } from "date-fns";
import { useToast } from "../../../../lib/providers/toast-provider";

export function SelectTime() {
  const { branchSelecting } = useShopContext();
  const { orderInput, setOrderInput } = usePaymentContext();
  const [times, setTimes] = useState<{ label: string; value: string }[]>([]);
  const toast = useToast();
  const [selectDate, setSelectDate] = useState(new Date());
  const [selectTime, setSelectTime] = useState(new Date());
  const [openDatePickerDate, setOpenDatePickerDate] = useState(false);
  const [openDatePickerTime, setOpenDatePickerTime] = useState(false);
  const getDiffDate = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (date1.getDate().toString() == date2.getDate().toString()) return 0;
    return diffDays;
  };

  const getDateString = (time, date) => {
    let dateTemp = new Date(date);
    return new Date(
      `${dateTemp.getMonth() + 1}/${dateTemp.getDate()}/${dateTemp.getFullYear()} ${time}`
    ).toISOString();
  };
  const today = new Date(getDateString("00:00", new Date()));
  const startDate = today;
  const endDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(endDate);
  const generateTime = () => {
    var current_day = today.getDay();
    let rangeTime = branchSelecting.operatingTimes;
    let closeTime, openTime;
    let diffDate = getDiffDate(today, selectDate);
    if (rangeTime[0].day == 0) {
      openTime = rangeTime[current_day + diffDate].timeFrames[0][0];
      closeTime = rangeTime[current_day + diffDate].timeFrames[0][1];
    } else if (rangeTime[0].day == 1) {
      openTime = rangeTime[(current_day + 1 + diffDate) % 7].timeFrames[0][0];
      closeTime = rangeTime[(current_day + 1 + diffDate) % 7].timeFrames[0][1];
    }
    let hourClose = new Date(getDateString(closeTime, today));
    let now = new Date();
    if (hourClose.toISOString() < now.toISOString()) {
      if (selectDate.getDate() == today.getDate()) {
        setSelectDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000));
        toast.warn("Do hôm nay quán đã đóng cửa. Nên sẽ chọn vào ngày mai nhé!");
      }
      setStartTime(new Date(getDateString(openTime, selectDate)));
    } else {
      setStartTime(new Date());
    }
    setEndTime(new Date(getDateString(closeTime, selectDate)));
    setOpenDatePickerTime(true);
  };
  useEffect(() => {
    generateTime();
  }, [selectDate]);
  useEffect(() => {
    setOrderInput({ ...orderInput, pickupTime: selectTime.toISOString() });
  }, [selectTime]);
  useEffect(() => {}, []);

  const configTime = {
    hour: {
      format: "hh",
      caption: "Hour",
      step: 1,
    },
    minute: {
      format: "mm",
      caption: "Min",
      step: 1,
    },
  };
  const configDate = {
    date: {
      format: "DD",
      caption: "Day",
      step: 1,
    },
    month: {
      format: "MM",
      caption: "Mon",
      step: 1,
    },
    year: {
      format: "YYYY",
      caption: "Year",
      step: 1,
    },
  };

  return (
    <>
      <div className="flex">
        <Button
          outline
          primary
          text={format(new Date(selectTime), "dd/MM/yyyy HH:mm")}
          icon={<FaAngleDown />}
          iconPosition="end"
          className="rounded-2xl"
          onClick={() => setOpenDatePickerDate(true)}
        />
      </div>
      <DatePicker
        isOpen={openDatePickerDate}
        min={startDate}
        max={endDate}
        value={selectDate}
        showHeader
        confirmText="Chọn"
        cancelText="Hủy"
        headerFormat="Ngày DD/MM/YYYY"
        theme="ios"
        onCancel={() => setOpenDatePickerDate(false)}
        onSelect={(date) => {
          setSelectDate(new Date(date));
          setSelectTime(
            new Date(getDateString(`${selectTime.getHours()}:${selectTime.getMinutes()}`, date))
          );
          setOpenDatePickerDate(false);
        }}
        dateConfig={configDate}
      />
      <DatePicker
        isOpen={openDatePickerTime}
        min={startTime}
        max={endTime}
        value={selectTime}
        showHeader
        confirmText="Chọn"
        cancelText="Hủy"
        headerFormat="Vào lúc hh:mm"
        theme="ios"
        onCancel={() => setOpenDatePickerTime(false)}
        onSelect={(time) => {
          setOpenDatePickerTime(false);
          setSelectTime(time);
        }}
        dateConfig={configTime}
      />
    </>
  );
}
