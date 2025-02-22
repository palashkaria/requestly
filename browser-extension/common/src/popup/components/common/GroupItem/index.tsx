import React, { useCallback, useState } from "react";
import { Col, Row, Switch, Tooltip } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import RuleItem from "../RuleItem";
import PinAction from "../PinAction";
import { Group, Rule, Status } from "../../../../types";
import { useRecords } from "../../../contexts/RecordsContext";
import GroupIcon from "../../../../../resources/icons/groupIcon.svg";
import RecordName from "../RecordName";
import "./groupItem.css";

interface GroupItemProps {
  group: Group;
}

const GroupItem: React.FC<GroupItemProps> = ({ group }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { updateGroup } = useRecords();
  const isGroupActive = group.status === Status.ACTIVE;

  const handleToggleStatus = useCallback(() => {
    updateGroup({
      ...group,
      status: isGroupActive ? Status.INACTIVE : Status.ACTIVE,
    });
  }, [group, isGroupActive, updateGroup]);

  return (
    <li>
      <Row align="middle" className="record-item" wrap={false}>
        <Col
          span={18}
          className="record-name-container"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <Row wrap={false} align="middle">
            <>
              <Col>
                <CaretRightOutlined
                  rotate={isExpanded ? 90 : 0}
                  className={`group-expand-icon ${
                    isExpanded ? "group-expanded" : ""
                  }`}
                />
              </Col>
              <Col>
                <Row wrap={false} align="middle">
                  <>
                    <Tooltip title="Group">
                      <span
                        className={`icon-wrapper ${
                          isExpanded ? "group-expanded" : ""
                        }`}
                      >
                        <GroupIcon />
                      </span>
                    </Tooltip>

                    <RecordName name={group.name as string}>
                      <span className="record-name">
                        {group.name as string}
                      </span>
                    </RecordName>
                  </>
                </Row>
              </Col>
            </>
          </Row>
        </Col>

        <Col span={2} className="icon-container">
          <Row align="middle" justify="center">
            <PinAction record={group} updateRecord={updateGroup} />
          </Row>
        </Col>

        <Col span={4} className="record-switch-container">
          <Row align="middle" justify="center">
            <div>
              <span
                className={`record-status-text ${
                  !isGroupActive ? "text-gray" : ""
                }`}
              >
                {isGroupActive ? "On" : "Off"}
              </span>
              <Switch onChange={handleToggleStatus} checked={isGroupActive} />
            </div>
          </Row>
        </Col>
      </Row>

      {isExpanded && (
        <Row>
          <Col span={24}>
            {group.children.length > 0 ? (
              group.children.map((rule: Rule) => (
                <RuleItem key={rule.id} rule={rule} isChildren={true} />
              ))
            ) : (
              <div className="text-gray empty-group-message">
                No rules present in this group!
              </div>
            )}
          </Col>
        </Row>
      )}
    </li>
  );
};

export default React.memo(GroupItem);
