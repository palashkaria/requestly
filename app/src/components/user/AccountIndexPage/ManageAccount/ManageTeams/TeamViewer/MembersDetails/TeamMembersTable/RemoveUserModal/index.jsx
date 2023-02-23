import React, { useState } from "react";
import { Button, Col, Row } from "antd";
import { toast } from "utils/Toast.jsx";
import { getFunctions, httpsCallable } from "firebase/functions";
import { RQModal } from "lib/design-system/components";
import "./RemoveUserModal.css";

const RemoveUserModal = ({
  isOpen,
  toggleModal,
  userId,
  teamId,
  callbackOnSuccess,
}) => {
  const [showLoader, setShowLoader] = useState(false);

  const removeUserFromTeam = () => {
    setShowLoader(true);
    const functions = getFunctions();
    const updateTeamUserRole = httpsCallable(functions, "updateTeamUserRole");

    updateTeamUserRole({
      teamId: teamId,
      userId: userId,
      role: "remove",
    })
      .then((res) => {
        toast.info("Member removed");
        callbackOnSuccess?.();
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setShowLoader(false);
        toggleModal();
      });
  };

  return (
    <RQModal centered open={isOpen} onCancel={toggleModal}>
      <div className="rq-modal-content">
        <div className="header">Remove Member</div>
        <div className="text-gray text-sm remove-user-message">
          <p>Do you really want to remove this user from the team?</p>
          <p>They would no longer be able to access shared workspace items.</p>
        </div>
      </div>

      <Row align="middle" justify="end" className="rq-modal-footer">
        <Col>
          <Button type="secondary" onClick={toggleModal} disabled={showLoader}>
            Cancel
          </Button>
          <Button
            danger
            type="primary"
            loading={showLoader}
            disabled={showLoader}
            onClick={removeUserFromTeam}
            className="remove-user-btn"
          >
            {showLoader ? "Removing user..." : "Remove"}
          </Button>
        </Col>
      </Row>
    </RQModal>
  );
};

export default RemoveUserModal;
