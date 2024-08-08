import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as CUI from "@thatopen/ui-obc";
import { AppManager } from "../../bim-components";

export default (components: OBC.Components) => {
  const fragments = components.get(OBC.FragmentsManager);
  const highlighter = components.get(OBF.Highlighter);
  const appManager = components.get(AppManager);
  const viewportGrid = appManager.grids.get("viewport");

  const [propsTable, updatePropsTable] = CUI.tables.elementProperties({
    components,
    fragmentIdMap: {},
  });

  propsTable.preserveStructureOnFilter = true;
  fragments.onFragmentsDisposed.add(() => updatePropsTable());

  highlighter.events.select.onHighlight.add((fragmentIdMap) => {
    if (!viewportGrid) return;
    viewportGrid.layout = "second";
    propsTable.expanded = false;
    updatePropsTable({ fragmentIdMap });
  });

  highlighter.events.select.onClear.add(() => {
    updatePropsTable({ fragmentIdMap: {} });
    if (!viewportGrid) return;
    viewportGrid.layout = "main";
  });
  // Generic function to parse TSV and retrieve a specific property
  function getPropertyFromTsv(tsvString: any, propertyName: any) {
    // Split the TSV data into lines (rows)
    const rows = tsvString.split('\n');

    // Initialize variable to store the property value
    let propertyValue = null;

    // Loop through each row to find the property
    for (let row of rows) {
      // Split row by tab (\t) to get columns
      const columns = row.split('\t');

      // Check if the first column (assuming it's 'Name' or similar) matches the propertyName
      if (columns.length > 1 && columns[0].trim() === propertyName) {
        // Extract the property value from the second column
        propertyValue = columns[1].trim();
        break; // Exit loop once found
      }
    }

    return propertyValue;
  }

  // Event handler for highlight event
  highlighter.events.select.onHighlight.add((fragmentIdMap) => {
    updatePropsTable({ fragmentIdMap });

    // Delay to ensure propertiesTable.tsv is updated
    setTimeout(() => {
      // Access propertiesTable.tsv after it has been updated
      const tsvData = propsTable.tsv;
      //console.log(tsvData);
      // Retrieve and log GlobalId
      const globalId = getPropertyFromTsv(tsvData, 'GlobalId');
      const Class = getPropertyFromTsv(tsvData, 'Class');
      //console.log(propertiesTable.tsv);
      if (globalId) {
        console.log('GlobalId:', globalId);
      } else {
        console.log('GlobalId not found in propertiesTable.tsv');
      }

      if (Class) {
        console.log('Class:', Class);

        // Send the description to the server
        fetch('/Class', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Class: Class }), // Use 'description' key
        })
          .then(response => response.json())
          .then(data => console.log('Server response:', data))
          .catch(error => console.error('Error:', error));
      } else {
        console.log('Class not found in propertiesTable.tsv');
      }
    }, 100); // Adjust the delay as necessary
  });

  highlighter.events.select.onClear.add(() =>
    updatePropsTable({ fragmentIdMap: {} })
  ); //end of properties section 
  const search = (e: Event) => {
    const input = e.target as BUI.TextInput;
    propsTable.queryString = input.value;
  };

  const toggleExpanded = () => {
    propsTable.expanded = !propsTable.expanded;
  };

  return BUI.Component.create<BUI.Panel>(() => {
    return BUI.html`
      <bim-panel>
        <bim-panel-section name="selection" label="Selection Information" icon="solar:document-bold" fixed>
          <div style="display: flex; gap: 0.375rem;">
            <bim-text-input @input=${search} vertical placeholder="Search..." debounce="200"></bim-text-input>
            <bim-button style="flex: 0;" @click=${toggleExpanded} icon="eva:expand-fill"></bim-button>
            <bim-button style="flex: 0;" @click=${() => propsTable.downloadData("ElementData", "tsv")} icon="ph:export-fill" tooltip-title="Export Data" tooltip-text="Export the shown properties to TSV."></bim-button>
          </div>
          ${propsTable}
        </bim-panel-section>
      </bim-panel> 
    `;
  });
};
