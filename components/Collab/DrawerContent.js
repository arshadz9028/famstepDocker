import React, { useState, useEffect } from "react";
import {
  Input,
  Tag,
  Drawer,
  Divider,
  Button,
  Tabs,
  DatePicker,
  Upload,
  Select,
  message,
  Menu,
  Dropdown,
} from "antd";
import { MdDelete } from "react-icons/md";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import styles from "./ControlDrawer.module.scss";
import axios from "axios";
import dayjs from "dayjs";
import { makeLinksClickable } from "../../utils/textUtils";
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

function DrawerContent({
  mutatefetchData,
  record,
  setSelectedRecord,
  projectTask,
  session,
}) {
  const [descriptionValue, setDescriptionValue] = useState("");
  const [editDescription, setEditDescription] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [commentAttachment, setCommentAttachment] = useState();
  const [editComment, setEditComment] = useState(false);
  const handleEditClick = () => {
    setEditDescription(true);
    setDescriptionValue(record.description);
  };
  const [attachments, setAttachments] = useState([
    { name: "azure.png", id: 1 },
  ]);
  const handleCommentAttachment = async ({ file }) => {
    const actualFile = file.originFileObj || file;
    setCommentAttachment(actualFile);
    const formData = new FormData();
    formData.append("attach_file2", commentAttachment);
    formData.append("projectTask", projectTask);
    formData.append("assigneeId", record?.assignee_id);
    try {
      const response = await axios.post("/api/collab/addTaskComment", formData);
      mutatefetchData();
      const attach = response?.data.data;
      const newComment = {
        comment: commentValue || "Shared an attachment",
        commentUser: {
          _id: session.user.id,
          name: session.user.name,
          image: session.user.image,
        },
        _id: response?.data?.commentId,
        createdAt: new Date(),
        // Add attachment URL if available
        commentAttachment: attach || null,
      };
      // Update local state immediately
      setSelectedRecord((prevRecord) => ({
        ...prevRecord,
        comments: [newComment, ...(prevRecord.comments || [])],
      }));
    } catch (error) {
      console.log(error);
    }
  };
    const handleUploadChange = async ({ file }) => {
    if (file.status === "done") {
      const actualFile = file.originFileObj || file;
      const fileToUpload = Object.assign(actualFile, {
        preview: URL.createObjectURL(actualFile),
      });

      const newAttachment = { name: file.name, id: Date.now() };
      const formData = new FormData();
      formData.append("attach_file", actualFile);
      formData.append("projectTask", projectTask);
      formData.append("assigneeId", record?.assignee_id);
      try {
        const response = await axios.post(
          "/api/collab/addAttachment",
          formData
        );
        const attach = response?.data.data;
        setSelectedRecord((prevRecord) => ({
          ...prevRecord,
          attachmentFiles: attach,
        }));
        if (response.success) {
          message.success(`${file.name} uploaded successfully.`);
        }
      } catch (error) {
        console.log(error);
      }
      mutatefetchData();
      // setAttachments((prevAttachments) => [...prevAttachments, newAttachment]);
    }
  };
  const handleDeleteComment = async (id) => {
    try {
      const response = await axios.delete(
        `/api/collab/deleteComment?projectTask=${projectTask}&assigneeId=${record?.assignee_id}&commentId=${id}`
      );
      mutatefetchData();
      if (response.status === 200) {
        message.success(`Comment removed.`);
        setSelectedRecord((prevRecord) => ({
          ...prevRecord,
          comments: prevRecord.comments.filter((comment) => comment._id !== id),
        }));
      } else {
        message.error("Failed to remove comment.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveAttachment = async (id) => {
    // setAttachments((prevAttachments) =>
    //   prevAttachments.filter((attachment) => attachment.id !== id)
    // );
    setSelectedRecord((prevRecord) => ({
      ...prevRecord,
      attachmentFiles: "",
    }));
    try {
      const response = await axios.delete(
        `/api/collab/deleteAttachment?projectTask=${projectTask}&assigneeId=${record?.assignee_id}&fileUrl=${record?.attachmentFiles}`
      );
      if (response.success) {
        message.success(`Attachment removed.`);
      }
    } catch (error) {
      console.log(error);
    }
  await mutatefetchData();
  };
  const handleStatusChange = async (progress) => {
    setSelectedRecord({
      ...record,
      progress,
    });
  //  const res=  await axios.put(`/api/collab/updateStatus?projectTask=${projectTask}&assigneeId=${record?.assignee_id}`,{status})
  //  mutatefetchData();
  };
  const statusMenu = {
    items: [
      { key: "Not Started", label: "Not Started" },
      { key: "In Progress", label: "In Progress" },
      { key: "Completed", label: "Completed" }
    ],
    onClick: (e) => handleStatusChange(e.key)
  };
  const handlePriorityChange = (priority) => {
    setSelectedRecord({ ...record, priority });
  };
  const handleDescriptionSave = () => {
    setEditDescription(false);
    setSelectedRecord({ ...record, description: descriptionValue });
    mutatefetchData();
  };
  const priorityMenu = {
    items: [
      { key: "Urgent", label: "Urgent" },
      { key: "High", label: "High" },
      { key: "Medium", label: "Medium" },
      { key: "Low", label: "Low" }
    ],
    onClick: (e) => handlePriorityChange(e.key)
  };

  const handleDateChange = (date) => {
    if (date) {
      setSelectedRecord({
        ...record,
        dueDate: date.format("YYYY-MM-DD"), // Dayjs format
      });
    }
  };
  const tasks = {
    projectTask,
    assigneeId: record?.assignee_id,
    progress: record?.progress,
    priority: record?.priority,
    dueDate: record?.dueDate,
    description: record?.description,
    attachment: attachments,
    commentValue,
    commentAttachment: commentAttachment || "",
  };
  useEffect(() => {
    if (!record) return;
    const handleTasks = async () => {
      try {
        await axios.put(`/api/collab/addTasks?projectTask=${projectTask}`, {
          tasks,
        });
        mutatefetchData();
      } catch (error) {
        console.error(error);
      }
    };
    handleTasks();
  }, [record]);
  const handleCommentClick = () => {
    setEditComment(true);
    // setCommentValue(selectedTask.description);
  };
  const handleCommentSave = async () => {
    // Don't save if no comment and no attachment
    if (!commentValue && !commentAttachment) {
      message.info("Please add a comment or an attachment");
      return;
    }
    try {
      // If we have an attachment, upload it first
      let attachmentUrl = null;
      if(commentValue){
        
        try {
          const response = await axios.put(
            `/api/collab/addTasks?projectTask=${projectTask}`,
            {
              tasks,
            }
          );
          setCommentValue("");
          mutatefetchData();
          if (response.status === 200) {
            setCommentAttachment(null);
            message.success("Comment sent successfully.");
          } else {
            message.error("Failed to save comment.");
          }
        } catch (error) {
          console.error(error);
        }
      }else {
        const formData = new FormData();
        formData.append("attach_file2", commentAttachment.file);
        formData.append("projectTask", projectTask);
        formData.append("assigneeId", record?.assignee_id);
        
        // Use the dedicated comment attachment API
        const response = await axios.post(
          `/api/collab/addTaskComment`,
          formData
        );
        if (response.data.success) {
          setCommentAttachment(); // Reset attachment after upload
          // Note that your API returns the URL directly in data
          attachmentUrl = response.data.data;
        }
      } 
      
      
      
      // Create local comment object with attachment if available
      const newComment = {
        comment: commentValue || "Shared an attachment",
        commentUser: {
          _id: session.user.id,
          name: session.user.name,
          image: session.user.image,
        },
        createdAt: new Date(),
        // Add attachment URL if available
        commentAttachment: attachmentUrl || null,
      };

      // Update local state immediately
      setSelectedRecord((prevRecord) => ({
        ...prevRecord,
        comments: [newComment, ...(prevRecord.comments || [])],
      }));

      // Reset form after submission
      setCommentValue("");
      setCommentAttachment(null);
      
      // Refresh data from server
      mutatefetchData();
    } catch (error) {
      console.error("Error saving comment:", error);
      message.error("Failed to save comment");
    }
  };

  const isAdmin = record?.ownerId === session.user.id;
  const isMember = record?.assignee_id === session.user.id;

  // Add a helper function to determine if the file is an image
  const isImageFile = (url) => {
    if (!url) return false;
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const extension = url.split(".").pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  return (
    <div>
      <div className={styles.section}>
        <span className={styles.fieldLabel}>Status:</span>
        <Dropdown
          menu={statusMenu}
          trigger={["click"]}
          disabled={!isMember}
        >
          <Button type="text" style={{ padding: 0, margin: 0 }}>
          <Tag
            color={
              record.progress === "Completed"
                ? "green"
                : record.progress === "In Progress"
                ? "blue"
                : "gray"
            }
              style={{ cursor: isMember ? "pointer" : "default" }}
          >
            {record.progress === "Completed"
              ? "Completed"
              : record.progress === "In Progress"
              ? "In Progress"
              : "Not Started"}
          </Tag>
          </Button>
        </Dropdown>
      </div>

      {/* Due Date */}
      <div className={styles.section}>
        <span className={styles.fieldLabel}>Due Date:</span>
        {/* <DatePicker defaultValue={record?.due_date} /> */}
        <DatePicker
          value={record?.dueDate ? dayjs(record.dueDate) : null} // Convert to Dayjs
          onClick={() => {
            if (isAdmin) {
              setSelectedRecord({
                ...record,
                dueDate: null,
              });
            }
          }}
          onChange={isAdmin ? handleDateChange : null} // Allow changes only if isAdmin
          className={styles.datePicker}
          suffixIcon={<CalendarOutlined />}
          disabled={!isAdmin} // Disable DatePicker if not admin
          disabledDate={(current) => current.isBefore(dayjs(), "day")} // Disable past dates
        />
      </div>

      {/* Priority */}
      <div className={styles.section}>
        <span className={styles.fieldLabel}>Priority:</span>
        <Dropdown
          menu={priorityMenu}
          trigger={["click"]}
          disabled={!isAdmin}
        >
          <Button type="text" style={{ padding: 0, margin: 0 }}>
          <Tag
            color={
                record?.priority === "Urgent"
                ? "red"
                  : record?.priority === "High"
                ? "gold"
                  : record?.priority === "Medium"
                ? "blue"
                : "green"
            }
            style={{
                cursor: isAdmin ? "pointer" : "default",
            }}
          >
              {record?.priority}
          </Tag>
          </Button>
        </Dropdown>
      </div>

      {/* Editable Description */}
      <div className={styles.section_desc}>
        <p className={styles.descrpt}>
          <span className={styles.fieldLabel}>Description:</span>
          {isAdmin && (
            <>
              {editDescription ? (
                <CheckOutlined
                  onClick={handleDescriptionSave}
                  style={{ cursor: "pointer", color: "green", marginLeft: 8 }}
                />
              ) : (
                <EditOutlined
                  onClick={handleEditClick}
                  style={{ cursor: "pointer", color: "gray", marginLeft: 8 }}
                />
              )}
            </>
          )}
        </p>
        {editDescription ? (
          <textarea
            value={descriptionValue}
            onChange={(e) => setDescriptionValue(e.target.value)}
            style={{
              height: "100px",
              width: "100%",
              fontSize: "15px",
              padding: "10px",
              marginTop: "1rem",
              marginBottom: "1rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              resize: "vertical"
            }}
          />
        ) : (
          <p
            style={{
              padding: "10px 5px",
              borderRadius: "4px",
              fontSize: "1.5rem",
              fontWeight: "400",
              textArea: "right",
              wordBreak: "break-all",
              wordWrap: "break-word"
            }}
          >
            {record.description}
          </p>
        )}
      </div>

      <div className={styles.section_desc}>
        <div className={styles.attach}>
          <span className={styles.fieldLabel}>Attachments:</span>
          {isAdmin && (
            <div className={styles.attachments}>
              <Upload
                customRequest={({ file, onSuccess, onError }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
                showUploadList={false}
                onChange={handleUploadChange}
                accept="image/*,application/pdf"
              >
                {!record?.attachmentFiles && (
                  <Button type="dashed" icon={<PlusOutlined />}>
                    Add
                  </Button>
                )}
              </Upload>
            </div>
          )}
        </div>

        <div className={styles.attachmentRow}>
          {(isMember || isAdmin) && record?.attachmentFiles ? (
            <p
              onClick={async () => {
                try {
                  const res = await fetch(record?.attachmentFiles);
                  const arrayBuffer = await res.arrayBuffer();

                  // Extract file extension from the URL
                  const urlParts = record?.attachmentFiles.split(".");
                  const fileExtension =
                    urlParts[urlParts.length - 1]?.toLowerCase();

                  // Define MIME types for different file types
                  const mimeTypes = {
                    pdf: "application/pdf",
                    png: "image/png",
                    jpg: "image/jpeg",
                    jpeg: "image/jpeg",
                    xls: "application/vnd.ms-excel",
                    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    doc: "application/msword",
                    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  };

                  const mimeType =
                    mimeTypes[fileExtension] || "application/octet-stream";
                  const fileName = `downloaded_file.${fileExtension}`;

                  const file = new File([arrayBuffer], fileName, {
                    type: mimeType,
                  });

                  const link = document.createElement("a");
                  link.href = window.URL.createObjectURL(file);
                  link.download = fileName;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } catch (error) {
                  console.error("Error downloading file:", error);
                }
              }}
            >
              Attached_file
            </p>
          ) : (
            <></>
          )}
          {isAdmin && record?.attachmentFiles && (
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveAttachment()}
            />
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        defaultActiveKey="1"
        className={styles.customTabs}
        items={[
          {
            key: "2",
            label: <span style={{ color: '#044280', fontWeight: '500' }}>Comments</span>,
            children: (
              <div>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "500",
                        fontSize: "16px",
                        margin: 0,
                        color: "#044280",
                      }}
                    >
                      Add Comments
                    </p>
                  </div>
                </div>

                <div style={{ position: "relative" }}>
                  <textarea
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                    style={{
                      height: "120px",
                      width: "100%",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      boxSizing: "border-box",
                      resize: "vertical",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      outline: "none",
                      transition: "border 0.3s, box-shadow 0.3s",
                      marginBottom: "12px",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "10px",
                      marginBottom:15
                    }}
                  >
                    <Upload
                      customRequest={({ file, onSuccess }) => {
                        setTimeout(() => {
                          onSuccess("ok");
                        }, 0);
                      }}
                      onChange={handleCommentAttachment}
                      showUploadList={false}
                      accept="image/*,application/pdf,.docx,.xlsx"
                    >
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f0f0f0",
                          color: "#595959",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 10px",
                          fontSize: "13px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "background-color 0.3s",
                          height: "36px",
                        }}
                      >
                        <PlusOutlined style={{ marginRight: "4px" }} />
                        <span>Attach</span>
                      </button>
                    </Upload>

                    <button
                      onClick={handleCommentSave}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#044280",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                        boxShadow: "0 2px 0 rgba(0,0,0,0.045)",
                        height: "36px",
                      }}
                    >
                      <span>Send</span>
                      <span style={{ marginLeft: "6px" }}>➤</span>
                    </button>
                  </div>
                </div>
                {record?.comments
                  ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((value) => (
                    <div className={styles.main_Main} key={value._id}>
                      <div className={styles.comment_section}>
                        <div className={styles.img}>
                          <div className={styles.imgCover}>
                            <Image
                              src={value.commentUser.image || "/images/default-user.png"}
                              className={styles.img1}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              alt={value.commentUser.name || "User image"}
                            />
                          </div>
                          <p>{value.commentUser?.name}</p>
                        </div>
                        <div className={styles.Serial}>
                          <p className={styles.createdAT}>
                            {dayjs(value.createdAt).format("DD/MM/YY hh:mm")}
                          </p>
                          {value?.commentUser?._id == session?.user?.id && (
                            <div onClick={() => handleDeleteComment(value?._id)}>
                              <MdDelete className={styles.delete} />
                            </div>
                          )}
                        </div>
                      </div>
                      <p className={styles.main_comment}>{makeLinksClickable(value.comment)}</p>

                      {value.commentAttachment && (
                        <div className={styles.attachment_comment}>
                          <a
                            onClick={async () => {
                              try {
                                const res = await fetch(value.commentAttachment);
                                const arrayBuffer = await res.arrayBuffer();
                                const urlParts = value.commentAttachment.split(".");
                                const fileExtension = urlParts[urlParts.length - 1]?.toLowerCase();
                                const mimeTypes = {
                                  pdf: "application/pdf",
                                  png: "image/png",
                                  jpg: "image/jpeg",
                                  jpeg: "image/jpeg",
                                  xls: "application/vnd.ms-excel",
                                  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                  doc: "application/msword",
                                  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                };
                                const mimeType = mimeTypes[fileExtension] || "application/octet-stream";
                                const fileName = `attachment.${fileExtension}`;
                                const file = new File([arrayBuffer], fileName, { type: mimeType });
                                const link = document.createElement("a");
                                link.href = window.URL.createObjectURL(file);
                                link.download = fileName;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              } catch (error) {
                                console.error("Error downloading file:", error);
                              }
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#044280",
                              cursor: "pointer",
                              textDecoration: "none",
                            }}
                          >
                            {isImageFile(value.commentAttachment) ? (
                              <div style={{ marginRight: "8px", position: "relative" }}>
                                <Image
                                  src={value.commentAttachment}
                                  alt="Preview"
                                  width={40}
                                  height={40}
                                  style={{
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    border: "1px solid #e0e0e0",
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "inline";
                                  }}
                                />
                                <span style={{ display: "none", fontSize: "24px", marginRight: "8px" }}>
                                  📄
                                </span>
                              </div>
                            ) : (
                              <span style={{ fontSize: "24px", marginRight: "8px" }}>📄</span>
                            )}
                            <span>View attachment</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

export default DrawerContent;
