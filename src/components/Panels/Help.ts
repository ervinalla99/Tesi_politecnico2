/* eslint-disable no-restricted-globals */
import * as BUI from "@thatopen/ui";

export default BUI.Component.create<BUI.Panel>(() => {
  return BUI.html`
    <bim-panel>
      <bim-panel-section fixed label="Get the full code of this app" icon="ic:baseline-people">
        <bim-label style="white-space: normal;">If you want to see the full code that was used to build this app, please visit the link in the button below.</bim-label>
        <bim-button @click=${() => open("https://people.thatopen.com/")} label="Github Repository" icon="ic:baseline-people"></bim-button>
        <div style="display: flex; justify-content: center; align-items: center; background-color: #f0f0f0; padding: 10px; margin-bottom: 10px;">
      <img src="../../logo.png" alt="Logo" style="width: 100px; height: auto;">
    </div>
      </bim-panel-section>
    </bim-panel>
  `;
});
