import { IOrder } from '../global';
import saveAs from 'file-saver';
import ExcelJS from 'exceljs';

export const exportOrdersToExcel = async (orders: IOrder[]) => {
  const wb = new ExcelJS.Workbook();
  const sheet = wb.addWorksheet('Attendees');
  sheet.columns = [
    {
      key: 'name',
      header: 'Name',
      width: 30,
    },
    {
      key: 'email',
      header: 'Email',
      width: 32,
    },
    {
      key: 'phone',
      header: 'Phone',
      width: 15.5,
    }
  ];
  sheet.addRows(orders);
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: "applicationi/xlsx" });
  saveAs(blob, `attendees-${new Date().toDateString().replace(/ /gi, '')}.xlsx`);
};
