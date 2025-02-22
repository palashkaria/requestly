import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Input, Typography } from "antd";
import { RQButton } from "lib/design-system/components";
import { BiPencil } from "react-icons/bi";
import { TextAreaRef } from "antd/lib/input/TextArea";
import "./RQEditorTitle.css";

interface ValidationErrors {
  name?: string;
}
interface TitleProps {
  name: string;
  description: string;
  namePlaceholder: string;
  descriptionPlaceholder: string;
  nameChangeCallback: (name: string) => void;
  descriptionChangeCallback: (desc: string) => void;
  errors?: ValidationErrors;
  divider?: boolean;
  mode?: "create" | "edit";
}

const { TextArea } = Input;

export const RQEditorTitle: React.FC<TitleProps> = ({
  name,
  description,
  nameChangeCallback,
  namePlaceholder,
  descriptionPlaceholder,
  descriptionChangeCallback,
  mode = "edit",
  divider = true,
  errors,
}) => {
  const [isNameEditable, setIsNameEditable] = useState<boolean>(false);
  const [isDescriptionEditable, setIsDescriptionEditable] = useState<boolean>(
    false
  );
  const textAreaRef = useRef<TextAreaRef | null>(null);

  useEffect(() => {
    if (errors?.name) {
      setIsNameEditable(true);
    }
  }, [errors]);

  useEffect(() => {
    if (isDescriptionEditable) {
      textAreaRef.current?.focus({ cursor: "end" });
    }
  }, [isDescriptionEditable]);

  return (
    <Row
      className={`editor-title-container ${
        divider ? "editor-title-container-divider" : ""
      }`}
    >
      <Col
        span={22}
        offset={1}
        md={{ offset: 2, span: 20 }}
        lg={{
          offset: 4,
          span: 16,
        }}
      >
        <Row className="editor-title-name">
          {name.length === 0 || isNameEditable ? (
            <Input
              className={`${errors?.name && !name ? "error" : null}`}
              autoFocus={true || mode === "create"}
              onFocus={() => setIsNameEditable(true)}
              onBlur={() => setIsNameEditable(false)}
              bordered={false}
              spellCheck={false}
              value={name}
              onChange={(e) => nameChangeCallback(e.target.value)}
              placeholder={namePlaceholder}
              onPressEnter={() => setIsNameEditable(false)}
            />
          ) : (
            <div className="editor-title">
              <Typography.Text
                ellipsis={true}
                onClick={() => {
                  setIsNameEditable(true);
                }}
              >
                {name ? name : namePlaceholder}
              </Typography.Text>
              <BiPencil onClick={() => setIsNameEditable(true)} />
            </div>
          )}
        </Row>
        <Row className="editor-title-description">
          {isDescriptionEditable ? (
            <TextArea
              ref={textAreaRef}
              autoSize={{ minRows: 1, maxRows: 3 }}
              // onFocus={() => setIsDescriptionEditable(true)}
              onBlur={() => setIsDescriptionEditable(false)}
              bordered={false}
              maxLength={180}
              value={description}
              onChange={(e) => descriptionChangeCallback(e.target.value)}
              placeholder={descriptionPlaceholder}
              onPressEnter={() => setIsDescriptionEditable(false)}
            />
          ) : (
            <div className="editor-description">
              <Typography.Paragraph
                ellipsis={{
                  rows: 3,
                }}
                editable={{
                  icon:
                    description.length > 0 ? (
                      <RQButton
                        onClick={() => setIsDescriptionEditable(true)}
                        className="edit-description-btn"
                        type="text"
                      >
                        Edit description
                      </RQButton>
                    ) : (
                      <></>
                    ),
                  tooltip: false,
                }}
                onClick={() => setIsDescriptionEditable(true)}
              >
                {description ? description : descriptionPlaceholder}
              </Typography.Paragraph>
            </div>
          )}
        </Row>
      </Col>
    </Row>
  );
};
