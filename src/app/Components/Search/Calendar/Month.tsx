import { StyleSheet } from "../../../Utils/Stylesheet";
import Colors from "../../../Utils/Colors";
import type { IntervaloInadimplencia } from "../../../Utils/Types";
import DayCell from "./Day";
interface Months {
  month: string;
  dates: Date[];
}

interface EventosType {
  onClick: () => void;
  label: string;
  date: Date;
}
interface MonthViewProps {
  monthGroup: Months;
  intervalos: IntervaloInadimplencia[];
  eventMap: Map<string, EventosType[]>;
}

export default function MonthView({
  monthGroup,
  intervalos,
  eventMap,
}: MonthViewProps) {
  const prepareGrid = (monthG: Months): (Date | null)[] => {
    const result: (Date | null)[] = [];
    const firstDay = monthG.dates[0].getDay();
    if (firstDay > 0) result.push(...Array(firstDay).fill(null));
    result.push(...monthG.dates);
    return result;
  };

  const gridDates = prepareGrid(monthGroup);

  // Format month title (e.g., "2024-01" -> "Janeiro 2024")
  const formatMonthTitle = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div style={style.month}>
      <div style={style.monthHeader}>
        <h3 style={style.monthTitle}>{formatMonthTitle(monthGroup.month)}</h3>
      </div>
      <div style={style.content}>
        <div style={style.dayHeader}>Dom</div>
        <div style={style.dayHeader}>Seg</div>
        <div style={style.dayHeader}>Ter</div>
        <div style={style.dayHeader}>Qua</div>
        <div style={style.dayHeader}>Qui</div>
        <div style={style.dayHeader}>Sex</div>
        <div style={style.dayHeader}>Sáb</div>
        {gridDates.map((d, i) => (
          <DayCell
            key={i}
            date={d}
            intervalos={intervalos}
            eventMap={eventMap}
          />
        ))}
      </div>
    </div>
  );
}

const style = StyleSheet.create({
  month: {
    width: "26em",
    backgroundColor: Colors.backgroundAlt,
    borderRadius: "8px",
    border: `1px solid ${Colors.border}`,
    padding: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
  },
  monthHeader: {
    marginBottom: "12px",
    paddingBottom: "12px",
    borderBottom: `2px solid ${Colors.primary}`,
  },
  monthTitle: {
    margin: 0,
    color: Colors.text,
    fontSize: "18px",
    fontWeight: "600",
    textAlign: "center",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "2px",
  },
  dayHeader: {
    textAlign: "center",
    fontWeight: "700",
    padding: "8px 4px",
    fontSize: "12px",
    color: Colors.primary,
    backgroundColor: Colors.surface,
    borderRadius: "4px",
    marginBottom: "4px",
  },
});
