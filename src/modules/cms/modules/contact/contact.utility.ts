import { ContactsListDto } from "./contact.dto"

export const formatContactList = (value: any): Array<ContactsListDto> => {

    return value.map(contact => {
        const { plus_building } = contact;
        const contactListDto = new ContactsListDto();
        contactListDto.contactId = contact?.contactid || null;
        contactListDto.fullName = contact?.fullname || null;
        contactListDto.contactNumber = contact?.telephone1 || contact?.telephone2 || contact?.telephone1 || null;
        contactListDto.building = plus_building?.msdyn_name || null;
        contactListDto.location = plus_building?.msdyn_FunctionalLocationType?.msdyn_name || null;
        contactListDto.parentCompany = contact?.parentcustomerid_account?.name || null;

        return contactListDto;
    });
}