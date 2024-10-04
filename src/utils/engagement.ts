import { EngagementAction } from "@prisma/client";
import {
  type EngagementActionRecord,
  type EngagementActionDataDb,
} from "../lib/interface";
import { capitalize } from "./string";

export const actionMap: EngagementActionRecord = {
  [EngagementAction.CreateCopyPasta]: { action: "create", type: "copyPasta" },
  [EngagementAction.ApproveCopyPasta]: { action: "approve", type: "copyPasta" },
  [EngagementAction.GiveReaction]: { action: "give", type: "reaction" },
  [EngagementAction.RemoveReaction]: { action: "remove", type: "reaction" },
  [EngagementAction.CreateCollection]: { action: "create", type: "collection" },
  [EngagementAction.DeleteCollection]: { action: "delete", type: "collection" },
};

export function handleEngagementAction(
  action: EngagementAction,
  resourceId: string | null,
): EngagementActionDataDb {
  const actionData = actionMap[action];

  return {
    engagementType: action,
    action: actionData.action,
    id: resourceId,
    type: actionData.type,
  };
}

export function parseEngagementLogs(log: EngagementActionDataDb) {
  let action = "";
  let activity = "";

  switch (log.action) {
    case "create":
      action = "Membuat";
      break;
    case "approve":
      action = "disetujui";
      break;
    case "delete":
      action = "Menghapus";
      break;
    case "give":
      action = "Memberikan";
      break;
    case "remove":
      action = "Menghapus";
      break;
  }

  switch (log.type) {
    case "collection":
      activity = "koleksi";
      break;
    case "copyPasta":
      activity = "template";
      break;
    case "reaction":
      activity = "reaksi pada template";
      break;
  }

  if (log.action === "approve") {
    return {
      text: `${capitalize(activity)} ${action}`,
      action: `link`,
    };
  }

  return {
    text: `${action} ${activity}`,
    action: `link`,
  };
}
