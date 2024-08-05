import { openai } from "../../../config/openai.config";


const QUESTION =
    "What's the result of 22 plus 5 in decimal added to the hexadecimal number A?";

const tools = [
    {
        type: "function",
        function: {
            name: "get_tasks_of_day",
            description: "Retrieve the tasks of a user for a specified duration (today, tomorrow, or week). Use this function for general task inquiries.",
            parameters: {
                type: "object",
                properties: {
                    filter: {
                        type: "string",
                        description: "The duration of the tasks (today, tomorrow, or week).",
                        enum: ["today", "tomorrow", "week"],
                    },
                    workordertype: {
                        type: "string",
                        description: "The type ID of the user. If reactive, return '112233221'."
                    },
                    screen: {
                        type: "string",
                        description: "this will always be this screen, -> tasks"
                    }
                },
                required: ["filter"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_bookings_for_calendar",
            description: "Get the bookings of a user for a specific date range for the Calendar screen.",
            parameters: {
                type: "object",
                properties: {
                    date: {
                        type: "string",
                        description: "The date for the tasks in ISO format (YYYY-MM-DD). If date is not provided by user, calculate for today. for example today's date is 2024-08-05",
                    },
                    workordertype: {
                        type: "string",
                        description: "The type ID of the user. THis is optional parameter.",
                        enum: ["reactive", "proactive"]
                    },
                    screen: {
                        type: "string",
                        description: "this will always be this screen, -> calender"
                    }
                },
                required: ["date", "screen"],
            },
        },
    },
];

export async function chatCompletion(
    messages: any,
) {

    let options: any = {
        messages,
        tools,
        model: 'gpt-3.5-turbo-1106',
        max_tokens: 2048,
        temperature: 0,
    }

    try {

        const result = await openai.chat.completions.create(options)

        if (result?.choices[0]?.message?.content) {
            throw new Error("No content found in the response. Make sure your prompt is right.")
        }

        return result

    } catch (error) {

        console.log(error.name, error.message)

        throw error

    }

}

// let response;
// while (true) {
//     response = await getCompletion(messages);


//     if (response.data.choices[0].finish_reason === "stop") {
//         console.log(response.data.choices[0].message.content);
//         break;
//     } else if (response.data.choices[0].finish_reason === "function_call") {
//         const fnName = response.data.choices[0].message.function_call.name;
//         const args = response.data.choices[0].message.function_call.arguments;

//         const functionToCall = functions[fnName];
//         const { value1, value2 } = JSON.parse(args);
//         const result = functionToCall(value1, value2);

//         messages.push({
//             role: "assistant",
//             content: null,
//             function_call: {
//                 name: fnName,
//                 arguments: args,
//             },
//         });

//         messages.push({
//             role: "function",
//             name: fnName,
//             content: JSON.stringify({ result: result }),
//         });
//     }
// }