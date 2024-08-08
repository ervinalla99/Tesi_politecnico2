import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
export declare class AppManager extends OBC.Component {
    static uuid: "939bb2bc-7d31-4a44-811d-68e4dd286c35";
    enabled: boolean;
    grids: Map<string, BUI.Grid>;
}
