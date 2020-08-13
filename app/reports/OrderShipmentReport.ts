import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";
import { RawQuery } from "../common/RawQuery";
import { InventorytransDAO } from "../repos/InventTransDAO";
import { UpdateInventoryService } from "../services/UpdateInventoryService";
//var QRCode = require("qrcode");
const SvgToDataURL = require("svg-to-dataurl");
var QRCode = require("qrcode-svg");
import { getConnection } from "typeorm";

export class OrderShipmentReport {
  public sessionInfo: any;
  private db: any;
  private salesTableService: SalesTableService;
  private rawQuery: RawQuery;
  private inventTransDAO: InventorytransDAO;
  private updateInventoryService: UpdateInventoryService;
  constructor() {
    this.db = getManager();
    this.salesTableService = new SalesTableService();
    this.rawQuery = new RawQuery();
    this.inventTransDAO = new InventorytransDAO();
    this.updateInventoryService = new UpdateInventoryService();
  }

  async execute(params: any) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log("OrderShipmentReport===================");
      let id = params.salesId;
      let status: string;
      let data: any = await this.query_to_data(id);
      // console.log("----------------", data);
      data = data.length >= 1 ? data[0] : {};
      data.originalPrinted = data.originalPrinted ? data.originalPrinted : false;

      let salesLine: any = await this.salesline_query_to_data(id);
      let list: any[] = [];
      let chunkArray: any[] = await this.chunkArray(salesLine, 10);
      // console.log(chunkArray);
      list = list.concat(chunkArray);
      // salesLine = salesLine.length > 0 ? salesLine : [];
      // console.log(salesLine);
      if (data.status != "POSTED") {
        let cond: boolean = await this.stockOnHandCheck(salesLine, data.inventLocationId);
        if (cond) {
          let date = new Date().toISOString();
          let query = `UPDATE salestable SET originalprinted = '${true}', status = 'POSTED'`;
          if (date) {
            query += `,lastmodifieddate = '${date}' `;
          }
          query += ` WHERE salesid = '${params.salesId.toUpperCase()}'`;
          await queryRunner.query(query);
          // this.rawQuery.updateSalesTable(params.salesId.toUpperCase(), "POSTED", new Date().toISOString());
          let batches: any = await this.inventTransDAO.findAll({ invoiceid: params.salesId });
          for (let item of batches) {
            item.transactionClosed = true;
            // this.inventTransDAO.save(item);
            await this.updateInventoryService.updateInventtransTable(item, false, true, queryRunner);
          }
        } else {
          throw { message: "SOME_OF_THE_ITEMS_ARE_OUT_OF_STOCK" };
        }
      }
      await queryRunner.commitTransaction();
      let newSalesline: any[] = [];
      let sNo = 1;
      let quantity = 0;
      for (let val of list) {
        let lines: any = {
          salesId: data.salesId,
          quantity: 0,
          custAccount: data.custAccount,
          status: data.status,
          transkind: data.transkind,
          createddatetime: data.createddatetime,
          originalPrinted: data.originalPrinted,
          inventLocationId: data.inventLocationId,
          fwnamealias: data.fwnamealias,
          fwname: data.fwname,
          twnamealias: data.twnamealias,
          twname: data.twname,
          interCompanyOriginalSalesId: data.interCompanyOriginalSalesId,
          page: 1,
          notes: data.notes,
          totalPages: list.length,
          lines: [],
        };
        val.map((v: any) => {
          lines.quantity += parseInt(v.salesQty);
          v.sNo = sNo;
          lines.lines.push(v);
          sNo += 1;
        });
        lines.page = list.indexOf(val) + 1;
        lines.quantity = lines.quantity + quantity;
        quantity = lines.quantity;
        let qrString = await this.dataToQrString(lines);
        lines.qr = await this.genrateQRCode(qrString);
        newSalesline.push(lines);
      }
      // console.log("#####", newSalesline, "######");
      data.salesLine = newSalesline;
      data.quantity = 0;
      salesLine.map((v: any) => {
        data.quantity += parseInt(v.quantity);
      });

