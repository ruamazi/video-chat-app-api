import { StreamChat } from "stream-chat";

const apiKey = process.env.GET_STREAM_IO_KEY;
const apiSecret = process.env.GET_STREAM_IO_SEC;

if (!apiKey || !apiSecret) {
 throw new Error("Missing GetStream.io API key or secret");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (user) => {
 try {
  await streamClient.upsertUsers([user]);
  return user;
 } catch (error) {
  console.error("Error upserting Stream user:", error);
 }
};

export const generateStreamToken = (userId) => {
 const id = userId.toString();
 const token = streamClient.createToken(id);
 return token;
};
