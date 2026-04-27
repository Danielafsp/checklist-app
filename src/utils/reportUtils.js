export const formatDate = (timestamp) =>
  timestamp ? new Date(timestamp).toLocaleString() : "—";