import { useEffect, useState } from "react";
import type { Analytics } from "../../Utils/Types";
import Colors from "../../Utils/Colors";
import { StyleSheet } from "../../Utils/Stylesheet";

interface AnalyticsLineGraphProps {
  analytics: Analytics[];
}

export default function AnalyticsLineGraph({
  analytics,
}: AnalyticsLineGraphProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const styles = isMobile ? mobileStyles : desktopStyles;

  if (!analytics || analytics.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Análise Mensal de Receitas</h2>
        <p style={styles.noData}>Nenhum dado de analytics disponível</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getMonthName = (month: number) => {
    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    return months[month - 1] || "";
  };

  // Sort analytics by year and month
  const sortedAnalytics = [...analytics].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  // Calculate min/max for scaling
  const allValues = sortedAnalytics.flatMap((a) => [
    a.expectedValue,
    a.receivedValue,
  ]);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const valueRange = maxValue - minValue;
  const padding = valueRange * 0.1;

  // Chart dimensions
  const chartWidth = isMobile ? 300 : 600;
  const chartHeight = isMobile ? 200 : 300;
  const paddingLeft = isMobile ? 50 : 70;
  const paddingRight = isMobile ? 20 : 30;
  const paddingTop = 20;
  const paddingBottom = isMobile ? 40 : 50;

  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  // Scale functions
  const scaleY = (value: number) => {
    const scaledValue =
      (value - (minValue - padding)) / (maxValue - minValue + 2 * padding);
    return paddingTop + graphHeight - scaledValue * graphHeight;
  };

  const scaleX = (index: number) => {
    return paddingLeft + (index / (sortedAnalytics.length - 1)) * graphWidth;
  };

  // Generate path data for lines
  const generatePath = (values: number[]) => {
    return values
      .map((value, index) => {
        const x = scaleX(index);
        const y = scaleY(value);
        return `${index === 0 ? "M" : "L"} ${x},${y}`;
      })
      .join(" ");
  };

  const expectedPath = generatePath(
    sortedAnalytics.map((a) => a.expectedValue)
  );
  const receivedPath = generatePath(
    sortedAnalytics.map((a) => a.receivedValue)
  );

  // Generate Y-axis labels
  const yAxisLabels = Array.from({ length: 5 }, (_, i) => {
    const value =
      minValue - padding + ((maxValue - minValue + 2 * padding) / 4) * i;
    return value;
  }).reverse();

  // Calculate totals
  const totalExpected = sortedAnalytics.reduce(
    (sum, a) => sum + a.expectedValue,
    0
  );
  const totalReceived = sortedAnalytics.reduce(
    (sum, a) => sum + a.receivedValue,
    0
  );
  const averageComplianceRate = (totalReceived / totalExpected) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Análise Mensal de Receitas</h2>
        <div style={styles.statusBadge}>
          <span
            style={{
              ...styles.statusText,
              color:
                averageComplianceRate >= 85
                  ? Colors.success
                  : averageComplianceRate >= 70
                  ? Colors.warning
                  : Colors.error,
            }}
          >
            {averageComplianceRate.toFixed(1)}% taxa média
          </span>
        </div>
      </div>

      <div style={styles.legendContainer}>
        <div style={styles.legendItem}>
          <div
            style={{ ...styles.legendDot, backgroundColor: Colors.info }}
          ></div>
          <span style={styles.legendText}>Valor Esperado</span>
        </div>
        <div style={styles.legendItem}>
          <div
            style={{ ...styles.legendDot, backgroundColor: Colors.success }}
          ></div>
          <span style={styles.legendText}>Valor Recebido</span>
        </div>
      </div>

      <div style={styles.chartWrapper}>
        <div style={{ position: "relative" }}>
          <svg width={chartWidth} height={chartHeight} style={styles.svg}>
            {/* Grid lines */}
            {yAxisLabels.map((label, i) => (
              <g key={`grid-${i}`}>
                <line
                  x1={paddingLeft}
                  y1={scaleY(label)}
                  x2={chartWidth - paddingRight}
                  y2={scaleY(label)}
                  stroke={Colors.border}
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  opacity="0.3"
                />
                <text
                  x={paddingLeft - 10}
                  y={scaleY(label) + 4}
                  textAnchor="end"
                  fill={Colors.textMuted}
                  fontSize={isMobile ? "10" : "12"}
                >
                  {formatCurrency(label).replace(/\s/g, "")}
                </text>
              </g>
            ))}

            {/* X-axis labels */}
            {sortedAnalytics.map((data, i) => (
              <text
                key={`x-label-${i}`}
                x={scaleX(i)}
                y={chartHeight - paddingBottom + 20}
                textAnchor="middle"
                fill={Colors.textMuted}
                fontSize={isMobile ? "10" : "12"}
              >
                {getMonthName(data.month)}
              </text>
            ))}

            {/* Expected value line */}
            <path
              d={expectedPath}
              fill="none"
              stroke={Colors.info}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Received value line */}
            <path
              d={receivedPath}
              fill="none"
              stroke={Colors.success}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points for expected */}
            {sortedAnalytics.map((data, i) => (
              <circle
                key={`expected-point-${i}`}
                cx={scaleX(i)}
                cy={scaleY(data.expectedValue)}
                r={hoveredPoint === i ? 6 : 4}
                fill={Colors.info}
                stroke={Colors.white}
                strokeWidth="2"
                style={{ cursor: "pointer", transition: "r 0.2s" }}
                onMouseEnter={() => {
                  setHoveredPoint(i);
                  setTooltipPosition({
                    x: scaleX(i),
                    y: Math.min(
                      scaleY(data.expectedValue),
                      scaleY(data.receivedValue)
                    ),
                  });
                }}
                onMouseLeave={() => {
                  setHoveredPoint(null);
                  setTooltipPosition(null);
                }}
              />
            ))}

            {/* Data points for received */}
            {sortedAnalytics.map((data, i) => (
              <circle
                key={`received-point-${i}`}
                cx={scaleX(i)}
                cy={scaleY(data.receivedValue)}
                r={hoveredPoint === i ? 6 : 4}
                fill={Colors.success}
                stroke={Colors.white}
                strokeWidth="2"
                style={{ cursor: "pointer", transition: "r 0.2s" }}
                onMouseEnter={() => {
                  setHoveredPoint(i);
                  setTooltipPosition({
                    x: scaleX(i),
                    y: Math.min(
                      scaleY(data.expectedValue),
                      scaleY(data.receivedValue)
                    ),
                  });
                }}
                onMouseLeave={() => {
                  setHoveredPoint(null);
                  setTooltipPosition(null);
                }}
              />
            ))}
          </svg>

          {/* Tooltip on hover - positioned near the point */}
          {hoveredPoint !== null &&
            sortedAnalytics[hoveredPoint] &&
            tooltipPosition && (
              <div
                style={{
                  ...styles.tooltip,
                  position: "relative",
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y - 10}px`,
                  transform: "translate(-50%, -100%)",
                  pointerEvents: "none",
                  zIndex: 10000,
                }}
              >
                <div style={styles.tooltipTitle}>
                  {getMonthName(sortedAnalytics[hoveredPoint].month)}{" "}
                  {sortedAnalytics[hoveredPoint].year}
                </div>
                <div style={styles.tooltipRow}>
                  <span style={styles.tooltipLabel}>Esperado:</span>
                  <span style={styles.tooltipValue}>
                    {formatCurrency(
                      sortedAnalytics[hoveredPoint].expectedValue
                    )}
                  </span>
                </div>
                <div style={styles.tooltipRow}>
                  <span style={styles.tooltipLabel}>Recebido:</span>
                  <span style={styles.tooltipValue}>
                    {formatCurrency(
                      sortedAnalytics[hoveredPoint].receivedValue
                    )}
                  </span>
                </div>
                <div style={styles.tooltipRow}>
                  <span style={styles.tooltipLabel}>Taxa:</span>
                  <span
                    style={{
                      ...styles.tooltipValue,
                      color:
                        (sortedAnalytics[hoveredPoint].receivedValue /
                          sortedAnalytics[hoveredPoint].expectedValue) *
                          100 >=
                        85
                          ? Colors.success
                          : Colors.warning,
                    }}
                  >
                    {(
                      (sortedAnalytics[hoveredPoint].receivedValue /
                        sortedAnalytics[hoveredPoint].expectedValue) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            )}
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Total Esperado</span>
          <span style={styles.summaryValue}>
            {formatCurrency(totalExpected)}
          </span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Total Recebido</span>
          <span style={{ ...styles.summaryValue, color: Colors.success }}>
            {formatCurrency(totalReceived)}
          </span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Diferença</span>
          <span
            style={{
              ...styles.summaryValue,
              color:
                totalReceived - totalExpected >= 0
                  ? Colors.success
                  : Colors.error,
            }}
          >
            {formatCurrency(totalReceived - totalExpected)}
          </span>
        </div>
      </div>
    </div>
  );
}

const desktopStyles = StyleSheet.create({
  container: {
    padding: "24px",
    backgroundColor: Colors.surfaceAlt,
    border: `2px solid ${Colors.border}`,
    borderRadius: "16px",
    marginBottom: "24px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    color: Colors.text,
    fontSize: "20px",
    fontWeight: "600",
    margin: 0,
  },
  statusBadge: {
    padding: "6px 12px",
    backgroundColor: Colors.surface,
    borderRadius: "8px",
    border: `1px solid ${Colors.border}`,
  },
  statusText: {
    fontSize: "16px",
    fontWeight: "700",
  },
  legendContainer: {
    display: "flex",
    gap: "24px",
    marginBottom: "20px",
    justifyContent: "center",
    zIndex: 1,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  legendDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },
  legendText: {
    color: Colors.text,
    fontSize: "14px",
    fontWeight: "500",
  },
  chartWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
    overflowX: "auto",
  },
  svg: {
    userSelect: "none",
  },
  tooltip: {
    padding: "12px 16px",
    backgroundColor: Colors.surface,
    border: `2px solid ${Colors.border}`,
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    whiteSpace: "nowrap",
  },
  tooltipTitle: {
    color: Colors.text,
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  tooltipRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
  },
  tooltipLabel: {
    color: Colors.textMuted,
    fontSize: "12px",
  },
  tooltipValue: {
    color: Colors.text,
    fontSize: "12px",
    fontWeight: "600",
  },
  footer: {
    paddingTop: "20px",
    borderTop: `1px solid ${Colors.border}`,
    display: "flex",
    justifyContent: "space-around",
    gap: "16px",
  },
  summaryItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  summaryLabel: {
    color: Colors.textMuted,
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  summaryValue: {
    color: Colors.text,
    fontSize: "20px",
    fontWeight: "700",
  },
  noData: {
    color: Colors.textMuted,
    fontSize: "14px",
    textAlign: "center",
    padding: "40px 0",
  },
});

const mobileStyles = StyleSheet.create({
  container: {
    padding: "16px",
    backgroundColor: Colors.surfaceAlt,
    border: `2px solid ${Colors.border}`,
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "8px",
  },
  title: {
    color: Colors.text,
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
  },
  statusBadge: {
    padding: "4px 10px",
    backgroundColor: Colors.surface,
    borderRadius: "6px",
    border: `1px solid ${Colors.border}`,
  },
  statusText: {
    fontSize: "14px",
    fontWeight: "700",
  },
  legendContainer: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  legendText: {
    color: Colors.text,
    fontSize: "12px",
    fontWeight: "500",
  },
  chartWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px",
    overflowX: "auto",
  },
  svg: {
    userSelect: "none",
  },
  tooltip: {
    padding: "10px 12px",
    backgroundColor: Colors.surface,
    border: `2px solid ${Colors.border}`,
    borderRadius: "6px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    whiteSpace: "nowrap",
  },
  tooltipTitle: {
    color: Colors.text,
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "6px",
  },
  tooltipRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "3px",
  },
  tooltipLabel: {
    color: Colors.textMuted,
    fontSize: "11px",
  },
  tooltipValue: {
    color: Colors.text,
    fontSize: "11px",
    fontWeight: "600",
  },
  footer: {
    paddingTop: "16px",
    borderTop: `1px solid ${Colors.border}`,
    display: "flex",
    justifyContent: "space-around",
    gap: "12px",
    flexWrap: "wrap",
  },
  summaryItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3px",
  },
  summaryLabel: {
    color: Colors.textMuted,
    fontSize: "10px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  summaryValue: {
    color: Colors.text,
    fontSize: "16px",
    fontWeight: "700",
  },
  noData: {
    color: Colors.textMuted,
    fontSize: "12px",
    textAlign: "center",
    padding: "30px 0",
  },
});
