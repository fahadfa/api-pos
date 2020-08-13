import { getRepository, Repository, getManager, getConnection } from "typeorm";
import { MenuGroup } from "../../entities/MenuGroup";

export class MenuGroupDAO {
  private dao: Repository<MenuGroup>;
  private db: any;

  constructor() {
    this.dao = getRepository(MenuGroup);
    this.db = getManager();
  }

  async search(data: any) {
    let cond: string = `menu.active=true `;
    if (data.isMobile) {
      cond += ` and menu.is_mobile = true`;
    }
    return await this.dao
      .createQueryBuilder("menuGroup")
      .innerJoin("menuGroup.group", "group")
      .innerJoinAndSelect("menuGroup.menu", "menu")
      .addSelect("group.groupid")
      .addSelect("group.role")
      .orderBy("priority", "ASC")
      .where(data)
      .andWhere(cond)
      .getMany();
  }

  async permissionData(data: any) {
    let query = `SELECT "menuGroup"."id" AS "id", 
        "menuGroup"."write_access" AS "writeAccess", 
        "menuGroup"."delete_access" AS "deleteAccess", 
        "menuGroup"."created_by" AS "createdBy", 
        "menuGroup"."created_date" AS "createdDate", 
        "menuGroup"."updated_by" AS "updatedBy", 
        "menuGroup"."updated_date" AS "updatedDate",
        "menuGroup"."active" AS "active",
        "group"."groupid" AS "groupid",
        "menu"."id" AS "menuId", 
        "menu"."name" AS "name", 
        "menu"."name_ar" AS "nameAr", 
        "menu"."link" AS "link", 
        "menu"."icon" AS "icon", 
        "menu"."parent_id" AS "parentId" 
        FROM "menu_group" "menuGroup" 
        INNER JOIN "usergroup" "group" ON "group"."groupid"="menuGroup"."group_id"  
        INNER JOIN "menu" "menu" ON "menu"."id"="menuGroup"."menu_id" 
        WHERE "menuGroup"."group_id" = '${data.groupId}' and menu.active=true ORDER BY menu.priority ASC`;
    return this.db.query(query);
  }

  async save(data: MenuGroup[]) {
    return await this.dao.save(data);
  }

  async entity(id: any) {
    return await this.dao.findOne(id, {
      join: {
        alias: "menuGroup",
        innerJoinAndSelect: {
          group: "menuGroup.group",
          menu: "menuGroup.menu",
        },
      },
    });
  }

  async delete(data: any) {
    data.active = !data.active;
    return await this.dao.save(data);
  }

  async findOne(data: any) {
    return await this.dao.findOne(data, {
      join: {
        alias: "menuGroup",
        innerJoinAndSelect: {
          group: "menuGroup.group",
          menu: "menuGroup.menu",
        },
      },
    });
  }
}

Object.seal(MenuGroupDAO);
