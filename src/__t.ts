import type { Database } from "@/lib/database.types";
type GR = { foreignKeyName: string; columns: string[]; isOneToOne?: boolean; referencedRelation: string; referencedColumns: string[] };
type GT = { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown>; Relationships: GR[] };
type Bad = { [K in keyof Database["public"]["Tables"]]: Database["public"]["Tables"][K] extends GT ? never : K }[keyof Database["public"]["Tables"]];
const b: Bad = "x" as never;
type Show = Bad;
const s: Show = null as never;
type ErrHere = { a: Bad };
const e: number = null as unknown as Bad;
