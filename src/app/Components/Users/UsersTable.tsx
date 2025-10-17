import { useEffect, useState } from "react";
import Colors from "../../Utils/Colors";
import { StyleSheet } from "../../Utils/Stylesheet";
import type { User } from "../../Utils/Types";

export default function UserTable({
  data,
  onEdit,
}: {
  data: User[];
  onEdit: (user: User) => Promise<any> | void;
}) {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleUserExpansion = (userId: string | undefined) => {
    if (!userId) return;
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const handleEditUser = (user: User) => {
    onEdit(user);
  };

  const formatPermissions = (permissions: { permission: string }[]) => {
    return permissions.join(", ");
  };

  const renderMobileView = () => {
    return (
      <div style={style.mobileContainer}>
        {data.map((user) => (
          <div key={user.id || user.username} style={style.mobileCard}>
            {/* User Header */}
            <div style={style.mobileCardHeader}>
              <div style={style.mobileCardTitle}>
                <h3 style={style.mobileUserName}>{user.username}</h3>
                <div style={style.mobileUserEmail}>
                  {user.email || "Sem email"}
                </div>
              </div>
              <button
                onClick={() => toggleUserExpansion(user.id)}
                style={style.mobileToggleButton}
              >
                {expandedUser === user.id ? "▲" : "▼"}
              </button>
            </div>

            {/* Basic User Details */}
            <div style={style.mobileDetails}>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>ID:</span>
                <span style={style.mobileValue}>
                  {user.id ? `${user.id.split("-")[0]}...` : "N/A"}
                </span>
              </div>
              <div style={style.mobileDetailRow}>
                <span style={style.mobileLabel}>Permissões:</span>
                <span style={style.mobileValue}>
                  {formatPermissions(user.permissions)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={style.mobileActions}>
              <button
                onClick={() => handleEditUser(user)}
                style={style.mobileEditButton}
              >
                Editar Usuário
              </button>
            </div>

            {/* Expanded Details Section */}
            {expandedUser === user.id && (
              <div style={style.mobileExpandedSection}>
                <h4 style={style.mobileExpandedTitle}>Detalhes Completos</h4>
                <div style={style.mobileExpandedDetails}>
                  <div style={style.mobileDetailRow}>
                    <span style={style.mobileLabel}>ID Completo:</span>
                    <span style={style.mobileValue}>{user.id || "N/A"}</span>
                  </div>
                  <div style={style.mobileDetailRow}>
                    <span style={style.mobileLabel}>Username:</span>
                    <span style={style.mobileValue}>{user.username}</span>
                  </div>
                  <div style={style.mobileDetailRow}>
                    <span style={style.mobileLabel}>Email:</span>
                    <span style={style.mobileValue}>
                      {user.email || "Não informado"}
                    </span>
                  </div>
                  <div style={style.mobileDetailRow}>
                    <span style={style.mobileLabel}>Permissões:</span>
                    <span style={style.mobileValue}>
                      {formatPermissions(user.permissions)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Desktop table view
  const renderDesktopView = () => {
    return (
      <table style={style.table}>
        <thead>
          <tr style={style.headerRow}>
            <th style={style.th}>ID</th>
            <th style={style.th}>Username</th>
            <th style={style.th}>Email</th>
            <th style={style.th}>Permissões</th>
            <th style={style.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <>
              <tr key={user.id || user.username} style={style.tableRow}>
                <td style={style.td}>
                  {user.id ? `${user.id.split("-")[0]}...` : "N/A"}
                </td>
                <td style={style.td}>{user.username}</td>
                <td style={style.td}>{user.email || "Não informado"}</td>
                <td style={style.td}>
                  <div style={style.permissionsCell}>
                    <span style={style.permissionsText}>
                      {formatPermissions(user.permissions)}
                    </span>
                    <button
                      onClick={() => toggleUserExpansion(user.id)}
                      style={style.toggleButton}
                    >
                      {expandedUser === user.id ? "▲" : "▼"}
                    </button>
                  </div>
                </td>
                <td style={style.td}>
                  <button
                    onClick={() => handleEditUser(user)}
                    style={style.editButton}
                  >
                    Editar
                  </button>
                </td>
              </tr>

              {expandedUser === user.id && (
                <tr style={style.expandedRow}>
                  <td colSpan={6} style={style.expandedCell}>
                    <div style={style.expandedContainer}>
                      <h4 style={style.expandedTitle}>
                        Detalhes Completos do Usuário
                      </h4>
                      <div style={style.expandedGrid}>
                        <div style={style.expandedDetailCard}>
                          <h5 style={style.expandedCardTitle}>
                            Informações da Conta
                          </h5>
                          <div style={style.expandedDetail}>
                            <span style={style.expandedLabel}>
                              ID Completo:
                            </span>
                            <span style={style.expandedValue}>
                              {user.id || "N/A"}
                            </span>
                          </div>
                          <div style={style.expandedDetail}>
                            <span style={style.expandedLabel}>Username:</span>
                            <span style={style.expandedValue}>
                              {user.username}
                            </span>
                          </div>
                          <div style={style.expandedDetail}>
                            <span style={style.expandedLabel}>Email:</span>
                            <span style={style.expandedValue}>
                              {user.email || "Não informado"}
                            </span>
                          </div>
                          <div style={style.expandedDetail}>
                            <span style={style.expandedLabel}>Permissões:</span>
                            <span style={style.expandedValue}>
                              {formatPermissions(user.permissions)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={style.mainContainer}>
      {isMobile ? renderMobileView() : renderDesktopView()}
    </div>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: "16px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: Colors.background,
    color: Colors.text,
    minHeight: "100vh",
  },

  // Desktop Table Styles
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: Colors.surface,
    border: `1px solid ${Colors.border}`,
  },
  headerRow: {
    backgroundColor: Colors.surfaceAlt,
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: "bold",
    borderBottom: `2px solid ${Colors.borderDark}`,
    backgroundColor: Colors.primary,
    color: Colors.black,
  },
  tableRow: {
    borderBottom: `1px solid ${Colors.border}`,
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: Colors.surfaceAlt,
    },
  },
  expandedRow: {
    backgroundColor: Colors.backgroundAlt,
    borderBottom: `2px solid ${Colors.borderDark}`,
  },
  expandedCell: {
    padding: "0",
    borderBottom: `1px solid ${Colors.border}`,
  },
  td: {
    padding: "12px 16px",
    borderBottom: `1px solid ${Colors.border}`,
    color: Colors.text,
  },
  editButton: {
    padding: "6px 12px",
    backgroundColor: Colors.primary,
    color: Colors.black,
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#45a049",
      transform: "translateY(-1px)",
    },
  },
  permissionsCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  permissionsText: {
    fontSize: "14px",
    color: Colors.text,
    flex: 1,
  },
  toggleButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    color: Colors.secondary,
    padding: "4px",
    transition: "color 0.2s ease",
    ":hover": {
      color: Colors.secondaryLight,
    },
  },
  expandedContainer: {
    padding: "20px",
    backgroundColor: Colors.backgroundAlt,
    borderLeft: `4px solid ${Colors.primary}`,
  },
  expandedTitle: {
    margin: "0 0 16px 0",
    color: Colors.text,
    fontSize: "16px",
    fontWeight: "600",
  },
  expandedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
  },
  expandedDetailCard: {
    padding: "16px",
    backgroundColor: Colors.surface,
    border: `1px solid ${Colors.border}`,
    borderRadius: "8px",
  },
  expandedCardTitle: {
    margin: "0 0 12px 0",
    color: Colors.text,
    fontSize: "14px",
    fontWeight: "600",
    borderBottom: `1px solid ${Colors.border}`,
    paddingBottom: "8px",
  },
  expandedDetail: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "8px",
    paddingBottom: "8px",
    borderBottom: `1px solid ${Colors.borderLight}`,
  },
  expandedLabel: {
    fontSize: "12px",
    color: Colors.textLight,
    fontWeight: "600",
    minWidth: "120px",
  },
  expandedValue: {
    fontSize: "13px",
    color: Colors.text,
    textAlign: "right",
    flex: 1,
    wordBreak: "break-word",
  },
  noData: {
    textAlign: "center",
    color: Colors.textMuted,
    fontStyle: "italic",
    padding: "20px",
  },

  // Mobile Styles
  mobileContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  mobileCard: {
    backgroundColor: Colors.surface,
    border: `1px solid ${Colors.border}`,
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  mobileCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  mobileCardTitle: {
    flex: 1,
  },
  mobileUserName: {
    margin: "0 0 4px 0",
    color: Colors.text,
    fontSize: "18px",
    fontWeight: "600",
  },
  mobileUserEmail: {
    color: Colors.textLight,
    fontSize: "14px",
  },
  mobileToggleButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    color: Colors.secondary,
    padding: "8px",
    margin: "-8px",
  },
  mobileDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
  },
  mobileDetailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  mobileLabel: {
    color: Colors.textLight,
    fontSize: "14px",
    fontWeight: "500",
    minWidth: "100px",
  },
  mobileValue: {
    color: Colors.text,
    fontSize: "14px",
    textAlign: "right",
    flex: 1,
    wordBreak: "break-word",
  },
  mobileActions: {
    display: "flex",
    justifyContent: "center",
  },
  mobileEditButton: {
    padding: "10px 20px",
    backgroundColor: Colors.primary,
    color: Colors.black,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    width: "100%",
    maxWidth: "200px",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#45a049",
    },
  },
  mobileExpandedSection: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: `1px solid ${Colors.border}`,
  },
  mobileExpandedTitle: {
    margin: "0 0 12px 0",
    color: Colors.text,
    fontSize: "16px",
    fontWeight: "600",
  },
  mobileExpandedDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  mobileSectionDivider: {
    height: "1px",
    backgroundColor: Colors.border,
    margin: "12px 0",
  },
  mobileSectionTitle: {
    margin: "0 0 8px 0",
    color: Colors.text,
    fontSize: "14px",
    fontWeight: "600",
  },
  mobileNoData: {
    textAlign: "center",
    color: Colors.textMuted,
    fontStyle: "italic",
    padding: "12px",
    backgroundColor: Colors.surfaceAlt,
    borderRadius: "4px",
  },
});
