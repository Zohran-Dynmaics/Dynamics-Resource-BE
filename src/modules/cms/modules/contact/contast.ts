import { COMMON_URL } from "src/shared/constant"

const params = {
    $count: true,
    $expand: "plus_building($select=msdyn_name;$expand=msdyn_FunctionalLocationType($select=msdyn_name)),parentcustomerid_account($select=name;$expand=parentaccountid($select=name)) "
}


export const ENDPOINT = (baseUrl: string) => `${baseUrl}${COMMON_URL}/contacts`;


