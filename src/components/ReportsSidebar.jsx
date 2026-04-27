import { formatDate } from "../utils/reportUtils";

export default function ReportsSidebar({
  items,
  selectedItem,
  onSelectItem,
  sidebarTab,
  onTabChange,
  getLabel,
  getStatus,
  getDate,
}) {
  const submittedItems = items.filter(
    (r) => r.status?.toLowerCase().trim() !== "draft",
  );
  const draftItems = items.filter(
    (r) => r.status?.toLowerCase().trim() === "draft",
  );
  const visibleItems = sidebarTab === "submitted" ? submittedItems : draftItems;

  const defaultGetDate = (item) =>
    item.submitted_at
      ? formatDate(item.submitted_at)
      : formatDate(item.created_at);

  const resolvedGetDate = getDate || defaultGetDate;

  return (
    <div className="reports-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${sidebarTab === "submitted" ? "active" : ""}`}
          onClick={() => onTabChange("submitted")}
        >
          Submitted
          {submittedItems.length > 0 && (
            <span className="sidebar-tab-count">{submittedItems.length}</span>
          )}
        </button>
        <button
          className={`sidebar-tab ${sidebarTab === "draft" ? "active" : ""}`}
          onClick={() => onTabChange("draft")}
        >
          Drafts
          {draftItems.length > 0 && (
            <span className="sidebar-tab-count">{draftItems.length}</span>
          )}
        </button>
      </div>

      <div className="reports-list">
        {visibleItems.length === 0 && (
          <p className="admin-empty" style={{ padding: "16px" }}>
            No {sidebarTab === "draft" ? "draft" : "submitted"} items yet.
          </p>
        )}
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className={`report-item ${selectedItem?.id === item.id ? "active" : ""}`}
            onClick={() => onSelectItem(item)}
          >
            <strong>{getLabel(item)}</strong>

            {getStatus && (
              <div
                className={`status status-${item.status
                  ?.toLowerCase()
                  .replace(/\s+/g, "_")}`}
              >
                {getStatus(item)}
              </div>
            )}

            <div>{resolvedGetDate(item)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
