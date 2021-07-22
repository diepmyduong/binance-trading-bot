import isSameDay from "date-fns/isSameDay";
import endOfDay from "date-fns/endOfDay";
import format from "date-fns/format";
import vi from "date-fns/locale/vi";
import { forwardRef, MutableRefObject, useEffect, useRef, useState } from "react";
import ReactDatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { RiCalendar2Line } from "react-icons/ri";
registerLocale("vi", vi);
setDefaultLocale("vi");

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// let isClosedRecently = false;
// function setIsClosedRecently(val) {
//   isClosedRecently = val;
// }
export interface DateProps extends FormControlProps {
  clearable?: boolean;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  includeDates?: Date[];
  excludeDates?: Date[];
  includeTimes?: Date[];
  excludeTimes?: Date[];
  filterDate?: (date) => boolean;
  filterTime?: (time) => boolean;
  monthsShown?: number;
  monthPicker?: boolean;
  selectsRange?: boolean;
  fullHeader?: boolean;
  yearRange?: { start: number; end: number };
  time?: boolean;
  timeOnly?: boolean;
  timeIntervals?: number;
}
export function DatePicker({
  clearable = true,
  controlClassName = "form-control",
  className = "",
  minDate = null,
  maxDate = null,
  monthsShown = 1,
  timeIntervals = 30,
  defaultValue = getDefaultValue({}),
  style = {},
  ...props
}: DateProps) {
  let pickerFormat: string;
  if (props.monthPicker) pickerFormat = "MM/yyyy";
  else if (props.time) pickerFormat = "dd/MM/yyyy HH:mm";
  else if (props.timeOnly) pickerFormat = "HH:mm";
  else pickerFormat = "dd/MM/yyyy";
  if (props.dateFormat) pickerFormat = props.dateFormat;

  const [value, setValue] = useState();
  const [range, setRange] = useState<DateRange>();
  const ref: MutableRefObject<any> = useRef();

  useEffect(() => {
    if (props.value && typeof props.value == "string") {
      props.value = new Date(props.value);
    }
    if (props.value !== undefined) {
      if (props.selectsRange) {
        setRange(props.value?.startDate && props.value?.endDate ? props.value : defaultValue);
      } else {
        setValue(props.value);
      }
    } else {
      if (props.selectsRange) {
        setRange(defaultValue);
      } else {
        setValue(defaultValue);
      }
    }
  }, [props.value]);

  const onChange = (date) => {
    if (props.selectsRange) {
      setRange({
        startDate: date[0],
        endDate: date[1] ? endOfDay(new Date(date[1])) : null,
      });
      if (date[0] && date[1]) {
        ref.current.setOpen(false);
        if (props.onChange) {
          props.onChange({
            startDate: date[0],
            endDate: date[1] ? endOfDay(new Date(date[1])) : null,
          });
          setTimeout(() => {
            ref.current.input.focus();
          });
        }
      }
    } else {
      setValue(date);
      if (props.onChange) {
        props.onChange(date);
        if (!props.timeOnly) {
          setTimeout(() => {
            ref.current.input.focus();
          });
        }
      }
    }
  };

  const onClose = () => {
    if (props.selectsRange) {
      if (range && range.startDate && !range.endDate) {
        setRange(null);
        if (props.onChange) {
          props.onChange(range);
          // setTimeout(() => {
          //   ref.current.input.focus();
          // });
        }
      }
    } else {
      // console.log(ref.current.input as HTMLInputElement);
      // setIsClosedRecently(true);
      // setTimeout(() => {
      //   ref.current.setFocus(true);
      //   // ref.current.input.focus();
      //   // console.log(ref.current);
      // });
      // setTimeout(() => {
      //   setIsClosedRecently(false);
      // }, 100);
    }
  };

  const clearDate = () => {
    if (props.selectsRange) {
      setRange(null);
      if (props.onChange) props.onChange(null);
    } else {
      setValue(null);
      if (props.onChange) props.onChange(null);
    }
  };

  const DateButton = () => (
    <button
      type="button"
      className="w-9 h-full flex justify-center items-center absolute top-0 right-0 pr-1.5 pointer-events-none text-gray-500 group-hover:text-gray-700 no-focus"
      tabIndex={-1}
    >
      <i className="text-xl">
        <RiCalendar2Line />
      </i>
    </button>
  );

  const ClearButton = () => (
    <button
      type="button"
      className="react-datepicker__close-icon"
      aria-label="Close"
      tabIndex={-1}
      onClick={clearDate}
    ></button>
  );
  const RangeInput = forwardRef(({ range, ...props }: any, rangeRef: any) => {
    return (
      <div className="relative">
        <input
          {...props}
          value={
            range?.startDate
              ? `${format(range.startDate, "dd/MM/yyyy")}${
                  range?.endDate && !isSameDay(range.startDate, range.endDate)
                    ? ` - ${format(range.endDate, "dd/MM/yyyy")}`
                    : ""
                }`
              : ""
          }
          ref={rangeRef}
          onChange={() => {}}
        />
        {range && !props.readonly && clearable ? <ClearButton /> : <DateButton />}
      </div>
    );
  });
  const DateInput = forwardRef((props: any, dateRef: any) => {
    return (
      <div className="relative group">
        <input
          {...props}
          ref={dateRef}
          // onKeyDown={(e) => {
          //   if (e.key == "Esc" || e.key == "Escape") {
          //     ref.current.setOpen(false);
          //     setIsClosedRecently(true);
          //     setTimeout(() => {
          //       ref.current.input.focus();
          //     });
          //     setTimeout(() => {
          //       setIsClosedRecently(false);
          //     }, 100);
          //   } else {
          //     props.onKeyDown(e);
          //   }
          // }}
          // onFocus={(e) => {
          //   if (e.relatedTarget) {
          //     ref.current.setOpen(true);
          //   } else {
          //     if (!isClosedRecently) {
          //       ref.current.setOpen(false);
          //     }
          //     props.onFocus(e);
          //   }
          // }}
        />
        {props.value && !props.readonly && clearable ? <ClearButton /> : <DateButton />}
      </div>
    );
  });

  const years = props.fullHeader
    ? props.yearRange
      ? Array.from(
          { length: props.yearRange.end - props.yearRange.start },
          (v, i) => props.yearRange.start + i
        )
      : Array.from({ length: new Date().getFullYear() + 5 - 1990 }, (v, i) => 1990 + i)
    : [];
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const fullHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div className="flex justify-center items-center">
      <button
        className="react-datepicker__navigation--previous"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      />
      <div className="border-group rounded">
        <select
          className={`${controlClassName} w-20 pr-8`}
          value={date.getFullYear()}
          onChange={({ target: { value } }) => changeYear(value)}
        >
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          className={`${controlClassName} w-28 pr-8`}
          value={months[date.getMonth()]}
          onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
        >
          {months.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <button
        className="react-datepicker__navigation--next"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      />
    </div>
  );

  return (
    <ReactDatePicker
      tabIndex={props.noFocus && -1}
      ref={ref}
      className={`${controlClassName} ${props.error ? "error" : ""} ${className}`}
      selected={props.selectsRange ? null : value}
      dateFormat={pickerFormat}
      isClearable={!props.readonly && clearable}
      {...(minDate ? { minDate } : {})}
      {...(maxDate ? { maxDate } : {})}
      includeDates={props.includeDates}
      excludeDates={props.excludeDates}
      includeTimes={props.includeTimes}
      excludeTimes={props.excludeTimes}
      filterDate={props.filterDate}
      filterTime={props.filterTime}
      monthsShown={monthsShown}
      disabled={props.readonly}
      placeholderText={props.placeholder}
      showMonthYearPicker={props.monthPicker}
      openToDate={props.selectsRange ? range?.startDate : value}
      startDate={range?.startDate || null}
      endDate={range?.endDate || null}
      selectsRange={props.selectsRange}
      shouldCloseOnSelect={props.selectsRange ? false : true}
      showTimeSelect={props.time || props.timeOnly}
      showTimeSelectOnly={props.timeOnly}
      timeIntervals={timeIntervals}
      onChange={onChange}
      onCalendarClose={onClose}
      timeCaption="Giờ"
      popperProps={{
        positionFixed: true,
      }}
      customInput={
        props.selectsRange ? (
          <RangeInput range={range} error={props.error} />
        ) : (
          <DateInput error={props.error} />
        )
      }
      {...(props.fullHeader ? { renderCustomHeader: fullHeader } : {})}
    />
  );
}

const getDefaultValue = (props: DateProps) => {
  return null;
};

DatePicker.getDefaultValue = getDefaultValue;
