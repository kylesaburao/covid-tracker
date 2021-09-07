import React from "react";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

export default function HistoricalTable(report) {
  const createColumn = (label, align = "left") => {
    return { id: label.toLowerCase(), align, label, minWidth: 100 };
  };

  const columns = [
    createColumn("Date", "right"),
    createColumn("Hospitalizations"),
    createColumn("Criticals"),
    createColumn("Cases"),
    createColumn("Tests"),
    createColumn("Vaccinations"),
    createColumn("Recoveries"),
    createColumn("Fatalities"),
  ];

  const columnIDs = columns.map((column) => column.id);

  const createDatapoint = (day) => {
    return columnIDs.reduce(
      (accum, currentID) => {
        if (currentID === "date") {
          accum[currentID] = day.date;
        } else {
          const changeKey = `change_${currentID}`;
          const totalKey = `total_${currentID}`;
          accum.change[currentID] = day[changeKey];
          accum.total[currentID] = day[totalKey];
        }
        return accum;
      },
      { change: {}, total: {} }
    );
  };

  return (
    <Paper>
      <TableContainer style={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {report?.report?.data
              ?.map((day) => {
                const datapoint = createDatapoint(day);

                return (
                  <TableRow key={datapoint.date}>
                    {columns.map((column) => {
                      const columnID = column.id;
                      let text = "";

                      if (columnID === "date") {
                        text = datapoint.date;
                      } else {
                        const totalValue = datapoint.total[columnID];
                        const changeValue = datapoint.change[columnID];
                        text = `${totalValue} (${changeValue})`;
                      }

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {text}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
              .reverse()}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
