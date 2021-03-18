import campaignAction from "./campaign.action";
import collaboratorAction from "./collaborator.action";
import collaboratorProductAction from "./collaboratorProduct.action";

const Actions = [
    { route: "/cd", action: campaignAction },
    { route: "/ctv", action: collaboratorAction },
    { route: "/san-pham", action: collaboratorProductAction },
    
];
export default Actions;
