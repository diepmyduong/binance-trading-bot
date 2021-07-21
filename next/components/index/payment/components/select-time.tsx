import { useEffect, useState } from "react";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import DatePicker from "react-mobile-datepicker";
import { Button } from "../../../shared/utilities/form/button";
import { FaAngleDown } from "react-icons/fa";
import { usePaymentContext } from '../providers/payment-provider';

export function SelectTime() {
  const { branchSelecting } = useShopContext();
  const { orderInput, setOrderInput } = usePaymentContext();
  const startDate = new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000);
  const endDate = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000);
  const [times, setTimes] = useState<{ label: string; value: string }[]>([]);
  const [selectDate, setSelectDate] = useState(new Date());
  const [selectTime, setSelectTime] = useState(new Date());
  const [openDatePickerDate, setOpenDatePickerDate] = useState(false);
  const [openDatePickerTime, setOpenDatePickerTime] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(endDate);
  const today = new Date();
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
    let hourClose = new Date(getDateString(closeTime, selectDate));
    if (hourClose.getHours() < today.getHours()) {
      setStartTime(new Date(getDateString(closeTime, selectDate)));
    } else {
      setStartTime(new Date());
      setOpenDatePickerTime(true);
    }
    if (selectDate.getDate() == today.getDate()) {
      //nếu chọn ngày hôm nay
    } else setStartTime(new Date(getDateString(openTime, selectDate)));
    setEndTime(new Date(getDateString(closeTime, selectDate)));
  };
  useEffect(() => {
    generateTime();
  }, [selectDate]);
  useEffect(() => {
    // let temp = getDate(selectTime, selectDate);
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
    year: {
      format: "YYYY",
      caption: "Year",
      step: 1,
    },
    month: {
      format: "MM",
      caption: "Mon",
      step: 1,
    },
    date: {
      format: "DD",
      caption: "Day",
      step: 1,
    },
  };

  return (
    <>
      <div className="flex">
        <Button
          outline
          primary
          text={`${selectDate.getDate()}/${selectDate.getMonth() + 1}/${selectDate.getFullYear()}`}
          icon={<FaAngleDown />}
          iconPosition="end"
          onClick={() => setOpenDatePickerDate(true)}
        />
        {startTime == endTime ? (
          "Quán đóng cửa"
        ) : (
          <Button
            outline
            primary
            text={`${selectTime.getHours().toString()}:${
              selectTime.getMinutes() < 10
                ? "0" + selectTime.getMinutes().toString()
                : selectTime.getMinutes().toString()
            }`}
            icon={<FaAngleDown />}
            iconPosition="end"
            onClick={() => setOpenDatePickerTime(true)}
          />
        )}
      </div>
      <DatePicker
        isOpen={openDatePickerDate}
        min={startDate}
        max={endDate}
        showHeader
        confirmText="Chọn"
        cancelText="Hủy"
        onCancel={() => setOpenDatePickerDate(false)}
        onSelect={(date) => {
          setSelectDate(date);
          setOpenDatePickerDate(false);
        }}
        dateConfig={configDate}
      />
      {startTime != endTime && (
        <DatePicker
          isOpen={openDatePickerTime}
          min={startTime}
          max={endTime}
          showHeader
          confirmText="Chọn"
          cancelText="Hủy"
          onCancel={() => setOpenDatePickerTime(false)}
          onSelect={(time) => {
            setOpenDatePickerTime(false);
            setSelectTime(time);
          }}
          dateConfig={configTime}
        />
      )}
    </>
  );
}
