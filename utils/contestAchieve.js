import Achievement from "../model/achievments";
import connectDb from "../database/conn";
import Competition from "../model/competition";
import User from "../model/userModel";

export async function contestAchieve(id, io) {
  await connectDb();
  let userSubmit = await Competition.findOne({ _id: id });
  if (userSubmit.contestState === "previous") {
    userSubmit.submission.sort((a, b) => b.score - a.score);

    const topRankers = userSubmit.submission.slice(0, 10);

    const promises = [];

    topRankers.forEach((code) => {
      const ranker = code.userSub;
      if (
        !userSubmit.rankers.some(
          (rankerEntry) => rankerEntry.userRank == ranker
        )
      ) {
        userSubmit.rankers.push({ userRank: ranker });
      }

      const userAchieve = new Achievement({
        userId: ranker,
        contestId: id,
        level: userSubmit.stage,
        solution: code.solution,
        score: code.score,
      });

      // Push the save promise into the promises array.
      promises.push(userAchieve.save());
      // const io = req.socket.server.io;
      userAchieve
        .populate("userId", "name image designation praise")
        .then((populatedData) => {
          io.emit("contestRankers", populatedData);
        })
        .catch((error) => {
          console.error("Error populating userAchievement:", error);
        });
    });
    // Use Promise.all to wait for all the save operations to complete.
    await Promise.all(promises);
    // Save the updated userSubmit
    await Competition.findByIdAndUpdate(userSubmit._id, userSubmit);

    /* update scores in user model */
    const userIdsToUpdate = [
      ...new Set(userSubmit.submission.map((submission) => submission.userSub)),
    ];

    // Fetch and update user documents in the User model
    await Promise.all(
      userIdsToUpdate.map(async (userId) => {
        // const userSubmissions = userSubmit.submission.filter(
        //   (submission) => submission.userSub == userId
        // );
        const userRanker = userSubmit.rankers.find(
          (rank) => rank.userRank == userId
        );

        const skillWise = await User.find({
          skills: {
            $elemMatch: {
              skill: userSubmit.language,
              points: { $ne: 0 },
            },
          },
        });

        // to assign ranks skill wise
        const sortedUsers = skillWise.sort((a, b) => {
          const skillA =
            a.skills.find((skill) => skill.skill === userSubmit.language)
              ?.points || 0;
          const skillB =
            b.skills.find((skill) => skill.skill === userSubmit.language)
              ?.points || 0;

          return skillB - skillA; // Sort in descending order by points
        });

        sortedUsers.forEach(async (user, index) => {
          const skillIndex = user.skills.findIndex(
            (skill) => skill.skill === userSubmit.language
          );

          if (skillIndex !== -1) {
            user.skills[skillIndex].rank = index + 1;

            await User.updateOne(
              { _id: user._id, "skills.skill": userSubmit.language },
              { $set: { "skills.$.rank": index + 1 } }
            );
          }
        });

        // to assign overall ranks
        const users = await User.find({});

       
        const sortedUserData = users.sort((a, b) => {
          return (b?.points || 0) - (a?.points || 0);
        });
        
        
        sortedUserData.forEach(async (user, index) => {
          user.rank = index + 1; 
        
          await User.updateOne(
            { _id: user._id },  
            { $set: { rank: index + 1 } } 
          );
        });
                
        const updateLevelUser = {
          $set: {
            level: userSubmit.stage,
          },
        };

        await User.findByIdAndUpdate(userId, updateLevelUser);

        if (userRanker) {
          const updateUser = {
            $inc: {
              achievements: 1,
              "skills.$.achievements": 1,
            },
          };

          await User.findOneAndUpdate(
            { _id: userId, "skills.skill": userSubmit.language },
            updateUser
          );
        }

        //   if (hasSelectedLanguage) {
        //     // If the user has the selected language, update their skills with rank and points
        //     const updateSkill = {
        //       $inc: {
        //         "skills.$.points": newTotalScore,
        //       },
        //     };

        //     if (userRanker) {
        //       // Increment achievements for this skill if the user is a ranker
        //       updateSkill.$inc["skills.$.achievements"] = 1;
        //     }

        //     await User.findOneAndUpdate(
        //       {
        //         _id: userId,
        //         "skills.skill": userSubmit.language,
        //       },
        //       updateSkill
        //     );
        //   } else {
        //     // If the user doesn't have the selected language, add it to their skills with rank, points, and achievements
        //     const newSkill = {
        //       skill: userSubmit?.language,
        //       points: newTotalScore,
        //     };

        //     if (userRanker) {
        //       // Increment achievements for this skill if the user is a ranker
        //       newSkill.achievements = 1;
        //     } else {
        //       newSkill.achievements = 0;
        //     }

        //     await User.findOneAndUpdate(
        //       { _id: userId },
        //       {
        //         $push: {
        //           skills: newSkill,
        //         },
        //       }
        //     );
        //   }

        //   // Update the User model
        //   await User.findByIdAndUpdate(userId, updateUser);
      })
    );
  }
}
