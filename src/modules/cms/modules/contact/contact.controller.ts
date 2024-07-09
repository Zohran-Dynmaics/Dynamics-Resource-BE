import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { CustomRequest } from "src/shared/custom-interface";

@Controller("cms/contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @Get("/:contact_id")
  async getContact(@Req() req: CustomRequest): Promise<any> {
    const { crmToken, env, params, query } = req;
    return await this.contactService.getContact(
      crmToken,
      env.base_url,
      params.contact_id,
      query,
    );
  }
}
