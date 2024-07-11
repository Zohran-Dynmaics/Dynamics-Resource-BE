import { Controller, Delete, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CustomRequest } from "src/shared/custom-interface";

@Controller("user")
export class UsersController {

    constructor(private usersService: UsersService) { }

    @Delete('delete-account')
    async deleteAccount(@Req() req: CustomRequest): Promise<boolean> {
        const { user } = req;
        return await this.usersService.delete(user._id);
    }
}
