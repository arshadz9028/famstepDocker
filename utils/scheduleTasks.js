import schedule from "node-schedule";
import Competition from "../model/competition";
import { contestAchieve } from "./contestAchieve";
import { deleteTempDire } from "../config/deleteTempDire";
export function scheduleContest(contestData, io) {
  const dateNow = new Date();
  const contestStartDateTime = contestData.combinedStart;
  const contestEndDateTime = contestData.combinedEnd;

  schedule.scheduleJob(contestData.combinedStart, async () => {
   
    try {
      const newData = await Competition.findByIdAndUpdate(
        contestData._id,
        { $set: { contestState: "ongoing" } },
        { new: true }
      );

      io.to(`level-${contestData.stage - 1}`).emit("startContest", newData);
    } catch (error) {
      console.error("Error starting contest:", error);
    }
  });

  schedule.scheduleJob(contestData.combinedEnd, async () => {

    try {
      const newData = await Competition.findByIdAndUpdate(
        contestData._id,
        { $set: { contestState: "previous" } },
        { new: true }
      );

      io.to(`level-${contestData.stage - 1}`).emit("endContest", newData);
      contestAchieve(contestData._id, io);
      deleteTempDire() 
    } catch (error) {
      console.error("Error ending contest:", error);
    }
  });
}
