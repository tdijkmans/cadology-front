import type { ActivityDto, SessionListDto } from "../models";


export type SkateActvitity = (ActivityDto & { activityId: number } & { activityDetails: SessionListDto })
export type SkateActvitities = SkateActvitity[];