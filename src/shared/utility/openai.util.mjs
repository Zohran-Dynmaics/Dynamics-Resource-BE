import {
  // type JobContext,
  WorkerOptions,
  cli,
  defineAgent,
  llm,
  multimodal
} from "@livekit/agents";
import * as openai from "@livekit/agents-plugin-openai";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { ConfigService } from "@nestjs/config";
import * as dotenv from "dotenv";

dotenv.config();
// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const __dirname = path.dirname(__filename);

// Define the LiveKit Agent
export default defineAgent({
  entry: async (ctx) => {
    try {
      await ctx.connect();
      console.log("Waiting for participant...");
      const participant = await ctx.waitForParticipant();
      console.log(
        `Starting assistant for participant: ${participant.identity}`
      );

      const model = new openai.realtime.RealtimeModel({
        instructions: `You are a helpful assistant that can answer questions and also perform actions like getting weather information based on user commands. If the user asks about the weather for any location, use the weather function to respond.`,
        apiKey: process.env.OPENAI_API_KEY,
        voice: "sage",
        temperature: 0.7,
        maxResponseOutputTokens: 2500,
        turnDetection: {
          type: "server_vad",
          threshold: 0.7,
          prefix_padding_ms: 1000,
          silence_duration_ms: 1000
        }
      });

      const fncCtx = {
        weather: {
          description:
            'Get weather information when a user asks about the current weather for a specific location. Examples: "What is the weather in Dubai?" or "Tell me the weather in New York".',
          parameters: z.object({
            location: z.string().describe("The location to get the weather for")
          }),
          execute: async ({ location }) => {
            console.debug(`Executing weather function for ${location}`);
            try {
              const response = await fetch(
                `https://wttr.in/${location}?format=%C+%t`
              );
              if (!response.ok) {
                throw new Error(
                  `Weather API returned status: ${response.status}`
                );
              }
              const weather = await response.text();
              return `The weather in ${location} is currently: ${weather}.`;
            } catch (error) {
              console.error(`Error fetching weather data: ${error}`);
              return `I'm having trouble fetching the weather data for ${location}. Please try again later.`;
            }
          }
          // Instead of defining `execute` function locally, we forward it to an RPC endpoint
          // execute: async (params) => {
          //     try {
          //         return await ctx.room.localParticipant!.performRpc({
          //             destinationIdentity: participant.identity,
          //             method: "getUserLocation",
          //             payload: JSON.stringify(params),
          //             responseTimeout: params.highAccuracy ? 10000 : 5000,
          //         });
          //     } catch (error) {
          //         return "Unable to retrieve user location";
          //     }
          // }
        }
        // getCase: {
        //     description: 'get status of case id, when user ask for case status or status of issue he reported.".',
        //     parameters: z.object({
        //         caseid: z.string().describe('get case id from user'),
        //     }),
        //     // Instead of defining `execute` function locally, we forward it to an RPC endpoint
        //     execute: async (params) => {
        //         try {
        //             return await ctx.room.localParticipant!.performRpc({
        //                 destinationIdentity: participant.identity,
        //                 method: "getUserLocation",
        //                 payload: JSON.stringify(params),
        //                 responseTimeout: params.highAccuracy ? 10000 : 5000,
        //             });
        //         } catch (error) {
        //             return "Unable to retrieve user location";
        //         }
        //     }
        // },
      };

      const liveKitAgent = new multimodal.MultimodalAgent({
        model,
        fncCtx
      });

      // Function Call Debugging Logs
      liveKitAgent.on("function_call", (functionName, parameters) => {
        console.log(
          `Function call triggered: ${functionName} with parameters:`,
          parameters
        );
      });

      liveKitAgent.on("function_executed", (functionName, result) => {
        console.log(`Function executed: ${functionName}, result:`, result);
      });

      const session = await liveKitAgent
        .start(ctx.room, participant)
        .then((session) => session);

      if (session) {
        console.log(
          `Agent successfully joined session for participant ${participant.identity}`
        );
      }

      session.conversation.item.create(
        llm.ChatMessage.create({
          role: llm.ChatRole.USER,
          text: "Can you get me the weather information for New York City?"
        })
      );

      // session.conversation.item.create(
      //     llm.ChatMessage.create({
      //         role: llm.ChatRole.USER,
      //         text: 'Say "How can I help you today?"',
      //     }),
      // );

      session.response.create();

      liveKitAgent.on("agent_started_speaking", () => {
        console.log("Agent started speaking.");
      });

      liveKitAgent.on("agent_stopped_speaking", () => {
        console.log("Agent stopped speaking.");
      });

      liveKitAgent.on("error", (error) => {
        console.error("Error during agent function execution:", error);
      });
    } catch (error) {
      console.error("Error in agent entry function:", error);
    }
  }
});

// Add a delay before starting the LiveKit agent to avoid conflicts
setTimeout(async () => {
  try {
    await cli.runApp(new WorkerOptions({ agent: path.resolve(__filename) }));
  } catch (error) {
    console.error("Error running LiveKit agent CLI:", error);
  }
}, 2000); // Delay of 2 seconds
