import xlsx from "xlsx";
import _ from "lodash";
import path from "path";
import { IPlantData } from "../interfaces/IPlantData";

export class ReadFiles {
  public readExcelFile() {
    try {
      const filePath = path.join(__dirname + "/../../egrid2021_data.xlsx");
      const workbook = xlsx.readFile(filePath);
      let workbook_sheet = workbook.SheetNames;
      let workbook_response = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook_sheet[3]]
      );

      const selectedFields = [
        "Plant file sequence number",
        "Plant state abbreviation",
        "Plant name",
        "Plant latitude",
        "Plant longitude",
        "Plant annual net generation (MWh)",
      ];
      const selectedDataByFields: any = this.selectFields(
        workbook_response,
        selectedFields
      );

      let plantData: IPlantData[] = [];

      for (const data of selectedDataByFields) {
        const sequenceNumber = data["Plant file sequence number"];

        if (typeof sequenceNumber === "number") {
          const plantDataMap: IPlantData = {
            name: data["Plant name"],
            plantID: data["Plant file sequence number"],
            annualNetGeneration: data["Plant annual net generation (MWh)"] || 0,
            annualNetPercentage:
              (data["Plant annual net generation (MWh)"] || 0) / 1000000,
            state: data["Plant state abbreviation"],
            latitude: data["Plant latitude"],
            longitude: data["Plant longitude"],
          };
          plantData.push(plantDataMap);
        }
      }

      // sort plantData by Plant annual net generation (MWh)
      plantData = plantData.sort(
        (data1, data2) =>
          (data1.annualNetGeneration as number) -
          (data2.annualNetGeneration as number)
      );

      const totalAnnualNetGeneration = plantData.reduce((accumulator, obj) => {
        return accumulator + Math.abs(obj.annualNetGeneration as number);
      }, 0);

      plantData.forEach((data) => {
        data.annualNetGeneration = Math.abs(data.annualNetGeneration as number);
        data.annualNetPercentage = parseFloat(
          ((data.annualNetGeneration / totalAnnualNetGeneration) * 100).toFixed(
            7
          )
        );
      });

      return plantData;
    } catch (error: any) {
      console.log(`No Data File found to fetch data ${error?.message}`);
      throw new Error(`No Data File found to fetch data ${error?.message}`);
    }
  }

  private selectFields(
    workbookResponse: any[],
    selectedFields: string[]
  ): any[] {
    return _.map(workbookResponse, (obj) => _.pick(obj, selectedFields));
  }
}