      // console.log(App.DateNow(), new Date(App.DateNow()), new Date().toISOString());
      // console.log("---------", data);
      // let qrString = await this.dataToQrString(data);
      // console.log(qrString);
      //data.qr = await QRCode.toDataURL("{name: 'naveen'}");

      return data;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async genrateQRCode(data: any) {
    // return QRCode.create(data, {
    //   width: 200,
    //   height: 200,
    //   colorDark: "#000000",
    //   colorLight: "#ffffff",
    //   errorCorrectionLevel: { bit: 2 },
    // });
    // var opts = {
    //   errorCorrectionLevel: "H",
    //   type: "image/jpeg",
    //   quality: 0.4,
    //   margin: 1,
    //   color: {
    //     dark: "#000000",
    //     light: "#FFFFFF",
    //   },
    // };
    // console.log(opts);
    // return await QRCode.toDataURL(data, opts);
    let dataurl = null;
    let QRSVG = await new QRCode({
      content: data,
      padding: 4,
      width: 180,
      height: 180,
      color: "#000000",
      background: "#ffffff",
      ecl: "M",
    });
    //await QRSVG.save("sample.svg");
    let dataFile = QRSVG.svg();
    //console.log(QRSVG.svg());
    // const Base64File = require("js-base64-file");
    // const image = new Base64File();
    // dataurl = image.loadSync("sample.svg");

    // let dataFile = fs.readFileSync("sample.svg", { encoding: "utf8", flag: "r" });
    // console.log("dataFile", dataFile);
    dataurl = SvgToDataURL(dataFile);
    // console.log(dataurl);
    return dataurl;
  }
  async warehouseName(param: string) {
    let query = `select inventlocationid, name, namealias from inventlocation where inventlocationid ='${param}' limit 1`;
    let data = await this.db.query(query);
    return data.length > 0 ? data[0] : {};
  }

  async report(result: any, params: any) {
    let renderData: any;
    // console.log(result.salesLine[0].product.nameEnglish);
    renderData = result;
    renderData.printDate = App.convertUTCDateToLocalDate(
      new Date(App.DateNow()),
      parseInt(params.timeZoneOffSet)
    ).toLocaleString();
    // console.log(params.lang);
    let file = params.lang == "en" ? "os-en" : "os-ar";
    // try {
    return App.HtmlRender(file, renderData);
    // } catch (error) {
    //   throw error;
    // }
  }
  async query_to_data(id: any) {
    let query = `
            select 
            st.salesid as "salesId",
            st.custaccount as "custAccount",
            st.status as status,
            st.transkind as transkind,
            st.vatamount as vatamount,
            st.netamount as "netAmount",
            st.disc as disc,
            st.description as notes,
            amount as amount,
            to_char(st.createddatetime, 'DD-MM-YYYY') as createddatetime,
            st.originalprinted as "originalPrinted",
            st.inventlocationid as "inventLocationId",
            fw.namealias as fwnamealias,
            fw.name as fwname,
            tw.namealias as twnamealias,
            tw.name as twname,
            st.intercompanyoriginalsalesId as "interCompanyOriginalSalesId"
            from salestable st 
            left join inventlocation fw on fw.inventlocationid = st.inventlocationid
            left join inventlocation tw on tw.inventlocationid = st.custaccount
            where salesid='${id}'
            `;
    return await this.db.query(query);
  }

