import React, { useContext, useState, useEffect } from "react";
import styles from "../../styles/earning.module.scss";
import Navbar from "../../layouts/Navbar";
import { getSession, useSession } from "next-auth/react";
import { ContextProvider } from "../../global/context";
import ClosePart from "../../components/profileComp/ClosePart";
import { Drawer, Tag } from "antd";
import Collab from "../../model/collab";
import User from "../../model/userModel";
import connectDb from "../../database/conn";
import DrawerContent from "../../components/Collab/DrawerContent";
import { fetchProjects } from "../../utils/apiTask";
import { useRouter } from "next/router";
import { DataGrid } from "@mui/x-data-grid";
import Image from "next/image";

function ProjectTask({ session }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const router = useRouter();
  const { projectTask } = router.query;
  const {
    data: fetchData,
    mutate: mutatefetchData,
    error: fetchDataError,
    refetch: refetchData,
  } = fetchProjects(projectTask);

  const handleRowClick = (params) => {
    mutatefetchData();
    setSelectedRecord(params.row); // Save the clicked row's data
    setOpenDrawer(true); // Open the drawer
  };
  useEffect(() => {
    if (selectedRecord) {
      mutatefetchData();
    }
  }, [mutatefetchData, selectedRecord]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: "3.5rem",
            height: "3.5rem",
            display: "flex",
            flexShrink: "0",
            borderRadius: '50%',
            overflow: 'hidden',
            marginRight: 10,
            position: 'relative',
            border: "2px solid white"
          }}>
            <Image
              src={params.row.userImage}
              alt={params.row.name}
             fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          {params.row.name}
        </div>
      ),
    },
    { field: "control_type", headerName: "Type", width: 150 },
    { field: "role", headerName: "Role", width: 200 },
    {
      field: "owner",
      headerName: "Owner",
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: "3.5rem",
            height: "3.5rem",
            display: "flex",
            flexShrink: "0",
            borderRadius: '50%',
            overflow: 'hidden',
            marginRight: 10,
            position: 'relative',
            border: "2px solid white"
          }}>
            <Image
              src={params.row.ownerImage}
              alt={params.row.owner}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover', display: "flex", flexShrink: "0" }}
            />
          </div>
          {params.row.owner}
        </div>
      ),
    },
    {
      field: "progress",
      headerName: "Progress",
      width: 150,
      renderCell: (params) => {
        const progress = params.value;
        const color =
          progress === "Completed"
            ? "green"
            : progress === "In Progress"
            ? "blue"
            : "gray";
        return (
          <Tag color={color} style={{ cursor: "pointer" }}>
            {progress === "Completed"
              ? "Completed"
              : progress === "In Progress"
              ? "In Progress"
              : "Not Started"}
          </Tag>
        );
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 150,
      renderCell: (params) => {
        const priority = params.value;
        const color =
          priority === "Urgent"
            ? "red"
            : priority === "High"
            ? "gold"
            : priority === "Medium"
            ? "blue"
            : "green";
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    { field: "dueDate", headerName: "Due Date", width: 150 },
  ];
  const dummyData = fetchData?.data?.collabRequests
    ?.filter((value) => value.IsAccepted) // Filter only accepted requests
    ?.map((value, index) => ({
      id: index, // DataGrid requires a unique id for each row
      task: value.task_title || "Default Task",
      key: `${value?.userid?._id}`,
      assignee_id: value?.userid?._id,
      name: value?.userid?.name,
      userImage: value?.userid?.image || "/default.png", // Add user image
      ownerId: `${fetchData?.data?.userid?._id}`,
      ownerImage: fetchData?.data?.userid?.image || "/default.png", // Add owner image
      control_type: fetchData?.data?.collaborationType,
      role: value?.userid?.designation,
      description: value?.tasks?.description,
      owner: `${fetchData?.data?.userid?.name}`,
      progress: value?.tasks?.status,
      comments: value?.tasks.comments,
      priority: value?.tasks?.priority || "Urgent",
      dueDate: value?.tasks?.dueDate,
      attachmentFiles: value?.tasks.attachment,
      attachmentComment: value?.tasks.attachment,
    }));

  return (
    <>
      <Navbar select={"earnings"} session={session} />
      <div className={styles.main}>
        <div className={styles.centerProjectTask}>
          <div className={styles.WrapperDisplay}>
            <div className={styles.sideBarMobHeader}>
              <ClosePart title={fetchData?.data?.title} linkBar={"me/project"} />
            </div>
            <div className={styles.display}>
              <div className={styles.containerChartTask}>
                <h3 className={styles.title}>{fetchData?.data?.title}</h3>
                <div style={{ height: "auto", width: "100%" }}>
                  <DataGrid
                    rows={dummyData}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onRowClick={handleRowClick}
                    hideFooter={true}
                    sx={{
                      display: "grid",
                      fontFamily: '"Inter", sans-serif, "Fira Sans"', // Apply font family here
                      fontSize: "1.5rem",
                    }}
                  />
                </div>
              </div>
              {openDrawer && (
                <Drawer
                  title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: "3rem",
                        height: "3rem",
                        display: "flex",
                        flexShrink: "0",
                        borderRadius: '50%',
                        overflow: 'hidden',
                        marginRight: 10,
                        position: 'relative',
                        border: "2px solid white"
                      }}>
                        <Image
                          src={selectedRecord?.userImage || "/images/default-user.png"}
                          alt={selectedRecord?.name || "User"}
                          fill
                          sizes="30px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <span>Details of {selectedRecord?.name}</span>
                    </div>
                  }
                  placement="right"
                  onClose={() => setOpenDrawer(false)}
                  open={openDrawer}
                  width={450}
                  className={styles.drawer}
                >
                  <DrawerContent
                    session={session}
                    projectTask={projectTask}
                    mutatefetchData={mutatefetchData}
                    record={selectedRecord}
                    setSelectedRecord={setSelectedRecord}
                  />
                </Drawer>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const { projectTask } = query;

  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { id, username, isNewUser } = session?.user;
  if (isNewUser) {
    return {
      redirect: {
        destination: "/getting-started",
        permanent: false,
      },
    };
  }

  try {
    // const response = await fetch(`${process.env.NEXTAUTH_URL}/api/collab/collabProject?projectTask=${query.projectTask}`);
    // const projectData = await response.json();
    let postData = await Collab.findOne({ _id: projectTask }).populate(
      "userid",
      "name username image"
    );

    // Populate additional nested fields
    postData = await User.populate(postData, [
      {
        path: "collabRequests.userid",
        select: "name designation image",
      },
      {
        path: "likes.user",
        select: "name username image",
      },
      {
        path: "tag.userid",
        select: "name username",
      },
      {
        path: "collabRequests.tasks.comments.commentUser",
        select: "name image",
      },
    ]);

    // if (!postData?) {
    //   return {
    //     redirect: {
    //       destination: "/me/project",
    //       permanent: false,
    //     },
    //   };
    // }
    // Check if user is owner or assignee
    const isOwner = postData.userid._id == id;

    const isAssignee = postData.collabRequests?.some(
      request => request.IsAccepted && request.userid._id == id
    );
    if (!isOwner && !isAssignee) {
      return {
        redirect: {
          destination: "/me/project",
          permanent: false,
        },
      };
    }

    return {
      props: {
        session,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      redirect: {
        destination: "/me/project",
        permanent: false,
      },
    };
  }
}

export default ProjectTask;

