/* tslint:disable */
/* eslint-disable */
/**
 * SpeedhivePracticeApi v1.8.58.0
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { ActivityDto } from './activity-dto'
/**
 *
 *
 * @export
 * @interface ActivitiesInfoExclLocationDto
 */
export interface ActivitiesInfoExclLocationDto {
  /**
   * @type {Array<ActivityDto>}
   * @memberof ActivitiesInfoExclLocationDto
   */
  activities?: Array<ActivityDto>

  /**
   * @type {number}
   * @memberof ActivitiesInfoExclLocationDto
   */
  activityCount?: number
}