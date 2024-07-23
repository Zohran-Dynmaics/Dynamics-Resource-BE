import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { CustomRequest } from "src/shared/custom-interface";

@Controller("cms/contacts")
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @Get("")
  async getAllContacts(@Req() req: CustomRequest): Promise<any> {
    const { env, query } = req;
    return await this.contactService.getAllContacts(
      env.token,
      env.base_url,
      query
    );
  }
  @Get(":contact_id")
  async getContact(@Req() req: CustomRequest): Promise<any> {
    const { env, params, query } = req;
    return await this.contactService.getContact(
      env.token,
      env.base_url,
      params.contact_id,
      query,
    );
  }



}
