import { join } from "path";
import type { Service } from "../../types/index.js";
import { PROTO_PATH } from "../path.js";

const name: string = "ChatsService";
const packageName: string = "chats.v1";
const path: string = join(PROTO_PATH, "chats.proto");

export const CHATS_SERVICE = {
  NAME: name,
  CREATE_CHAT: "CreateChat",
  UPDATE_CHAT: "UpdateChat",
  DELETE_CHAT: "DeleteChat",
  GET_CHAT_BY_ID: "GetChatById",
  GET_CHATS_BY_NAME: "GetChatsByName",
  ADD_MEMBER_TO_CHAT: "AddMemberToChat",
  REMOVE_MEMBER_FROM_CHAT: "RemoveMemberFromChat",
  CHANGE_ROLE: "ChangeRole",
} as const;

export const CHATS_CLIENT: Omit<Service, "url"> = {
  name,
  package: packageName,
  path,
};

export function createChatsService(url: string): Service {
  return {
    name,
    package: packageName,
    path,
    url,
  };
}
