import { StyleSheet } from "../../../Utils/Stylesheet";
import Colors from "../../../Utils/Colors";
import type { IntervaloInadimplencia } from "../../../Utils/Types";

interface EventosType {
  onClick: () => void;
  label: string;
  date: Date;
}

interface DayLCellProps {
  date: Date | null;
  intervalos: IntervaloInadimplencia[];
  eventMap: Map<string, EventosType[]>;
}

export default function DayCell({ date, intervalos, eventMap }: DayLCellProps) {
  if (!date) return <div style={style.dayEmpty}> </div>;

  const isInPeriod = intervalos.some(
    (intervalo) =>
      date >= intervalo.dataInicio &&
      (intervalo.dataTermino ? date <= intervalo.dataTermino : false)
  );

  const dateKey = date.toISOString().split("T")[0];
  const dayEvents = eventMap.get(dateKey) || [];
  const hasEvents = dayEvents.length > 0;

  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  return (
    <div
      style={{
        ...style.day,
        ...(isInPeriod ? style.highlight : {}),
        ...(isToday ? style.today : {}),
        ...(isWeekend ? style.weekend : {}),
        ...(hasEvents ? style.hasEvent : {}),
      }}
    >
      <div style={style.dayNumber}>{date.getDate()}</div>
      {dayEvents.length > 0 && (
        <div style={style.eventsContainer}>
          {dayEvents.map((event, idx) => (
            <div
              key={idx}
              onClick={event.onClick}
              style={style.event}
              title={event.label}
            >
              {event.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const style = StyleSheet.create({
  dayEmpty: {
    minHeight: "60px",
    backgroundColor: Colors.surface,
    borderRadius: "4px",
  },
  day: {
    minHeight: "60px",
    padding: "6px",
    backgroundColor: Colors.surface,
    border: `1px solid ${Colors.borderLight}`,
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "all 0.2s ease",
    position: "relative",
    cursor: "default",
    ":hover": {
      backgroundColor: Colors.surfaceAlt,
      borderColor: Colors.border,
    },
  },
  dayNumber: {
    fontSize: "13px",
    fontWeight: "600",
    color: Colors.text,
    marginBottom: "4px",
  },
  weekend: {
    backgroundColor: Colors.surfaceAlt,
  },
  today: {
    backgroundColor: Colors.inputBackground,
    border: `2px solid ${Colors.secondary}`,
    fontWeight: "700",
  },
  highlight: {
    backgroundColor: `${Colors.error}33`,
    border: `2px solid ${Colors.error}`,
    ":hover": {
      backgroundColor: `${Colors.error}44`,
    },
  },
  hasEvent: {
    borderColor: Colors.info,
  },
  eventsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    maxHeight: "40px",
    overflowY: "auto",
  },
  event: {
    fontSize: "9px",
    lineHeight: "1.2",
    cursor: "pointer",
    padding: "3px 4px",
    backgroundColor: Colors.primary,
    color: Colors.black,
    borderRadius: "3px",
    transition: "all 0.15s ease",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    ":hover": {
      backgroundColor: Colors.secondaryLight,
      transform: "scale(1.05)",
      zIndex: 10,
    },
  },
});
