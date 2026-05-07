import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { CalendarMonthOutlined } from "@mui/icons-material";
import EmptyState from "./shared/EmptyState";

export default function DataTable({ columns, rows }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "var(--color-border)",
        overflow: "auto",
        boxShadow: "var(--shadow-sm)",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#F7FAFF", borderBottom: "1px solid var(--color-border)" }}>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                sx={{
                  fontWeight: 700,
                  color: "#0D2B6B",
                  borderColor: "var(--color-border)",
                  py: 1.75,
                  fontSize: "12px",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length ? (
            rows.map((row, index) => (
              <TableRow
                key={row._id || index}
                sx={{
                  borderBottom: "1px solid var(--color-border)",
                  backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#FAFBFF",
                  "&:hover": {
                    backgroundColor: "var(--color-highlight-bg)",
                  },
                  transition: "background-color 0.2s ease",
                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} sx={{ borderColor: "var(--color-border)", py: 1.5, color: "#0D2B6B" }}>
                    {column.render ? column.render(row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: '100%', maxWidth: 420, bgcolor: 'transparent', borderRadius: 1 }}>
                    <EmptyState icon={CalendarMonthOutlined} message={"No records found."} />
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
