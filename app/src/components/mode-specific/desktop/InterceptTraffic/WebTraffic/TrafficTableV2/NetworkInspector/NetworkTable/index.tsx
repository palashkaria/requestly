import { Table } from "@devtools-ds/table";
import React from "react";
import _ from "lodash";

import { getColumnKey } from "../utils";
import { VirtualTable } from "./VirtualTable";
import AppliedRules from "../../Tables/columns/AppliedRules";

export const ITEM_SIZE = 30;

interface Props {
  logs: any;
  onRow: Function;
}

const NetworkTable: React.FC<Props> = ({ logs, onRow }) => {
  const columns = [
    {
      id: "time",
      title: "Time",
      dataIndex: "timestamp",
      width: "5%",
      render: (timestamp: any) => {
        return new Date(timestamp * 1000).toLocaleTimeString(undefined, {
          hour12: false,
        });
      },
    },
    {
      id: "url",
      title: "URL",
      dataIndex: "url",
      width: "50%",
    },
    {
      id: "method",
      title: "Method",
      dataIndex: ["request", "method"], // corresponds to request.method
      width: "5%",
    },
    {
      id: "contentType",
      title: "Content-Type",
      dataIndex: ["response", "contentType"],
      width: "10%",
    },
    {
      title: "Rules Applied",
      dataIndex: ["actions"],
      width: "10%",
      responsive: ["xs", "sm"],
      render: (actions: any) => {
        if (!actions || actions === "-" || actions.length === 0) {
          return "-";
        }
        return <AppliedRules actions={actions} />;
      },
    },
    {
      id: "status",
      title: "Status",
      dataIndex: ["response", "statusCode"],
      width: "5%",
    },
  ];

  const renderHeader = () => {
    return (
      <Table.Head style={{ zIndex: 1000 }}>
        <Table.Row>
          {columns.map((column: any) => (
            <Table.HeadCell key={column.id} style={{ width: column.width }}>
              {column.title}
            </Table.HeadCell>
          ))}
        </Table.Row>
      </Table.Head>
    );
  };

  const renderLogRow = (log: any, style: any) => {
    if (!log) {
      return null;
    }

    const rowProps = onRow(log);

    return (
      <Table.Row id={log.id} {...rowProps}>
        {columns.map((column: any) => {
          const columnData = _.get(log, getColumnKey(column?.dataIndex));

          return (
            <Table.Cell key={column.id}>
              {column?.render ? column.render(columnData) : columnData}
            </Table.Cell>
          );
        })}
      </Table.Row>
    );
  };

  const Row = ({ index, style }: any) => {
    return renderLogRow(logs[index], style);
  };

  return (
    <>
      <VirtualTable
        height="100%"
        width="100%"
        itemCount={logs.length}
        itemSize={ITEM_SIZE}
        header={renderHeader()}
        row={Row}
        footer={null}
      />
    </>
  );
};

export default NetworkTable;