  async salesline_query_to_data(id: any) {
    let salesQuery = `
    select
    ln.salesid,
    ln.itemid,
    ln.batchno,
    ln.configid,
    ln.inventsizeid,
    ln.status,
    ln.colorantid,
    to_char(ln.salesqty, 'FM999,999,999,999D') as "salesQty",
    ln.prodnamear as "prodNameAr",
    ln.prodnameen as "prodNameEn",
    ln.colNameAr as "colNameAr",
    ln.colNameEn as "colNameEn",
    ln.sizeNameEn as "sizeNameEn",
    ln.sizeNameAr as "sizeNameAr"
    from
    (
        select
        distinct on (i.id, i.invoiceid, i.itemid, i.configid, i.inventsizeid, i.batchno, i.qty, i.sales_line_id)
        i.invoiceid as salesid,
        i.batchno,
        i.itemid,
        i.configid,
        i.inventsizeid,
        st.status as status,
        ABS(i.qty) as salesqty,
        b.itemname as prodnamear,
        b.namealias as prodnameen,
        c.name as colNameAr,
        c.name as colNameEn,
        s.description as sizeNameEn,
        s.name as sizeNameAr,
        sl.colorantid as  colorantid,
        sl.linenum
        from inventtrans i
        left join salestable st on st.salesid = i.invoiceid
        left join salesline sl on sl.id = i.sales_line_id
        left join inventtable b on i.itemid=b.itemid
        left join inventsize s on s.itemid = i.itemid and i.inventsizeid = s.inventsizeid
        left join configtable c on c.configid = i.configid and c.itemid = i.itemid
    where invoiceid='${id}' 
    ) as ln order by ln.linenum DESC
    `;
    return await this.db.query(salesQuery);
  }

  dataToQrString(data) {
    console.log(data);
    let header: string =
      data.page +
      "%" +
      data.totalPages +
      "$" +
      data.salesId +
      "^" +
      data.inventLocationId +
      "^" +
      data.custAccount +
      "|";
    let lines: string = "";
    for (let item of data.lines) {
      if (lines.length != 0) {
        lines += "*";
      }
      let line: string =
        item.itemid +
        "+" +
        item.configid +
        "+" +
        item.inventsizeid +
        "+" +
        item.batchno +
        "+" +
        item.salesQty +
        "+" +
        0 +
        "+" +
        0 +
        "+" +
        0;
      if (item.colorantid) {
        line +=
          "*" +
          "HSN-00001" +
          "+" +
          item.colorantid +
          "+" +
          "GROUP" +
          "+" +
          "-" +
          "+" +
          item.salesQty +
          "+" +
          0 +
          "+" +
          0 +
          "+" +
          0;
      }
      lines += line;
    }
    return header + lines;
  }
  async chunkArray(myArray: any, chunk_size: number) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    for (index = 0; index < arrayLength; index += chunk_size) {
      let myChunk = myArray.slice(index, index + chunk_size);
      // Do something if you want with the group
      tempArray.push(myChunk);
    }
    return await tempArray;
  }
  async stockOnHandCheck(salesLine: any, inventlocationid: string) {
    let canConvert: boolean = true;
    let colors: any[] = [];
    let items: any[] = [];
    let sizes: any[] = [];
    let groupSalesLines: any = this.groupBy(salesLine, function (item: any) {
      return [item.itemid, item.configid, item.inventsizeid, item.batchno];
    });
    let newSalesline: any[] = [];
    groupSalesLines.forEach(function (groupitem: any) {
      const qty = groupitem.reduce((res: number, item: any) => res + parseInt(item.salesQty), 0);
      groupitem[0].salesQty = Math.abs(qty);
      newSalesline.push({ ...groupitem[0] });
    });
    newSalesline.map((v: any) => {
      if (v.itemid && v.configid && v.inventsizeid) {
        items.push(v.itemid), colors.push(v.configid), sizes.push(v.inventsizeid);
      } else {
        return false;
      }
    });
    let itemsInStock: any[] = await this.rawQuery.checkItems(inventlocationid, items, colors, sizes);
    newSalesline.map((v: any) => {
      let index = itemsInStock.findIndex(
        (value: any) =>
          value.itemid.toLowerCase() == v.itemid.toLowerCase() &&
          value.configid.toLowerCase() == v.configid.toLowerCase() &&
          value.inventsizeid.toLowerCase() == v.inventsizeid.toLowerCase()
      );
      if (index >= 0) {
        if (parseInt(v.salesQty) > parseInt(itemsInStock[index].qty)) {
          canConvert = canConvert == true ? false : false;
        }
      } else {
        canConvert = canConvert == true ? false : false;
      }
    });
    if (!canConvert) {
      return false;
    }
    return canConvert;
  }
  groupBy(array: any, f: any) {
    let groups: any = {};
    array.forEach(function (o: any) {
      let group: any = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    });
  }
}
