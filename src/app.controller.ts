import { Controller, Get, HttpException, Req } from "@nestjs/common";
import { AccessToken } from "livekit-server-sdk";
import { CustomRequest } from "src/shared/custom-interface";
// (async () => {
//   const openaiUtil = await import("./shared/utility/openai.util");
//   console.log("🚀 ~ openaiUtil:", openaiUtil);
// })();

@Controller()
export class AppController {
  constructor() {}

  @Get()
  async Home(@Req() req: CustomRequest): Promise<string> {
    return "Cms is running is running";
  }

  generateLiveKitToken = async (
    participantName: string,
    roomName: string,
    metadata: string
  ) => {
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: participantName, // Unique identifier for the participant
        ttl: 3600 // Token expiry in seconds (1 hour)
      }
    );

    // Attach metadata to the participant
    at.addGrant({
      roomJoin: true,
      room: roomName
    });
    at.metadata = JSON.stringify(metadata); // Metadata as a JSON string

    return at.toJwt(); // Return the token
  };

  @Get("getLiveKitToken")
  async GetLiveKitToken(@Req() req: CustomRequest): Promise<any> {
    const { userName, roomName, metadata } = req.query as {
      userName: string;
      roomName: string;
      metadata: string;
    };

    if (!userName || !roomName || !metadata) {
      //   return res.status(400).send("Missing required parameters");
      throw new HttpException("Missing required parameters", 500);
    }

    try {
      const token = await this.generateLiveKitToken(
        userName,
        roomName,
        metadata
      );
      return { token };
    } catch (error) {
      //   res.status(500).send("Error generating token");
      throw error;
    }
  }
}
