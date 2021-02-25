import React, { useState } from "react";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

export const GridExample = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    const updateData = (data) => {
      setRowData(data);
    };

    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => updateData(data));
  };

  const onBtExport = () => {
    var columnWidth = getBooleanValue("#columnWidth")
      ? getTextValue("#columnWidthValue")
      : undefined;
    var params = {
      columnWidth:
        columnWidth === "myColumnWidthCallback" ? myColumnWidthCallback : parseFloat(columnWidth),
      sheetName: getBooleanValue("#sheetName") && getTextValue("#sheetNameValue"),
      exportMode: getBooleanValue("#exportModeXml") ? "xml" : undefined,
      suppressTextAsCDATA: getBooleanValue("#suppressTextAsCDATA"),
      rowHeight: getBooleanValue("#rowHeight") ? getNumericValue("#rowHeightValue") : undefined,
      headerRowHeight: getBooleanValue("#headerRowHeight")
        ? getNumericValue("#headerRowHeightValue")
        : undefined,
    };
    gridApi.exportDataAsExcel(params);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className='container'>
        <div className='columns'>
          <div className='column'>
            <label className='option'>
              <input type='checkbox' id='columnWidth' />
              columnWidth =
              <select id='columnWidthValue'>
                <option>100</option>
                <option>200</option>
                <option>myColumnWidthCallback</option>
              </select>
            </label>
            <label className='option'>
              <input type='checkbox' id='sheetName' />
              sheetName =
              <input type='text' id='sheetNameValue' value='custom-name' maxlength='31' />
            </label>
            <label className='option'>
              <input type='checkbox' id='exportModeXml' />
              <span className='option-name'>exportMode = "xml"</span>
            </label>
          </div>
          <div className='column' style={{ marginLeft: "30px" }}>
            <label className='option'>
              <input type='checkbox' id='suppressTextAsCDATA' />
              <span className='option-name'>suppressTextAsCDATA</span>
            </label>
            <div className='option'>
              <label>
                <input type='checkbox' id='rowHeight' />
                rowHeight =
              </label>
              <input type='text' id='rowHeightValue' value='30' style={{ width: "40px" }} />
            </div>
            <div className='option'>
              <label>
                <input type='checkbox' id='headerRowHeight' />
                headerRowHeight =
              </label>
              <input type='text' id='headerRowHeightValue' value='40' style={{ width: "40px" }} />
            </div>
          </div>
        </div>
        <div style={{ margin: "5px" }}>
          <label>
            <button onClick={() => onBtExport()} style={{ margin: "5px", fontWeight: "bold" }}>
              Export to Excel
            </button>
          </label>
        </div>
        <div className='grid-wrapper'>
          <div
            id='myGrid'
            style={{
              height: "100%",
              width: "100%",
            }}
            className='ag-theme-alpine'
          >
            <AgGridReact
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
                minWidth: 100,
                flex: 1,
              }}
              rowSelection={"multiple"}
              pinnedTopRowData={[
                {
                  athlete: "Floating <Top> Athlete",
                  age: 999,
                  country: "Floating <Top> Country",
                  year: 2020,
                  date: "2020-08-01",
                  sport: "Track & Field",
                  gold: 22,
                  silver: "003",
                  bronze: 44,
                  total: 55,
                },
              ]}
              pinnedBottomRowData={[
                {
                  athlete: "Floating <Bottom> Athlete",
                  age: 888,
                  country: "Floating <Bottom> Country",
                  year: 2030,
                  date: "2030-08-01",
                  sport: "Track & Field",
                  gold: 222,
                  silver: "005",
                  bronze: 244,
                  total: 255,
                },
              ]}
              onGridReady={onGridReady}
              rowData={rowData}
            >
              <AgGridColumn headerName='Top Level Column Group'>
                <AgGridColumn headerName='Group A'>
                  <AgGridColumn field='athlete' minWidth={200} />
                  <AgGridColumn
                    field='age'
                    cellClassRules={{
                      greenBackground: (params) => {
                        return params.value < 30;
                      },
                      blueBackground: (params) => {
                        return params.value < 20;
                      },
                    }}
                  />
                  <AgGridColumn field='country' minWidth={200} />
                  <AgGridColumn headerName='Group' valueGetter='data.country.charAt(0)' />
                  <AgGridColumn field='year' />
                </AgGridColumn>
                <AgGridColumn headerName='Group B'>
                  <AgGridColumn
                    field='date'
                    minWidth={150}
                    valueGetter={(params) => {
                      var val = params.data.date;
                      if (val.indexOf("/") < 0) {
                        return val;
                      }
                      var split = val.split("/");
                      return split[2] + "-" + split[1] + "-" + split[0];
                    }}
                  />
                  <AgGridColumn field='sport' minWidth={150} />
                  <AgGridColumn field='gold' />
                  <AgGridColumn field='silver' />
                  <AgGridColumn field='bronze' />
                  <AgGridColumn field='total' />
                </AgGridColumn>
              </AgGridColumn>
            </AgGridReact>
          </div>
        </div>
      </div>
    </div>
  );
};

function getBooleanValue(cssSelector) {
  return document.querySelector(cssSelector).checked === true;
}
function getTextValue(cssSelector) {
  return document.querySelector(cssSelector).value;
}
function getNumericValue(cssSelector) {
  var value = parseFloat(getTextValue(cssSelector));
  if (isNaN(value)) {
    var message = "Invalid number entered in " + cssSelector + " field";
    alert(message);
    throw new Error(message);
  }
  return value;
}
function myColumnWidthCallback(params) {
  var originalWidth = params.column.getActualWidth();
  if (params.index < 7) {
    return originalWidth;
  }
  return 30;
}
