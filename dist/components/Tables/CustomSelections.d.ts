import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
interface GroupingsUIState {
    components: OBC.Components;
}
declare const _default: (state: GroupingsUIState) => [element: BUI.Table, update: (state?: Partial<GroupingsUIState> | undefined) => GroupingsUIState];
export default _default;
