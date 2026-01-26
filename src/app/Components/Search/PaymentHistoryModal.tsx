import { useState } from "react";
import { StyleSheet } from "../../Utils/Stylesheet";
import type { Pagamento, Aluno } from "../../Utils/Types";
import Colors from "../../Utils/Colors";
import {
  CalendarBlankIcon,
  PlusIcon,
  X,
} from "@phosphor-icons/react";
import PagamentoManual from "../Pagamentos/pagManual";
import AdicionarDivida from "../Pagamentos/AdicionarDivida";
import Calendar from "./Calendar/Calendar";
import { formatCurrency } from "./alunoUtils";

interface PaymentHistoryModalProps {
  valorDevido: number;
  pagamentos: Pagamento[];
  alunoNome: string;
  onClose: () => void;
  aluno: Aluno;
  isMobile: boolean;
}

export default function PaymentHistoryModal({
  pagamentos,
  alunoNome,
  onClose,
  valorDevido,
  aluno,
  isMobile,
}: PaymentHistoryModalProps) {
  const [showNewPaymentModal, setShowNewPaymentModal] =
    useState<boolean>(false);
  const [showDividaModal, setShowDividaModal] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedPagamento, setSelectedPagamento] = useState<Pagamento | null>(
    null
  );

  const handlePaymentModal = () => {
    setShowNewPaymentModal(!showNewPaymentModal);
  };

  const handleDividaModal = () => {
    setShowDividaModal(!showDividaModal);
  };

  const handleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const mapPagamentosToEventos = (pagamentos: Pagamento[]) => {
    return pagamentos.map((pagamento) => ({
      onClick: () => setSelectedPagamento(pagamento),
      label: formatCurrency(pagamento.valorPago),
      date: new Date(pagamento.dataPago),
    }));
  };

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case "PIX":
        return "#10b981";
      case "CARTAO":
        return "#3b82f6";
      case "DINHEIRO":
        return "#f59e0b";
      default:
        return Colors.textMuted;
    }
  };

  return (
    <div
      style={{
        ...style.paymentHistoryOverlay,
        padding: isMobile ? "1rem" : "1rem",
        paddingTop: isMobile ? "1rem" : "65rem",
      }}
    >
      <div
        style={{
          ...style.paymentHistoryContainer,
          width: isMobile ? "95vw" : "90vw",
        }}
      >
        <div
          style={{
            ...style.paymentHistoryHeader,
            padding: isMobile ? "1rem" : "1.5rem 2rem",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "flex-start",
            gap: isMobile ? "1rem" : "0",
          }}
        >
          <div>
            <h2
              style={{
                ...style.paymentHistoryTitle,
                fontSize: isMobile ? "1.125rem" : "1.5rem",
                wordBreak: "break-word",
              }}
            >
              Histórico de Pagamentos | Valor devido: R${valorDevido}
            </h2>
            <p style={style.paymentHistorySubtitle}>{alunoNome}</p>
          </div>
          <div style={{ flexDirection: "row", display: "flex", gap: 8 }}>
            <button
              onClick={handleCalendar}
              style={style.paymentHistoryCloseButton}
            >
              <CalendarBlankIcon size={24} />
            </button>
            <button
              onClick={handlePaymentModal}
              style={style.paymentHistoryCloseButton}
            >
              Novo Pagamento
              <PlusIcon size={24} />
            </button>
            <button
              onClick={handleDividaModal}
              style={style.paymentHistoryCloseButton}
            >
              Nova Dívida
              <PlusIcon size={24} />
            </button>
            <button onClick={onClose} style={style.paymentHistoryCloseButton}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div
          style={{
            ...style.paymentHistoryContent,
            padding: isMobile ? "1rem" : "1.5rem 2rem",
          }}
        >
          {pagamentos.length === 0 ? (
            <div style={style.noPaymentsContainer}>
              <div style={style.noPaymentsIcon}>💳</div>
              <p style={style.noPaymentsText}>Nenhum pagamento registrado</p>
            </div>
          ) : (
            <div style={style.paymentsList}>
              {pagamentos.map((pagamento) => (
                <div
                  key={pagamento.id}
                  style={{
                    ...style.paymentCard,
                    borderRadius: isMobile ? "8px" : "12px",
                  }}
                >
                  <div
                    style={{
                      ...style.paymentCardHeader,
                      padding: isMobile ? "0.75rem" : "1rem 1.25rem",
                      flexDirection: isMobile ? "column" : "row",
                      alignItems: isMobile ? "flex-start" : "center",
                      gap: isMobile ? "0.5rem" : "0",
                    }}
                  >
                    <div style={style.paymentDateContainer}>
                      <span style={style.paymentDateLabel}>Data</span>
                      <span style={style.paymentDate}>
                        {formatDate(pagamento.dataPago)}
                      </span>
                    </div>
                    <div
                      style={{
                        ...style.paymentValueContainer,
                        textAlign: isMobile ? "left" : "right",
                      }}
                    >
                      <span
                        style={{
                          ...style.paymentValue,
                          fontSize: isMobile ? "1.125rem" : "1.25rem",
                        }}
                      >
                        {formatCurrency(pagamento.valorPago)}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      ...style.paymentCardBody,
                      padding: isMobile ? "0.75rem" : "1rem 1.25rem",
                    }}
                  >
                    <div style={style.paymentMeta}>
                      <span
                        style={{
                          ...style.paymentMethodBadge,
                          backgroundColor: getMethodBadgeColor(
                            pagamento.metodoPagamento
                          ),
                        }}
                      >
                        {pagamento.metodoPagamento}
                      </span>
                      {pagamento.isAutomatized && (
                        <span style={style.automaticBadge}>Automático</span>
                      )}
                    </div>

                    {pagamento.observacao && (
                      <div style={style.paymentObservation}>
                        <strong>Observação:</strong> {pagamento.observacao}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showNewPaymentModal && (
        <div style={style.paymentNewModalOverlay}>
          <PagamentoManual
            onClose={handlePaymentModal}
            showClose={true}
            defaultAluno={aluno}
          />
        </div>
      )}
      {showDividaModal && (
        <div style={style.paymentNewModalOverlay}>
          <AdicionarDivida
            onClose={handleDividaModal}
            showClose={true}
            defaultAluno={aluno}
          />
        </div>
      )}

      {showCalendar &&
        aluno?.dataMatricula &&
        aluno?.intervalosInadimplencia && (
          <div
            style={style.paymentNewModalOverlay}
            onClick={() => setShowCalendar(false)}
          >
            <button
              onClick={() => setShowCalendar(false)}
              style={{
                ...style.calendarCloseButton,
                top: isMobile ? "1rem" : "2rem",
                right: isMobile ? "1rem" : "2rem",
                width: isMobile ? "40px" : "48px",
                height: isMobile ? "40px" : "48px",
              }}
              aria-label="Fechar calendário"
            >
              <X size={24} weight="bold" />
            </button>
            <div
              style={style.calendarModalContainer}
              onClick={(e) => e.stopPropagation()}
            >
              <Calendar
                startDate={aluno.dataMatricula}
                intervalos={aluno.intervalosInadimplencia}
                eventos={mapPagamentosToEventos(pagamentos)}
              />
            </div>
          </div>
        )}

      {selectedPagamento && (
        <div
          style={style.paymentNewModalOverlay}
          onClick={() => setSelectedPagamento(null)}
        >
          <div
            style={{
              ...style.paymentDetailsModal,
              width: isMobile ? "95%" : "90%",
              padding: isMobile ? "1rem" : "1.5rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={style.paymentDetailsHeader}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", color: Colors.text }}>
                Detalhes do Pagamento
              </h3>
              <button
                onClick={() => setSelectedPagamento(null)}
                style={style.paymentHistoryCloseButton}
              >
                <X size={20} weight="bold" color={Colors.text} />
              </button>
            </div>
            <div style={style.paymentDetailsBody}>
              <div style={style.paymentDetailRow}>
                <span style={style.paymentDetailLabel}>Valor Pago:</span>
                <span style={style.paymentDetailValue}>
                  {formatCurrency(selectedPagamento.valorPago)}
                </span>
              </div>
              <div style={style.paymentDetailRow}>
                <span style={style.paymentDetailLabel}>Data do Pagamento:</span>
                <span style={style.paymentDetailValue}>
                  {formatDate(selectedPagamento.dataPago)}
                </span>
              </div>
              <div style={style.paymentDetailRow}>
                <span style={style.paymentDetailLabel}>
                  Método de Pagamento:
                </span>
                <span
                  style={{
                    ...style.methodBadge,
                    backgroundColor: getMethodBadgeColor(
                      selectedPagamento.metodoPagamento
                    ),
                  }}
                >
                  {selectedPagamento.metodoPagamento}
                </span>
              </div>
              <div style={style.paymentDetailRow}>
                <span style={style.paymentDetailLabel}>Automatizado:</span>
                <span style={style.paymentDetailValue}>
                  {selectedPagamento.isAutomatized ? "Sim" : "Não"}
                </span>
              </div>
              {selectedPagamento.observacao && (
                <div style={style.paymentDetailRow}>
                  <span style={style.paymentDetailLabel}>Observação:</span>
                  <span style={style.paymentDetailValue}>
                    {selectedPagamento.observacao}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const style = StyleSheet.create({
  paymentHistoryOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 15,
    backdropFilter: "blur(8px)",
    padding: "1rem",
    paddingTop: "65rem",
    overflow: "auto",
  },
  paymentHistoryContainer: {
    backgroundColor: Colors.surface,
    borderRadius: "16px",
    border: `1px solid ${Colors.border}`,
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
    width: "90vw",
    minHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  paymentHistoryHeader: {
    padding: "1.5rem 2rem",
    borderBottom: `1px solid ${Colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  paymentHistoryTitle: {
    color: Colors.primary,
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "0.25rem",
  },
  paymentHistorySubtitle: {
    color: Colors.textMuted,
    margin: 0,
    fontSize: "0.875rem",
  },
  paymentHistoryCloseButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "2.5rem",
    height: "2.5rem",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    border: `1px solid ${Colors.border}`,
    borderRadius: "10px",
    color: Colors.textMuted,
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
    gap: 4,
  },
  paymentHistoryContent: {
    flex: 1,
    overflowY: "auto",
    padding: "1.5rem 2rem",
  },
  noPaymentsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 1rem",
    textAlign: "center",
  },
  noPaymentsIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
    opacity: 0.5,
  },
  noPaymentsText: {
    color: Colors.textMuted,
    fontSize: "1rem",
    margin: 0,
  },
  paymentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  paymentCard: {
    backgroundColor: Colors.surfaceAlt,
    border: `1px solid ${Colors.border}`,
    borderRadius: "12px",
    overflow: "hidden",
    transition: "all 0.2s ease",
  },
  paymentCardHeader: {
    padding: "1rem 1.25rem",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderBottom: `1px solid ${Colors.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentDateContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  paymentDateLabel: {
    fontSize: "0.75rem",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: 600,
  },
  paymentDate: {
    fontSize: "0.9375rem",
    color: Colors.text,
    fontWeight: 500,
  },
  paymentValueContainer: {
    textAlign: "right",
  },
  paymentValue: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: Colors.success,
  },
  paymentCardBody: {
    padding: "1rem 1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  paymentMeta: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    flexWrap: "wrap",
  },
  paymentMethodBadge: {
    padding: "0.375rem 0.75rem",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "white",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  automaticBadge: {
    padding: "0.375rem 0.75rem",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: 600,
    backgroundColor: Colors.info,
    color: "white",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  paymentObservation: {
    fontSize: "0.875rem",
    color: Colors.text,
    lineHeight: "1.5",
    padding: "0.75rem",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: "6px",
    borderLeft: `3px solid ${Colors.borderFocus}`,
  },
  paymentNewModalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 18,
    backdropFilter: "blur(8px)",
    padding: "2rem 1rem",
    width: "100vw",
    height: "100vh",
    overflow: "auto",
    boxSizing: "border-box",
  },
  paymentDetailsModal: {
    backgroundColor: Colors.surface,
    borderRadius: "12px",
    padding: "1.5rem",
    width: "90%",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    border: `1px solid ${Colors.borderLight}`,
  },
  calendarModalContainer: {
    position: "relative",
    width: "90%",
    marginTop: "3rem",
  },
  calendarCloseButton: {
    position: "fixed",
    top: "2rem",
    right: "2rem",
    backgroundColor: Colors.surface,
    border: `2px solid ${Colors.border}`,
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: Colors.text,
    transition: "all 0.2s ease",
    zIndex: 20,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
  paymentDetailsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: `1px solid ${Colors.borderLight}`,
  },
  paymentDetailsBody: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  paymentDetailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem",
    backgroundColor: Colors.background,
    borderRadius: "8px",
    border: `1px solid ${Colors.borderLight}`,
  },
  paymentDetailLabel: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: Colors.textLight,
  },
  paymentDetailValue: {
    fontSize: "0.95rem",
    fontWeight: "500",
    color: Colors.text,
  },
  methodBadge: {
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: Colors.text,
  },
});