import { Controller, Get, HttpException, Req } from "@nestjs/common";
import axios from "axios";
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

  generateLiveKitToken = async (participantName: string, roomName: string) => {
    try {
      const response = await axios.post(
        process.env.SANDBOX_URL,
        {},
        {
          headers: {
            "X-Sandbox-ID": process.env.SANDBOX_ID,
            "Content-Type": "application/json"
          },
          params: {
            roomName: roomName,
            /* In the code snippet provided, `participantName: participantName` is setting the value of
            the `participantName` parameter in the request to the value of the `participantName`
            variable passed into the `generateLiveKitToken` function. */
            participantName: participantName
          }
        }
      );

      if (response.data && response.data.participantToken) {
        return response.data.participantToken;
      } else {
        throw new Error("Token generation failed: No token in response");
      }
    } catch (error) {
      console.error("Error generating token from LiveKit Sandbox:", error);
      throw new Error("Failed to generate LiveKit token");
    }
  };

  @Get("getLiveKitToken")
  async GetLiveKitToken(@Req() req: CustomRequest): Promise<any> {
    const { userName, roomName } = req.query as {
      userName: string;
      roomName: string;
    };

    if (!userName || !roomName) {
      //   return res.status(400).send("Missing required parameters");
      throw new HttpException("Missing required parameters", 500);
    }

    try {
      const token = await this.generateLiveKitToken(userName, roomName);
      return { token };
    } catch (error) {
      //   res.status(500).send("Error generating token");
      throw error;
    }
  }
}
