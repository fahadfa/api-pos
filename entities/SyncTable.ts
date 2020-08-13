import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm"

import { SyncSource } from "./SyncSource"

@Entity("sync_table")
export class SyncTable {
	@PrimaryColumn({ name: "id" })
	id: string

	@Column({ name: "source_table" })
	sourceTable: string

	@Column({ name: "target_table" })
	targetTable: string

	@Column({ name: "source_pk" })
	sourcePk: string

	@Column({ name: "target_pk" })
	targetPk: string

	@Column({ name: "sync_column" })
	syncColumn: string

	@Column({ name: "cond" })
	cond: string

	@Column({ name: "last_update" })
	lastUpdate: Date

	@Column({ name: "active" })
	active: boolean

	@Column({ name: "priority" })
	priority: number

	@Column({ name: "group_on" })
	groupOn: string

	@Column({ name: "updated_by" })
	updatedBy: string

	@Column({ name: "updated_on" })
	updatedOn: Date

	@JoinColumn({ name: "source_id" })
	@ManyToOne(type => SyncSource)
	source: SyncSource

	@JoinColumn({ name: "target_id" })
	@ManyToOne(type => SyncSource)
	target: SyncSource
}
