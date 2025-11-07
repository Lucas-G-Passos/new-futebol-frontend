import { useMemo, useState } from "react";
import Colors from "../../../Utils/Colors";
import { StyleSheet } from "../../../Utils/Stylesheet";
import type { IntervaloInadimplencia } from "../../../Utils/Types";
import MonthView from "./Month";

export interface EventosType {
  onClick: () => void;
  label: string;
  date: Date;
}

interface CalendarTypes {
  startDate: Date;
  intervalos: IntervaloInadimplencia[];
  eventos: EventosType[];
}

interface Months {
  month: string;
  dates: Date[];
}
const genRange = (start: Date): Months[] => {
  const monthGroups: Months[] = [];
  const currentDate = new Date(start);
  const today = new Date();

  let currentMonthKey = "";
  let currentMonthDates: Date[] = [];

  while (currentDate <= today) {
    const monthKey = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    if (monthKey !== currentMonthKey) {
      if (currentMonthDates.length > 0) {
        monthGroups.push({
          month: currentMonthKey,
          dates: currentMonthDates,
        });
      }
      currentMonthKey = monthKey;
      currentMonthDates = [];
    }

    currentMonthDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (currentMonthDates.length > 0) {
    monthGroups.push({ month: currentMonthKey, dates: currentMonthDates });
  }

  return monthGroups;
};

const genEventMap = (events: EventosType[]): Map<string, EventosType[]> => {
  const map: Map<string, EventosType[]> = new Map();

  for (let c = 0; c < events.length; c++) {
    const key = events[c].date.toISOString().split("T")[0];
    if (map.has(key)) {
      map.get(key)?.push(events[c]);
    } else {
      map.set(key, Array.of(events[c]));
    }
  }
  return map;
};
export default function Calendar({
  startDate,
  intervalos,
  eventos,
}: CalendarTypes) {
  const [currentPage, setCurrentPage] = useState(0);
  const MONTHS_PER_PAGE = 3;

  const datas = useMemo(() => {
    return genRange(startDate);
  }, []);

  const eventMap = useMemo(() => {
    return genEventMap(eventos);
  }, []);

  const startIndex = currentPage * MONTHS_PER_PAGE;
  const visibleMonths = datas.slice(startIndex, startIndex + MONTHS_PER_PAGE);

  const canGoNext = startIndex + MONTHS_PER_PAGE < datas.length;
  const canGoPrev = currentPage > 0;

  const nextPage = () => {
    if (canGoNext) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (canGoPrev) setCurrentPage(currentPage - 1);
  };

  return (
    <div style={style.container}>
      <div style={style.navigation}>
        <button
          onClick={prevPage}
          disabled={!canGoPrev}
          style={{
            ...style.navButton,
            ...(canGoPrev ? {} : style.navButtonDisabled),
          }}
        >
          ← Anterior
        </button>
        <span style={style.pageInfo}>
          Página {currentPage + 1} de{" "}
          {Math.ceil(datas.length / MONTHS_PER_PAGE)}
        </span>
        <button
          onClick={nextPage}
          disabled={!canGoNext}
          style={{
            ...style.navButton,
            ...(canGoNext ? {} : style.navButtonDisabled),
          }}
        >
          Próximo →
        </button>
      </div>
      <div style={style.mainContainer}>
        {visibleMonths.map((g) => (
          <MonthView
            key={g.month}
            monthGroup={g}
            intervalos={intervalos}
            eventMap={eventMap}
          />
        ))}
      </div>
    </div>
  );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: "12px",
    border: `1px solid ${Colors.border}`,
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    gap: "16px",
  },
  navButton: {
    padding: "10px 20px",
    backgroundColor: Colors.primary,
    color: Colors.black,
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    ":hover": {
      backgroundColor: Colors.primaryLight,
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    },
    ":active": {
      transform: "translateY(0)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
  },
  navButtonDisabled: {
    backgroundColor: Colors.surfaceAlt,
    color: Colors.textMuted,
    cursor: "not-allowed",
    opacity: 0.5,
    ":hover": {
      backgroundColor: Colors.surfaceAlt,
      transform: "none",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
  },
  pageInfo: {
    color: Colors.text,
    fontSize: "14px",
    fontWeight: "500",
  },
  mainContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "flex-start",
  },
});
